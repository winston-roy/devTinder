const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        require: true,
        minLength:4
    },
    lastName: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true,
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
        require: true,
        min: [18, 'Must be at least 18, got {VALUE}'],
        maxlength: 2
    },
    gender: {
        type: String,
        require: true,
        enum: {
            values: ['male', 'female', 'other'],
            message: `enum validator failed for the path {PATH} with value {VALUE}`
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
        require: true,
        validate(value) {
            if (!validator.isStrongPassword(value, { minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1, returnScore: false, pointsPerUnique: 1, pointsPerRepeat: 0.5, pointsForContainingLower: 10, pointsForContainingUpper: 10, pointsForContainingNumber: 10, pointsForContainingSymbol: 10 })) {
                throw new Error("Password need to have { minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1}")
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
}, { timestamps: true })

const UserModel = mongoose.model("User", userSchema);

module.exports = { UserModel };