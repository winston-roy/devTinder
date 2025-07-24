const validator = require('validator');

const validateSignUp = (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName) {
        throw new Error("Enter valid name!!!")
    } else if (!validator.isEmail(email)) {
        throw new Error("Enter valid Email!!!")
    } else if (!validator.isStrongPassword(password)) {
        throw new Error("Enter Strong Password!!!")
    }
}

module.exports = {
    validateSignUp
}