import express from "express";
import { authMiddleware, adminOnly } from "../middleware/authMiddleware.js";
import {
    getDashboardStats,
    getAllUsers,
    getUserTickets,
    updateUserRole,
    deleteUser
} from "../controllers/adminController.js";

const router = express.Router();

router.use(authMiddleware);
router.use(adminOnly);

router.get("/dashboard/stats", getDashboardStats);

router.get("/users", getAllUsers);
router.get("/users/:userId/tickets", getUserTickets);
router.put("/users/:userId/role", updateUserRole);
router.delete("/users/:userId", deleteUser);

export default router;
