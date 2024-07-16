import expressAsyncHandler from "express-async-handler";
import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/token.utils.js";

// @desc   Register user
// @route  POST /api/v1/users/register
// @access Public
export const registerUser = expressAsyncHandler(async (req, res) => {
    const { name, username, bio, password } = req.body;

    const avatar  = {

    };

    // check if the user already exists
    const userExists = await User.findOne({
        username: username,
    });

    if (userExists) {
        // throws error
        const err = new Error("user already exists");
        err.statusCode = 409;
        throw err;
    }

    // create the user
    const user = User.create({
        name: name,
        username: username,
        bio: bio,
        password: password,
        avatar: avatar,
    });

    await user.save();

    res.status(201).json({
        status: "Success",
        message: "User registered successfully",
        data: user,
    });
});


// @desc   Login user
// @route  POST /api/v1/users/login
// @access Public
export const loginUser = expressAsyncHandler(async (req, res) => {
    const { username, password } = req.body;

    // find the user by username
    const userExists = await User.findOne({
        username: username,
    });

    if (userExists && await bcrypt.compare(password, userExists?.password)) {
        res.status(200).json({
            status: "Success",
            message: "User logged in successfully",
            data: generateToken(userExists?.id),
        });
    } else {
        const err = new Error("Invalid login credentials");
        err.statusCode = 401;
        throw err;
    }
});


// @desc   Get user profile
// @route  GET /api/v1/users/profile
// @access Private
export const getUserProfile = expressAsyncHandler(async (req, res) => {
    if (req.user) {
        res.status(200).json({
            status: "Success",
            message: "User profile retrieved successfully",
            data: req.user,
        });
    } else {
        const err = new Error("getUserProfileController accessed without prior middlewares");
        err.statusCode = 403;
        throw err;
    }
});

export const searchUser = expressAsyncHandler(async (req, res) => {
    
});