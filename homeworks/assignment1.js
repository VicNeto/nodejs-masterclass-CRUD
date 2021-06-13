const http = require('http');
const url = require('url');

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname;
    const trimmedPath = path.replace(/^\/+|\/+$/g, '');

    let chosenHandler = router.hasOwnProperty(trimmedPath) ? router[trimmedPath] : handlers.notFound;

    const data = {
        trimmedPath: trimmedPath,
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

server.listen(3000, () => {
    console.log(`Server up and running on port 3000 🚀`)
});

let handlers = {};

// Ping handler
handlers.hello = (data, callback) => {
    // callback an http status code, and a payload object
    callback(200, {"greet": "Hello Pirple"});
};

handlers.notFound = (data, callback) => {
    callback(404);
};


const router = {
    hello: handlers.hello,
    ping: handlers.ping,
};