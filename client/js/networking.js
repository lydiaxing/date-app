class Networking {
  /**
   * Container object for all client side networking operatinos
   * @param name The users display name
   * @param initiateCallback Function to call when the session is about to begin
   */
  constructor(name, initiateCallback) {
    this.name = name;
    this.otherUsers = [];
    
    this.socket = io({ query: { name: name }});
    // todo: check for errors (socket didn't connect, etc.)
    
    this.socket.on('userList', this.receiveUsers.bind(this));
    this.socket.on()
  }
  
  /**
   * Refreshes the list of users
   * @param callback Passes the data (user list) received from the server
   */
  queryUsers(callback) {
    this.socket.emit('getUsers');
    this.callback = callback;
  }
  
  /**
   * Receives user data
   * @param data List of users received from the server
   */
  receiveUsers(data) {
    this.otherUsers = data.filter(user => user.name !== this.name);
    this.callback(this.otherUsers);
    this.callback = () => {};
  }
  
  /**
   * Initiates the session
   * @param name Other persons name
   */
  initiateSession(name) {
    this.socket.emit('initiateSession', name);
  }
}