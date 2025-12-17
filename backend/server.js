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

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date(),
    mongodb: mongoose.connection.readyState === 1 ? "connected" : "disconnected"
  });
});

const PORT = process.env.PORT || 5000;
const MONGO = process.env.MONGO_URI || "mongodb://localhost:27017/museum-bot";

// MongoDB connection with retry logic
const connectWithRetry = async (retries = 5, delay = 5000) => {
  for (let i = 0; i < retries; i++) {
    try {
      await mongoose.connect(MONGO, {
        serverSelectionTimeoutMS: 10000,
        socketTimeoutMS: 45000,
      });
      console.log("✅ MongoDB connected successfully");
      console.log(`📦 Database: ${mongoose.connection.name || 'default'}`);
      console.log(`🔗 Connection state: ${mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'}`);
      return true;
    } catch (err) {
      console.error(`❌ MongoDB connection attempt ${i + 1}/${retries} failed:`, err.message);

      if (err.message.includes("IP") || err.message.includes("whitelist")) {
        console.error("\n⚠️  IP WHITELIST ERROR DETECTED!");
        console.error("📋 Action required:");
        console.error("   1. Go to https://cloud.mongodb.com/");
        console.error("   2. Navigate to Network Access → IP Whitelist");
        console.error("   3. Add your current IP or allow access from anywhere (0.0.0.0/0)");
        console.error("   4. Wait 1-2 minutes and restart the server\n");
      }

      if (i < retries - 1) {
        const waitTime = delay * Math.pow(2, i); // Exponential backoff
        console.log(`⏳ Retrying in ${waitTime / 1000} seconds...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
  }
  return false;
};

// Middleware to check DB connection before processing requests
const checkDbConnection = (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      message: "Database connection unavailable. Please try again later.",
      error: "SERVICE_UNAVAILABLE",
      details: "The server cannot connect to the database. Please contact support if this persists."
    });
  }
  next();
};

// Apply DB check middleware to critical routes
app.use("/api/tickets", checkDbConnection);
app.use("/api/auth", checkDbConnection);

// Start server with MongoDB connection
connectWithRetry().then((connected) => {
  if (connected) {
    app.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
    });
  } else {
    console.error("❌ Failed to connect to MongoDB after multiple retries");
    console.error("⚠️  Server will start but database operations will fail");
    console.error("🔧 Please fix the MongoDB connection and restart the server");

    // Start server anyway but warn about DB issues
    app.listen(PORT, () => {
      console.log(`⚠️  Server running on http://localhost:${PORT} (DB DISCONNECTED)`);
      console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
    });
  }
});

// Handle MongoDB connection errors after initial connection
mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB connection error:', err.message);
});

mongoose.connection.on('disconnected', () => {
  console.warn('⚠️  MongoDB disconnected. Attempting to reconnect...');
  connectWithRetry(3, 3000);
});
