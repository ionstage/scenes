(function(app) {
  'use strict';

  var jCore = require('jcore');
  var dom = app.dom || require('../dom.js');
  var Button = app.Button || require('./button.js');

  var Action = jCore.Component.inherits(function(props) {
    this.type = this.prop(props.type);
    this.x = this.prop(props.x);
    this.y = this.prop(props.y);
    this.isActive = this.prop(false);
    this.draggable = new Button.Draggable(this);
  });

  Action.prototype.render = function() {
    return dom.render(Action.HTML_TEXT);
  };

  Action.prototype.oninit = function() {
    this.draggable.enable();
  };

  Action.prototype.onredraw = function() {
    this.redrawBy('type', function(type) {
      dom.data(this.element(), 'type', type);
    });

    this.redrawBy('x', 'y', function(x, y) {
      dom.translate(this.element(), x / 0.045 * 100 - 50, y / 0.08 * 100 - 50);
    });

    this.redrawBy('isActive', function(isActive) {
      dom.toggleClass(this.element(), 'active', isActive);
    });
  };

  Action.HTML_TEXT = '<img class="action" src="images/exclamation.svg">';

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = Action;
  } else {
    app.Action = Action;
  }
})(this.app || (this.app = {}));
