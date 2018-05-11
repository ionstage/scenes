(function(app) {
  'use strict';

  var jCore = require('jcore');
  var dom = app.dom || require('../dom.js');

  var ContentItem = jCore.Component.inherits(function(props) {
    this.x = this.prop(props.x);
    this.y = this.prop(props.y);
    this.z = this.prop(props.z);
    this.w = this.prop(props.w);
    this.h = this.prop(props.h);
  });

  ContentItem.prototype.load = function(url) {
    return new Promise(function(resolve) {
      var img = this.findElement('.content-item-image');
      var onfailed = function() {
        var src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYWH5DwABKAEMOPUkGQAAAABJRU5ErkJggg==';
        dom.attr(img, { src: src });
      }.bind(this);
      dom.once(img, 'load', function() {
        dom.off(img, 'error', onfailed);
        dom.off(img, 'abort', onfailed);
        resolve(this);
      }.bind(this));
      dom.on(img, 'error', onfailed);
      dom.on(img, 'abort', onfailed);
      dom.attr(img, { src: url });
    }.bind(this));
  };

  ContentItem.prototype.show = function() {
    return new Promise(function(resolve) {
      dom.once(this.element(), 'transitionend', function() {
        resolve();
      }.bind(this));
      dom.css(this.element(), { opacity: 1 });
    }.bind(this));
  };

  ContentItem.prototype.hide = function() {
    return new Promise(function(resolve) {
      dom.once(this.element(), 'transitionend', function() {
        resolve();
      }.bind(this));
      dom.css(this.element(), { opacity: 0 });
    }.bind(this));
  };

  ContentItem.prototype.render = function() {
    return dom.render(ContentItem.HTML_TEXT);
  };

  ContentItem.prototype.onredraw = function() {
    this.redrawBy('x', 'y', 'w', 'h', function(x, y, w, h) {
      dom.translate(this.element(), x / w * 100, y / h * 100);
      dom.css(this.element(), {
        height: (h * 100) + '%',
        width: (w * 100) + '%',
      });
    });

    this.redrawBy('z', function(z) {
      dom.css(this.element(), { zIndex: parseInt(z * 100, 10) });
    });
  };

  ContentItem.HTML_TEXT = [
    '<div class="content-item">',
      '<img class="content-item-image">',
    '</div>',
  ].join('');

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = ContentItem;
  } else {
    app.ContentItem = ContentItem;
  }
})(this.app || (this.app = {}));
