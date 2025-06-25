const { SERVER } = require("./server-constants")

const serverConfigs = Object.freeze({
    'LOCAL': {
        'mongoUri': process.env.DB_CONNECTION_SECRET,
        'wsPort': process.env.PORT
    }
})

module.exports = {
    connection: serverConfigs[SERVER]
}