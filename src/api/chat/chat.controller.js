const { Chat } = require('./chat.model');
const { User } = require('../auth/auth.model');
const { respondWithResult, handleError } = require('../../helpers/response');

async function getChat(req, res) {
    try {
        const { targetUserId } = req.params;
        const userId = req.user?._id;

        let chat = await Chat.findOne({
            participants: { $all: [userId, targetUserId] }
        }).populate({
            path: "messages.senderId",
            select: "firstName profilePic"
        })

        if (!chat) {
            chat = new Chat({
                participants: [userId, targetUserId],
                messages: []
            });
            await chat.save(); // only save if newly created
        }

        respondWithResult(res, {
            message: 'Chat messages',
            data: chat
        });

    } catch (error) {
        handleError(res, error);
    }
}


module.exports = {
    handler: {
        getChat
    }
}