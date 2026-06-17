import express from "express";

import {
    authenticate
} from "../middleware/auth.middleware";

import {
    savePublicKey, 
    getPublicKey
} from "../controllers/keyController.controller";

const router = express.Router();

router.post(
    "/keys/public",
    authenticate,
    savePublicKey
);

router.get(
    "/keys/public/:username",
    authenticate,
    getPublicKey
);

export default router;