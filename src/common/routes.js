const express = require('express');
const { userRoutes } = require('../api/user/user.routes'); // Ensure this also uses CommonJS exports

const baseRouter = express.Router();

// Use .use() to mount middleware/routes at a specific path
baseRouter.use("/user", userRoutes);

function loadRoutes(app) {
    app.use('/api/v2', baseRouter);
}

module.exports = {
    loadRoutes,
};
