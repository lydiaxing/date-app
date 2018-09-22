/**
 * ViewModel for Dating-App
 */
class DatingApp {
  /**
   * Initializes the viewmodel, and sets the
   * current screen to the welcome view
   */
  constructor() {
    this.currentScreen = ko.observable('welcome');
    this.users = ko.observableArray([]);
    this.selectedUser = ko.observable('');
  }
  
  /**
   * Sets the current screen
   * @param screen The new screen name
   */
  setScreen(screen) {
    this.currentScreen(screen);
  }
  
  setUsers(users) {
    this.users(users);
  }
  
  nameClick(name) {
    this.selectedUser(name);
  }
}

// TODO: move into $() for safety
const app = new DatingApp();

$(() => {
  ko.applyBindings(app);
  
  let networking;
  
  // Connect button
  document.getElementById('connect').addEventListener('click', () => {
    const name = document.getElementById('name').value;
    networking = new Networking(name);
    
    app.setScreen('userList');
    refreshUserList();
  });
  
  // Refresh button
  document.getElementById('refresh').addEventListener('click', refreshUserList);
  
  function refreshUserList() {
    networking.queryUsers((data) => {
      app.setUsers(data);
    });
  }
  
  // User names
  app.selectedUser.subscribe((name) => {
    // todo: initiate session
    networking.initiateSession(name);
  });
});