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

  Action.HTML_TEXT = [
    '<img class="action" src=\'data:image/svg+xml;utf8,',
    '<svg width="1792" height="1792" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">',
      '<path d="M1088 1248v224q0 26-19 45t-45 19h-256q-26 0-45-19t-19-45v-224q0-26 19-45t45-19h256q26 0 45 19t19 45zm30-1056l-28 768q-1 26-20.5 45t-45.5 19h-256q-26 0-45.5-19t-20.5-45l-28-768q-1-26 17.5-45t44.5-19h320q26 0 44.5 19t17.5 45z" fill="#fafafa"/>',
    '</svg>\'>',
  ].join('');

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
