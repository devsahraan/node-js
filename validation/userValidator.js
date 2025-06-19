const joi=require('joi')

const userValidator=joi.object({
    name:joi.string().trim().required().messages({
        'string.base':'{#} should be a string',
        'string.empty':'{#} cannot be empty',

    }),
    email:joi.string().email().required().messages({
        'string.base': `Email must be a string`,
        'string.empty': `Email cannot be empty`,
        'string.email': `Email must be a valid email address`,
        'any.required': `Email is required`,
      }),
    password:joi.string().min(6).max(100).pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])')).required().messages({
        'string.base': `Password must be a string`,
        'string.empty': `Password cannot be empty`,
        'string.min': `Password should have a minimum length of {#limit}`,
        'string.max': `Password should have a maximum length of {#limit}`,
        'string.pattern.base': `Password must include at least one uppercase letter, one lowercase letter, one number, and one special character`,
        'any.required': `Password is required`,
      }),

    userType:joi.string().valid('user','admin').required().messages({
        'string.base': `userType must be a string`,
        'string.empty': `Name cannot be empty`,
        'string.valid': `Type only Admin or User`,
        'any.required': `userType is required`,
      }),
})
module.exports = userValidator