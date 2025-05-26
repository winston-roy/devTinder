const express = require('express');
const app = express();

const connectDB = require('./config/database')
const { adminAuth, userAuth } = require('./middlewares/auth')

app.use("/admin", adminAuth)

app.get("/admin/allData", (req, res) => {
    console.log('all data')
    res.end('all data')
})

app.get("/user/login", (req, res) => {
    res.end('Login succes')
})


app.get("/user/allData", userAuth, (req, res) => {
    console.log('all data')
    throw new Error("wer")
    res.end('all  user data')
})

app.use("/", (err, req, res, next) => {
    if (err) {
        res.status(500).end("Something went wrong!!!")
    }
})


app.listen(4200, (err) => {
    if (err) {
        console.error('Failed to start server:', err);
    } else {
        console.log('Server is listening on port 4200');
    }
});