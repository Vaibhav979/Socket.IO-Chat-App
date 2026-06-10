import { Request, Response } from "express";
import Otp from "../models/Otp";
import crypto from "crypto";
import { sendOtpEmail } from "../services/email.service";
import VerificationSession from "../models/Verificationsession";

export const sendOtp = async (
    req: Request,
    res: Response
) => {
    const { email } = req.body;

    const otp = crypto.randomInt(100000, 1000000).toString();

    await Otp.deleteMany({
        email
    });

    await Otp.create({
        email,
        otp,
        expiresAt:
            new Date(
                Date.now() + 5*60*1000
            )
    });

    await sendOtpEmail(
        email,
        otp
    );

    res.json({
        message: "OTP sent successfully"
    });
}

export const verifyOtp = async (
    req: Request,
    res: Response
) => {
    const { email, otp } = req.body;

    const otpRecord = await Otp.findOne({
        email
    });

    if (!otpRecord) {
        return res.status(400).json({
            message: "OTP not found!"
        });
    }

    if (!otpRecord.expiresAt || otpRecord.expiresAt < new Date()) {
        return res.status(400).json({
            message: "OTP expired!"
        });
    }

    if (otpRecord.otp !== otp) {
        return res.status(400).json({
            message: "Invalid OTP!"
        });
    }

    const verificationSession = await VerificationSession.create({
        email,
        expiresAt:
            new Date(
                Date.now() + 5 * 60 * 1000
            )
    });

    await Otp.deleteMany({
        email
    });

    res.status(200).json({
        verificationId: verificationSession._id
    });
}