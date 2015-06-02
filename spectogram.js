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

    var baseColors = ['#0000ff',  '#00ffff', '#00ff00', '#ffff00', '#ff0000'];
    this.canvas.style.backgroundColor = baseColors[0];
  }

  Spectogram.prototype.init = function() {
    this.scriptNode = this.context.createScriptProcessor(2048, 1, 1);
    this.scriptNode.connect(this.context.destination);
    this.scriptNode.onaudioprocess = function() {
      var array = new Uint8Array(this.analyser.frequencyBinCount);
      this.analyser.getByteFrequencyData(array);

      if (this.sourceNode.playbackState === this.sourceNode.PLAYING_STATE) {
        this.draw(array);
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
        this.canvasContext.fillStyle = this.getColor(value);
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

  Spectogram.prototype.getColor = function(index) {
    var colors = [
      "#0000FF",
      "#0005FF",
      "#000BFF",
      "#0011FF",
      "#0016FF",
      "#001CFF",
      "#0022FF",
      "#0027FF",
      "#002DFF",
      "#0033FF",
      "#0038FF",
      "#003EFF",
      "#0044FF",
      "#0049FF",
      "#004FFF",
      "#0055FF",
      "#005AFF",
      "#0060FF",
      "#0066FF",
      "#006BFF",
      "#0071FF",
      "#0077FF",
      "#007CFF",
      "#0082FF",
      "#0088FF",
      "#008DFF",
      "#0093FF",
      "#0099FF",
      "#009EFF",
      "#00A4FF",
      "#00AAFF",
      "#00AFFF",
      "#00B5FF",
      "#00BBFF",
      "#00C0FF",
      "#00C6FF",
      "#00CCFF",
      "#00D1FF",
      "#00D7FF",
      "#00DDFF",
      "#00E2FF",
      "#00E8FF",
      "#00EEFF",
      "#00F3FF",
      "#00F9FF",
      "#00FFFF",
      "#00FFF9",
      "#00FFF3",
      "#00FFED",
      "#00FFE8",
      "#00FFE2",
      "#00FFDC",
      "#00FFD7",
      "#00FFD1",
      "#00FFCC",
      "#00FFC6",
      "#00FFC0",
      "#00FFBB",
      "#00FFB5",
      "#00FFAF",
      "#00FFA9",
      "#00FFA4",
      "#00FF9E",
      "#00FF99",
      "#00FF93",
      "#00FF8D",
      "#00FF88",
      "#00FF82",
      "#00FF7C",
      "#00FF76",
      "#00FF71",
      "#00FF6B",
      "#00FF66",
      "#00FF60",
      "#00FF5A",
      "#00FF54",
      "#00FF4F",
      "#00FF49",
      "#00FF43",
      "#00FF3E",
      "#00FF38",
      "#00FF32",
      "#00FF2D",
      "#00FF27",
      "#00FF21",
      "#00FF1C",
      "#00FF16",
      "#00FF11",
      "#00FF0B",
      "#00FF05",
      "#00FF00",
      "#04FF00",
      "#08FF00",
      "#0CFF00",
      "#11FF00",
      "#15FF00",
      "#19FF00",
      "#1DFF00",
      "#22FF00",
      "#26FF00",
      "#2AFF00",
      "#2EFF00",
      "#33FF00",
      "#37FF00",
      "#3BFF00",
      "#3FFF00",
      "#44FF00",
      "#48FF00",
      "#4CFF00",
      "#50FF00",
      "#54FF00",
      "#59FF00",
      "#5DFF00",
      "#61FF00",
      "#66FF00",
      "#6AFF00",
      "#6EFF00",
      "#72FF00",
      "#76FF00",
      "#7BFF00",
      "#7FFF00",
      "#83FF00",
      "#88FF00",
      "#8CFF00",
      "#90FF00",
      "#94FF00",
      "#99FF00",
      "#9DFF00",
      "#A1FF00",
      "#A5FF00",
      "#AAFF00",
      "#AEFF00",
      "#B2FF00",
      "#B6FF00",
      "#BBFF00",
      "#BFFF00",
      "#C3FF00",
      "#C7FF00",
      "#CCFF00",
      "#D0FF00",
      "#D4FF00",
      "#D8FF00",
      "#DDFF00",
      "#E1FF00",
      "#E5FF00",
      "#E9FF00",
      "#EEFF00",
      "#F2FF00",
      "#F6FF00",
      "#FAFF00",
      "#FFFF00",
      "#FFFB00",
      "#FFF800",
      "#FFF400",
      "#FFF100",
      "#FFED00",
      "#FFEA00",
      "#FFE700",
      "#FFE300",
      "#FFE000",
      "#FFDD00",
      "#FFD900",
      "#FFD600",
      "#FFD200",
      "#FFCF00",
      "#FFCB00",
      "#FFC800",
      "#FFC500",
      "#FFC100",
      "#FFBE00",
      "#FFBB00",
      "#FFB700",
      "#FFB400",
      "#FFB000",
      "#FFAD00",
      "#FFA900",
      "#FFA600",
      "#FFA300",
      "#FF9F00",
      "#FF9C00",
      "#FF9900",
      "#FF9500",
      "#FF9200",
      "#FF8E00",
      "#FF8B00",
      "#FF8700",
      "#FF8400",
      "#FF8100",
      "#FF7D00",
      "#FF7A00",
      "#FF7700",
      "#FF7300",
      "#FF7000",
      "#FF6C00",
      "#FF6900",
      "#FF6500",
      "#FF6200",
      "#FF5F00",
      "#FF5B00",
      "#FF5800",
      "#FF5500",
      "#FF5100",
      "#FF4E00",
      "#FF4A00",
      "#FF4700",
      "#FF4300",
      "#FF4000",
      "#FF3D00",
      "#FF3900",
      "#FF3600",
      "#FF3300",
      "#FF2F00",
      "#FF2C00",
      "#FF2800",
      "#FF2500",
      "#FF2200",
      "#FF1E00",
      "#FF1B00",
      "#FF1700",
      "#FF1400",
      "#FF1100",
      "#FF0D00",
      "#FF0A00",
      "#FF0600",
      "#FF0300",
      "#FF0000",
      "#FF0000",
      "#FF0000",
      "#FF0000",
      "#FF0000",
      "#FF0000",
      "#FF0000",
      "#FF0000",
      "#FF0000",
      "#FF0000",
      "#FF0000",
      "#FF0000",
      "#FF0000",
      "#FF0000",
      "#FF0000",
      "#FF0000",
      "#FF0000",
      "#FF0000",
      "#FF0000",
      "#FF0000",
      "#FF0000",
      "#FF0000",
      "#FF0000",
      "#FF0000",
      "#FF0000",
      "#FF0000",
      "#FF0000",
      "#FF0000",
      "#FF0000",
      "#FF0000",
      "#FF0000",
      "#FF0000",
      "#FF0000",
      "#FF0000",
      "#FF0000",
      "#FF0000",
      "#FF0000",
      "#FF0000",
      "#FF0000",
      "#FF0000",
      "#FF0000",
      "#FF0000",
      "#FF0000",
      "#FF0000",
      "#FF0000",
      "#FF0000",
      "#FF0000",
      "#FF0000",
      "#FF0000",
      "#FF0000",
      "#FF0000",
      "#FF0000",
      "#FF0000",
      "#FF0000",
      "#FF0000",
      "#FF0000",
      "#FF0000",
      "#FF0000",
      "#FF0000",
      "#FF0000",
      "#FF0000",
      "#FF0000",
      "#FF0000",
      "#FF0000",
      "#FF0000",
      "#FF0000",
      "#FF0000",
      "#FF0000",
      "#FF0000",
      "#FF0000",
      "#FF0000",
      "#FF0000",
      "#FF0000",
      "#FF0000",
      "#FF0000",
      "#FF0000"
    ];

    return colors[index];
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
