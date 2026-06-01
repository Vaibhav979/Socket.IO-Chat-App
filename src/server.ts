import express from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes";
import conversationRoutes from "./routes/conversationsRoutes";
import path from "path";
import uploadRoutes from "./routes/uploadRoutes";

import { Server }
from "socket.io";

import connectDB
from "./config/db";

import {
    initializeSocket
} from "./socket";

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(userRoutes);
app.use(conversationRoutes);
app.use(
    "/uploads",
    express.static(     // serve files directly from this folder
        path.join(__dirname, "../uploads")
    )
);
app.use(uploadRoutes);

const server =
    http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*"
    }
});

initializeSocket(io);

server.listen(3000, () => {

    console.log(
        "Server running on 3000"
    );

});