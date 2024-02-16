import { Router } from "express";
import isAuthenticated from "../middlewares/authenticate";
import reviewControllers from "../controllers/review";

const router = Router();
router.get("/", reviewControllers.getReviews);
router.get("/counts", reviewControllers.getReviewSentimentCount);
router.post("/addReview", reviewControllers.createReview);
router.get("/:id", reviewControllers.getReview);
router.put("/:id", reviewControllers.updateReview);
router.delete("/:id", reviewControllers.deleteReview);

export default router;