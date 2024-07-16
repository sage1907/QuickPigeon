import express from "express";
import cors from "cors";

// Mongo database config to establish connection
import dbConnect from "./config/mongo.config.js";

import { notFound, globalErrorHandler } from "./middlewares/error-handler.middleware.js";

// Import Routes
import userRoutes from "./routes/user.routes.js";
import chatRoutes from "./routes/chat.routes.js";

// Connect database
dbConnect();

const app = express();

// Middleware to automatically parse incoming JSON requests
// Parses JSON payloads and makes the resulting JSON object available as req.body in route handlers.
app.use(cors());
app.use(express.json());


// Routes
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/chats", chatRoutes);


app.use(notFound);
app.use(globalErrorHandler);


export default app;