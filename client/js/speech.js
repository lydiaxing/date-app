const SPEECH_INTERVAL = 6000;
const SPEECH_URL = 'https://westcentralus.api.cognitive.microsoft.com/text/analytics/v2.0/sentiment';

class SpeechAPI {
  /**
    * Creates a new SpeechAPI instance
    */
  constructor() {
    this.recognition = new webkitSpeechRecognition();
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.transcript = '';
    this.interim = '';

    this.recognition.onresult = (event) => {
      let latest = event.results.length - 1;
      if (event.results[latest][0].transcript) {
        if (event.results[latest].isFinal) {
          this.transcript += event.results[latest][0].transcript
        } else {
          this.interim += event.results[latest][0].transcript
        }
      }

      //TODO: update html based on these values
      console.log('interm', this.interim)
      console.log('final', this.transcript)
    }

    this.recognition.onstart = () => {
      this.startRequests();
    }

    this.recognition.onerror = (event) => {
      console.log("speech to text error: ", event.error);
    }

    //prevent auto-stopping after silence
    this.recognition.onend = () => {
      this.recognition.start();
    }
  }

  /**
  * Begins speech to text transcription
  */
  startRecognition() {
    this.recognition.start();
  }

  /**
   * Starts requesting data from the sentiment analysis API
   */
  startRequests() {
    this.interval = window.setInterval(this.sendRequest.bind(this), SPEECH_INTERVAL);
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
    let json = JSON.stringify({
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
    }).done(this.onReceiveData)
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
    // TODO: send to server
  }
}
