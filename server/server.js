const express = require('express');

const PORT = process.env.PORT || 2000;

let app = express();
let http = require('http').Server(app);
let io = require('socket.io')(http);

app.use(express.static('./client/'));

let users = [];

io.on('connection', socket => {
   console.log(socket);
   
   socket.on('getUsers', socket => {
     socket.emit('userList', users);
   });
});

io.on('getUsers', socket => {
  console.log('get users');
});

http.listen(PORT, () => {
   console.log("Listening on", PORT);
});