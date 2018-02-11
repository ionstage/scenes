(function(app) {
  'use strict';

  var jCore = require('jcore');
  var Button = app.Button || require('./button.js');

  var Controls = jCore.Component.inherits(function() {
    this.nextButton = new Button({ element: this.findElement('.next-button') });
  });

  Controls.prototype.oninit = function() {
    this.nextButton.on('tap', this.emit.bind(this, 'next'));
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = Controls;
  } else {
    app.Controls = Controls;
  }
})(this.app || (this.app = {}));
