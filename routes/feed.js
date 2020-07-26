const express = require('express');
const {body} = require('express-validator');
const feedController = require('../controllers/feed');
const isAuth = require('../middleware/is-auth');
const isSecure = require('../middleware/is-secure');

const router = express.Router();

// GET /feed/posts
router.get('/posts', isAuth, isSecure, feedController.getPosts);

// GET /feed/post/:postId
router.get('/post/:postId', feedController.getPost);

// POST /feed/post
router.post('/post', isAuth, [
    body('title')
        .isLength({min: 3})
        .trim(),
    body('content')
        .isLength({min: 3})
        .trim()
], feedController.createPost);

// PUT /feed/post/:postId
router.put('/post/:postId', isAuth, [
    body('title')
        .isLength({min: 3})
        .trim(),
    body('content')
        .isLength({min: 3})
        .trim()
], feedController.updatePost);

// DELETE /feed/post/:postId
router.delete('/post/:postId', isAuth, feedController.deletePost);

module.exports = router;