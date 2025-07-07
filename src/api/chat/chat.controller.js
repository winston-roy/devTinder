const { Chat } = require('./chat.model');
const { User } = require('../auth/auth.model');
const { respondWithResult, handleError } = require('../../helpers/response');

async function getChat(req, res) {
    try {
        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit = limit > 50 ? 50 : limit;

        const skip = (page - 1) * limit;

        const { targetUserId } = req.params;
        const userId = req.user?._id;

        let chat = await Chat.findOne({
            participants: { $all: [userId, targetUserId] }
        });

        if (!chat) {
            chat = new Chat({
                participants: [userId, targetUserId],
                messages: []
            });
            await chat.save();
        }

        // Paginate messages (most recent first)
        const totalMessages = chat.messages.length;
        const paginatedMessages = chat.messages
            .slice()
            .reverse()
            .slice(skip, skip + limit)
            .reverse(); // Optional: keep the original order (oldest to newest)

        // Populate sender info for paginated messages
        const populatedMessages = await Chat.populate(
            { messages: paginatedMessages },
            { path: "messages.senderId", select: "firstName profilePic" }
        );

        respondWithResult(res, {
            message: 'Chat messages',
            data: {
                _id: chat._id,
                participants: chat.participants,
                messages: populatedMessages.messages,
                totalMessages
            }
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