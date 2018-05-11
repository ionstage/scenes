(function(app) {
  'use strict';

  var jCore = require('jcore');
  var helper = app.helper || require('../helper.js');
  var dom = app.dom || require('../dom.js');
  var Action = app.Action || require('./action.js');
  var Medal = app.Medal || require('./medal.js');
  var MuteButton = app.MuteButton || require('./mute-button.js');

  var Controls = jCore.Component.inherits(function() {
    this.actionContainer = new Controls.ActionContainer({ element: this.findElement('.action-container') });
    this.medal = new Medal({ element: this.findElement('.medal') });
    this.playerContainer = new Controls.PlayerContainer({ element: this.findElement('.player-container') });
    this.muteButton = new MuteButton({ element: this.findElement('.mute-button') });
  });

  Controls.prototype.loadActions = function(actions, character) {
    return this.actionContainer.load(actions.map(function(action) {
      var item = new Action({
        type: (action.next.character === character ? 'amber' : 'pink'),
        x: action.x,
        y: action.y,
      });
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

  Controls.prototype.enableActions = function() {
    this.actionContainer.enable();
  };

  Controls.prototype.disableActions = function() {
    this.actionContainer.disable();
  };

  Controls.prototype.playAction = function(name) {
    return this.playerContainer.play(name);
  };

  Controls.prototype.hidePlayer = function() {
    return this.playerContainer.hide();
  };

  Controls.prototype.loadMedal = function(name) {
    return this.medal.change(name);
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
          action.removeAllListeners();
          action.parentElement(null);
          action.redraw();
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

    ActionContainer.prototype.enable = function() {
      dom.css(this.element(), { 'pointer-events': 'auto' });
    };

    ActionContainer.prototype.disable = function() {
      dom.css(this.element(), { 'pointer-events': 'none' });
    };

    return ActionContainer;
  })();

  Controls.PlayerContainer = (function() {
    var PlayerContainer = jCore.Component.inherits();

    PlayerContainer.prototype.playerElement = function() {
      return this.findElement('.player');
    };

    PlayerContainer.prototype.playerContentWindow = function() {
      return dom.contentWindow(this.playerElement());
    };

    PlayerContainer.prototype.play = function(name) {
      return this.show().then(function() {
        return new Promise(function(resolve) {
          var src = 'actions/' + name + '.html';
          dom.once(this.playerElement(), 'load', function() {
            dom.once(this.playerContentWindow(), 'message', function() {
              resolve();
            }.bind(this));
          }.bind(this));
          dom.replace(this.playerElement(), src);
        }.bind(this));
      }.bind(this));
    };

    PlayerContainer.prototype.show = function() {
      return new Promise(function(resolve) {
        dom.once(this.element(), 'transitionend', function() {
          resolve();
        }.bind(this));
        dom.css(this.element(), {
          opacity: 1,
          visibility: 'visible',
        });
      }.bind(this));
    };

    PlayerContainer.prototype.hide = function() {
      return new Promise(function(resolve) {
        dom.once(this.element(), 'transitionend', function() {
          dom.css(this.element(), { visibility: 'hidden' });
          resolve();
        }.bind(this));
        dom.css(this.element(), { opacity: 0 });
      }.bind(this)).then(function() {
        dom.replace(this.playerElement(), 'about:blank');
      }.bind(this));
    };

    return PlayerContainer;
  })();

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = Controls;
  } else {
    app.Controls = Controls;
  }
})(this.app || (this.app = {}));
