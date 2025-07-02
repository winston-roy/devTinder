const express = require('express');

const { handler } = require('./payment.controller');

const { authenticateUser } = require('../../middlewares/auth');

const router = express.Router();

router.post('/create', authenticateUser, handler.createOrder);
router.post('/webhook', handler.createWebhook);
router.get('/premium/verify', authenticateUser, handler.premiumVerify)

module.exports = {
    paymentRoutes: router
}