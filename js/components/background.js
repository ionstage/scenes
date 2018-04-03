(function(app) {
  'use strict';

  var jCore = require('jcore');

  var Background = jCore.Component.inherits();

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = Background;
  } else {
    app.Background = Background;
  }
})(this.app || (this.app = {}));
