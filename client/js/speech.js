const SPEECH_INTERVAL = 6000;
const SPEECH_URL = 'https://westcentralus.api.cognitive.microsoft.com/text/analytics/v2.0/sentiment';

class SpeechAPI {
  /**
    * Creates a new SpeechAPI instance
    */
  constructor(network, callback) {
    this.network = network;
    this.callback = callback;

    this.recognition = new webkitSpeechRecognition();
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.transcript = '';
    this.interim = '';
    this.sentiment = '';

    this.recognition.onstart = () => {
      console.log('started');
    };

    this.recognition.onresult = (event) => {
      let latest = event.results.length - 1;
      if (event.results[latest][0].transcript) {
        if (event.results[latest].isFinal) {
          this.transcript += event.results[latest][0].transcript;
        } else {
          this.interim += event.results[latest][0].transcript;
        }
      }
    };

    this.recognition.onerror = (event) => {
      console.log("speech to text error: ", event.error);
    };

    //prevent auto-stopping after silence
    this.recognition.onend = () => {
      /*
      this.recognition.stop();
      this.recognition.start();
      */
    };

    this.onReceiveData = this.onReceiveData.bind(this);
  }

  /**
   * Begins speech to text transcription
   */
  startRecognition() {
    this.recognition.start();
  }

  stopRecognition() {
    this.recognition.stop();
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
   * Sends the transcript to the API for sentiment analysis
   */
  sendRequest() {
    const copy = this.transcript;
    const json = JSON.stringify({
      "documents": [
        {
          "id": "1",
          "text": copy
        }
      ]
    });

    if (copy !== '') {
      $.ajax({
        beforeSend: request => {
          request.setRequestHeader("Ocp-Apim-Subscription-Key", "72826f94bb10406ea7d50687b2566068");
          request.setRequestHeader("Content-Type", "application/json");
        },
        url: SPEECH_URL,
        method: "POST",
        data: json
      }).done(this.onReceiveData).fail(err => {
        console.error('error in speech.js: ', err);
      });
    }
  };

  /**
    * Process received data
    * @param data Data received from the API
    */
  onReceiveData(data) {
    this.sentiment = data;
    this.callback(data);
  }

  /**
    * Process received postmortem data
    * @param data Data received from the API
    */
  onReceiveKeyPhrases(data) {
    const keyPhrases = data.documents[0].keyPhrases;
  }
}
