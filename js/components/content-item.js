(function(app) {
  'use strict';

  var jCore = require('jcore');

  var ContentItem = jCore.Component.inherits(function(props) {
    this.x = this.prop(props.x);
    this.y = this.prop(props.y);
  });

  ContentItem.prototype.onredraw = function() {
    this.redrawBy('x', 'y', function(x, y) {
      dom.translate(this.element(), x, y);
    });
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = ContentItem;
  } else {
    app.ContentItem = ContentItem;
  }
})(this.app || (this.app = {}));
