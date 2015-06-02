(function(root) {
  'use strict';

  function Spectogram(canvas, options) {
    if (!(this instanceof Spectogram)) {
      return new Spectogram(canvas, options);
    }

    this.context = null;
    this.audioBuffer = null;
    this.sourceNode = null;
    this.scriptNode = null;
    this.analyser = null;
    this.canvas = canvas;
    this.canvasContext = this.canvas.getContext('2d');

    this.canvas.width = options.canvas.width() || 1000;
    this.canvas.height = options.canvas.height || 500;

    this.tempCanvas = document.createElement('canvas');
    this.tempCanvasContext = this.tempCanvas.getContext('2d');
    this.tempCanvas.width = this.canvas.width;
    this.tempCanvas.height = this.canvas.height;

    var colors = ['#0000ff',  '#00ffff', '#00ff00', '#ffff00', '#ff0000'];
    this.canvas.style.backgroundColor = colors[0];

    this.hot = new chroma.ColorScale({
      colors: colors,
      positions: [0, 0.15, 0.30, 0.50, 0.75],
      mode: 'rgb',
      limits: [0, 300]
    });

  }

  Spectogram.prototype.init = function() {
    this.scriptNode = this.context.createScriptProcessor(2048, 1, 1);
    this.scriptNode.connect(this.context.destination);
    this.scriptNode.onaudioprocess = function() {
      var array = new Uint8Array(this.analyser.frequencyBinCount);
      this.analyser.getByteFrequencyData(array);

      if (this.sourceNode.playbackState === this.sourceNode.PLAYING_STATE) {
        this.draw(array, this);
      }
    }.bind(this);

    this.analyser = this.context.createAnalyser();
    this.analyser.smoothingTimeConstant = 0;
    this.analyser.fftSize = 1024;

    this.analyser.connect(this.scriptNode);
    this.sourceNode.connect(this.analyser);
    this.sourceNode.connect(this.context.destination);
  };

  Spectogram.prototype.draw = function(array) {
      var width = this.canvas.width;
      var height = this.canvas.height;
      this.tempCanvasContext.drawImage(this.canvas, 0, 0, width, height);
      for (var i = 0; i < array.length; i++) {
        var value = array[i];
        this.canvasContext.fillStyle = this.hot.getColor(value).hex();
        this.canvasContext.fillRect(width - 1, height - i, 1, 1);
      }
      this.canvasContext.translate(-1, 0);
      this.canvasContext.drawImage(this.tempCanvas, 0, 0, width, height, 0, 0, width, height);
      // reset transformation matrix
      this.canvasContext.setTransform(1, 0, 0, 1, 0, 0);
    };

  Spectogram.prototype.addSource = function(buffer, context) {
    this.buffer = buffer;
    this.context = buffer.context || context;
    this.sourceNode = this.context.createBufferSource();
    this.sourceNode.buffer = this.buffer;
    this.init();
  };

  Spectogram.prototype.start = function() {
    this.sourceNode.start(0);
  };

  Spectogram.prototype.stop = function() {
    this.sourceNode.stop();
  };

  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = Spectogram;
    }
    exports.Spectogram = Spectogram;
  } else if (typeof define === 'function' && define.amd) {
    define([], function() {
      return Spectogram;
    });
  } else {
    root.Spectogram = Spectogram;
  }

})(this);
