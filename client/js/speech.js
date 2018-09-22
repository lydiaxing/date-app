const INTERVAL = 3000;
const URL = '';

class SpeechAPI {
  /**
    * Creates a new SpeechAPI instance
    * @param
    */
  constructor() {
    this.recognition = new webkitSpeechRecognition();
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.transcript = '';

    this.recognition.onresult = function(event) {
      for (var i = event.resultIndex; i < event.results.length; ++i) {
        this.transcript += event.results[i][0].transcript;
      }
    }
  }

  /**
  * Starts requesting data from the sentiment analysis API
  */
  startRequests() {
    this.interval = window.setInterval(this.sendRequest, INTERVAL);
  }

  /**
  * Stops sending requests
  */
  stopRequests() {
    window.clearInterval(this.interval);
  }

  /**
   * Sends the transcript to the API
   */
   sendRequest() {
     $.ajax({
       url: URL,
       method: "POST",
       data: this.transcript
     })
     .done(this.onReceiveData)
     .fail(err => {
       console.error('error in speech.js: ', err);
     });
   };

   /**
    * Process received data
    * @param data Data received from the API
    */
    onReceiveData(data) {
      console.log(data);
      //TODO: send to server
    }
}