var { body, param, query } = require('express-validator/check')

exports.validate = (method) => {
    switch (method) {
        case 'getTeam': {
            return [
                param('username').trim().escape(),
                param('username', 'username must not contain spaces').custom(value => !/\s/.test(value)),
                param('username', 'username does not exist').exists(),
                param('username', 'invalid username').isAlphanumeric(),
                param('username', 'invalid username length').isLength({ min: 5, max: 15 }),
            ]
        }
        case 'createTeam': {
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

                body('name').trim().escape(),
                body('name', 'name does not exist').exists(),
                body('name', 'invalid name length').isLength({ min: 5, max: 15 }),

                body('worms', 'worms does not exist').exists(),
                body('worms', 'worms is an invalid format').isArray(),
                body('worms', 'worms cannot be empty').not().isEmpty(),

                body('worms.*.name').trim().escape(),
                body('worms.*.name', 'worm name must not contain spaces').custom(value => !/\s/.test(value)),
                body('worms.*.name', 'worm name does not exist').exists(),
                body('worms.*.name', 'invalid worm name').isAlphanumeric(),
                body('worms.*.name', 'invalid worm name length').isLength({ min: 2, max: 10 }),
            ]
        }
        case 'updateTeam': {
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

                body('name').trim().escape(),
                body('name', 'name does not exist').exists(),
                body('name', 'invalid name length').isLength({ min: 5, max: 15 }),

                body('worms', 'worms does not exist').exists(),
                body('worms', 'worms is an invalid format').isArray(),
                body('worms', 'worms cannot be empty').not().isEmpty(),

                body('worms.*.name').trim().escape(),
                body('worms.*.name', 'worm name must not contain spaces').custom(value => !/\s/.test(value)),
                body('worms.*.name', 'worm name does not exist').exists(),
                body('worms.*.name', 'invalid worm name').isAlphanumeric(),
                body('worms.*.name', 'invalid worm name length').isLength({ min: 2, max: 10 }),
            ]
        }
        case 'deleteTeam': {
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