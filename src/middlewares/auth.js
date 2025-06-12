const jwt = require('jsonwebtoken');
const { User } = require("../api/auth/auth.model")

const authenticateUser = async (req, res, next) => {
    try {
        const { token } = req.cookies;

        if (!token) {
            return res.status(401).send('Please Login');
        }

        const decodedMessage = await jwt.verify(token, "!@#$1234DevTinder");

        const { _id } = decodedMessage;

        const user = await User.findById({ _id });
        
        if (!user) {
            throw new Error("No user found!!!")
        }

        req.user = user;

        next();
    } catch (error) {
        res.status(400).send(error.message)
    }
}

module.exports = {
    authenticateUser
}