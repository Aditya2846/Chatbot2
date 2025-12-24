import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const authMiddleware = async (req, res, next) => {
    try {
        const token = req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            return res.status(401).json({
                message: "No authentication token, access denied",
                success: false
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");

        const user = await User.findById(decoded.user.id).select("-password");

        if (!user) {
            return res.status(401).json({
                message: "User not found, access denied",
                success: false
            });
        }

        req.user = user;
        next();
    } catch (err) {
        console.error("Auth middleware error:", err.message);
        res.status(401).json({
            message: "Token is not valid",
            success: false
        });
    }
};

export const optionalAuth = async (req, res, next) => {
    try {
        const token = req.header("Authorization")?.replace("Bearer ", "");

        if (token) {
            const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
            const user = await User.findById(decoded.user.id).select("-password");

            if (user) {
                req.user = user;
            }
        }

        next();
    } catch (err) {
        next();
    }
};

export const adminOnly = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            message: "Authentication required",
            success: false
        });
    }

    if (req.user.role !== "admin") {
        return res.status(403).json({
            message: "Access denied. Admin privileges required.",
            success: false
        });
    }

    next();
};
