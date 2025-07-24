const express = require('express');

const { handler } = require('./user.controller')
const { authenticateUser } = require('../../middlewares/auth')

const router = express.Router();

router.get('/requests/received', authenticateUser, handler.requests);
router.get('/requests/connections', authenticateUser, handler.connections);
router.get('/requests/feed', authenticateUser, handler.feed)


module.exports = {
    userRoutes: router
}