import { Schema, Document, Model, model } from 'mongoose';

export interface IChatRate extends Document {
  user: string;
  date:string;
  usedToken: Number;
  createdAt: Date;
  updatedAt: Date;
}

const ChatRateSchema: Schema<IChatRate> = new Schema(
  {
    user: {
      type: String,
      required: [true, 'User Id is required']
    },
    date: {
      type: String,
      required: [true, 'Please enter your Date.']
    },
    usedToken: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt'
    }
  }
);

const ChatRate = model<IChatRate>('ChatRate', ChatRateSchema);

export default ChatRate;