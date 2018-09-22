/**
 * ViewModel for Dating-App
 */
class DatingApp {
  /**
   * Initializes the viewmodel, and sets the
   * current screen to the welcome view
   */
  constructor() {
    this.myName = ko.observable('');
    this.currentScreen = ko.observable('welcome');
    this.users = ko.observableArray([]);
    this.selectedUser = ko.observable('');

    this.time = ko.observable('');
    this.startTime = new Date();

    this.imageData = ko.observable({
      emotionPrediction: '',
      emotionConfidence: ''
    });
    this.textData = ko.observable({
      transcript: '',
      interim: '',
      sentiment: ''
    });

    this.postMortem = ko.observable({
      transcript: '',
      keyPhrases: ''
    })

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
  let speech;

  // Connect button
  document.getElementById('connect').addEventListener('click', () => {
    const name = document.getElementById('name').value.trim();
    if (name === '') return;
    app.myName(name);
    networking = new Networking(name);

    // This isn't the best layout for this code but its
    // the best I can do under the circumstance :)

    // Code to be run after we have connected to another user
    networking.setInitiateSessionCallback(data => {
      app.selectedUser(data);
      app.setScreen('session');

      // Session code
      camera = new CameraAPI(networking, () => {
        app.imageData({
          emotionConfidence: camera.emotionConfidence,
          emotionPrediction: camera.emotionPrediction
        });
      });
      camera.startRequests();

      speech = new SpeechAPI(networking, () => {
        app.textData({
          transcript: speech.transcript,
          interim: speech.interim,
          sentiment: speech.sentiment
        });
        console.log('speech', speech.transcript, speech.interim, speech.sentiment)
      });
      speech.startRecognition();
      speech.startRequests();

      app.startTime = new Date();
    });

    // User names
    app.selectedUser.subscribe(name => {
      if (!networking.isInSession()) networking.initiateSession(name);
    });

    // On receive match
    networking.setMatchCallback((data) => {
      app.setScreen('match');
<<<<<<< HEAD

=======
      
      window.navigator.vibrate(200);
      
>>>>>>> 9544c8611006275b7926f5ab4371c237d2d283f9
      // calculate time taken
      let difference = new Date(new Date() - app.startTime);
      app.time(
        (difference.getMinutes() !== 0 ? difference.getMinutes() +'m ' : '' ) +
        (difference.getSeconds()) + 's');
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

  document.getElementById('viewStats').addEventListener('click', () => {
    app.setScreen('postMortem');
  });
});
