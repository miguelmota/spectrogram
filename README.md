# spectrogram

> Audio spectrogram in canvas.

[![NPM](https://nodei.co/npm/spectrogram.png)](https://nodei.co/npm/spectrogram)

# Demo

**[http://lab.moogs.io/spectrogram](http://lab.moogs.io/spectrogram)**

<img src="./examples/images/grayscale.png" width="360">

# Install

```bash
npm install spectrogram
```

```bash
bower install spectrogram
```

# Usage

Take a look at the [full example][].

```javascript
var spectrogram = require('spectrogram');

var spectro = Spectrogram(document.getElementById('canvas'), {
  audio: {
    enable: true
  },
  colors: function(steps) {
    var colors = [];

    for (var i = 0; i < steps; ++i) {
      // generate custom colors
    }

    return colors;
  }
});

var audioContext = new audioContext();
var request = new XMLHttpRequest();
request.open('GET', 'audio.mp3', true);
request.responseType = 'arraybuffer';

request.onload = function() {
  audioContext.decodeAudioData(request.response, function(buffer) {
    spectro.addSource(buffer, audioContext);
    spectro.start();
  });
};

request.send();
```

By default the colors are grayscale. You can generate custom colors using a color scale library such as [chroma.js](https://github.com/gka/chroma.js);

```javascript
var spectro = Spectrogram(..., {
  canvas: ...
  audio: ...
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
```

<img src="./examples/images/color.png" width="360">

# License

MIT

[full example]: example/
