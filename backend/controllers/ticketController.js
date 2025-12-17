import Ticket from "../models/Ticket.js";

export const createTicket = async (req, res) => {
  try {
    const data = req.body;

    console.log("📝 Attempting to create ticket:", {
      ticketType: data.ticketType,
      date: data.date,
      visitors: data.visitors,
      email: data.email,
      userId: req.user?.id
    });

    if (!data.date) {
      console.error("❌ Validation failed: Missing date");
      return res.status(400).json({
        message: "Date is required",
        error: "VALIDATION_ERROR"
      });
    }

    // Add userId if user is authenticated
    if (req.user) {
      data.userId = req.user.id;
      data.name = data.name || req.user.name;
      data.email = data.email || req.user.email;
    }

    const ticket = new Ticket(data);
    await ticket.save();

    console.log("✅ Ticket saved successfully:", ticket._id);

    if (data.email) {
      try {
        const { sendTicketEmail } = await import("../utils/emailService.js");
        await sendTicketEmail(data.email, data);
        console.log("📧 Email sent to:", data.email);
      } catch (emailErr) {
        console.error("⚠️  Failed to send email:", emailErr.message);
      }
    }

    res.status(201).json({
      message: "Ticket booked successfully",
      ticket,
      success: true
    });
  } catch (err) {
    console.error("❌ Error creating ticket:", err);

    let errorMessage = "Server error";
    let errorType = "SERVER_ERROR";
    let statusCode = 500;

    if (err.name === "ValidationError") {
      errorMessage = "Invalid ticket data: " + Object.values(err.errors).map(e => e.message).join(", ");
      errorType = "VALIDATION_ERROR";
      statusCode = 400;
    } else if (err.name === "MongoNetworkError" || err.message.includes("connection")) {
      errorMessage = "Database connection error. Please try again in a moment.";
      errorType = "DB_CONNECTION_ERROR";
      statusCode = 503;
      console.error("🔴 DATABASE CONNECTION ISSUE - Check MongoDB Atlas IP whitelist!");
    } else if (err.code === 11000) {
      errorMessage = "Duplicate ticket entry";
      errorType = "DUPLICATE_ERROR";
      statusCode = 409;
    }

    res.status(statusCode).json({
      message: errorMessage,
      error: errorType,
      success: false,
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

export const getTickets = async (req, res) => {
  try {
    let query = {};

    // If user is authenticated
    if (req.user) {
      // Admins see all tickets, regular users see only their tickets
      if (req.user.role !== "admin") {
        query.userId = req.user.id;
      }
    } else {
      // If no user is authenticated, return empty array
      return res.json([]);
    }

    const tickets = await Ticket.find(query).sort({ createdAt: -1 });

    console.log(`📋 Fetched ${tickets.length} tickets for user: ${req.user?.email || 'anonymous'} (${req.user?.role || 'none'})`);

    res.json(tickets);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getTicketById = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({
        message: "Ticket not found",
        success: false
      });
    }

    // Check if user owns this ticket or is admin
    if (req.user) {
      if (req.user.role !== "admin" && ticket.userId && ticket.userId.toString() !== req.user.id) {
        return res.status(403).json({
          message: "Access denied. You can only view your own tickets.",
          success: false
        });
      }
    }

    res.json({
      ticket,
      success: true
    });
  } catch (err) {
    console.error("❌ Error fetching ticket:", err);
    res.status(500).json({
      message: "Server error",
      success: false
    });
  }
};

export const cancelTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const ticket = await Ticket.findById(id);

    if (!ticket) {
      return res.status(404).json({
        message: "Ticket not found",
        success: false
      });
    }

    // Check if user owns this ticket or is admin
    if (req.user) {
      if (req.user.role !== "admin" && ticket.userId && ticket.userId.toString() !== req.user.id) {
        return res.status(403).json({
          message: "Access denied. You can only cancel your own tickets.",
          success: false
        });
      }
    }

    if (ticket.status === "Cancelled") {
      return res.status(400).json({
        message: "Ticket is already cancelled",
        success: false
      });
    }

    const visitDate = new Date(ticket.date);
    const today = new Date();
    const daysDifference = Math.ceil((visitDate - today) / (1000 * 60 * 60 * 24));

    if (daysDifference < 2) {
      return res.status(400).json({
        message: "Cannot cancel tickets less than 2 days before the visit date",
        success: false
      });
    }

    let refundAmount = 0;
    if (ticket.paymentStatus === "Paid") {
      if (daysDifference >= 7) {
        refundAmount = ticket.price;
      } else if (daysDifference >= 2) {
        refundAmount = ticket.price * 0.5;
      }
    }

    ticket.status = "Cancelled";
    ticket.cancelledAt = new Date();
    ticket.cancelReason = reason || "User requested cancellation";

    if (refundAmount > 0) {
      ticket.paymentStatus = "Refunded";
      ticket.refundAmount = refundAmount;
      ticket.refundedAt = new Date();
    }

    await ticket.save();

    console.log(`✅ Ticket ${id} cancelled. Refund: $${refundAmount}`);

    if (ticket.email) {
      try {
        const { sendCancellationEmail } = await import("../utils/emailService.js");
        await sendCancellationEmail(ticket.email, ticket, refundAmount);
        console.log("📧 Cancellation email sent to:", ticket.email);
      } catch (emailErr) {
        console.error("⚠️  Failed to send cancellation email:", emailErr.message);
      }
    }

    res.json({
      message: refundAmount > 0
        ? `Ticket cancelled successfully. Refund of $${refundAmount} will be processed within 5-7 business days.`
        : "Ticket cancelled successfully.",
      ticket,
      refundAmount,
      success: true
    });
  } catch (err) {
    console.error("❌ Error cancelling ticket:", err);
    res.status(500).json({
      message: "Server error during cancellation",
      success: false
    });
  }
};
