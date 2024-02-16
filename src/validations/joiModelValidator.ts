import Joi from "joi";

const requiredRule = { post: (schema) => schema.required(), put: (schema => schema.optional()) }

export const reviewValidation = (review) => {
  const schema = Joi.object({
    _id: Joi.forbidden(),
    comment: Joi.string(),
    sentiment: Joi.string().valid('Positive', 'Negative', 'Neutral'),
    userId: Joi.string().hex().length(24).required()
  });
  return schema.validate(review, { abortEarly: false });
};
