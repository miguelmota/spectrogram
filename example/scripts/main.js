window.AudioContext = window.AudioContext || window.webkitAudioContext;
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
window.URL = window.URL || window.webkitURL;
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

var audioContext;
var spectro;
var songBuffer;
var microphoneButton;
var songButton;

function init() {
  spectro = Spectrogram(document.getElementById('canvas'), {
    canvas: {
      width: function() {
        return window.innerWidth;
      },
      height: 500
    },
    audio: {
      enable: true
    },
    colors: function(steps) {
      var baseColors = [[0,0,255,1], [0,255,255,1], [0,255,0,1], [255,255,0,1], [ 255,0,0,1]];
      var positions = [0, 0.15, 0.30, 0.50, 0.75];

      var scale = new chroma.scale(baseColors, positions)
      .domain([0, steps]);

      function toRGBString(rgb) {
        return 'rgba(' + rgb.map(function(x) { return x>>0; }).toString() + ')';
      }

      var colors = [];

      for (var i = 0; i < steps; ++i) {
        var color = scale(i);
        color = toRGBString(color._rgb || color);
        colors.push(color);
      }

      return colors;
    }
  });

  try {
    audioContext = new AudioContext();
  } catch (e) {
    alert('No web audio support in this browser!');
  }

  var request = new XMLHttpRequest();
  request.open('GET', 'media/ethos-final-hope.mp3', true);
  request.responseType = 'arraybuffer';

  request.onload = function() {
    audioContext.decodeAudioData(request.response, function(buffer) {
      AudioBufferSlice(buffer, 50000, 170000, function(error, buf) {
        songBuffer = buf;
        songButton.disabled = false;
      });
    });
  };

  request.send();

  microphoneButton = document.getElementById('btn-microphone');
  songButton = document.getElementById('btn-song');

  microphoneButton.disabled = false;

  microphoneButton.addEventListener('click', requestMic, false);
  songButton.addEventListener('click', playSong, false);
}

function playSong() {
  spectro.connectSource(songBuffer, audioContext);
  spectro.start();

  songButton.parentNode.removeChild(songButton);
  microphoneButton.parentNode.removeChild(microphoneButton);
}

function requestMic() {
  navigator.getUserMedia({
    video: false,
    audio: true
  },
  function(stream) {
    handleMicStream(stream);

    microphoneButton.parentNode.removeChild(microphoneButton);
    songButton.parentNode.removeChild(songButton);
  }, handleMicError);
}

function handleMicStream(stream) {
  var input = audioContext.createMediaStreamSource(stream);
  var analyser = audioContext.createAnalyser();

  analyser.smoothingTimeConstant = 0;
  analyser.fftSize = 2048;

  input.connect(analyser);

  spectro.connectSource(analyser, audioContext);
  spectro.start();
}

function handleMicError(error) {
  alert(error);
  console.log(error);
}

window.addEventListener('load', init, false);
