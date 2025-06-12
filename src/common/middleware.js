const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');

function loadMiddlerware(app) {
    app.use(cors({
        origin: 'http://localhost:5174',
        credentials: true
    }));
    app.use(express.json());
    app.use(cookieParser());
}

module.exports = {
    loadMiddlerware
};