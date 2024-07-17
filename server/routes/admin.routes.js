import express from "express";
import { adminLogin, adminLogout, allChats, allMessages, allUsers, getAdminData, getDashboardStats } from "../controllers/admin.controller.js";
import { adminLoginValidator, validateHandler } from "../lib/validator.js";
import { protect } from "../middlewares/auth.middleware.js";


const adminRoutes = express.Router();


// public routes
adminRoutes.post("/login", adminLoginValidator(), validateHandler, adminLogin);

adminRoutes.get("/logout", adminLogout);

// only accessible to admin
adminRoutes.use(protect);

adminRoutes.get("/", getAdminData);

adminRoutes.get("/users", allUsers);

adminRoutes.get("/chats", allChats);

adminRoutes.get("/messages", allMessages);

adminRoutes.get("/stats", getDashboardStats);


export default adminRoutes;