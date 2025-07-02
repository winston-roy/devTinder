const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    "userId": {
        type: mongoose.Types.ObjectId,
        ref: 'user',
        required: true
    },
    "paymentId": {
        type: String
    },
    "orderId": {
        type: String,
        required: true
    },
    "amount": {
        type: Number,
        required: true
    },
    "amount_paid": {
        type: Number,
        required: true
    },
    "currency": {
        type: String,
        required: true
    },
    "notes": {
        "firstName": {
            type: String
        },
        "lastname": {
            type: String
        },
        "membershipType": {
            type: String
        }
    },
    "receipt": {
        type: String,
        required: true
    },
    "status": {
        type: String,
        required: true
    }
}, { timestamps: true });

const Payment = mongoose.model("Payment", paymentSchema);
module.exports = { Payment }