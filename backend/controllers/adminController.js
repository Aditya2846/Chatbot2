import User from "../models/User.js";
import Ticket from "../models/Ticket.js";

// Get dashboard statistics
export const getDashboardStats = async (req, res) => {
    try {
        // Total counts
        const totalUsers = await User.countDocuments();
        const totalTickets = await Ticket.countDocuments();
        const activeTickets = await Ticket.countDocuments({
            status: { $in: ["Booked", "Confirmed"] }
        });
        const cancelledTickets = await Ticket.countDocuments({ status: "Cancelled" });

        // Revenue calculations
        const revenueData = await Ticket.aggregate([
            { $match: { paymentStatus: "Paid" } },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: "$price" },
                    averageTicketPrice: { $avg: "$price" }
                }
            }
        ]);

        const totalRevenue = revenueData[0]?.totalRevenue || 0;
        const averageTicketPrice = revenueData[0]?.averageTicketPrice || 0;

        // Refunded amount
        const refundData = await Ticket.aggregate([
            { $match: { paymentStatus: "Refunded" } },
            {
                $group: {
                    _id: null,
                    totalRefunded: { $sum: "$refundAmount" }
                }
            }
        ]);

        const totalRefunded = refundData[0]?.totalRefunded || 0;

        // Tickets by status
        const ticketsByStatus = await Ticket.aggregate([
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 }
                }
            }
        ]);

        // Recent tickets
        const recentTickets = await Ticket.find()
            .sort({ createdAt: -1 })
            .limit(10)
            .populate("userId", "name email");

        // Top exhibitions
        const topExhibitions = await Ticket.aggregate([
            {
                $group: {
                    _id: "$exhibition",
                    count: { $sum: 1 },
                    revenue: { $sum: "$price" }
                }
            },
            { $sort: { count: -1 } },
            { $limit: 5 }
        ]);

        res.json({
            success: true,
            stats: {
                totalUsers,
                totalTickets,
                activeTickets,
                cancelledTickets,
                totalRevenue: totalRevenue.toFixed(2),
                averageTicketPrice: averageTicketPrice.toFixed(2),
                totalRefunded: totalRefunded.toFixed(2),
                netRevenue: (totalRevenue - totalRefunded).toFixed(2)
            },
            ticketsByStatus,
            recentTickets,
            topExhibitions
        });
    } catch (err) {
        console.error("Error fetching dashboard stats:", err);
        res.status(500).json({
            success: false,
            message: "Failed to fetch dashboard statistics"
        });
    }
};

// Get all users with their ticket counts
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password").sort({ createdAt: -1 });

        // Get ticket count for each user
        const usersWithStats = await Promise.all(
            users.map(async (user) => {
                const ticketCount = await Ticket.countDocuments({ userId: user._id });
                const totalSpent = await Ticket.aggregate([
                    { $match: { userId: user._id, paymentStatus: "Paid" } },
                    { $group: { _id: null, total: { $sum: "$price" } } }
                ]);

                return {
                    ...user.toObject(),
                    ticketCount,
                    totalSpent: totalSpent[0]?.total || 0
                };
            })
        );

        res.json({
            success: true,
            users: usersWithStats
        });
    } catch (err) {
        console.error("Error fetching users:", err);
        res.status(500).json({
            success: false,
            message: "Failed to fetch users"
        });
    }
};

// Get tickets by user ID
export const getUserTickets = async (req, res) => {
    try {
        const { userId } = req.params;

        const tickets = await Ticket.find({ userId }).sort({ createdAt: -1 });
        const user = await User.findById(userId).select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.json({
            success: true,
            user,
            tickets
        });
    } catch (err) {
        console.error("Error fetching user tickets:", err);
        res.status(500).json({
            success: false,
            message: "Failed to fetch user tickets"
        });
    }
};

// Update user role
export const updateUserRole = async (req, res) => {
    try {
        const { userId } = req.params;
        const { role } = req.body;

        if (!["user", "admin"].includes(role)) {
            return res.status(400).json({
                success: false,
                message: "Invalid role. Must be 'user' or 'admin'"
            });
        }

        const user = await User.findByIdAndUpdate(
            userId,
            { role },
            { new: true }
        ).select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.json({
            success: true,
            message: `User role updated to ${role}`,
            user
        });
    } catch (err) {
        console.error("Error updating user role:", err);
        res.status(500).json({
            success: false,
            message: "Failed to update user role"
        });
    }
};

// Delete user
export const deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;

        // Prevent deleting yourself
        if (userId === req.user.id) {
            return res.status(400).json({
                success: false,
                message: "Cannot delete your own account"
            });
        }

        const user = await User.findByIdAndDelete(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Optionally delete user's tickets or just orphan them
        await Ticket.deleteMany({ userId });

        res.json({
            success: true,
            message: "User and their tickets deleted successfully"
        });
    } catch (err) {
        console.error("Error deleting user:", err);
        res.status(500).json({
            success: false,
            message: "Failed to delete user"
        });
    }
};
