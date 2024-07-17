import express from "express";
import {
  registerUser,
  loginUser,
  getUserProfile,
  searchUser,
  sendFriendRequest,
  acceptFriendRequest,
  getMyNotifications,
  getMyFriends,
} from "../controllers/user.controller.js";
import { singleAvatar } from "../middlewares/multer.middleware.js";
import { protect } from "../middlewares/auth.middleware.js";
import {
  acceptRequestValidator,
  loginValidator,
  registerValidator,
  sendRequestValidator,
  validateHandler,
} from "../lib/validator.js";

const userRoutes = express.Router();

// public routes
userRoutes.post(
  "/register",
  singleAvatar,
  registerValidator(),
  validateHandler,
  registerUser
);
userRoutes.post("/login", loginValidator(), validateHandler, loginUser);

// protected routes
userRoutes.get("/profile-pii", protect, getUserProfile);
userRoutes.get("/search", searchUser);
userRoutes.put(
  "/sendrequest",
  sendRequestValidator(),
  validateHandler,
  sendFriendRequest
);

userRoutes.put(
  "/acceptrequest",
  acceptRequestValidator(),
  validateHandler,
  acceptFriendRequest
);

userRoutes.get("/notifications", getMyNotifications);

userRoutes.get("/friends", getMyFriends);

export default userRoutes;
