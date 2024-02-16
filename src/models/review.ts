import { Schema, Document, Model, model } from 'mongoose';

export enum Sentiment {
  Positive = "Positive",
  Negative = "Negative",
  Neutral = "Neutral"
}

export interface IReviewDocument extends Document {
  comment: string;
  sentiment: Sentiment;
  userId: Schema.Types.ObjectId;
}

interface ReviewModel extends Model<IReviewDocument> {}

const ReviewSchema: Schema<IReviewDocument, ReviewModel> = new Schema(
  {
    comment: {
      type: String,
      default: "No comment"
    },
    sentiment: {
      type: String,
      enum: Object.values(Sentiment),
      default: Sentiment.Neutral
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null
    }
  },
  {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt'
    }
  }
);

const Review = model<IReviewDocument, ReviewModel>('Review', ReviewSchema);

export default Review;