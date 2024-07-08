import {Router} from "express"
import { isLoggged } from "../middlewares/auth.middleware.js";
import { addChat, get_chat, getChats } from "../controllers/chat.controller.js";

const router = Router();

router.get("/getChats",isLoggged,getChats);
router.post("/create_chat",isLoggged,addChat);
router.get("/getChat/:chatId",isLoggged,get_chat);
export default router;