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
    
    this.nameClick = this.nameClick.bind(this); // ugly hack to make Knockout cooperate
  }
  
  /**
   * Sets the current screen
   * @param screen The new screen name
   */
  setScreen(screen) {
    this.currentScreen(screen);
  }

  /**
   * Event handler for user selection
   * @param name User object passed (not actually the name, that would be name.name)
   */
  nameClick(name) {
    this.selectedUser(name);
  }
}

// TODO: move into $() for safety
const app = new DatingApp();

$(() => {
  ko.applyBindings(app);
  
  let networking;
  let camera;
  
  // Connect button
  document.getElementById('connect').addEventListener('click', () => {
    const name = document.getElementById('name').value;
    networking = new Networking(name);
  
    // This isn't the best layout for this code but its
    // the best I can do under the circumstance :)
    
    // Code to be run after we have connected to another user
    networking.setInitiateSessionCallback(data => {
      app.selectedUser(data);
      app.setScreen('session');
      
      // Session code
      camera = new CameraAPI(networking, () => {});
      camera.startRequests();
    });
    
    // On receive match
    networking.setMatchCallback((data) => {
      app.setScreen('match')
    });
    
    app.setScreen('userList');
    refreshUserList();
  });
  
  // Refresh button
  document.getElementById('refresh').addEventListener('click', refreshUserList);
  
  function refreshUserList() {
    networking.queryUsers(data => {
      app.users(data);
    });
  }
  
  // User names
  app.selectedUser.subscribe(name => {
    networking.initiateSession(name);
  });
});