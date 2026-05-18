import { Server, Socket } from "socket.io";

import { onlineUsers } from "../store/onlineUsers";

export const registerPresenceHandlers = (
    io: Server,
    socket: Socket
) => {
    socket.on("disconnect", () => {
        onlineUsers.delete(socket.data);

        io.emit(
            "online-users",
            Array.from(onlineUsers.keys())
        );

        io.to(socket.data.room).emit(
            "recieve-message",
            {
                system: true,
                text: `${socket.data.username} left the room`
            }
        )
        console.log("User disconnected:", socket.id);
    });
};