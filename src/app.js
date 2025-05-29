const express = require('express');
const app = express();

const { connectDB } = require('./config/database');
const { UserModel } = require("./models/user")


app.post("/user/signup", async (req, res) => {
    try {
        let userData = {
            firstName: "Winston",
            lastName: "Pashan",
            email: "winston.pashan@gmail.com",
            age: 26,
            gender: "male"
        }
        const user = new UserModel(userData);
        await user.save();
        res.send("User created successfully!!")
    } catch (err) {
        res.status(500).send("Error while signup!!!")
    }


})


connectDB()
    .then(() => {
        console.log('database connection successfull')
        app.listen(4200, (err) => {
            if (err) {
                console.error('Failed to start server:', err);
            } else {
                console.log('Server is listening on port 4200');
            }
        });
    })
    .catch((err) => {
        console.log('Error in DB Connection', err)
    })


