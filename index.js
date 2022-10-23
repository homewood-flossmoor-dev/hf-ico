"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Wallet_1 = require("./lib/Wallet");
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
    const wallet = new Wallet_1.Wallet();
    insert = { id: socket.id, name: 'player', info: wallet };
    connected.push(insert);
    io.emit("info", insert);
    socket.on('disconnect', () => {
        let b = _.findIndex(connected, function (el) { return el.id == socket.id; });
        connected.splice(b, 1);
    });
});
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/client/index.html');
});
server.listen(3000, () => {
    console.log('listening on *:3000');
});
