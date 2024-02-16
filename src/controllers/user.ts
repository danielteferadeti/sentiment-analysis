import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken';

import { BaseResponse } from '../types/baseResponse';
import User, { IUserDocument, userValidation, updateUserValidation } from '../models/user'
import configs from '../config/configs'

const jwtSecret = configs.JWT_SECRET;

// create json web token that expires in AUTH_TOKEN_EXP_DAY
const maxAge = configs.AUTH_TOKEN_EXP_DAY * 24 * 60 * 60;
export const createToken = (id) => {
  return jwt.sign({ id }, jwtSecret, {
    expiresIn: maxAge
  });
};

const userLogin = async (req: Request, res: Response, next) => {

  try {
    let { email_phone, password } = req.body;
    email_phone = email_phone.trim()
    password = password.trim()

    let baseResponse = new BaseResponse();

    if (email_phone === null || password === null || email_phone === "" || password == "") {
      throw Error("Must provide Email/Phone_Number and password.");
    }
    const user: IUserDocument = await User.login(email_phone, password);

    const token = createToken(user);

    res.header('token', token);
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });

    const cur_user = await User.findOne({ _id: user._id })
    .select('-__v -password -createdAt -updatedAt')
    .lean().exec();

    baseResponse.success = true
    baseResponse.message = 'User logged in successfully'
    baseResponse.data = {
      token: token,
      curUser: cur_user,
    }
    return res.status(200).json({ ...baseResponse });
  }
  catch (err) {
    if (err.isJoi === true) {
      next(Error(err.details[0].message));
    }
    next(err);
  }
}

const userSignup = async (req, res, next) => {
  try {
    let {email_phone, password } = req.body;

    let baseResponse = new BaseResponse();

    const validatedUser = await userValidation.validateAsync( {email_phone, password });

    //check if user exists with email
    const userByEmail = await User.findOne({ email_phone: validatedUser.email_phone }).lean().exec();

    //if user found return error
    if (userByEmail) {
      throw Error("That email is already registered!");
    }

    const new_user = await User.create({ ...validatedUser });

    //send jwt token
    const token = createToken(new_user);
    res.header('token', token);
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });

    const cur_user = await User.findOne({ _id: new_user._id })
    .select('-__v -password -createdAt -updatedAt')
    .lean().exec();

    baseResponse.success = true
    baseResponse.message = 'User registered in successfully'
    baseResponse.data = {
      token: token,
      curUser: cur_user,
    }
    return res.status(201).json({ ...baseResponse }).end();
  }
  catch (err) {
    if (err.isJoi === true) {
      next(Error(err.details[0].message));
    }
    next(err);
  }
}


const logoutUser = async (req, res, next) => {
  try {
    let baseResponse = new BaseResponse();
    baseResponse.success = true
    baseResponse.message = "User logged out successfully!"
    baseResponse.data = {
      status: "Logged out",
    }
    return res.cookie('jwt', '', { maxAge: 1 }).header('token', "").status(201).json({ ...baseResponse }).end();
  } catch (error) {
    next(Error("Error while logging out!"))
  }
}


const UserControllers = { userLogin, userSignup, logoutUser }
export default UserControllers