const express = require('express');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const { authRoutes } = require('../api/auth/auth.routes');
const { connectionRoutes } = require('../api/connectionRequest/connectionRequest.routes');
const { userRoutes } = require('../api/user/user.routes');
const { paymentRoutes } = require('../api/payment/payment.routes');
const { chatRoutes } = require('../api/chat/chat.routes');
const { authenticateUser } = require('../middlewares/auth');
const { swaggerSpec, swaggerUiOptions, updateSwaggerSpecAndUiOptions } = require('../config/swagger.js');
const { ROUTE_BASE_PATH } = require('../config/server-constants.js');

const baseRouter = express.Router();

// Use .use() to mount middleware/routes at a specific path
baseRouter.use("/auth", authRoutes);
baseRouter.use("/request", connectionRoutes);
baseRouter.use("/user", userRoutes);
baseRouter.use("/payment", paymentRoutes);
baseRouter.use("/chat", chatRoutes);

function loadRoutes(app) {
    app.use(`${ROUTE_BASE_PATH}`, baseRouter);
    app.use('https://devmatrimony.in/api/api-test-page', //`${ROUTE_BASE_PATH}/api-test-page`,
        authenticateUser,
        swaggerUi.serve,
        (req, res, next) => {
            updateSwaggerSpecAndUiOptions(req, res);
            swaggerUi.setup(swaggerJsdoc(swaggerSpec), swaggerUiOptions)(req, res, next);
        }
    );
}

module.exports = {
    loadRoutes,
};
