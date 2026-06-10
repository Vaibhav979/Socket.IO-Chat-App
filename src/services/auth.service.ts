import bcrypt from "bcryptjs";

import User from "../models/users";
import VerificationSession from "../models/Verificationsession";
import { generateToken } from "../utils/jwt";

interface RegisterInput {
    verificationId: string;
    username: string;
    password: string;
    role: string;
}

export const registerUser = async (
    data: RegisterInput
) => {
    const { verificationId, username, password, role } = data;

    const session = await VerificationSession.findOne({
        _id: verificationId,
    });

    if (!session) {
        throw new Error("Invalid verification session");
    }

    if (session.expiresAt < new Date()) {
        throw new Error("Verification session expired");
    }

    const email = session.email;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
        throw new Error("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
        username,
        email,
        passwordHash: hashedPassword,
        role,
        isEmailVerified: true
    });
    
    const token = generateToken({
    userId: user._id.toString(),

    username: user.username,

    email: user.email,

    role: user.role
});

    await VerificationSession.deleteOne({ _id: verificationId });

    return {user, token};
}

export const loginUser = async (
    data: {
        email: string;
        password: string;
    }
) => {
    const { email, password } = data;

    const user = await User.findOne({ email });

    if (!user) {
        throw new Error("Invalid Credentials");
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);

    if (!isValid) {
        throw new Error("Invalid Credentials");
    }

    if (!user.isEmailVerified) {
        throw new Error("Email not verified");
    }

    const token = generateToken({
    userId: user._id.toString(),

    username: user.username,

    email: user.email,

    role: user.role
});

    return {

        message:
            "Login successful",

        user: {

            id:
                user._id,

            username:
                user.username,

            email:
                user.email,

            role:
                user.role
        },

        token
    };
}