import { Socket } from "socket.io";

export const registerTypingHandlers = (
    socket: Socket
) => {
    socket.on("typing", ({ room }) => {
        console.log(`${socket.data.username} is typing...`);
        socket.to(room).emit("user-typing", {
            username: socket.data.username
        });
    });
};