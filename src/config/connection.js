const { SERVER } = require("./server-constants")

const serverConfigs = Object.freeze({
    'LOCAL': {
        'mongoUri': 'mongodb+srv://winstonroy:winstonroy@cluster0.7ies1.mongodb.net/devTinder?retryWrites=true&w=majority&appName=Cluster0',
        'wsPort': 7777
    }
})

module.exports = {
    connection: serverConfigs[SERVER]
}