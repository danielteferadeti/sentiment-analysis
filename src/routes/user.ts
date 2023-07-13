import { Router } from "express";
import userControllers from "../controllers/user";

const router = Router();
router.post("/", userControllers.createUserContact);

export default router;