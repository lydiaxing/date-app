class Networking {
  constructor(name) {
    this.name = name;
    this.socket = io({ query: { name: name }});
    // todo: check for errors (socket didn't connect, etc.)
    
    this.socket.on('userList', this.receiveUsers);
  }
  
  queryUsers() {
    this.socket.emit('getUsers');
  }
  
  receiveUsers(data) {
    this.otherUsers = data.filter(name => name !== this.name);
  }
}