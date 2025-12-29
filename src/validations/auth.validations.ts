import joi from 'joi';

// one uppercase one lowercase one number one special character
const passwordRegex =
  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;

const registerSchema = joi.object({
  email: joi.string().email().required(),
  password: joi
    .string()
    .min(6)
    .required()
    .regex(passwordRegex)
    .message(
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
    ),
});

const loginSchema = joi.object({
  email: joi.string().email().required(),
  password: joi.string().required(),
});

export { loginSchema, registerSchema };
