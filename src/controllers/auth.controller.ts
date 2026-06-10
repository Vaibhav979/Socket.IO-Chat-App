import { Request, Response } from "express";
import { registerUser, loginUser } from "../services/auth.service";

export const register = async (
    req: Request,
    res: Response
) => {
    try {
        const result = await registerUser(req.body);

        return res.status(201).json(
            result
        );
    } catch (error) {
        return res.status(400).json({ error: String(error) });
    }
}

export const login = async (
    req: Request,
    res: Response
) => {
    try {
        const result = await loginUser(req.body);

        return res.status(200).json(
            result
        );
    } catch (error) {
        return res.status(400).json({ error: String(error) });
    }
}