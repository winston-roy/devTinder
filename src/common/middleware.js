const express = require('express');
const cookieParser = require('cookie-parser');

function loadMiddlerware(app) {
    app.use(express.json());
    app.use(cookieParser());
}

module.exports = {
    loadMiddlerware
};