import { Socket, Server } from "socket.io";
import Message from "../models/messages";

export const registerLoadConversations = (
    socket: Socket,
    io: Server
) => {
    socket.on("load-conversations", async ({ withUser }) => {
        await Message.updateMany(
            {
                sender: withUser,
                receiver: socket.data.user.username,
                seen: false
            }, {
                seen: true
            }
        );
        const messages = await Message.find({
            $or: [
                {
                    sender: socket.data.user.username,

                    receiver: withUser
                },

                {
                    sender: withUser,

                    receiver: socket.data.user.username
                }
            ]
        }).sort({
            createdAt: 1
        });

        socket.emit("conversation-history", messages);
        io.to(socket.id).emit(
            "message-seen"
        );
    })
};