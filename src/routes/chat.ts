import { Router } from "express";
import chatControllers from "../controllers/chat";

const router = Router();
router.post("/", chatControllers.userChat);

export default router;