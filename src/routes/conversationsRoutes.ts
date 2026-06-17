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

            const allUsers = await User.find({
                username: {
                    $ne: currentUser
                }
            });

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

            for (const user of allUsers) {
                if (!conversationMap.has(user.username)) {
                    conversationMap.set(user.username,
                        {
                            username: user.username,

                            role: user.role,

                            lastMessage: "",

                            unreadCount: 0,

                            lastSender: null

                            // lastFileType: null
                        }
                    );
                }
            }

            const conversations = Array.from(
                conversationMap.values()
            );

            conversations.sort(
                (a, b) => 
                    new Date(b.lastMessageTime || 0).getTime() - new Date(a.lastMessageTime || 0).getTime()
            );

            res.status(200).json(
                conversations
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