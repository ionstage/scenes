(function(app) {
  'use strict';

  var jCore = require('jcore');
  var ContentItem = app.ContentItem || require('./content-item.js');

  var Content = jCore.Component.inherits(function() {
    this.materials = [];
    this.previousMaterials = [];
  });

  Content.prototype.loadMaterials = function(materials) {
    return Promise.all(materials.map(function(material) {
      var url = 'images/materials/' + material.name + '.svg';
      return new ContentItem(material).load(url);
    })).then(function(items) {
      this.previousMaterials = this.materials;
      this.materials = items;
    }.bind(this));
  };

  Content.prototype.showMaterials = function() {
    return Promise.all([
      Promise.all(this.previousMaterials.map(function(item) {
        return item.hide().then(function() {
          item.parentElement(null);
        });
      })),
      Promise.all(this.materials.map(function(item) {
        item.parentElement(this.element());
        item.redraw();
        return item;
      }.bind(this))).then(function(items) {
        return new Promise(function(resolve) {
          setTimeout(function() {
            resolve();
          }, 1000 / 15);
        }).then(function() {
          return Promise.all(items.map(function(item) {
            return item.show();
          }));
        });
      }),
    ]);
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = Content;
  } else {
    app.Content = Content;
  }
})(this.app || (this.app = {}));
