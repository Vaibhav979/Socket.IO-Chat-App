import { Server, Socket } from "socket.io";
import Message from "../models/messages";

export const registerMessagehandlers = (
    io: Server,
    socket: Socket
) => {
    socket.on("send-message", async ({ room, message }) => {
        
        const savedMessage = await Message.create({ 
            username: socket.data.username,
            room,
            text: message
        });
        io.to(room).emit("receive-message", {
            username: savedMessage.username,
            text: savedMessage.text
        });
    });
};