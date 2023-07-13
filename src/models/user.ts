import { Schema, Document, Model, model } from 'mongoose';
import Joi from 'joi';

export interface IUserDocument extends Document {
  email: string;
  firstName: string;
  lastName: string;
  examType: string;
  department: string;
  fieldOfStudy: string;
  phoneNumber: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema<IUserDocument> = new Schema(
  {
    email: {
      type: String,
      lowercase: true,
      trim: true,
      unique: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    firstName: {
      type: String,
      required: [true, 'Please enter your first name!']
    },
    lastName: {
      type: String,
      required: [true, 'Please enter your last name!']
    },
    examType: {
      type: String,
      required: true,
    },
    department: {
      type: String,
      default: "Department goes here"
    },
    fieldOfStudy: {
      type: String,
      default: "field goes here."
    },
    phoneNumber: {
      type: String,
      required: true,
    }
  },
  {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt'
    }
  }
);

const User = model<IUserDocument>('User', UserSchema);

export default User;