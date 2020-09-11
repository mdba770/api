const express = require('express');
const {body} = require('express-validator');
const authController = require('../../controllers/front/auth');
const Customer = require('../../models/customer');
const router = express.Router();
const isAuth = require('../../middleware/is-auth');

// GET /front/auth/signup
router.put('/signup', [
    body('email')
        .isEmail()
        .withMessage('Please enter a valid email')
        .custom((value, {req}) => {
            return Customer
                    .findOne({email: value})
                    .then(customerDoc => {
                        if(customerDoc) {
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

module.exports = router;