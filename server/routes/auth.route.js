import { Router } from "express"
import { login, logout_user, register } from "../controllers/auth.controller.js";
const router = Router();

router.post("/register",register);
router.post("/login",login);
router.get("/logout",logout_user)
export default router;