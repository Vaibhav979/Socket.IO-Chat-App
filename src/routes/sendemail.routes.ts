import express from "express";
import { sendOtp, verifyOtp } from "../controllers/otp.controller";

const router = express.Router();

router.post("/auth/send-otp", sendOtp);
router.post("/auth/verify", verifyOtp);

export default router;