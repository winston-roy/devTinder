const { User } = require('../auth/auth.model')
const { ConnectionRequest } = require('../connectionRequest/connectionRequest.model')
const { respondWithResult, handleError } = require('../../helpers/response')

const USER_SAFE_DATA = "firstName lastName";

async function requests(req, res) {
    try {
        const loggedInUser = req.user;

        const connectionRequest = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: "Interested"
        }).populate("fromUserId", "firstName lastName")
            .select("fromUserId toUserId status")

        respondWithResult(res, {
            'message': `All Connection Requests of ${loggedInUser.firstName}`,
            'data': connectionRequest
        });
    } catch (error) {
        handleError(res, error)
    }

}

async function connections(req, res) {
    try {
        const loggedInUser = req.user;

        const connections = await ConnectionRequest.find({
            '$or': [
                { fromUserId: loggedInUser._id, status: 'Accepted' },
                { toUserId: loggedInUser._id, status: 'Accepted' }
            ]
        })
            .populate("fromUserId", USER_SAFE_DATA)
            .populate("toUserId", USER_SAFE_DATA)

        const data = connections.map((row) => {
            if (row.fromUserId._id.toString() === loggedInUser._id.toString())
                return row.toUserId

            return row.fromUserId;
        })

        respondWithResult(res, {
            'message': `All Connection of ${loggedInUser.firstName}`,
            'data': data
        });

    } catch (error) {
        handleError(res, error)
    }

}

async function feed(req, res) {
    try {
        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 5;
        limit = limit > 50 ? 50 : limit;

        const skip = (page - 1) * limit;

        const loggedInUser = req.user;

        const connectionRequest = await ConnectionRequest.find({
            '$or': [
                { fromUserId: loggedInUser._id },
                { toUserId: loggedInUser._id }
            ]
        }).select("fromUserId toUserId status");

        const hideFromFeed = new Set();

        connectionRequest.forEach((conn) => {
            hideFromFeed.add(conn.fromUserId.toString());
            hideFromFeed.add(conn.toUserId.toString());
        })

        const users = await User.find({
            '$and': [
                { _id: { '$nin': Array.from(hideFromFeed) } },
                { _id: { '$ne': loggedInUser._id } }
            ]
        }).skip(skip).limit(limit)

        respondWithResult(res, {
            'message': `Feed of ${loggedInUser.firstName}`,
            'data': users
        });


    } catch (error) {
        handleError(res, error)
    }
}

module.exports = {
    handler: {
        requests,
        connections,
        feed
    }
}