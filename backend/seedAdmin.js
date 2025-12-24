import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "./models/User.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/museum-bot";

const createAdminUser = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("✅ Connected to MongoDB");

        const adminEmail = "rajputanasingh767@admin.com";
        const adminUsername = "rajputanasingh767";
        const adminPassword = "123";

        let admin = await User.findOne({ email: adminEmail });

        if (admin) {
            admin.role = "admin";
            await admin.save();
            console.log("✅ Updated existing user to admin role");
        } else {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(adminPassword, salt);

            admin = new User({
                name: adminUsername,
                email: adminEmail,
                password: hashedPassword,
                role: "admin"
            });

            await admin.save();
            console.log("✅ Created new admin user");
        }

        console.log("\n📋 Admin Account Details:");
        console.log("   Email: " + adminEmail);
        console.log("   Username: " + adminUsername);
        console.log("   Password: " + adminPassword);
        console.log("   Role: admin");
        console.log("\n🎉 Admin account ready! You can now login with these credentials.\n");

        await mongoose.disconnect();
        process.exit(0);
    } catch (err) {
        console.error("❌ Error creating admin:", err);
        process.exit(1);
    }
};

createAdminUser();
