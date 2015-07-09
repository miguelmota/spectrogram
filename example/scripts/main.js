window.AudioContext = window.AudioContext || window.webkitAudioContext;
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
window.URL = window.URL || window.webkitURL;
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

var audioContext;
var spectro;
var microphoneButton;
var songButton;
var songSelect;
var selectedMedia;

var media = [
  {
    file: 'media/aphex_twins_equation.mp3',
    slice: {start: 320000, end: 340000}
  },
  {
    file: 'media/ethos_final_hope.mp3',
    slice: {start: 50000, end: 170000}
  }
];

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

      var colors = [];

      for (var i = 0; i < steps; ++i) {
        var color = scale(i);
        colors.push(color.hex());
      }

      return colors;
    }
  });

  try {
    audioContext = new AudioContext();
  } catch (e) {
    alert('No web audio support in this browser!');
  }

  microphoneButton = document.getElementById('btn-microphone');
  songButton = document.getElementById('btn-song');
  songSelect = document.getElementById('select-song');

  microphoneButton.disabled = false;

  microphoneButton.addEventListener('click', requestMic, false);
  songButton.addEventListener('click', playSong, false);
  songSelect.addEventListener('change', selectMedia, false);

  selectMedia();
}

function loadMedia(selectedMedia, callback) {
  songButton.disabled = false;

  var request = new XMLHttpRequest();
  request.open('GET', selectedMedia.file, true);
  request.responseType = 'arraybuffer';

  request.onload = function() {
    audioContext.decodeAudioData(request.response, function(buffer) {
      var slice = selectedMedia.slice;
      AudioBufferSlice(buffer, slice.start, slice.end, function(error, buf) {
        callback(buf);
      });
    });
  };

  request.send();
}

function selectMedia() {
  songButton.disabled = false;
  selectedMedia = media[songSelect.value];
}

function playSong() {
  loadMedia(selectedMedia, function(songBuffer) {
    spectro.connectSource(songBuffer, audioContext);
    spectro.start();
  });

  removeControls();
}

function requestMic() {
  navigator.getUserMedia({
    video: false,
    audio: true
  },
  function(stream) {
    handleMicStream(stream);
    removeControls();
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

function removeControls() {
  songSelect.parentNode.removeChild(songSelect);
  songButton.parentNode.removeChild(songButton);
  microphoneButton.parentNode.removeChild(microphoneButton);
}

window.addEventListener('load', init, false);
