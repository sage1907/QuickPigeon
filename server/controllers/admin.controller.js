import expressAsyncHandler from "express-async-handler";
import User from "../models/user.model.js";
import Chat from "../models/chat.model";
import Message from "../models/message.model.js";
import { generateToken } from "../utils/token.utils.js";


export const adminLogin = expressAsyncHandler(async (req, res) => {
    const { secretKey } = req.body;

    const adminSecretKey = process.env.ADMIN_SECRET_KEY || "nothingjusttheadminsecretkey";

    const isMatched = secretKey === adminSecretKey;

    if (!isMatched) {
        const err = new Error("Invalid Admin Key");
        err.statusCode = 401;
        throw err;
    }

    res.status(200).json({
        success: true,
        message: "Authenticated successfully, Welcome Admin",
        token: generateToken(secretKey),
    });
});


export const adminLogout = expressAsyncHandler(async (req, res) => {
    res.status(200).json({
        success: true,
        message: "Admin logged out successfully",
        clearToken: true // Signal to the client to clear the token // implement in the frontend
    });
});


export const getAdminData = expressAsyncHandler(async (req, res) => {
    res.status(200).json({
        admin: true,
    });
});


export const allUsers = expressAsyncHandler(async (req, res) => {
  // add codes here
  const users = await User.find({});

  const transformedUsers = await Promise.all(
    users.map(async ({ name, username, avatar, _id }) => {
      const [groups, friends] = await Promise.all([
        Chat.countDocuments({ groupChat: true, members: _id }),
        Chat.countDocuments({ groupChat: false, members: _id }),
      ]);

      return {
        name,
        username,
        avatar: avatar.url,
        _id,
        groups,
        friends,
      };
    })
  );

  res.status(200).json({
    success: true,
    users: transformedUsers,
  });
});

export const allChats = expressAsyncHandler(async (req, res) => {
  const chats = (await Chat.find({}))
    .populate("members", "name avatar")
    .populate("creator", "name avatar");

  const transformedChats = await Promise.all(
    chats.map(async ({ members, _id, groupChat, name, creator }) => {
      const totalMessages = await Message.countDocuments({ chat: _id });

      return {
        _id,
        groupChat,
        name,
        avatar: members.slice(0, 3).map((member) => member.avatar.url),
        members: members.map(({ _id, name, avatar }) => ({
          _id,
          name,
          avatar: avatar.url,
        })),
        creator: {
          name: creator?.name || "None",
          avatar: creator?.avatar.url || "",
        },
        totalMembers: members.length,
        totalMessages,
      };
    })
  );

  res.status(200).json({
    success: true,
    chats: transformedChats,
  });
});

export const allMessages = expressAsyncHandler(async (req, res) => {
  const messages = await Message.find({})
    .populate("sender", "name avatar")
    .populate("chat", "groupChat");

  const transformedMessages = messages.map(
    ({ content, attachments, _id, sender, createdAt, chat }) => ({
      _id,
      attachments,
      content,
      createdAt,
      chat: chat._id,
      groupChat: chat.groupChat,
      sender: {
        _id: sender._id,
        name: sender.name,
        avatar: sender.avatar.url,
      },
    })
  );

  res.status(200).json({
    success: true,
    messages: transformedMessages,
  });
});

export const getDashboardStats = expressAsyncHandler(async (req, res) => {
  const [groupsCount, usersCount, messagesCount, totalChatsCount] =
    await Promise.all([
      Chat.countDocuments({ groupChat: true }),
      User.countDocuments(),
      Message.countDocuments(),
      Chat.countDocuments(),
    ]);

  const today = new Date();

  const last7Days = new Date();
  last7Days.setDate(last7Days.getDate() - 7);

  const last7DaysMessages = await Message.find({
    createdAt: {
      $gte: last7Days,
      $lte: today,
    },
  }).select("createdAt");

  const messages = new Array(7).fill(0);
  const dayInMilliseconds = 1000 * 60 * 60 * 24;

  last7DaysMessages.forEach((message) => {
    const indexApprox =
      (today.getTime() - message.createdAt.getTime()) / dayInMilliseconds;
    const index = Math.floor(indexApprox);
    messages[6 - index]++;
  });

  const stats = {
    groupsCount,
    usersCount,
    messagesCount,
    totalChatsCount,
  };

  res.status(200).json({
    success: true,
    stats,
  });
});
