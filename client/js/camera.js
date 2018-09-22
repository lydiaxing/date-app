const player = document.getElementById('player');

const constraints = {
  video: true,
};

window.addEventListener('DOMContentLoaded', () => {
    navigator.mediaDevices.getUserMedia(constraints)
        .then((stream) => {
            player.srcObject = stream;
        });
});
