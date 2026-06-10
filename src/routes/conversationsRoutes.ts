import express from "express";
import Message from "../models/messages";
import User from "../models/users";

import { authenticate } from "../middleware/auth.middleware";

const router = express.Router();

router.get(
    "/conversations",
    authenticate,
    async (req, res) => {

        try {

            const currentUser =
                req.user.username;

            const messages =
                await Message.find({
                    $or: [
                        {
                            sender: currentUser
                        },
                        {
                            receiver: currentUser
                        }
                    ]
                }
            ).sort(
                {
                    createdAt: -1
                }
            );

            const conversationMap =
                new Map();

            for (const msg of messages) {

                const otherUser =
                    msg.sender === currentUser
                        ? msg.receiver
                        : msg.sender;

                const userData = await User.findOne({ username: otherUser }); 

                if (!otherUser) {
                    continue;
                }

                if (
                    !conversationMap.has(
                        otherUser
                    )
                ) {
                    const unreadCount = await Message.countDocuments({
                        sender: otherUser,
                        receiver: currentUser,
                        seen: false
                    });
                    
                    conversationMap.set(
                        otherUser,
                        {
                            username: otherUser,

                            role: userData?.role || "User",

                            lastMessage:
                                msg.text,

                            lastMessageTime:
                                msg.createdAt,

                            unreadCount,
                            
                            lastSender: msg.sender,

                            lastFileType: msg.fileType || null
                        }
                    );
                }
            }

            res.status(200).json(
                Array.from(
                    conversationMap.values()
                )
            );

        } catch (error) {

            console.log(error);

            res.status(500).json({
                message:
                    "Failed to fetch conversations"
            });
        }
    }
);

export default router;