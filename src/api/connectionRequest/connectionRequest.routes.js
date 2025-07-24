const express = require('express');

const { handler } = require('./connectionRequest.controller');

const { authenticateUser } = require('../../middlewares/auth');

const router = express.Router();

router.post("/send/:status/:toUserId", authenticateUser, handler.sendConnection);
router.post("/review/:status/:requestId", authenticateUser, handler.reviewConnection)


module.exports = {
    connectionRoutes: router
}
