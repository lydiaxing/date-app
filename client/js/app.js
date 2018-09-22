class DatingApp {
  constructor() {
    this.currentScreen = ko.observable('welcome');
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
  });
});