"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const _ = require('lodash');
const connected = [];
app.use(express.static(__dirname));
app.get('/play', (req, res) => {
    res.sendFile(__dirname + '/client/play.html');
});
//waiting for connections on the play route
let insert = {};
io.on('connection', (socket) => {
    insert = { id: socket.id, name: 'player', coin: 200 };
    connected.push(insert);
    io.emit("info", insert);
    socket.on('disconnect', () => {
        let b = _.findIndex(connected, function (el) { return el.id == socket.id; });
        connected.splice(b, 1);
    });
    console.log(connected);
});
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/client/index.html');
});
server.listen(3000, () => {
    console.log('listening on *:3000');
});
