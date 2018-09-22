const express = require('express');

const PORT = process.env.PORT || 2000;

let app = express();
let http = require('http').Server(app);
let io = require('socket.io')(http);

app.use(express.static('./client/'));

class User {
  constructor(name, socket) {
    this.name = name;
    this.socket = socket;
  }
}

class Session {

}

let users = []

io.on('connection', socket => {
   users.push(new User(socket.handshake.query.name, socket));
   
   socket.on('getUsers', () => {
     socket.emit('userList', getUsersList());
   });
});

function findUser(name) {
  return users.find(user => user.name === name);
}

/**
 * Returns the users list without the sockets.
 * This helps avoid stack errors
 */
function getUsersList() {
  let result = [];
  for (let user of users) {
    result.push({
      name: user.name
    });
  }
  return result;
}

http.listen(PORT, () => {
   console.log("Listening on", PORT);
});