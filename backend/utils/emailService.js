import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export const sendTicketEmail = async (to, ticketDetails) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn("Skipping email send: EMAIL_USER or EMAIL_PASS not set in .env");
    console.log("Would have sent ticket to:", to);
    return;
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: to,
    subject: '🎫 Your Museum Ticket Confirmation',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 30px auto; background: white; border-radius: 15px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
          .header h1 { margin: 0; font-size: 28px; }
          .content { padding: 30px; }
          .ticket-info { background: #f8f9fa; border-radius: 10px; padding: 20px; margin: 20px 0; }
          .info-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e0e0e0; }
          .info-row:last-child { border-bottom: none; }
          .label { font-weight: bold; color: #555; }
          .value { color: #333; }
          .price { font-size: 24px; font-weight: bold; color: #667eea; text-align: center; margin: 20px 0; }
          .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 12px; }
          .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; margin: 15px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🏛️ National Museum</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Ticket Confirmation</p>
          </div>
          
          <div class="content">
            <h2 style="color: #4CAF50; text-align: center;">✅ Booking Confirmed!</h2>
            <p>Dear ${ticketDetails.name || 'Visitor'},</p>
            <p>Thank you for booking with National Museum. Your ticket has been confirmed!</p>
            
            <div class="ticket-info">
              <div class="info-row">
                <span class="label">🎟️ Ticket Type:</span>
                <span class="value">${ticketDetails.ticketType}</span>
              </div>
              <div class="info-row">
                <span class="label">🖼️ Exhibition:</span>
                <span class="value">${ticketDetails.exhibition}</span>
              </div>
              <div class="info-row">
                <span class="label">📅 Visit Date:</span>
                <span class="value">${ticketDetails.date}</span>
              </div>
              <div class="info-row">
                <span class="label">👥 Visitors:</span>
                <span class="value">${ticketDetails.visitors} x ${ticketDetails.category}</span>
              </div>
              <div class="info-row">
                <span class="label">💳 Status:</span>
                <span class="value">${ticketDetails.paymentStatus || 'Paid'}</span>
              </div>
            </div>
            
            <div class="price">Total: $${ticketDetails.price}</div>
            
            <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <strong>📍 Important Information:</strong>
              <ul style="margin: 10px 0; padding-left: 20px;">
                <li>Please arrive 15 minutes before your visit time</li>
                <li>Show this email at the entrance</li>
                <li>Bring a valid ID for verification</li>
                <li>Cancellations allowed up to 2 days before visit</li>
              </ul>
            </div>
            
            <p style="text-align: center; color: #666;">
              Need to make changes? Visit your tickets page to cancel or view details.
            </p>
            
            <div style="text-align: center; margin: 25px 0;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/tickets" style="background-color: #f5576c; color: white; padding: 12px 25px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">
                Manage Booking / Cancel Ticket
              </a>
            </div>
          </div>
          
          <div class="footer">
            <p><strong>National Museum</strong></p>
            <p>Visit: www.nationalmuseum.com | Support: support@museum.com</p>
            <p style="margin-top: 10px; font-size: 11px;">This is an automated email. Please do not reply.</p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Ticket email sent to ${to}`);
  } catch (error) {
    console.error("❌ Error sending email:", error);
  }
};

export const sendCancellationEmail = async (to, ticketDetails, refundAmount) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn("Skipping cancellation email: EMAIL_USER or EMAIL_PASS not set");
    return;
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: to,
    subject: '❌ Ticket Cancellation Confirmation',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 30px auto; background: white; border-radius: 15px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 30px; text-align: center; }
          .content { padding: 30px; }
          .ticket-info { background: #f8f9fa; border-radius: 10px; padding: 20px; margin: 20px 0; }
          .info-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e0e0e0; }
          .info-row:last-child { border-bottom: none; }
          .refund-box { background: #d4edda; border: 2px solid #28a745; border-radius: 10px; padding: 20px; text-align: center; margin: 20px 0; }
          .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🏛️ National Museum</h1>
            <p style="margin: 10px 0 0 0;">Cancellation Confirmation</p>
          </div>
          
          <div class="content">
            <h2 style="color: #f5576c; text-align: center;">Ticket Cancelled</h2>
            <p>Dear ${ticketDetails.name || 'Visitor'},</p>
            <p>Your ticket has been successfully cancelled as per your request.</p>
            
            <div class="ticket-info">
              <div class="info-row">
                <span><strong>Ticket Type:</strong></span>
                <span>${ticketDetails.ticketType}</span>
              </div>
              <div class="info-row">
                <span><strong>Exhibition:</strong></span>
                <span>${ticketDetails.exhibition}</span>
              </div>
              <div class="info-row">
                <span><strong>Original Date:</strong></span>
                <span>${ticketDetails.date}</span>
              </div>
              <div class="info-row">
                <span><strong>Cancelled On:</strong></span>
                <span>${new Date().toLocaleDateString()}</span>
              </div>
            </div>
            
            ${refundAmount > 0 ? `
            <div class="refund-box">
              <h3 style="margin: 0 0 10px 0; color: #28a745;">💰 Refund Information</h3>
              <p style="font-size: 24px; font-weight: bold; margin: 10px 0;">$${refundAmount.toFixed(2)}</p>
              <p style="margin: 0; color: #555;">Will be credited to your original payment method within 5-7 business days</p>
            </div>
            ` : `
            <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <strong>⚠️ No Refund:</strong>
              <p style="margin: 5px 0 0 0;">As per our cancellation policy, tickets cancelled less than 7 days before the visit date are not eligible for a full refund.</p>
            </div>
            `}
            
            <p style="text-align: center; margin-top: 30px;">
              We hope to see you again soon!<br>
              Feel free to book another visit anytime.
            </p>
          </div>
          
          <div class="footer">
            <p><strong>National Museum</strong></p>
            <p>Questions? Contact support@museum.com</p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Cancellation email sent to ${to}`);
  } catch (error) {
    console.error("❌ Error sending cancellation email:", error);
  }
};
