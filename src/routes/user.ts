import { Router } from "express";
import UserControllers from "../controllers/user";
import isAuthenticated from "../middlewares/authenticate";

const router = Router();

router.post("/signup", UserControllers.userSignup);
router.post("/login", UserControllers.userLogin);
router.get("/logout", isAuthenticated, UserControllers.logoutUser);

export default router;