import Joi from "joi";
import { Schema } from "mongoose";

export const userValidator = (user) => {
  const schema = Joi.object({
    _id: Joi.forbidden(),
    email: Joi.string().min(6).email().trim().lowercase(),
    firstName: Joi.string().required().trim(),
    lastName: Joi.string().required().trim(),
    examType: Joi.string().required().trim(),
    department: Joi.string().allow('').default("Department goes here").trim().optional(),
    fieldOfStudy: Joi.string().allow('').default("field goes here.").trim().optional(),
    phoneNumber: Joi.string().required()
  });
  return schema.validate(user, { abortEarly: false });
};