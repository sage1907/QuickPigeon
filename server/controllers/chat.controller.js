import expressAsyncHandler from "express-async-handler";
import Chat from "../models/chat.model.js";
import { emitEvent } from "../utils/features.utils.js";
import {
  ALERT,
  NEW_ATTACHMENT,
  NEW_MEESAGE_ALERT,
  REFETCH_CHATS,
} from "../constants/events.js";
import { getOtherMembers } from "../lib/helper.js";
import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import { deleteFromCloudinary } from "../utils/cloudinary.utils.js";

export const newGroupChat = expressAsyncHandler(async (req, res) => {
  const { name, members } = req.body;

  // if (members.length < 2) {
  //   // throws error
  //   const err = new Error("Group chat must have ay least 3 members");
  //   err.statusCode = 400;
  //   throw err;
  // }

  const allMembers = [...members, req.user];

  const chat = Chat.create({
    name,
    groupChat: true,
    creator: req.user,
    members: allMembers,
  });

  await chat.save();

  emitEvent(req, ALERT, allMembers, `Welcome to ${name} group.`);
  emitEvent(req, REFETCH_CHATS, members);

  res.status(201).json({
    status: "Success",
    message: "Group Created Successfully",
    data: chat,
  });
});

export const getMyChats = expressAsyncHandler(async (req, res) => {
  const chats = await Chat.find({ members: req.user }).populate(
    "members",
    "name avatar"
  );

  const transformedChats = chats.map(({ _id, name, members, groupChat }) => {
    const otherMembers = getOtherMembers(members, req.user);

    return {
      _id,
      name: groupChat ? name : otherMembers.name,
      groupChat,
      avatar: groupChat
        ? members.slice(0, 3).map(({ avatar }) => avatar.url)
        : [otherMembers.avatar.url],
      members: members.reduce((prev, curr) => {
        if (curr._id.toString() !== req.user.toString()) {
          prev.push(curr._id);
        }
        return prev;
      }, []),
    };
  });

  res.status(200).json({
    success: true,
    chats: transformedChats,
  });
});

export const getMyGroups = expressAsyncHandler(async (req, res) => {
  const chats = await Chat.find({
    members: req.user,
    groupChat: true,
    creator: req.user,
  }).populate("members", "name avatar");

  const groups = chats.map(({ members, _id, groupChat, name }) => ({
    _id,
    groupChat,
    name,
    avatar: members.slice(0, 3).map(({ avatar }) => avatar.url),
  }));

  res.status(200).json({
    success: true,
    groups,
  });
});

export const addMembers = expressAsyncHandler(async (req, res) => {
  const { chatId, members } = req.body;

  if (!members || members.length < 1) {
    const err = new Error("Please provide members");
    err.statusCode = 400;
    throw err;
  }

  const chat = await Chat.findById(chatId);

  // if (!chat) {
  //   // throws error
  //   const err = new Error("Chat not found");
  //   err.statusCode = 404;
  //   throw err;
  // }

  if (!chat.groupChat) {
    // throws err (bad request)
    const err = new Error("This is not a group chat");
    err.statusCode = 400;
    throw err;
  }

  if (chat.creator.toString() !== req.user.toString()) {
    // throws error
    const err = new Error("You are not allowed to add members");
    err.statusCode = 403;
    throw err;
  }

  const allNewMembersPromise = members.map((i) => User.findById(i, "name"));

  const allNewMembers = await Promise.all(allNewMembersPromise);

  const uniqueMembers = allNewMembers
    .filter((i) => !chat.members.includes(i._id.toString()))
    .map((i) => i._id);

  chat.members.push(...uniqueMembers);

  if (chat.members.length > 100) {
    // throws error
    const err = new Error("Group members limit reached");
    err.statusCode = 400;
    throw err;
  }

  await chat.save();

  const allUsersName = allNewMembers.map((i) => i.name).join(",");

  emitEvent(
    req,
    ALERT,
    chat.members,
    `${allUsersName} have been added to ${chat.name} group`
  );
  emitEvent(req, REFETCH_CHATS, chat.members);

  res.status(200).json({
    success: true,
    message: "Members added successfully",
  });
});

export const removeMember = expressAsyncHandler(async (req, res) => {
  const { userId, chatId } = req.body;

  const [chat, userWhoWillBeRemoved] = await Promise.all([
    Chat.findById(chatId),
    User.findById(userId, "name"),
  ]);

  if (!chat) {
    // throws error
    const err = new Error("Chat not found");
    err.statusCode = 404;
    throw err;
  }

  if (!chat.groupChat) {
    // throws err (bad request)
    const err = new Error("This is not a group chat");
    err.statusCode = 400;
    throw err;
  }

  if (chat.creator.toString() !== req.user.toString()) {
    // throws error
    const err = new Error("You are not allowed to add members");
    err.statusCode = 403;
    throw err;
  }

  if (chat.members.length <= 3) {
    // throws error
    const err = new Error("Group must have at least 3 members");
    err.statusCode = 400;
    throw err;
  }

  chat.members = chat.members.filter(
    (member) => member.toString() !== userId.toString()
  );

  await chat.save();

  emitEvent(
    req,
    ALERT,
    chat.members,
    `${userWhoWillBeRemoved} has been removed from the group`
  );
  emitEvent(req, REFETCH_CHATS, chat.members);

  res.status(200).json({
    success: true,
    message: "Members removed successfully",
  });
});

export const leaveGroup = expressAsyncHandler(async (req, res) => {
  const chatId = req.params.id;

  const chat = await Chat.findById(chatId);

  if (!chat) {
    // throws error
    const err = new Error("Chat not found");
    err.statusCode = 404;
    throw err;
  }

  if (!chat.groupChat) {
    // throws err (bad request)
    const err = new Error("This is not a group chat");
    err.statusCode = 400;
    throw err;
  }

  const remainingMembers = chat.members.filter(
    (member) => member.toString() !== req.user.toString()
  );

  if (remainingMembers.length <= 3) {
    // throws error
    const err = new Error("Group must have at least 3 members");
    err.statusCode = 400;
    throw err;
  }

  if (chat.creator.toString() === req.user.toString()) {
    const randomElement = Math.floor(Math.random() * remainingMembers.length());
    const newCreator = remainingMembers[randomElement];
    chat.creator = newCreator;
  }

  chat.members = remainingMembers;

  const [user] = await Promise.all(
    User.findById(req.user, "name"),
    chat.save()
  );

  emitEvent(req, ALERT, chat.members, `${user} has left the group`);

  res.status(200).json({
    success: true,
    message: "Successfully left the group",
  });
});

export const sendAttachments = expressAsyncHandler(async (req, res) => {
  const { chatId } = req.body;

  const files = req.files || [];

  if (files.length < 1) {
    const err = new Error("Please Upload Attachments");
    err.statusCode = 400;
    throw err;
  }

  if (files.length > 5) {
    const err = new Error("Attachments can't be more than 5");
    err.statusCode = 400;
    throw err;
  }

  const [chat, me] = await Promise.all([
    Chat.findById(chatId),
    User.findById(req.user, "name"),
  ]);

  if (!chat) {
    // throws error
    const err = new Error("Chat not found");
    err.statusCode = 404;
    throw err;
  }

  if (files.length < 1) {
    // throws error
    const err = new Error("Please provide attachments");
    err.statusCode = 400;
    throw err;
  }

  // to be implemented later
  const attachments = [];

  const messageForDB = {
    content: "",
    attachments,
    sender: me._id,
    chat: chatId,
  };

  const messageForRealTime = {
    ...messageForDB,
    sender: {
      _id: me._id,
      name: me.name,
    },
  };

  const message = await Message.create(messageForDB);

  emitEvent(req, NEW_ATTACHMENT, chat.members, {
    message: messageForRealTime,
    chatId,
  });

  emitEvent(req, NEW_MEESAGE_ALERT, chat.members, { chatId });

  res.status(200).json({
    success: true,
    message,
  });
});

export const getChatDetails = expressAsyncHandler(async (req, res) => {
  if (req.query.populate === "true") {
    const chat = await Chat.findById(req.params.id)
      .populate("members", "name avatar")
      .lean();

    if (!chat) {
      // throws error
      const err = new Error("Chat not found");
      err.statusCode = 404;
      throw err;
    }

    chat.members = chat.members.map(({ _id, name, avatar }) => ({
      _id,
      name,
      avatar: avatar.url,
    }));

    res.status(200).json({
      success: true,
      chat,
    });
  } else {
    const chat = await Chat.findById(req.params.id);

    if (!chat) {
      // throws error
      const err = new Error("Chat not found");
      err.statusCode = 404;
      throw err;
    }

    res.status(200).json({
      success: true,
      chat,
    });
  }
});

export const renameGroup = expressAsyncHandler(async (req, res) => {
  const chatId = req.params.id;
  const { name } = req.body;

  const chat = await Chat.findById(chatId);

  if (!chat) {
    // throws error
    const err = new Error("Chat not found");
    err.statusCode = 404;
    throw err;
  }

  if (!chat.groupChat) {
    // throws err (bad request)
    const err = new Error("This is not a group chat");
    err.statusCode = 400;
    throw err;
  }

  if (chat.creator.toString() !== req.user.toString()) {
    // throw error
    const err = new Error("You are not allowed to rename the group");
    err.statusCode = 403;
    throw err;
  }

  chat.name = name;

  await chat.save();

  emitEvent(req, REFETCH_CHATS, chat.members);

  res.status(200).json({
    success: true,
    message: "Group renamed successfully",
  });
});

export const deleteChat = expressAsyncHandler(async (req, res) => {
  const chatId = req.params.id;

  const chat = await Chat.findById(chatId);

  if (!chat) {
    // throws error
    const err = new Error("Chat not found");
    err.statusCode = 404;
    throw err;
  }

  if (chat.groupChat && chat.creator.toString() !== req.user.toString()) {
    // throws error
    const err = new Error("You are not allowed to delete the group");
    err.statusCode = 403;
    throw err;
  }

  if (chat.groupChat && !chat.members.includes(req.user.toString())) {
    // throws error
    const err = new Error("You are not allowed to delete the group");
    err.statusCode = 403;
    throw err;
  }

  const messageWithAttachments = await Message.find({
    chat: chatId,
    attachments: { $exists: true, $ne: [] },
  });

  const public_ids = [];

  messageWithAttachments.forEach(({ attachments }) =>
    attachments.forEach(({ public_id }) => public_ids.push(public_id))
  );

  await Promise.all([
    deleteFromCloudinary(public_ids),
    chat.deleteOne(),
    Message.deleteMany({ chat: chatId }),
  ]);

  emitEvent(req, REFETCH_CHATS, chat.members);

  res.status(200).json({
    success: true,
    message: "Chat deleted successfully",
  });
});

export const getMessages = expressAsyncHandler(async (req, res) => {
  const chatId = req.params.id;
  const { page = 1 } = req.query;

  const limit = 20;
  const skip = (page - 1) * limit;

  const [messages, totalMessagesCount] = await Promise.all([
    Message.find({ chat: chatId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("sender", "name")
      .lean(),
    Message.countDocuments({ chat: chatId }),
  ]);

  const totalPages = Math.ceil(totalMessagesCount / limit);

  res.status(200).json({
    success: true,
    message: messages.reverse(),
    totalPages,
  });
});
