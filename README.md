# spectrogram

> Audio spectrogram in canvas.

[![NPM](https://nodei.co/npm/spectrogram.png)](https://nodei.co/npm/spectrogram)

# Demo

**[https://lab.miguelmota.com/spectrogram](https://lab.miguelmota.com/spectrogram)**

<img src="./example/images/screenshot_grayscale.gif" width="400">

# Install

```bash
npm install spectrogram
```

# Usage

Take a look at the [full example][].

##### Spectrogram of an audio file buffer.

```javascript
var spectrogram = require('spectrogram');

var spectro = Spectrogram(document.getElementById('canvas'), {
  audio: {
    enable: false
  }
});

var audioContext = new AudioContext();
var request = new XMLHttpRequest();
request.open('GET', 'audio.mp3', true);
request.responseType = 'arraybuffer';

request.onload = function() {
  audioContext.decodeAudioData(request.response, function(buffer) {
    spectro.connectSource(buffer, audioContext);
    spectro.start();
  });
};

request.send();
```

##### Live input stream with [getUserMedia](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/getUserMedia).

```javascript
navigator.getUserMedia({
  video: false,
  audio: true
},
function(stream) {
  var input = audioContext.createMediaStreamSource(stream);
  var analyser = audioContext.createAnalyser();

  analyser.smoothingTimeConstant = 0;
  analyser.fftSize = 2048;

  input.connect(analyser);

  spectro.connectSource(analyser, audioContext);
  spectro.start();
}, function(error) {

});
```

### Custom color spectrum

By default the colors are grayscale. You can generate a custom color spectrum using a color scale library such as [chroma.js](https://github.com/gka/chroma.js).

```javascript
var spectro = Spectrogram(..., {
  canvas: ...
  audio: ...
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
```

<img src="./example/images/screenshot_color.gif" width="400">

# Credits

- [Exploring the HTML5 Web Audio: visualizing sound](http://www.smartjava.org/content/exploring-html5-web-audio-visualizing-sound)

# License

MIT

[full example]: example/
