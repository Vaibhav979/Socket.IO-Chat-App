import express from "express";
import User from "../models/users";

const router = express.Router();

router.get("/users", async (req, res) => {
    try {
        const users = await User.find();

        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch users"
        });
    }
});

export default router;