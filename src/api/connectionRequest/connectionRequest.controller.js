const { ConnectionRequest } = require('./connectionRequest.model');
const { User } = require('../auth/auth.model');
const { respondWithResult, handleError } = require('../../helpers/response');
const sendEmail = require('../../helpers/sendEmail')

const USER_SAFE_DATA = "firstName lastName";

async function sendConnection(req, res) {
    try {
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        const ALLOWED_STATUS = ['Interested', 'Ignore'];
        if (!ALLOWED_STATUS.includes(status)) {
            throw new Error("Invalid Status Type!");
        }

        const toUser = await User.findById({ _id: toUserId });
        if (!toUser) throw new Error("User Not Found!");

        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or: [
                { fromUserId, toUserId },
                { fromUserId: toUserId, toUserId: fromUserId }
            ]
        });
        if (existingConnectionRequest) throw new Error("Connection Already Exists!");

        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        });

        const savedConnection = await connectionRequest.save();

        // Send email
        await sendEmail.run(
            "pashanwinsty1998@gmail.com",
            "sender@devmatrimony.in",
            req.user.firstName,
            toUser.firstName
        );

        let response = `${req.user.firstName} has ${status}${status === 'Ignore' ? 'd' : ''} ${toUser.firstName}`;
        respondWithResult(res, {
            message: response,
            data: savedConnection
        });

    } catch (error) {
        console.log('error---', error);
        handleError(res, error);
    }
};

async function reviewConnection(req, res) {
    try {
        const loggedInUser = req.user;
        const { status, requestId } = req.params;

        const ALLOWED_STATUS = ["Accepted", "Rejected"];

        if (!ALLOWED_STATUS.includes(status)) {
            throw new Error("InValid Status Type!!!!")
        }

        const connectionRequest = await ConnectionRequest.findOne({
            _id: requestId,
            toUserId: loggedInUser._id,
            status: "Interested"
        })
            .populate("fromUserId", USER_SAFE_DATA)
            .populate("toUserId", USER_SAFE_DATA)


        if (!connectionRequest) {
            throw new Error("Connection Request Not Found!!!")
        }

        let name = '';
        if (connectionRequest.fromUserId._id.toString() === loggedInUser._id.toString())
            name = connectionRequest.toUserId.firstName;

        if (connectionRequest.toUserId._id.toString() === loggedInUser._id.toString())
            name = connectionRequest.fromUserId.firstName;

        connectionRequest.status = status;

        const data = await connectionRequest.save();

        respondWithResult(res, {
            'message': `${loggedInUser.firstName} has ${status} the Connection Request From ${name}`,
            'data': data
        });

    } catch (error) {
        handleError(res, error)
    }
}

module.exports = {
    handler: {
        sendConnection,
        reviewConnection
    }
}