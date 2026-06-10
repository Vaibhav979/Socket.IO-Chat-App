import express from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes";
import conversationRoutes from "./routes/conversationsRoutes";
import path from "path";
import uploadRoutes from "./routes/uploadRoutes";
import sendemailroutes from "./routes/sendemail.routes";
import authRoutes from "./routes/auth.routes";

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
app.use(express.json());
app.use(userRoutes);
app.use(conversationRoutes);
app.use(
    "/uploads",
    express.static(     // serve files directly from this folder
        path.join(__dirname, "../uploads")
    )
);
app.use(uploadRoutes);
app.use(sendemailroutes);
app.use(authRoutes);

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