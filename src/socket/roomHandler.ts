// import { Server, Socket } from "socket.io";

// import Message from "../models/messages";

// import { onlineUsers } from "../store/onlineUsers";

// export const registerRoomHandlers = (
//     io: Server,
//     socket: Socket
// ) => {

//     socket.on("join-room", async ({ room, username }) => {
//         const oldMessages = await Message.find({ room }).sort({ createdAt: 1 });

//         socket.emit("chat-history", oldMessages);

//         socket.join(room);

//         socket.data.username = username;
//         socket.data.room = room;

//         onlineUsers.set(username, socket.id);

//         io.emit("online-users", 
//             Array.from(onlineUsers.keys())
//         );

//         io.to(room).emit("receive-message", {
//             system: true,
//             text: `${username} joined the room`
//         });
//     });
// };