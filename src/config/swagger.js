const fs = require('fs').promises;
const path = require('path');
const { handleError } = require('../helpers/response');

const filePath = path.join(__dirname, '../tools/postman-to-openapi/openapi.json');

let swaggerSpec = {
    definition: {},
    apis: ['api/*/*.route.js']
};

const swaggerUiOptions = {
    swaggerOptions: {}
};

// Load openapi.json and initialize swaggerSpec
async function initSwaggerSpec() {
    try {
        const data = await fs.readFile(filePath, 'utf8');
        const openapi = JSON.parse(data);
        swaggerSpec.definition = openapi;
    } catch (err) {
        console.error('Error reading OpenAPI file:', err);
    }
}

// Call init once during startup
initSwaggerSpec();

function updateSwaggerSpecAndUiOptions(req, res) {
    try {
        // Clean specific paths/tags
        if (swaggerSpec.definition.paths?.['/v2/autologin']) {
            delete swaggerSpec.definition.paths['/v2/autologin'];
        }

        if (Array.isArray(swaggerSpec.definition.tags)) {
            swaggerSpec.definition.tags.splice(0, 1);
        }

        // Set matching server
        const originUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
        if (Array.isArray(swaggerSpec.definition.servers)) {
            swaggerSpec.definition.servers = [
                swaggerSpec.definition.servers.find(server => originUrl.includes(server.url)) || swaggerSpec.definition.servers[0]
            ];
        }
    } catch (err) {
        handleError(res, err);
    }
}

module.exports = {
    swaggerSpec,
    swaggerUiOptions,
    updateSwaggerSpecAndUiOptions
};