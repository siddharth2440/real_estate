import { Router } from "express"
import { delete_user, getAllUsers, getUserById, update_user_details } from "../controllers/user.controller.js";
import { isLoggged } from "../middlewares/auth.middleware.js";
const router = Router();

router.get("/get_all_users",getAllUsers);
router.get("/get_user_details/:userId",isLoggged,getUserById);
router.put("/update_user/:userId",update_user_details);
router.delete("delete_user/:userId",delete_user);

export default router;