import express from "express";
import {
  addMembers,
  deleteChat,
  getChatDetails,
  getMessages,
  getMyChats,
  getMyGroups,
  leaveGroup,
  newGroupChat,
  removeMember,
  renameGroup,
  sendAttachments,
} from "../controllers/chat.controller.js";
import { attachmentsMulter } from "../middlewares/multer.middleware.js";
import {
  addMemberValidator,
  chatIdValidator,
  newGroupValidator,
  removeMemberValidator,
  renameValidator,
  sendAttachmentsValidator,
  validateHandler,
} from "../lib/validator.js";

const chatRoutes = express.Router();

chatRoutes.post(
  "/newgroup",
  newGroupValidator(),
  validateHandler,
  newGroupChat
);

chatRoutes.get("/mychats", getMyChats);

chatRoutes.get("/mychats/groups", getMyGroups);

chatRoutes.put(
  "/addmembers",
  addMemberValidator(),
  validateHandler,
  addMembers
);

chatRoutes.put(
  "/removemember",
  removeMemberValidator(),
  validateHandler,
  removeMember
);

chatRoutes.delete(
  "/leave/:id",
  chatIdValidator(),
  validateHandler,
  leaveGroup
);

chatRoutes.post(
  "/message",
  attachmentsMulter,
  sendAttachmentsValidator(),
  validateHandler,
  sendAttachments
);

chatRoutes.get(
  "/messages/:id",
  chatIdValidator(),
  validateHandler,
  getMessages
);

chatRoutes
  .route("/:id")
  .get(chatIdValidator(), validateHandler, getChatDetails)
  .put(renameValidator(), validateHandler, renameGroup)
  .delete(chatIdValidator(), validateHandler, deleteChat);

export default chatRoutes;
