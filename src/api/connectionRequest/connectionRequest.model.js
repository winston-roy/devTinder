const mongoose = require('mongoose');

const connectionRequestSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:'User'
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    status: {
        type: String,
        enums: {
            values: ["Accepted", "Rejected", "Ignore", "Interested"],
            message: `{VALUE} is Incorrect Status Type`
        }
    }
}, { timestamps: true });

connectionRequestSchema.pre("save", function (next) {
    if (this.fromUserId.equals(this.toUserId)) {
        throw new Error("Cannot Send Request to Self!!!!")
    }
    next(); //vvv imp to call
})

const ConnectionRequest = mongoose.model("ConnectionRequest", connectionRequestSchema);

module.exports = { ConnectionRequest }