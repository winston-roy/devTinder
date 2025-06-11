const { ConnectionRequest } = require('./connectionRequest.model');
const { User } = require('../auth/auth.model');
const { respondWithResult, handleError } = require('../../helpers/response')

const USER_SAFE_DATA = "firstName lastName";

async function sendConnection(req, res) {
    try {
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        const ALLOWED_STATUS = ['Interested', 'Ignore'];
        if (!ALLOWED_STATUS.includes(status)) {
            throw new Error("InValid Status Types!!!")
        }

        //CHhecking User Existence
        const toUser = await User.findById({ _id: toUserId });

        if (!toUser) {
            throw new Error("User Not Found!!!")
        }

        //Checking Existing Connection
        const existingConnectionRequest = await ConnectionRequest.findOne({
            '$or': [
                { fromUserId, toUserId },
                { fromUserId: toUserId, toUserId: fromUserId }
            ]
        })

        if (existingConnectionRequest) {
            throw new Error("Connection Already Exists!!!")
        }

        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        })

        const user = await connectionRequest.save();

        let response = `${req.user.firstName} has ${status} in ${toUser.firstName}`;
        if (status == 'Interested')
            response = `${req.user.firstName} has ${status} in ${toUser.firstName}`

        if (status == 'Ignore')
            response = `${req.user.firstName} has ${status}d  ${toUser.firstName}`


        respondWithResult(res, {
            'message': response,
            'data': user
        });

    } catch (error) {
        handleError(res, error)
    }
}

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