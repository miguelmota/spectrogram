# spectogram

> Audio spectogram in canvas.

[![NPM](https://nodei.co/npm/spectogram.png)](https://nodei.co/npm/spectogram)

# Demo

[http://lab.moogs.io/spectogram](http://lab.moogs.io/spectogram)

# Install

```bash
npm install spectogram
```

```bash
bower install spectogram
```

# Usage

```javascript
var spectogram = require('spectogram');

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
