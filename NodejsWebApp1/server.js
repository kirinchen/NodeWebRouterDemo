'use strict';
var AccessLogger = require('./AccessLogger');
var http = require('http');
var port = process.env.PORT || 1337;
var accesses = new AccessLogger(10, 3000);

http.createServer(function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/plain' });

    if (!accesses.check(req.connection.remoteAddress)) {
        // cancel the request here
        res.end("No data for you!");
    } else {
        res.end('Hello World\n' + res.connection.localPort + "/" + req.connection.remoteAddress);
    }

}).listen(port);
