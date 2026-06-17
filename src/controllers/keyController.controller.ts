import { Request, Response } from "express";

import User from "../models/users";

import {
    getPublicKeyByUsername
} from "../services/key.service";

export const savePublicKey = async (req: Request, res: Response) => {
    try {
        console.log(req.user);

        const { publicKey } = req.body;

        if (!publicKey) {
            return res.status(400).json({
                message: "Public key required"
            });
        }

        await User.findByIdAndUpdate(
            req.user.userId, 
            {
                publicKey
            }
        );

        return res.status(200).json({
            message: "Public Key saved"
        });
    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Failed to save public key"
        });
    }
};

export const getPublicKey = async (
    req: Request,
    res: Response
) => {
    try {
        const { username } = req.params;

        if (Array.isArray(username)) {
            return res.status(400).json({
                message: "Invalid username format"
            });
        }

        const response = await getPublicKeyByUsername(username);

        return res.status(200).json(
            response
        );
    } catch (error) {
        console.log(error);

        res.status(500).json(error);
    }
}