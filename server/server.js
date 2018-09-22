const express = require('express');

const PORT = process.env.PORT || 2000;

const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.use(express.static('./client/'));

io.on('connection', socket => {
   console.log(socket);
});

io.on('getUsers', socket => {
  console.log('get users');
})

http.listen(PORT, () => {
   console.log("Listening on", PORT);
});