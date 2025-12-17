import express from "express";
import { createTicket, getTickets, getTicketById, cancelTicket } from "../controllers/ticketController.js";
import { authMiddleware, optionalAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", optionalAuth, createTicket);
router.get("/", authMiddleware, getTickets);
router.get("/:id", authMiddleware, getTicketById);
router.post("/:id/cancel", authMiddleware, cancelTicket);

export default router;
