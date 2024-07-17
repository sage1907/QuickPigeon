import express from "express";
import cors from "cors";
import { Server } from "socket.io";
import { v4 as uuid } from "uuid";

// Mongo database config to establish connection
import dbConnect from "./config/mongo.config.js";

import { notFound, globalErrorHandler } from "./middlewares/error-handler.middleware.js";

// Import Routes
import userRoutes from "./routes/user.routes.js";
import chatRoutes from "./routes/chat.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import { NEW_MEESAGE_ALERT, NEW_MESSAGE } from "./constants/events.js";
import { getSockets } from "./lib/helper.js";
import Message from "./models/message.model.js";


export const userSocketIDs = new Map();

// Connect database
dbConnect();

const app = express();
const io = new Server(app, {});

// Middleware to automatically parse incoming JSON requests
// Parses JSON payloads and makes the resulting JSON object available as req.body in route handlers.
app.use(cors());
app.use(express.json());


// Routes
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/chats", chatRoutes);
app.use("/api/v1/admin", adminRoutes);


io.on("connection", (socket) => {

    const user = {
        _id: "randomId",
        name: "Mingo"
    }

    userSocketIDs.set(user._id.toString(), socket.id);

    console.log("a user connected", socket.id);

    socket.on(NEW_MESSAGE, async ({ chatId, members, message }) => {

        const messageForRealTime = {
            content: message,
            _id: uuid(),
            sender: {
                _id: user._id,
                name: user.name,
            },
            chat: chatId,
            createdAt: new Date().toISOString(),
        };

        const messageForDB = {
            content: message,
            sender: user._id,
            chat: chatId,
        };

        const membersScokets = getSockets(members);
        io.to(membersScokets).emit(NEW_MESSAGE, {
            chatId,
            message: messageForRealTime,
        });

        io.to(membersScokets).emit(NEW_MEESAGE_ALERT, { chatId });

        try {
            await Message.create(messageForDB);
        } catch (error) {
            console.log(error);
        }
    });

    socket.on("disconnect", () => {
        console.log("user disconnected");
        userSocketIDs.delete(user._id.toString());
    });
});


app.use(notFound);
app.use(globalErrorHandler);


export default app;