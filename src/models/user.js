const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    email: {
        type: String
    },
    age: {
        type: Number
    },
    gender: {
        type: String
    },
    password: {
        type: String
    },
})

const UserModel = mongoose.model("User", userSchema);

module.exports = { UserModel };