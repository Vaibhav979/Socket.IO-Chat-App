import express from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";

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