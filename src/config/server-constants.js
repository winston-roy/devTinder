const serverTypes = Object.freeze({
    LOCAL: 'LOCAL',
    PRODUCTION: 'PRODUCTION'
});

const basePaths = Object.freeze({
    LOCAL: '/api/v2',
    PRODUCTION: '/api/v2'
});

// Set the current server
const SERVER = serverTypes.PRODUCTION;

module.exports = {
    SERVER,
    ROUTE_BASE_PATH: basePaths[SERVER]
};
