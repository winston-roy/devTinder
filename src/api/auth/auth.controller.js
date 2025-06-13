const bcrypt = require('bcrypt');
const { User } = require("./auth.model")
const { validateSignUp } = require("../../helpers/validation")
const { respondWithResult, handleError } = require('../../helpers/response')

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

        respondWithResult(res, {
            'message': 'Sign Up Successfull',
            'data': user
        });

    } catch (error) {
        handleError(res, error)
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

            respondWithResult(res, {
                'message': 'Login Successfull',
                'data': user
            });
        } else {
            handleError(res, {
                'name': 'Login Error',
                'message': 'Invalid Credentials!!!'
            })
        }

    } catch (error) {
        handleError(res, error)
    }
}

async function changePassword(req, res) {
    try {
        const loggedInUser = req.user;

        const newPassword = req.body.newPassword;
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        const updateUser = await User.findByIdAndUpdate(
            { _id: loggedInUser._id },
            {
                '$set': {
                    password: hashedPassword
                }
            },
            {
                returnDocument: "after",
                runValidators: true
            })

        if (updateUser) {
            respondWithResult(res, {
                'message': 'Password Updated Successfully',
                'data': updateUser
            });
        }

    } catch (error) {
        handleError(res, error)
    }

}

async function profile(req, res) {
    try {
        const loggedInUser = req.user;

        respondWithResult(res, {
            'message': 'User Profile',
            'data': loggedInUser
        });

    } catch (error) {
        handleError(res, error)
    }
}

async function profileUpdate(req, res) {
    try {
        const _id = req.params?.userId;
        const data = req.body;

        const ALLOWED_UPDATES = ["age", "firstName", "lastName", "skills","gender", "phoneNumber", "about","profilePic"];

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

        respondWithResult(res, {
            'message': 'Profile Updated Successfully',
            'data': user
        });

    } catch (error) {
        handleError(res, error)
    }
}

async function logout(req, res) {
    try {
        res.cookie("token", null, { expires: new Date(Date.now()) })
        respondWithResult(res, {
            'message': 'User Logged out successfully',
        });

    } catch (error) {
        handleError(res, error)
    }

}

module.exports = {
    handler: {
        signup,
        login,
        changePassword,
        profile,
        profileUpdate,
        logout
    }
}