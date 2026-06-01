// socket entry
import { Server } from "socket.io";
import { onlineUsers } from "../store/onlineUsers";
import User from "../models/users";

// import {
//     registerRoomHandlers
// } from "./roomHandler";

// import {
//     registerMessagehandlers,
// } from "./messageHandlers";

import {
    registerLoadConversations
} from "./loadConversations";

import {
    registerTypingHandlers
} from "./typingHandlers";

import {
    registerPrivateMessageHandlers,
} from "./privateMessageHandlers";

import {
    registerPresenceHandlers,
} from "./presenceHandlers";

export const initializeSocket = (
    io: Server
) => {
    io.on("connection", (socket) => {
        console.log(`New client connected: ${socket.id}`);

        socket.on("register-user", async (user) => {

            if (!user.username || !user.role) {
                return;
            }

            socket.data.username = user.username;

            socket.data.role = user.role;

            // saving to db

            await User.findOneAndUpdate(
                {
                    username: user.username
                },

                {
                    username: user.username,
                    role: user.role,
                },

                {
                    upsert: true,
                    new: true
                }
            );

            onlineUsers.set(user.username, socket.id);

            io.emit(
                "online-users",
                Array.from(onlineUsers.keys())
            );
        });

        // Register handlers for different events
        // registerRoomHandlers(io, socket);
        // registerMessagehandlers(io, socket);
        registerLoadConversations(socket, io);
        registerTypingHandlers(socket, io);
        registerPrivateMessageHandlers(io, socket);
        registerPresenceHandlers(io, socket);
    });
};
