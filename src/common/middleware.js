const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');

function loadMiddlerware(app) {
    app.use(cors);
    app.use(express.json());
    app.use(cookieParser());
}

module.exports = {
    loadMiddlerware
};