const express = require('express');

const PORT = process.env.PORT || 2000;

let app = express();
let http = require('http').Server(app);
let io = require('socket.io')(http);

app.use(express.static('./client/'));

class User {
  constructor(name, socket) {
    this.socket = socket;
  }
}

class Session {

}

let users = []

io.on('connection', socket => {
   //console.log(socket.handshake.query.name);
   users.push(new User(socket.handshake.query.name, socket));
   
   socket.on('getUsers', socket => {
     socket.emit('userList', users);
   });
});

function findUser(name) {
  return users.find(user => user.name === name);
}

http.listen(PORT, () => {
   console.log("Listening on", PORT);
});