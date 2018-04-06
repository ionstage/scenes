(function(app) {
  'use strict';

  var jCore = require('jcore');

  var Foreground = jCore.Component.inherits();

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = Foreground;
  } else {
    app.Foreground = Foreground;
  }
})(this.app || (this.app = {}));
