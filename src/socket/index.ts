// socket entry
import { Server } from "socket.io";
import { onlineUsers } from "../store/onlineUsers";
import User from "../models/users";

import jwt from "jsonwebtoken";

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
    io.use((socket, next) => {
        try {
            const token = socket.handshake.auth.token;

            const decoded = jwt.verify(token, process.env.JWT_SECRET!);

            socket.data.user = decoded;
            next();
        } catch {
            next (
                new Error(
                    "Authentication error"
                )
            );
        }
    });

    io.on("connection", (socket) => {
        console.log(socket.data.user);
        const username = socket.data.user.username;

        onlineUsers.set(username, socket.id);
        console.log(`New client connected: ${socket.id}`);         

            io.emit(
                "online-users",
                Array.from(onlineUsers.keys())
            );

        // Register handlers for different events
        // registerRoomHandlers(io, socket);
        // registerMessagehandlers(io, socket);
        registerLoadConversations(socket, io);
        registerTypingHandlers(socket, io);
        registerPrivateMessageHandlers(io, socket);
        registerPresenceHandlers(io, socket);
    });
};
