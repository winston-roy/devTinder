const jwt = require('jsonwebtoken');
const { User } = require('../api/auth/auth.model');

const socketAuth = async (socket, next) => {
    try {
        const token = socket.handshake.auth.token;

        if (!token) {
            return next(new Error("Unauthorized: No token provided"));
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const { _id } = decoded;
        const user = await User.findById({ _id });

        if (!user) {
            throw new Error("No user found!!!")
        }
        socket.user = user; // attach user data to the socket instance
        next();
        
    } catch (err) {
        console.error("Socket auth failed:", err);
        next(new Error("Unauthorized"));
    }
};

module.exports = {
    socketAuth
};
