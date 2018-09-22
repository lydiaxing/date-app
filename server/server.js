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
    
    this.user1.session = this;
    this.user2.session = this;
    
    // i know its not optimal
    this.user1positive = false;
    this.user2positive = false;
    
    this.emitStart();
  }
  
  
  emitStart() {
    this.user1.socket.emit('start', {
      name: this.user2.name // name of the other person
    });
    
    this.user2.socket.emit('start', {
      name: this.user1.name
    });
  }
  
  emitMatch() {
    const data = {};
    this.user1.socket.emit('match', data); // possibly add other data?
    this.user2.socket.emit('match', data);
    
    // TODO: end session
  }
}

var users = [];
var sessions = [];

io.on('connection', socket => {
  let user = new User(socket.handshake.query.name, socket);
  users.push(user);
  
  let myUsers = users; // i dont know why but we need to save this pointer
  
  socket.on('getUsers', () => {
    socket.emit('userList', getPossibleUsersList());
  });
  
  socket.on('initiateSession', (otherName) => {
    // in the future we need to make sure the user exists
    // otherwise malicious users can exploit this.
    let other = findUser(myUsers, otherName.name);
    user.isInSession = true;
    other.isInSession = true;
    
    sessions.push(new Session(user, other));
  });
  
  socket.on('imageData', data => {
    const isPositive = data === 'human'; // TODO: get from data
    
    if (user.name === user.session.user1.name) user.session.user1positive = isPositive;
    else user.session.user2positive = isPositive;
    
    if (user.session.user1positive && user.session.user2positive)
      user.session.emitMatch();
    
    console.log(`${user.session.user1.name} is ${user.session.user1positive} and ${user.session.user2.name} is ${user.session.user2positive}`);
  });
  
  socket.on('disconnect', reason => {
    // hopefully he wasnt in a session because
    // thats not handled currently
    
    // very inefficient but oh well
    users = users.filter(a => a !== user);
  });
});

/**
 * Finds the User object in the array
 * @param array Array to search in
 * @param name The name of the user
 * @returns {User} Found user (undefined behaviour if name is not in the array)
 */
function findUser(array, name) {
  return array.find(user => user.name === name);
}

/**
 * Returns the users list without the sockets.
 * This helps avoid stack errors
 */
function getPossibleUsersList() {
  let result = [];
  
  for (let user of users) {
    if (!user.isInSession) {
      result.push({ name: user.name });
    }
  }
  
  return result;
}

http.listen(PORT, () => {
  console.log("date-app server listening on", PORT);
});