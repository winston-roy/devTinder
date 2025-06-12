const express = require('express');

const { handler } = require('./auth.controller');

const { authenticateUser } = require('../../middlewares/auth');

const router = express.Router();


router.post("/signup", handler.signup)
router.post("/login", handler.login)
router.get("/profile", authenticateUser, handler.profile)
router.post("/changePassword", authenticateUser, handler.changePassword)
router.patch("/profile/:userId", authenticateUser, handler.profileUpdate)
router.post("/logout", handler.logout)


module.exports = {
    authRoutes: router
};