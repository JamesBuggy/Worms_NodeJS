var { body } = require('express-validator/check')

exports.validate = (method) => {
    switch (method) {
        case 'validateRegistration': {
            return [
                body('fields.username').trim().escape(),
                body('fields.username', 'username must not contain spaces').custom(value => !/\s/.test(value)),
                body('fields', 'fields does not exist').exists(),
                body('fields.username', 'username does not exist').exists(),
                body('fields.username', 'invalid username').isAlphanumeric(),
            ]
        }
        case 'register': {
            return [
                body('username').trim().escape(),
                body('username', 'username must not contain spaces').custom(value => !/\s/.test(value)),
                body('username', 'username does not exist').exists(),
                body('username', 'invalid username').isAlphanumeric(),
                body('username', 'invalid username length').isLength({ min: 5, max: 15 }),
                
                body('password').trim().escape(),
                body('password', 'password must not contain spaces').custom(value => !/\s/.test(value)),
                body('password', 'password must contain a number').custom(value => /\d/.test(value)),
                body('password', 'password must contain an uppercase letter').custom(value => /[A-Z]/.test(value)),
                body('password', 'password does not exist').exists(),
                body('password', 'invalid password length').isLength({ min: 5, max: 15 })
            ]
        }
        case 'login': {
            return [
                body('username').trim().escape(),
                body('username', 'username must not contain spaces').custom(value => !/\s/.test(value)),
                body('username', 'username does not exist').exists(),
                body('username', 'invalid username').isAlphanumeric(),
                body('username', 'invalid username length').isLength({ min: 5, max: 15 }),

                body('password').trim().escape(),
                body('password', 'password must not contain spaces').custom(value => !/\s/.test(value)),
                body('password', 'password does not exist').exists(),
                body('password', 'invalid password length').isLength({ min: 5, max: 15 })
            ]
        }
    }
}