(function(app) {
  'use strict';

  var jCore = require('jcore');
  var dom = app.dom || require('../dom.js');

  var Medal = jCore.Component.inherits();

  Medal.prototype.change = function(name) {
    return new Promise(function(resolve) {
      var children = dom.children(this.element());
      var src = 'images/medals/' + name + '.svg';
      dom.once(children[0], 'load', function() {
        dom.once(this.element(), 'transitionend', function() {
          dom.append(this.element(), children[0]);
          dom.attr(children[1], { src: src });
          dom.css(this.element(), { 'background-image': 'url("' + src + '")' });
          resolve();
        }.bind(this));
        dom.css(children[0], { opacity: 1 });
        dom.css(children[1], { opacity: 0 });
      }.bind(this));
      dom.attr(children[0], { src: src });
    }.bind(this));
  };

  Medal.prototype.oninit = function() {
    var children = dom.children(this.element());
    dom.css(children[0], { opacity: 0 });
    dom.css(children[1], { opacity: 1 });
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = Medal;
  } else {
    app.Medal = Medal;
  }
})(this.app || (this.app = {}));
