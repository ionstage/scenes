(function(app) {
  'use strict';

  var jCore = require('jcore');
  var dom = app.dom || require('../dom.js');
  var Background = app.Background || require('./background.js');
  var Content = app.Content || require('./content.js');
  var Controls = app.Controls || require('./controls.js');
  var Foreground = app.Foreground || require('./foreground.js');

  var Main = jCore.Component.inherits(function() {
    this.background = new Background({ element: this.findElement('.background') });
    this.content = new Content({ element: this.findElement('.content') });
    this.foreground = new Foreground({ element: this.findElement('.foreground') });
    this.controls = new Controls({ element: this.findElement('.controls') });
  });

  Main.prototype.scene = function() {
    return Object.create(Object.prototype, {
      load: { value: this.loadScene.bind(this) },
    });
  };

  Main.prototype.loadScene = function(callback) {
    var scene = callback();
    if (scene.hasOwnProperty('background')) {
      this.background.change(scene.background);
    }
    if (scene.hasOwnProperty('foreground')) {
      this.foreground.change(scene.foreground[0], scene.foreground[1]);
    }
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = Main;
  } else {
    app.Main = Main;
  }
})(this.app || (this.app = {}));
