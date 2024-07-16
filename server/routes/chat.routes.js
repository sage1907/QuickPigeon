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

const chatRoutes = express.Router();

chatRoutes.post("/newgroup", newGroupChat);
chatRoutes.get("/mychats", getMyChats);
chatRoutes.get("/mychats/groups", getMyGroups);
chatRoutes.put("/addmembers", addMembers);
chatRoutes.put("/removemember", removeMember);
chatRoutes.delete("/leave/:id", leaveGroup);

chatRoutes.post("/message", attachmentsMulter, sendAttachments);

chatRoutes.get("/messages/:id", getMessages);

chatRoutes.route("/:id").get(getChatDetails).put(renameGroup).delete(deleteChat);

export default chatRoutes;
