(function(app) {
  'use strict';

  var jCore = require('jcore');

  var ContentItem = jCore.Component.inherits(function(props) {
    this.x = this.prop(props.x);
    this.y = this.prop(props.y);
    this.z = this.prop(props.z || 0);
  });

  ContentItem.prototype.onredraw = function() {
    this.redrawBy('x', 'y', function(x, y) {
      dom.translate(this.element(), x, y);
    });

    this.redrawBy('z', function(z) {
      dom.css(this.element(), { zIndex: parseInt(z * 100, 10) });
    });
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = ContentItem;
  } else {
    app.ContentItem = ContentItem;
  }
})(this.app || (this.app = {}));
