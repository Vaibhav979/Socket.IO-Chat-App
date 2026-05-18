import { Socket, Server } from "socket.io";
import { onlineUsers } from "../store/onlineUsers";

export const registerPrivateMessageHandlers = (
    io: Server,
    socket: Socket
) => {

    socket.on("private-message", ({ to, message }) => {
        const targetSocketId = onlineUsers.get(to);
        if (!targetSocketId) {
            return;
        }

        io.to(targetSocketId).emit(
            "private-message",
            {
                from: socket.data.username,
                text: message
            }
        );

        socket.emit("private-message",
            {
                from: "You",
                text: message
            }
        )
    });
};