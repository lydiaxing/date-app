class Networking {
  /**
   * Container object for all client side networking operatinos
   * @param name The users display name
   */
  constructor(name) {
    // default initialized values
    this.name = name;
    this.otherUsers = [];
    this.initiateSessionCallback = () => {};
    this.matchCallback = () => {};
    this.inSession = false;
    
    this.socket = io({ query: { name: name }, reconnection: false });
    // todo: check for errors (socket didn't connect, etc.)
    
    this.socket.on('userList', this.receiveUsers.bind(this));
    this.socket.on('start', this.callInitiateSessionCallback.bind(this));
    this.socket.on('match', this.callMatchCallback.bind(this));
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
  
  /**
   * Sets the callback
   * @param callback Function to call when the session is about to begin
   */
  setInitiateSessionCallback(callback) {
    this.initiateSessionCallback = callback;
  }
  
  setMatchCallback(callback) {
    this.matchCallback = callback;
  }
  
  callInitiateSessionCallback(data) {
    if (!this.inSession) {
      this.initiateSessionCallback(data);
      this.inSession = true;
    }
  }
  
  callMatchCallback(data) {
    this.matchCallback(data);
  }
  
  sendImageAPIResult(data) {
    this.socket.emit('imageData', data)
  }
  
  isInSession() {
    return this.inSession;
  }
}