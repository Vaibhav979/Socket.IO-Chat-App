import express from "express";
import { upload } from "../middleware/upload";
import { authenticate } from "../middleware/auth.middleware";

const router = express.Router();

router.post(
    "/upload",
    authenticate,
    upload.single("file"),
    async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({
                    message: "No file uploaded"
                });
            }

            res.status(200).json({
                fileUrl: `http://localhost:3000/uploads/${req.file.filename}`,

                fileType: req.file.mimetype
            });
        } catch (error) {
            res.status(500).json({
                message: "File upload failed"
            });
        }
    }
);

export default router;