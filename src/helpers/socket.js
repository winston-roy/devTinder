const socket = require('socket.io');
const crypto = require('crypto');
const { handleError } = require('./response');
const { Chat } = require('../api/chat/chat.model');
const { User } = require('../api/auth/auth.model');
const { ConnectionRequest } = require('../api/connectionRequest/connectionRequest.model');
const { socketAuth } = require('../middlewares/socketAuth');

const getSecretRoomId = (userId, targetUserId) => {
    return crypto.createHash("sha256").update([userId, targetUserId].sort().join("_")).digest("hex")
}

const initializeSocket = (server) => {
    const io = socket(server, {
        cors: {
            origin: 'http://localhost:5173',
        }
    })

    // ✅ Auth Middleware for Socket.io
    io.use(socketAuth);


    io.on("connection", (socket) => {

        // On connect → set lastSeen = current time
        const userId = socket.user._id;
        
        if (userId) {
            User.findByIdAndUpdate(userId, { lastSeen: new Date() })
                .then(() => console.log("lastSeen updated"))
                .catch(err => console.error("Update failed:", err.message));
        }


        //handle events
        socket.on("joinChat", ({ firstName, userId, targetUserId }) => {
            const roomId = getSecretRoomId(userId, targetUserId);
            socket.join(roomId);
        })

        socket.on("sendMessage", async ({ firstName, userId, targetUserId, text }) => {
            try {
                const roomId = getSecretRoomId(userId, targetUserId);

                // ✅ Check if both users are connected (Accepted status)
                const isConnected = await ConnectionRequest.findOne({
                    $or: [
                        { fromUserId: userId, toUserId: targetUserId, status: "Accepted" },
                        { fromUserId: targetUserId, toUserId: userId, status: "Accepted" }
                    ]
                });

                if (!isConnected) {
                    throw new Error(`Unauthorized chat attempt between ${userId} and ${targetUserId}`)
                }

                let chat = await Chat.findOne({
                    participants: { '$all': [userId, targetUserId] }
                });
                if (!chat) {
                    chat = new Chat({
                        participants: [userId, targetUserId],
                        messages: []
                    });
                }

                chat.messages.push({
                    senderId: userId,
                    text
                });

                await chat.save();

                // 👉 Get sender details from DB
                const sender = await User.findById(userId).select("firstName profilePic");

                io.to(roomId).emit("messageReceived", {
                    senderId: userId,
                    firstName: sender.firstName,
                    profilePic: sender.profilePic,
                    text,
                    createdAt: new Date()
                });

            } catch (error) {
                console.log('Error saving message to DB', error);
            }
        });
        socket.on("disconnect", async () => {
            if (userId) {
                User.findByIdAndUpdate(userId, { lastSeen: new Date() })
                    .then(() => console.log("lastSeen updated"))
                    .catch(err => console.error("Update failed:", err.message));
            }
        });

    })
};

module.exports = { initializeSocket };