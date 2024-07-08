import { Router } from "express"
import { create_Post, delete_post, getPost, update_post } from "../controllers/post.controller.js";
import { isLoggged } from "../middlewares/auth.middleware.js";
const router = Router();

router.post("/createPost",isLoggged,create_Post);
router.get("/getPost/:postId",getPost);
router.delete("/delete_post/:postId",isLoggged,delete_post);
router.put("/update_post/:postId",update_post);

export default router;