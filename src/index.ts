import "reflect-metadata";
import express from "express";
import cors from "cors";
import config from './core/config';
import {AppDataSource} from "./core/database";
import {EventRouter, UserRouter} from "./core/routes";
import { createServer } from "http";
import { Server } from "socket.io";


const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const httpServer = createServer();
export const io = new Server(httpServer, {
    transports: ["websocket"]
});

io.on("connection", (socket) => {
    console.log("[WEB SOCKETS] | [CONNECTION] ID:", socket.id);
    socket.join(String(socket.handshake.query.id));
    console.log(`[WEB SOCKETS] | [JOIN TO ROOM] User: ${socket.id}, Room: ${socket.handshake.query.id}`)
});

AppDataSource.initialize()
    .catch(err => console.log(`[DB] | [ERROR]: ${err}`));

app.use("/api/event", EventRouter);
app.use("/api/user", UserRouter);

app.listen(config.port, () => console.log(`Application started on port: ${config.port}`));