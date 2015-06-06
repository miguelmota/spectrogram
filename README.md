# spectrogram

> Audio spectrogram in canvas.

[![NPM](https://nodei.co/npm/spectrogram.png)](https://nodei.co/npm/spectrogram)

# Demo

[http://lab.moogs.io/spectrogram](http://lab.moogs.io/spectrogram)

# Install

```bash
npm install spectrogram
```

```bash
bower install spectrogram
```

# Usage

```javascript
var spectrogram = require('spectrogram');

var specto = Spectrogram(document.getElementById('canvas'));

var audioContext = new audioContext();
var request = new XMLHttpRequest();
request.open('GET', 'audio.mp3', true);
request.responseType = 'arraybuffer';

request.onload = function() {
  audioContext.decodeAudioData(request.response, function(buffer) {
    specto.addSource(buffer, audioContext);
    specto.start();
  });
};

request.send();
```

# License

MIT
