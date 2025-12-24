import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import ticketRoutes from "./routes/ticketRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import { chatWithAI } from "./controllers/chatController.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/tickets", ticketRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.post("/api/chat", chatWithAI);

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date(),
    mongodb: mongoose.connection.readyState === 1 ? "connected" : "disconnected"
  });
});

const PORT = process.env.PORT || 5000;
const MONGO = process.env.MONGO_URI || "mongodb://localhost:27017/museum-bot";

// MongoDB Connection for Serverless (prevents multiple connections)
let isConnected = false;

const connectToDatabase = async () => {
  if (isConnected) {
    console.log('=> using existing database connection');
    return;
  }

  try {
    const db = await mongoose.connect(MONGO, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    isConnected = db.connections[0].readyState;
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    throw error; // Rethrow to let Vercel know function failed
  }
};

// Middleware to ensure DB connection
const checkDbConnection = async (req, res, next) => {
  try {
    await connectToDatabase();
    next();
  } catch (error) {
    res.status(503).json({
      message: "Database connection failed",
      error: "SERVICE_UNAVAILABLE"
    });
  }
};

app.use("/api/tickets", checkDbConnection);
app.use("/api/auth", checkDbConnection);
app.use("/api/admin", checkDbConnection);
// Note: /api/chat might not need DB directly if it's just AI, but good practice if it logs chats

// Local development server
if (process.env.NODE_ENV !== 'production') {
  connectToDatabase().then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Server running locally on http://localhost:${PORT}`);
    });
  });
}

export default app;
