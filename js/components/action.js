(function(app) {
  'use strict';

  var jCore = require('jcore');
  var dom = app.dom || require('../dom.js');

  var Action = jCore.Component.inherits(function(props) {
    this.type = this.prop(props.type);
    this.x = this.prop(props.x);
    this.y = this.prop(props.y);
    this.isActive = this.prop(false);
    this.draggable = new Action.Draggable(this);
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

  Action.Draggable = (function() {
    var Draggable = jCore.Draggable.inherits();

    Draggable.prototype.onstart = function(action, x, y, event, context) {
      context.target = dom.target(event);
      dom.cancel(event);
      action.isActive(true);
    };

    Draggable.prototype.onmove = function(action, dx, dy, event, context) {
      action.isActive(dom.target(event) === context.target);
    };

    Draggable.prototype.onend = function(action, dx, dy, event, context) {
      if (dom.target(event) === context.target) {
        action.emit('tap');
      }
    };

    return Draggable;
  })();

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = Action;
  } else {
    app.Action = Action;
  }
})(this.app || (this.app = {}));
