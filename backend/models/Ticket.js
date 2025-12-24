import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  name: { type: String, default: "Guest" },
  email: { type: String },
  ticketType: { type: String, required: true, default: "General Admission" },
  exhibition: { type: String, default: "Main Collection" },
  date: { type: String, required: true }, 
  visitors: { type: Number, default: 1 },
  category: { type: String, default: "Adult" },
  price: { type: Number, default: 0 },
  status: {
    type: String,
    enum: ["Booked", "Confirmed", "Cancelled", "Refunded"],
    default: "Booked"
  },
  paymentStatus: {
    type: String,
    enum: ["Pending", "Paid", "Refunded"],
    default: "Pending"
  },
  cancelledAt: { type: Date },
  cancelReason: { type: String },
  refundAmount: { type: Number },
  refundedAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

ticketSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model("Ticket", ticketSchema);
