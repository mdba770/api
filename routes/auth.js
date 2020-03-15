const express = require('express');
const {body} = require('express-validator');
const authController = require('../controllers/auth');
const User = require('../models/user');
const router = express.Router();
const isAuth = require('../middleware/is-auth');

// GET /auth/signup
router.put('/signup', [
    body('email')
        .isEmail()
        .withMessage('Please enter a valid email')
        .custom((value, {req}) => {
            return User
                    .findOne({email: value})
                    .then(userDoc => {
                        if(userDoc) {
                            return Promise.reject('E-Mail address already exists!')
                        }
                    })
        })
        .normalizeEmail(),
    body('password')
        .trim()
        .isLength({min: 8})
        .withMessage('Password min 8 characters.'),
    body('firstName')
        .trim()
        .not()
        .isEmpty(),
    body('lastName')
        .trim()
        .not()
        .isEmpty()
], authController.signup);

router.post('/login', authController.login);

router.get('/me', isAuth, authController.getMe);

router.get('/status', isAuth, authController.getUserStatus);

router.patch('/status', isAuth, [
    body('status')
        .trim()
        .not()
        .isEmpty()
], authController.updateUserStatus);

module.exports = router;