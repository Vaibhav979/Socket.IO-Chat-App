import { Socket, Server } from "socket.io";
import { onlineUsers } from "../store/onlineUsers";
import Message from "../models/messages";

export const registerPrivateMessageHandlers = (
    io: Server,
    socket: Socket
) => {

    socket.on(
    "private-message",
    async ({ to, message, fileUrl, fileType, nonce }) => {

        const targetSocketId =
            onlineUsers.get(to);


        // message can be either:
        // 1) string ciphertext
        // 2) { cipherText: string, nonce?: string }
        const cipherText =
            typeof message === "string"
                ? message
                : (message?.cipherText ?? "");

        const derivedNonce =
            typeof message === "object" && message !== null && "nonce" in message
                ? (message as { nonce?: string }).nonce
                : nonce;

        const savedMessage =
            await Message.create({
                sender: socket.data.user.username,
                receiver: to,
                cipherText: cipherText || "",
                nonce: derivedNonce,
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
    });
};