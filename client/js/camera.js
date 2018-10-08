const INTERVAL = 3000;
const URL = "https://southcentralus.api.cognitive.microsoft.com/customvision/v2.0/Prediction/24aed5d6-c24f-4ae2-9500-cdbd20ecab05/image?iterationId=9ff6fef5-eaf4-4fd6-af89-32d567919772"

class CameraAPI {
  /**
   * Creates a new CameraAPI instance
   * @param network A pointer to a Networking object in order to access socket methods
   * @param callback Called after data has been received from the ML framework
   */
  constructor(network, callback) {
    this.network = network;
    this.callback = callback; // Do we actually need this?

    this.player = document.getElementById('player'); // video player
    this.canvas = document.getElementById('canvas');
    this.context = this.canvas.getContext('2d');

    this.emotionConfidence = '';
    this.emotionPrediction = '';

    navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
      this.player.srcObject = stream;
    });

    this.onReceiveData = this.onReceiveData.bind(this);
  }

  /**
   * Starts requesting data from the image API
   */
  startRequests() {
    this.interval = window.setInterval(this.sendRequest.bind(this), INTERVAL);
  }

  /**
   * Stops sending requests
   */
  stopRequests() {
    window.clearInterval(this.interval);
  }

  /**
   * Sends the camera data to the API
   */
  sendRequest() {
    this.context.drawImage(this.player, 0, 0, this.canvas.width, this.canvas.height);

    this.canvas.toBlob(blob => {
      $.ajax({
          beforeSend: request => {
            request.setRequestHeader("Prediction-Key", "0f1a8c95038f477f8187f0ae3464eb5c");
            request.setRequestHeader("Prediction-key", "0f1a8c95038f477f8187f0ae3464eb5c");
            request.setRequestHeader("Content-Type", "application/octet-stream");
          },
          url: URL,
          method: "POST",
          data: blob,
          processData: false
        })
        .done(this.onReceiveData)
        .fail(err => {
          console.error('error in camera.js:', err);
        });
    });
  }

  /**
   * Process the data
   * @param data Data received from the API
   */
  onReceiveData(data) {
    this.emotionConfidence = data.predictions[0].probability;
    this.emotionPrediction = data.predictions[0].tagName;
    const prediction = data.predictions[0].probability > data.predictions[1].probability ?
                          data.predictions[0].tagName : data.predictions[1].tagName;
    this.network.sendImageAPIResult(prediction);
    this.callback(data);
  }
}
