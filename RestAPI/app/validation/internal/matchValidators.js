var { body, param, query } = require('express-validator/check')

exports.validate = (method) => {
    switch (method) {
        case 'getMatches': {
            return [
                query('top').trim().escape(),
                query('top').optional()
                    .isNumeric().withMessage('top must be numeric')
            ]
        }
        case 'getMatchesForUser': {
            return [
                param('username').trim().escape(),
                param('username', 'username must not contain spaces').custom(value => !/\s/.test(value)),
                param('username', 'username does not exist').exists(),
                param('username', 'invalid username').isAlphanumeric(),
                param('username', 'invalid username length').isLength({ min: 5, max: 15 })
            ]
        }
        case 'saveMatch': {
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

                body('won').trim().escape(),
                body('won', 'won does not exist').exists(),
                body('won', 'won is an invalid format').isBoolean(),

                body('vs').trim().escape(),
                body('vs', 'vs must not contain spaces').custom(value => !/\s/.test(value)),
                body('vs', 'vs does not exist').exists(),
                body('vs', 'invalid vs').isAlphanumeric(),
                body('vs', 'invalid vs length').isLength({ min: 5, max: 15 }),

                body('score').trim().escape(),
                body('score', 'score does not exist').exists(),
                body('score', 'score must be numeric').isNumeric(),
            ]
        }
    }
}