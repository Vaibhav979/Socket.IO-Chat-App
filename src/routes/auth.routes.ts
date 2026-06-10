import express from "express";

import { register, login } from "../controllers/auth.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = express.Router();

router.post("/auth/register", register);
router.post("/auth/login", login);

router.get("/auth/me",
    authenticate,
    (req, res) => {
        res.status(200).json(req.user);
    }
);

export default router;