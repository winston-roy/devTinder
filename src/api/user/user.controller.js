const bcrypt = require('bcrypt');
const { User } = require("./user.model")
const { validateSignUp } = require("../../utils/validation")

async function signup(req, res) {
    try {
        //Validate
        validateSignUp(req);

        //Encrypt Password
        const { firstName, lastName, email, password } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
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
}

async function login(req, res) {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            throw new Error("User not exists!!!")
        }

        const isPasswordValid = await user.validatePassword(password);

        if (isPasswordValid) {
            const token = await user.getJwtToken();
            res.cookie("token", token, { expires: new Date(Date.now() + 1 * 3600000) })
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
}

async function profile(req, res) {
    try {
        const loggedInUser = req.user;

        res.status(200).send({
            'message': 'User Profile!!!',
            data: loggedInUser
        })

    } catch (error) {
        res.status(400).send(error.message)
    }
}

async function profileUpdate(req, res) {
    try {
        const _id = req.params?.userId;
        const data = req.body;

        const ALLOWED_UPDATES = ["age", "firstName", "lastName", "skills", "phoneNumber"];

        const invalidKeys = Object.keys(data).filter(k => !ALLOWED_UPDATES.includes(k));

        if (invalidKeys.length > 0) {
            throw new Error(`Update not allowed for key(s): ${invalidKeys.join(', ')}`);
        }

        if (data?.skills.length > 10) {
            throw new Error("Skills should not be more than 10")
        }

        const isUserExists = await User.findById({ _id });

        if (!isUserExists) {
            throw new Error("User not found")
        }

        const user = await User.findByIdAndUpdate(_id, data, {
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
}

module.exports = {
    handler: {
        signup,
        login,
        profile,
        profileUpdate
    }
}