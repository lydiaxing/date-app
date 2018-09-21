const player = document.getElementById('player');

const constraints = {
  video: true,
};

navigator.mediaDevices.getUserMedia(constraints)
  .then((stream) => {
    player.srcObject = stream;
});
