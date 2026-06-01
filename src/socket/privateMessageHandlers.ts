import { Socket, Server } from "socket.io";
import { onlineUsers } from "../store/onlineUsers";
import Message from "../models/messages";

export const registerPrivateMessageHandlers = (
    io: Server,
    socket: Socket
) => {

    socket.on(
    "private-message",
    async ({ to, message, fileUrl, fileType }) => {

        const targetSocketId =
            onlineUsers.get(to);


        const savedMessage =
            await Message.create({
                sender: socket.data.username,
                receiver: to,
                text: message || "",
                fileUrl: fileUrl || "",
                fileType: fileType || "",
                seen: false
            });

        // receiver
        if (targetSocketId) {
            io.to(targetSocketId).emit(
                "private-message",
                savedMessage
            );
        }

        // sender
        socket.emit(
            "private-message",
            savedMessage
        );
    }
);
};