import joi from 'joi';

const registerSchema = joi.object({
  databaseId: joi.string().required(),
  number: joi.string().required(),
  password: joi.string().min(6).required(),
});

const loginSchema = joi.object({
  databaseId: joi.string().required(),
  number: joi.string().required(),
  password: joi.string().min(6).required(),
});

export { loginSchema, registerSchema };
