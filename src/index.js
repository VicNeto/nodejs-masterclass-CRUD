// Dependecies
const http = require('http');
const https = require('https');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;
const config = require('./config');
const fs = require('fs');

const httpServer = http.createServer((req, res) => {
    unifiedServer(req, res);
});

httpServer.listen(config.httpPort, () => {
    console.log(`Server listening on port ${config.httpPort}, env ${config.envName} 🚀`);
});

const httpsServerOptions = {
    key: fs.readFileSync('./https/key.pem'),
    cert: fs.readFileSync('./https/cert.pem'),
};
const httpsServer = https.createServer(httpsServerOptions, (req, res) => {
    unifiedServer(req, res);
});
httpsServer.listen(config.httpsPort, () => {
    console.log(`Server listening on port ${config.httpsPort}, env ${config.envName} 🚀`);
});

const unifiedServer = (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname;
    const trimmedPath = path.replace(/^\/+|\/+$/g, '');

    const queryStringObject = parsedUrl.query;

    const method = req.method.toLocaleLowerCase();

    const headers = req.headers;

    const decoder = new StringDecoder('utf-8');
    let buffer = '';
    req.on('data', (data) => {
        buffer += decoder.write(data);
    });
    req.on('end', () => {
        buffer += decoder.end();

        let chosenHandler = router.hasOwnProperty(trimmedPath) ? router[trimmedPath] : handlers.notFound;

        const data = {
            trimmedPath: trimmedPath,
            queryStringObject: queryStringObject,
            method: method,
            headers: headers,
            payload: buffer
        }

        chosenHandler(data, (statusCode, payload) => {
            statusCode = typeof(statusCode) === 'number' ? statusCode : 200;
            payload = typeof(payload) === 'object' ? payload : {};

            const payloadString = JSON.stringify(payload);

            res.setHeader('Content-Type', 'application/json');
            res.writeHead(statusCode);
            res.end(payloadString);

            console.log("Returning response ", statusCode, payloadString);
        });
    });
};

let handlers = {};

// Ping handler
handlers.ping = (data, callback) => {
    // callback an http status code, and a payload object
    callback(200);
};

handlers.notFound = (data, callback) => {
    callback(404);
};


const router = {
    sample: handlers.sample,
    ping: handlers.ping,
};