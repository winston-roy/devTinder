const mongoose = require('mongoose');

const connectDB = async () => {
    await mongoose.connect('mongodb+srv://winstonroy:winstonroy@cluster0.7ies1.mongodb.net/devTinder?retryWrites=true&w=majority&appName=Cluster0')
}

module.exports = {
    connectDB
}

