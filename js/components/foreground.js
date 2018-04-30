(function(app) {
  'use strict';

  var jCore = require('jcore');
  var dom = app.dom || require('../dom.js');

  var Foreground = jCore.Component.inherits(function() {
    this.background = '';
    this.opacity = 0;
  });

  Foreground.prototype.change = function(background, opacity) {
    if (this.background === background && this.opacity === opacity) {
      return Promise.resolve();
    }
    this.background = background;
    this.opacity = opacity;
    return new Promise(function(resolve) {
      var children = dom.children(this.element());
      dom.once(this.element(), 'transitionend', function() {
        dom.append(this.element(), children[0]);
        dom.css(children[1], { background: background });
        resolve();
      }.bind(this));
      dom.css(children[0], {
        background: background,
        opacity: (typeof opacity !== 'undefined' ? opacity : 1),
      });
      dom.css(children[1], { opacity: 0 });
    }.bind(this));
  };

  Foreground.prototype.oninit = function() {
    var children = dom.children(this.element());
    dom.css(children[0], { opacity: 0 });
    dom.css(children[1], { opacity: 1 });
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = Foreground;
  } else {
    app.Foreground = Foreground;
  }
})(this.app || (this.app = {}));
