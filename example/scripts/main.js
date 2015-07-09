window.AudioContext = window.AudioContext || window.webkitAudioContext;
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
window.URL = window.URL || window.webkitURL;

var audioContext;
var spectro;

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
    color: function(steps) {
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
      AudioBufferSlice(buffer, 50000, 120000, function(error, buf) {
        spectro.connectSource(buf, audioContext);
        spectro.start();
      });
    });
  };

  request.send();
}

window.onload = init;
