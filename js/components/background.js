(function(app) {
  'use strict';

  var jCore = require('jcore');
  var dom = app.dom || require('../dom.js');

  var Background = jCore.Component.inherits();

  Background.prototype.change = function(background) {
    return new Promise(function(resolve) {
      var children = dom.children(this.element());
      dom.once(this.element(), 'transitionend', function() {
        dom.append(this.element(), children[0]);
        dom.css(children[1], { background: background });
        dom.css(this.element(), { background: background });
        resolve();
      }.bind(this));
      dom.css(children[0], {
        background: background,
        opacity: 1,
      });
      dom.css(children[1], { opacity: 0 });
    }.bind(this));
  };

  Background.prototype.oninit = function() {
    var children = dom.children(this.element());
    dom.css(children[0], { opacity: 0 });
    dom.css(children[1], { opacity: 1 });
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = Background;
  } else {
    app.Background = Background;
  }
})(this.app || (this.app = {}));
