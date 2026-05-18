// socket entry
import { Server } from "socket.io";

import {
    registerRoomHandlers
} from "./roomHandler";

import {
    registerMessagehandlers,
} from "./messageHandlers";

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

        // Register handlers for different events
        registerRoomHandlers(io, socket);
        registerMessagehandlers(io, socket);
        registerTypingHandlers(socket);
        registerPrivateMessageHandlers(io, socket);
        registerPresenceHandlers(io, socket);
    });
};
