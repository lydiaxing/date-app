const SPEECH_INTERVAL = 3000;
const SPEECH_URL = 'https://westcentralus.api.cognitive.microsoft.com/text/analytics/v2.0/sentiment';

class SpeechAPI {
  /**
    * Creates a new SpeechAPI instance
    * @param
    */
  constructor() {
    this.recognition = new webkitSpeechRecognition();
    this.recognition.continuous = true;
    this.recognition.interimResults = false;
    this.transcript = '';

    this.recognition.onresult = function(event) {
      $("#welcome p").text("recognition picked up");
      for (var i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          this.transcript = event.results[i][0].transcript;
        }
      }
      $("#welcome p").text(this.transcript);
    }

    this.recognition.onerror = function(event) {
      console.log("speech to text error: ", event.error)
    }

    this.recognition.onend = function() {
      console.log("speech to text ended.")
    }
  }

  /**
  * Begins speech to text transcription
  */
  startRecognition() {
    this.recognition.start();
    $("#welcome p").text("recognition starting");
  }

  /**
  * Starts requesting data from the sentiment analysis API
  */
  startRequests() {
    this.sendRequest();
    this.interval = window.setInterval(this.sendRequest, SPEECH_INTERVAL);
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
     var json = JSON.stringify({
       "documents": [
         {
           "id": "1",
           "text": this.transcript
         }
       ]
     });

     $.ajax({
       beforeSend: request => {
         request.setRequestHeader("Ocp-Apim-Subscription-Key", "72826f94bb10406ea7d50687b2566068");
         request.setRequestHeader("Content-Type", "application/json");
       },
       url: SPEECH_URL,
       method: "POST",
       data: json
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
