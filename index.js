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
const rooms = [];
app.use(express.static(__dirname));
app.get('/play/:username', (req, res) => {
    res.sendFile(__dirname + '/client/play.html');
});
app.get('/admin', (req, res) => {
    res.sendFile(__dirname + '/client/admin.html');
});
//waiting for connections on the play route
let insert = {};
io.on('connection', (socket) => {
    const wallet = new Wallet_1.Wallet(socket.id);
    insert = { id: socket.id, name: 'player', info: wallet };
    connected.push(insert);
    //checking for the rooms
    if (rooms.length === 0) {
        socket.join('room' + rooms.length);
        rooms.push({ id: 'room' + rooms.length, full: false, users: [insert] });
    }
    else if (rooms[rooms.length - 1].full) {
        socket.join('room' + rooms.length);
        rooms.push({ id: 'room' + rooms.length, full: false, users: [insert] });
    }
    else {
        rooms[rooms.length - 1].full = true;
        socket.join('room' + (rooms.length - 1));
    }
    io.emit("info", insert);
    console.log(rooms);
    //waiting for pay event
    socket.on('pay', (payeeAdd) => {
        console.log(payeeAdd);
    });
    //waiting for socket disconnect event
    socket.on('disconnect', () => {
        let b = _.findIndex(connected, function (el) { return el.id == socket.id; });
        connected.splice(b, 1);
    });
    socket.on("disconnecting", () => {
        let socketId = Array.from(socket.rooms)[1];
        //leaving the room
        if (socketId) {
            //finding the room
            let a = _.findIndex(rooms, function (el) { return el.id == socketId; });
            rooms[a].full = false;
            //finding the user
            let b = _.findIndex(rooms[a].users, function (el) { return el.id == socket.id; });
            rooms[a].users.splice(b, 1);
            socket.leave(socketId);
            console.log(rooms);
        }
    });
});
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/client/index.html');
});
server.listen(3000, () => {
    console.log('listening on *:3000');
});
