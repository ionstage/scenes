(function(app) {
  'use strict';

  var jCore = require('jcore');
  var ContentItem = app.ContentItem || require('./content-item.js');

  var Content = jCore.Component.inherits(function() {
    this.materials = [];
    this.previousMaterials = [];
    this.characters = [];
    this.previousCharacters = [];
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
    return this.showItems(this.materials);
  };

  Content.prototype.hideMaterials = function() {
    return this.hideItems(this.previousMaterials);
  };

  Content.prototype.loadCharacters = function(characters) {
    return Promise.all(characters.map(function(character) {
      var url = 'images/characters/' + character.name + '.svg';
      return new ContentItem(character).load(url);
    })).then(function(items) {
      this.previousCharacters = this.characters;
      this.characters = items;
    }.bind(this));
  };

  Content.prototype.showCharacters = function() {
    return this.showItems(this.characters);
  };

  Content.prototype.hideCharacters = function() {
    return this.hideItems(this.previousCharacters);
  };

  Content.prototype.showItems = function(items) {
    return Promise.all(items.map(function(item) {
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
    });
  };

  Content.prototype.hideItems = function(items) {
    return Promise.all(items.map(function(item) {
      return item.hide().then(function() {
        item.parentElement(null);
      });
    }));
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = Content;
  } else {
    app.Content = Content;
  }
})(this.app || (this.app = {}));
