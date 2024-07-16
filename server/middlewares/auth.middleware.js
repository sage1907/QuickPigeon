import expressAsyncHandler from "express-async-handler";

import User from "../models/user.model.js";

import { getTokenFromHeader, verifyToken } from "../utils/token.utils.js";


// Protect Middleware
export const protect = expressAsyncHandler(async (req, res, next) => {
    const token = getTokenFromHeader(req);

    if (!token) {
        return res.status(401).json({ message: "Not authorized, no token" });
    }

    try {
        const decodedToken = verifyToken(token);
        if (!decodedToken) {
            return res.status(401).json({ message: "Not authorized, token failed" });
        }

        // Attach the user to the request object
        req.decodedToken = decodedToken;
        req.user = await User.findById(decodedToken.id).select("-password");

        if (!req.user) {
            res.status(404);
            throw new Error("User not found");
        }

        // Check if the user's updatedAt field is after the token's iat
        if (req.user.updatedAt > new Date(req.decodedToken.iat * 1000)) {
            return res.status(401).json({ message: "Not authorized, token invalidated by profile update" });
        }

        next();
    } catch (error) {
        return res.status(401).json({ message: "Not authorized, token failed" });
    }
});
