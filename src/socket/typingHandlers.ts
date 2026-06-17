import { Socket, Server } from "socket.io";
import { onlineUsers } from "../store/onlineUsers";

export const registerTypingHandlers = (
    socket: Socket,
    io: Server
) => {
    socket.on("typing", ({ to }) => {
        console.log(`${socket.data.user.username} is typing...`);
        const targetSocketId = onlineUsers.get(to);

        if (!targetSocketId) {
            return;
        }
        
        io.to(targetSocketId).emit(
             "user-typing",
                {
                    username: socket.data.user.username
                }
            );
        }
    );
};