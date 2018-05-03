(function(app) {
  'use strict';

  var jCore = require('jcore');
  var helper = app.helper || require('../helper.js');
  var dom = app.dom || require('../dom.js');
  var Action = app.Action || require('./action.js');
  var Button = app.Button || require('./button.js');
  var Medal = app.Medal || require('./medal.js');
  var MuteButton = app.MuteButton || require('./mute-button.js');

  var Controls = jCore.Component.inherits(function() {
    this.actionContainer = new Controls.ActionContainer({ element: this.findElement('.action-container') });
    this.medal = new Medal({ element: this.findElement('.medal') });
    this.muteButton = new MuteButton({ element: this.findElement('.mute-button') });
  });

  Controls.prototype.loadActions = function(actions) {
    return this.actionContainer.load(actions.map(function(action) {
      var item = new Action(action);
      item.on('tap', this.emit.bind(this, 'action', action.name, helper.clone(action.next)));
      return item;
    }.bind(this)));
  };

  Controls.prototype.showActions = function() {
    return this.actionContainer.show();
  };

  Controls.prototype.hideActions = function() {
    return this.actionContainer.hide();
  };

  Controls.prototype.oninit = function() {
    this.muteButton.on('mute', this.emit.bind(this, 'mute'));
    this.muteButton.on('unmute', this.emit.bind(this, 'unmute'));
  };

  Controls.ActionContainer = (function() {
    var ActionContainer = jCore.Component.inherits(function() {
      this.actions = [];
    });

    ActionContainer.prototype.load = function(actions) {
      return new Promise(function(resolve) {
        this.actions.forEach(function(action) {
          action.parentElement(null);
        });
        actions.forEach(function(action) {
          action.parentElement(this.element());
          action.redraw();
        }.bind(this));
        this.actions = actions;
        resolve();
      }.bind(this));
    };

    ActionContainer.prototype.show = function() {
      return new Promise(function(resolve) {
        dom.once(this.element(), 'transitionend', function() {
          resolve();
        }.bind(this));
        dom.css(this.element(), { opacity: 1 });
      }.bind(this));
    };

    ActionContainer.prototype.hide = function() {
      return new Promise(function(resolve) {
        dom.once(this.element(), 'transitionend', function() {
          resolve();
        }.bind(this));
        dom.css(this.element(), { opacity: 0 });
      }.bind(this));
    };

    return ActionContainer;
  })();

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = Controls;
  } else {
    app.Controls = Controls;
  }
})(this.app || (this.app = {}));
