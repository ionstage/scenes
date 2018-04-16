(function(app) {
  'use strict';

  var jCore = require('jcore');

  var ContentItem = jCore.Component.inherits();

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = ContentItem;
  } else {
    app.ContentItem = ContentItem;
  }
})(this.app || (this.app = {}));
