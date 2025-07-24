const express = require('express');

const { handler } = require('./chat.controller');

const { authenticateUser } = require('../../middlewares/auth');

const router = express.Router();

router.get("/messages/:targetUserId", authenticateUser, handler.getChat);


module.exports = {
    chatRoutes: router
}
