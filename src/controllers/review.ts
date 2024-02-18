import { Request, Response, NextFunction } from 'express';
import Review, { Sentiment } from '../models/review';
import { reviewValidation } from '../validations/joiModelValidator';
import { BaseResponse } from '../types/baseResponse';
import { commentSentimentAnalysis } from './chat';

const createReview = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.body.user?._id || req.body.userId || "65d10c0ffb83e57ea07aee46"
        const { comment } = req.body;
        const analysis = await commentSentimentAnalysis(comment.toString())
        const sentiment =  (analysis.toString() === "Positive" || analysis.toString() === "Negative") ? analysis.toString() as Sentiment : "Neutral" as Sentiment

        const userInput = { comment, sentiment, userId: userId.toString() };

        const { error, value } = reviewValidation(userInput);

        if (error) throw error;

        const review = new Review(value);

        const savedReview = await review.save();

        let baseResponse = new BaseResponse();
        baseResponse.success = true;
        baseResponse.message = 'Review created successfully!';
        baseResponse.data = {
            newReview: savedReview
        };

        return res.status(201).json({...baseResponse});
    } catch (error) {
        next(error);
    }
};

const getReviews = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const reviews = await Review.find().populate("userId").lean().exec();

        let baseResponse = new BaseResponse();
        baseResponse.success = true;
        baseResponse.message = 'Reviews retrieved successfully!';
        baseResponse.data = {
            reviews,
        };

        return res.status(200).json({...baseResponse});
    } catch (error) {
        next(error);
    }
};

const getReview = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id;
        const review = await Review.findOne({_id: id}).lean().exec();

        if (!review) throw Error("Review not found with that Id.");

        let baseResponse = new BaseResponse();
        baseResponse.success = true;
        baseResponse.message = 'Review retrieved successfully!';
        baseResponse.data = {
            review,
        };

        return res.status(200).json({...baseResponse});
    } catch (error) {
        next(error);
    }
};

const updateReview = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const reviewToBeUpdated = await Review.findById(id).lean().exec();

        if (!reviewToBeUpdated) throw Error("Review not found with that Id.");

        const { comment, sentiment, userId } = req.body;

        let updateObject = { comment, sentiment, userId };

        for (const key in updateObject) {
            if (!updateObject[key]) delete updateObject[key];
        }

        const { error, value } = reviewValidation(updateObject);

        if (error) throw error;

        const updatedReview = await Review.findByIdAndUpdate(id, value, {new: true}).lean().exec();

        let baseResponse = new BaseResponse();
        baseResponse.success = true;
        baseResponse.message = 'Review updated successfully!';
        baseResponse.data = {
            updatedReview,
        };

        return res.status(200).json({...baseResponse});
    } catch (error) {
        next(error);
    }
};

const deleteReview = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const reviewToBeDeleted = await Review.findById(id).lean().exec();

        if (!reviewToBeDeleted) throw Error("Review not found with that Id.");

        const deletedReview = await Review.findByIdAndDelete(id).lean().exec();

        let baseResponse = new BaseResponse();
        baseResponse.success = true;
        baseResponse.message = 'Review deleted successfully!';
        baseResponse.data = {
            deletedReview,
        };

        return res.status(200).json({...baseResponse});
    } catch (error) {
        next(error);
    }
};

const getReviewSentimentCount = async (req, res, next) => {
    try {
        const positiveCount = await Review.countDocuments({ sentiment: 'Positive' }).exec();
        const negativeCount = await Review.countDocuments({ sentiment: 'Negative' }).exec();
        const neutralCount = await Review.countDocuments({ sentiment: 'Neutral' }).exec();

        const sentimentCounts = {
            positive: positiveCount,
            negative: negativeCount,
            neutral: neutralCount
        };

        let baseResponse = new BaseResponse();
        baseResponse.success = true;
        baseResponse.message = 'Review sentiment count retrieved successfully!';
        baseResponse.data = sentimentCounts;

        return res.status(200).json({...baseResponse});
    } catch (error) {
        next(error);
    }
};

const reviewControllers = {
    createReview,
    getReviews,
    getReview,
    updateReview,
    deleteReview,
    getReviewSentimentCount
};

export default reviewControllers;
