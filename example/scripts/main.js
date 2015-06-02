window.AudioContext = window.AudioContext || window.webkitAudioContext;
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
window.URL = window.URL || window.webkitURL;

var audioContext;
var specto;

function init() {
  specto = Spectogram(document.getElementById('canvas'), {
    canvas: {
      width: function() {
        return window.innerWidth;
      },
      height: 500
    }
  });

  try {
    audioContext = new AudioContext();
  } catch (e) {
    alert('No web audio support in this browser!');
  }
}


var request = new XMLHttpRequest();
request.open('GET', 'media/ethos-final-hope.mp3', true);
request.responseType = 'arraybuffer';

request.onload = function() {
  audioContext.decodeAudioData(request.response, function(buffer) {
    AudioBufferSlice(buffer, 50000, 120000, function(error, buf) {
      specto.addSource(buf, audioContext);
      specto.start();
    });
  });
};

request.send();

window.onload = init;
