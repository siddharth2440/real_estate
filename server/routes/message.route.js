import {Router} from "express"
import { isLoggged } from "../middlewares/auth.middleware.js";
import { addMessage } from "../controllers/message.controller .js";

const router = Router();

router.post("/:chatId",isLoggged,addMessage)

export default router;