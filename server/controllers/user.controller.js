import expressAsyncHandler from "express-async-handler";
import User from "../models/user.model.js";
import Chat from "../models/chat.model.js";
import Request from "../models/request.model.js";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/token.utils.js";
import { emitEvent } from "../utils/features.utils.js";
import { NEW_REQUEST, REFETCH_CHATS } from "../constants/events.js";
import { getOtherMembers } from "../lib/helper.js";

// @desc   Register user
// @route  POST /api/v1/users/register
// @access Public
export const registerUser = expressAsyncHandler(async (req, res) => {
    const { name, username, bio, password } = req.body;

    const file = req.file;

    if (!file) {
        const err = new Error("Please Upload Avatar");
        err.statusCode = 400;
        throw err;
    }

    const avatar  = {
        public_id: "",
        url: "",
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
    const { name } = req.query;

    const myChats = await Chat.find({ groupChat: false, members: req.user });

    // all users from my chats means friends or people I have chatted with
    const allUsersFromMyChats = myChats.flatMap((chat) => chat.members);

    const allUsersExceptMeAndMyFriends = await User.find({
        _id: { $nin: allUsersFromMyChats },
        name: { $regex: name, $options: "i" },
    });

    const users = allUsersExceptMeAndMyFriends.map(({ _id, name, avatar }) => ({
        _id,
        name,
        avatar: avatar.url,
    }));

    res.status(200).json({
        success: true,
        users,
    });
});



export const sendFriendRequest = expressAsyncHandler(async (req, res) => {
    const { userId } = req.body;

    const request = await Request.findOne({
        $or: [
            { sender: req.user, receiver: userId },
            { sender: userId, receiver: req.user },
        ],
    });

    if (request) {
        const err = new Error("Request already sent");
        err.statusCode = 400;
        throw err;
    }

    await Request.create({
        sender: req.user,
        receiver: userId,
    });

    emitEvent(req, NEW_REQUEST, [userId]);

    res.status(200).json({
        success: true,
        message: "Friend Request Sent",
    });
});



export const acceptFriendRequest = expressAsyncHandler(async (req, res) => {
    const { requestId, accept } = req.body;

    const request = await Request.findById(requestId).populate("sender", "name").populate("receiver", "name");

    if (!request) {
        const err = new Error("Request not found");
        err.statusCode = 400;
        throw err;
    }

    if (request.receiver._id.toString() !== req.user.toString()) {
        const err = new Error("You are not authorized to accept this request");
        err.statusCode = 401;
        throw err;
    }

    if (!accept) {
        await request.deleteOne();

        res.status(200).json({
            success: true,
            message: "Friend Request Rejetcted",
        });
    }

    const members = [request.sender._id, request.receiver._id];

    await Promise.all([
        Chat.create({
            members,
            name: `${request.sender.name} and ${request.receiver.name}`,
        }),
        request.deleteOne(),
    ]);

    emitEvent(req, REFETCH_CHATS, members);

    res.status(200).json({
        success: true,
        message: "Friend Request Accepted",
        senderId: request.sender._id,
    });
});



export const getMyNotifications = expressAsyncHandler(async (req, res) => {
    const requests = await Request.find({ receiver: req.user }).populate("sender", "name avatar");

    const allRequests = requests.map(({ _id, sender }) => ({
        _id,
        sender: {
            _id: sender._id,
            name: sender.name,
            avatar: sender.avatar.url,
        },
    }));

    res.status(200).json({
        success: true,
        allRequests,
    });
});



export const getMyFriends = expressAsyncHandler(async (req, res) => {
    const chatId = req.query.chatId;

    const chats = await Chat.find({
        members: req.user,
        groupChat: false,
    }).populate("members", "name avatar");

    const friends = chats.map(({ members }) => {
        const otherUsers = getOtherMembers(members, req.user);

        return {
            _id: otherUsers._id,
            name: otherUsers.name,
            avatar: otherUsers.avatar.url,
        }
    });

    if (chatId) {
        const chat = await Chat.find(chatId);

        const availableFriends = friends.filter((friend) => !chat.members.includes(friend._id));

        res.status(200).json({
            success: true,
            friends: availableFriends,
        });
    } else {
        res.status(200).json({
            success: true,
            friends,
        });
    }
})