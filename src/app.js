const express = require('express');
const app = express();

const { connectDB } = require('./config/database');
const { UserModel } = require("./models/user")
const { validateSignUp } = require("./utils/validation")

const bcrypt = require('bcrypt');


app.use(express.json())


app.post("/user/signup", async (req, res) => {
    try {
        let userData = req.body;

        //Validate
        validateSignUp(req);

        //Encrypt Password
        const { firstName, lastName, email, password } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new UserModel({
            firstName,
            lastName,
            email,
            password: hashedPassword
        });

        await user.save();
        res.status(200).send({
            "message": 'User created successfully!!',
            "data": user
        })
    } catch (error) {
        res.status(400).json({
            message: error.message,
        });
    }
})

app.post("/user/login", async (req, res) => {

    try {
        const { email, password } = req.body;

        const user = await UserModel.findOne({ email });

        if (!user) {
            throw new Error("User not exists!!!")
        }

        const isPasswordValid = await bcrypt.compare(password, user?.password);

        if (isPasswordValid) {
            res.status(200).send({
                message: "Login Successfull!!!s",
                data: user
            })
        } else {
            res.status(500).send({
                message: "Invalid Credentials"
            })
        }

    } catch (error) {
        res.status(400).json({
            message: error.message,
        });
    }

})

app.patch("/user/edit/:userId", async (req, res) => {
    try {
        const _id = req.params?.userId;
        const data = req.body;

        const ALLOWED_UPDATES = ["age", "firstName", "lastName", "skills","phoneNumber"];

        const invalidKeys = Object.keys(data).filter(k => !ALLOWED_UPDATES.includes(k));

        if (invalidKeys.length > 0) {
            throw new Error(`Update not allowed for key(s): ${invalidKeys.join(', ')}`);
        }

        if (data?.skills.length > 10) {
            throw new Error("Skills should not be more than 10")
        }

        const isUserExists = await UserModel.findById({ _id });

        if (!isUserExists) {
            throw new Error("User not found")
        }

        const user = await UserModel.findByIdAndUpdate(_id, data, {
            returnDocument: "after",
            runValidators: true
        })

        res.status(200).send({
            message: "User Updated successfully",
            data: user
        })

    } catch (error) {
        res.status(400).json({
            message: error.message,
        });
    }
})


connectDB()
    .then(() => {
        console.log('database connection successfull')
        app.listen(7777, (err) => {
            if (err) {
                console.error('Failed to start server:', err);
            } else {
                console.log('Server is listening on port 7777');
            }
        });
    })
    .catch((err) => {
        console.log('Error in DB Connection', err)
    })


