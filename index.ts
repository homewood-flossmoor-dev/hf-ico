import { Socket } from 'socket.io';
import { Wallet } from './lib/Wallet';
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const _ = require('lodash');

interface User {
  id: string;
  name: string;
  info: Wallet;
}
const connected : User[] = []; 

app.use(express.static(__dirname));


app.get('/play', (req: any, res:any) => {
  res.sendFile(__dirname + '/client/play.html');
});
  //waiting for connections on the play route
  let insert: User = {} as User;

  io.on('connection', (socket: Socket) => {
    const wallet = new Wallet();

    insert = {id: socket.id, name: 'player', info: wallet};

    connected.push(insert);

    io.emit("info", insert);
    socket.on('pay', (payeeAdd: string) => {
      wallet.sendMoney(25, "payeeAdd");
      io.emit("info", insert);
    });

    socket.on('disconnect', ()=>{
      let b = _.findIndex(connected, function(el:User) { return el.id == socket.id; });
      connected.splice(b, 1);
    })
  });
  
  
app.get('/', (req: any, res:any) => {
  res.sendFile(__dirname + '/client/index.html');
});

server.listen(3000, () => {
    console.log('listening on *:3000');
});
  
