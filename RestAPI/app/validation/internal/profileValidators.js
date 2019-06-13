var { body, param, query } = require('express-validator/check')

exports.validate = (method) => {
    switch (method) {
        case 'getProfile': {
            return [
                param('username').trim().escape(),
                param('username', 'username must not contain spaces').custom(value => !/\s/.test(value)),
                param('username', 'username does not exist').exists(),
                param('username', 'invalid username').isAlphanumeric(),
                param('username', 'invalid username length').isLength({ min: 5, max: 15 }),
            ]
        }
        case 'getProfiles': {
            return [
                query('search').trim().escape(),
                query('search').optional()
                    .isAlphanumeric().withMessage('invalid search')
                    .isLength({ min: 0, max: 15 }).withMessage('invalid search length'),
            ]
        }
        case 'updateProfile': {
            return [
                param('username').trim().escape(),
                param('username', 'username must not contain spaces').custom(value => !/\s/.test(value)),
                param('username', 'username does not exist').exists(),
                param('username', 'invalid username').isAlphanumeric(),
                param('username', 'invalid username length').isLength({ min: 5, max: 15 }),

                body('username').trim().escape(),
                body('username', 'username must not contain spaces').custom(value => !/\s/.test(value)),
                body('username', 'username does not exist').exists(),
                body('username', 'invalid username').isAlphanumeric(),
                body('username', 'invalid username length').isLength({ min: 5, max: 15 }),

                body('image').trim(),
                body('image', 'image must not contain spaces').custom(value => !/\s/.test(value)),
                body('image', 'image does not exist').exists(),
                body('image', 'invalid image length').isLength({ min: 5, max: 75 }),

                body('location').trim().escape(),
                body('location').optional().isLength({ min: 0, max: 15 }).withMessage('invalid location length'),

                body('description').trim().escape(),
                body('description').optional().isLength({ min: 0, max: 100 }).withMessage('invalid description length'),
                
                body('name').trim().escape(),
                body('name').optional().isLength({ min: 0, max: 50 }).withMessage('invalid name length'),
            ]
        }
        case 'deleteProfile': {
            return [
                param('username').trim().escape(),
                param('username', 'username must not contain spaces').custom(value => !/\s/.test(value)),
                param('username', 'username does not exist').exists(),
                param('username', 'invalid username').isAlphanumeric(),
                param('username', 'invalid username length').isLength({ min: 5, max: 15 }),
            ]
        }
    }
}