const constraints = {
  video: true
};

window.addEventListener('DOMContentLoaded', () => {
  const player = document.getElementById('player');
  const canvas = document.getElementById('canvas');
  const context = canvas.getContext('2d');

  setInterval(function() {
    context.drawImage(player, 0, 0, canvas.width, canvas.height)
    canvas.toBlob(function(blob) {
      $.ajax({
        beforeSend: function(request) {
          request.setRequestHeader("Prediction-Key", "0f1a8c95038f477f8187f0ae3464eb5c");
          request.setRequestHeader("Prediction-key", "0f1a8c95038f477f8187f0ae3464eb5c");
          request.setRequestHeader("Content-Type", "application/octet-stream");
        },
        url: "https://southcentralus.api.cognitive.microsoft.com/customvision/v2.0/Prediction/68d11203-e168-4fc1-bc7c-fd15f7382000/image?iterationId=05c76556-313b-40da-89ce-4ee9c40357c6",
        method: "POST",
        data: blob,
        processData: false
      }).done(function(data) {
        console.log(data.predictions[0])
      }).fail(function(err) {
        console.log('error')
      })
    });
  }, 3000);

  navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
    player.srcObject = stream;
  });
});
