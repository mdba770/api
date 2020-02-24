const express = require('express');
const {body} = require('express-validator');
const feedController = require('../controllers/feed');

const router = express.Router();

// GET /feed/posts
router.get('/posts', feedController.getPosts);

// POST /feed/post
router.post('/post', [
    body('title')
        .isLength({min: 3})
        .trim(),
    body('content')
        .isLength({min: 3})
        .trim()
], feedController.createPost);

module.exports = router;