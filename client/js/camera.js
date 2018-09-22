const constraints = {
  video: true,
};

const INTERVAL = 3000;
const URL = "https://southcentralus.api.cognitive.microsoft.com/customvision/v2.0/Prediction/68d11203-e168-4fc1-bc7c-fd15f7382000/image?iterationId=05c76556-313b-40da-89ce-4ee9c40357c6"

class CameraAPI {
  /**
   * Creates a new CameraAPI instance
   * @param network A Networking object in order to access socket methods
   */
  constructor(network) {
    this.network = network;
    
    this.player = document.getElementById('player');
    this.canvas = document.getElementById('canvas');
    this.context = canvas.getContext('2d');
    
    navigator.mediaDevices.getUserMedia(constraints).then(stream => {
      player.srcObject = stream;
    });
  }
  
  /**
   * Starts requesting data from the image API
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
   * Sends the camera data to the API
   */
  sendRequest() {
    this.context.drawImage(player, 0, 0, canvas.width, canvas.height);
  
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
    console.log(data);
    // TODO: send to server
    network.sendImageAPIResult(data);
  }
}