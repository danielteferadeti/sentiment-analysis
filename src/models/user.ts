import { Schema, Document, Model, model } from 'mongoose';
import * as bcrypt from "bcrypt";
import Joi, { number } from 'joi';

export interface IUserDocument extends Document {
  email_phone: string
  password: string
  fullName: string
  createdAt: Date
  updatedAt: Date
}

interface UserModel extends Model<IUserDocument>{
  login(email_phone: string, password: string): any
}


const UserSchema: Schema<IUserDocument, UserModel> = new Schema(
  {
    email_phone: {
      type: String,
      required: [true, "email or phone number is required"],
      lowercase: true,
      trim: true,
      unique: true,
      index:true,
      validate: {
        validator: function (value) {
          const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
          const phoneRegex = /^\+\d{11,}$/; // Update this regex for your specific phone number format
          return emailRegex.test(value) || phoneRegex.test(value);
        },
        message: 'Please fill a valid email address or phone number'
      }
   },
    password: {
      type: String,
      required: [true, 'Please enter a password'],
      minlength: [6, 'Minimum password length is 6 characters'],
    },
    fullName: {
      type: String,
      default: "Full Name"
    }
  },
  {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt'
    }
  }
)

UserSchema.pre('remove', { document: true, query: false }, async function (next) {
  next()
})

// fire a function before user is saved to db
UserSchema.pre('save', async function(next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// static method to login a user
UserSchema.statics.login = async function(email_phone, password) {
  const user = await this.findOne({ email_phone });
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    }
    throw Error('incorrect email/phone_number or password!');
  }
  throw Error('incorrect email/phone_number or password!');
};


const User = model<IUserDocument, UserModel>('User', UserSchema)

export const userValidation = Joi.object({
  email_phone: Joi.string().min(6).required()
  .custom((value, helpers) => {
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    const phoneRegex = /^\+\d{11,}$/; //phone numbers with "+" sign

    if (!emailRegex.test(value) && !phoneRegex.test(value)) {
      return helpers.error('any.invalid');
    }
    return value;
  }).trim().lowercase().messages({
    'any.invalid': 'Please fill a valid email address or phone number',
  }),
  password: Joi.string().min(6).required().trim(),
  fullName: Joi.string().default("Full Name").trim(),
});

export const updateUserValidation = Joi.object({
  fullName: Joi.string().trim(),
});

export default User
