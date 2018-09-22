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
    this.isInSession = false;
  }
}

class Session {
  constructor(user1, user2) {
    this.user1 = user1;
    this.user2 = user2;
    
    emitStart(this.user1); emitStart(this.user2);
  }
  
  emitStart(user) {
    user.socket.emit('start', {
      // todo: data
    })
  }
}

let users = [];
let sessions = [];

io.on('connection', socket => {
  let user = new User(socket.handshake.query.name, socket);
  users.push(user);
  
  socket.on('getUsers', () => {
    socket.emit('userList', getPossibleUsersList());
  });
  
  socket.on('initiateSession', (otherName) => {
    // in the future we need to make sure the user exists
    // otherwise malicious users can exploit this.
    let other = findUser(otherName);
    let session = new Session(user, other);
    sessions.push(session);
  });
});

/**
 * Finds the User object in the array
 * @param name The name of the user
 * @returns {User} Found user (undefined behaviour if name is not in the array)
 */
function findUser(name) {
  return users.find(user => user.name === name);
}

/**
 * Returns the users list without the sockets.
 * This helps avoid stack errors
 */
function getPossibleUsersList() {
  let result = [];
  
  for (let user of users) {
    if (!user.isInSession) {
      result.push({
        name: user.name
      });
    }
  }
  
  return result;
}

http.listen(PORT, () => {
  console.log("Listening on", PORT);
});