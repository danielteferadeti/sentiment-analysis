import { Request, Response, NextFunction } from 'express';
import User from '../models/user';
import { userValidator } from '../validations/joiModelValidator';
import { BaseResponse } from '../types/baseResponse';

const createUserContact = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        email, firstName, lastName,
        examType, department,
        fieldOfStudy, phoneNumber
      } = req.body;
  
      const userInput = {
        email, firstName, lastName,
        examType, department,
        fieldOfStudy, phoneNumber
      };
  
      const { error, value } = userValidator(userInput);
  
      if (error) {
        throw new Error(error.details[0].message);
      }
  
      const foundUser = await User.findOne({ email });
  
      if (foundUser) {
        throw new Error("You have already been registered! We will be contacting you soon!");
      }
  
      const newUser = new User(value);
      const savedUser = await newUser.save();
  
      let baseResponse = new BaseResponse();
      baseResponse.success = true;
      baseResponse.message = 'User created successfully!';
      baseResponse.data = {
        newUser: savedUser
      };
  
      return res.status(201).json(baseResponse);
    } catch (error) {
      next(error);
    }
  };

const userControllers = {createUserContact}

export default userControllers