const express = require('express');

const { handler } = require('./user.controller');

const { authenticateUser } = require('../../middlewares/auth');

const router = express.Router();


router.post("/signup", handler.signup)
router.post("/login", handler.login)
router.get("/profile", authenticateUser, handler.profile)
router.patch("/profile/:userId", authenticateUser, handler.profileUpdate)


module.exports = {
    userRoutes: router
};