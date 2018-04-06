(function(app) {
  'use strict';

  var jCore = require('jcore');
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

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = Main;
  } else {
    app.Main = Main;
  }
})(this.app || (this.app = {}));
