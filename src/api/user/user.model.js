const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 4
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Enter Correct Email ID " + value)
            }
        }
    },
    age: {
        type: Number,
        required: true,
        min: [18, 'Must be at least 18'],
        max: [99, 'Maximum allowed age is 99']
    },
    gender: {
        type: String,
        required: true,
        enum: {
            values: ['male', 'female', 'other'],
            message: `Gender must be 'male', 'female', or 'other'`
        }
    },
    phoneNumber: {
        type: String,
        validate(value) {
            if (!validator.isMobilePhone(value)) {
                throw new Error("Enter Valid Phone Number " + value)
            }
        }
    },
    password: {
        type: String,
        required: true,
        validate(value) {
            if (!validator.isStrongPassword(value)) {
                throw new Error("Password must be strong (8+ chars, 1 upper, 1 lower, 1 number, 1 symbol)")
            }
        }
    },
    profilePic: {
        type: String,
        default: 'https://ca.slack-edge.com/T01H2UQCP3J-U01GF8VNEAH-b460649f4b2d-48',
        validate(value) {
            if (!validator.isURL(value)) {
                throw new Error("Enter Valid Profile URL " + value)
            }
        }
    },
    skills: {
        type: [String]
    }
}, { timestamps: true });

userSchema.methods.getJwtToken = async function () {
    const token = await jwt.sign({ _id: this._id }, "!@#$1234DevTinder", { expiresIn: "1d" });
    return token;
}

userSchema.methods.validatePassword = async function (passwordInputByUser) {
    return await bcrypt.compare(passwordInputByUser, this.password);
}

// ✅ Prevent OverwriteModelError
const User = mongoose.models.User || mongoose.model("User", userSchema);

module.exports = { User };
