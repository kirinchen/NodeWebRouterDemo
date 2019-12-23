'use strict';
const express = require('express');
const app = express();
var AccessLogger = require('./AccessLogger');
var https = require('https');
var port = process.env.PORT || 1337;
var ipAccesses = new AccessLogger(10, 60 * 1000);
var idAccesses = new AccessLogger(5, 60 * 1000);
var url = 'https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty';

app.get('/', (req, res) => {
    var id = req.query.id;
    var ipAr = ipAccesses.check(req.connection.remoteAddress);
    var idAr = idAccesses.check(id);

    if (ipAr.ok && idAr.ok) {
        https.get(url, function (response) {
            var data = '';
            // response event 'data' 當 data 陸續接收的時候，用一個變數累加它。
            response.on('data', function (chunk) {
                data += chunk;
            });
            // response event 'end' 當接收 data 結束的時候。
            response.on('end', function () {
                // 將 JSON parse 成物件
                //data = JSON.parse(data);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(data);
            });
        }).on('error', function (e) { // http get 錯誤時
            console.log("error: ", e);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end("");
        });
    } else {
        res.writeHead(403, { 'Content-Type': 'application/json' });
        var msg = {
            ip: ipAr.count,
            id: idAr.count
        };
        res.end(JSON.stringify(msg));
    }

});
app.listen(port);

