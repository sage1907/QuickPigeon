import express from "express";
import { registerUser, loginUser, getUserProfile } from "../controllers/user.controller.js";
import { singleAvatar } from "../middlewares/multer.middleware.js";
import { protect } from "../middlewares/auth.middleware.js";


const userRoutes = express.Router();

// public routes
userRoutes.post("/register", singleAvatar , registerUser);
userRoutes.post("/login", loginUser);

// protected routes
userRoutes.get("/profile-pii", protect , getUserProfile);


export default userRoutes;