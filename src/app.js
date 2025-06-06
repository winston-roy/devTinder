const express = require('express');
const mongoose = require('mongoose');
const app = express();

// Load internal modules
const { loadMiddlerware } = require('./common/middleware');
const { loadRoutes } = require("./common/routes");

// MongoDB connection URI
const { connection } = require('./config/connection'); 

// Utility functions
async function shutdown() {
    const readyState = mongoose.connection.readyState;
    if (readyState === 1 || readyState === 2 || readyState === 3) {
        await mongoose.connection.close();
        console.log('MongoDB connection closed');
    }
    console.log('Exiting node process');
    process.exit(0);
}

function startServer() {
    app.listen(connection.wsPort, (err) => {
        if (err) {
            console.error('Failed to start server:', err);
        } else {
            console.log(`Server is listening on port ${connection.wsPort}`);
        }
    });
}

// Setup MongoDB events
mongoose.connection.on('error', (err) => {
    console.error(`MongoDB connection error: ${err}`);
    shutdown();
});

mongoose.connection.once('connected', () => {
    console.log('Connected to MongoDB');
    app.set('defaultConnection', mongoose.connection);
    app.set('trust proxy', 1);

    loadMiddlerware(app);
    loadRoutes(app);
    startServer();
});

// Start the app by connecting to MongoDB
mongoose.connect(connection.mongoUri)
    .catch((err) => {
        console.error('Error in DB Connection:', err);
        shutdown();
    });

// Handle termination signals
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
