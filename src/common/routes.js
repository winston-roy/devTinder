const express = require('express');
const { authRoutes } = require('../api/auth/auth.routes');
const { connectionRoutes } = require('../api/connectionRequest/connectionRequest.routes');
const { userRoutes } = require('../api/user/user.routes')

const baseRouter = express.Router();

// Use .use() to mount middleware/routes at a specific path
baseRouter.use("/auth", authRoutes);
baseRouter.use("/request", connectionRoutes);
baseRouter.use("/user", userRoutes);

function loadRoutes(app) {
    app.use('/api/v2', baseRouter);
}

module.exports = {
    loadRoutes,
};
