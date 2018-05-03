(function(app) {
  'use strict';

  var helper = {};

  helper.extend = function(obj, src) {
    Object.keys(src).forEach(function(key) {
      obj[key] = src[key];
    });
    return obj;
  };

  helper.clone = function(obj) {
    return helper.extend({}, obj);
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = helper;
  } else {
    app.helper = helper;
  }
})(this.app || (this.app = {}));
