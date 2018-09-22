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
  }
  
  /**
   * Sets the current screen
   * @param screen The new screen name
   */
  setScreen(screen) {
    this.currentScreen(screen);
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
  });
});