(function(app) {
  'use strict';

  var howler = require('howler');
  var jCore = require('jcore');
  var dom = app.dom || require('../dom.js');
  var Background = app.Background || require('./background.js');
  var Content = app.Content || require('./content.js');
  var Controls = app.Controls || require('./controls.js');
  var Foreground = app.Foreground || require('./foreground.js');

  var Main = jCore.Component.inherits(function() {
    this.medal = '';
    this.sound = new Main.Sound();
    this.history = [];
    this.background = new Background({ element: this.findElement('.background') });
    this.content = new Content({ element: this.findElement('.content') });
    this.foreground = new Foreground({ element: this.findElement('.foreground') });
    this.controls = new Controls({ element: this.findElement('.controls') });
  });

  Main.prototype.scene = function() {
    return Object.create(Object.prototype, {
      load: { value: this.loadSceneWithCallback.bind(this) },
    });
  };

  Main.prototype.load = function() {
    var current = dom.load('current', null);
    if (current) {
      return Promise.all([
        this.loadMedal(current.medal),
        this.loadScene(current.scene),
      ]);
    } else {
      return dom.loadScript('scenes/index.js');
    }
  };

  Main.prototype.loadScene = function(scene) {
    return Promise.all([
      this.content.loadMaterials(scene.materials || []),
      this.content.loadCharacters(scene.characters || []),
      this.sound.load(scene.sound || ''),
    ]).then(function() {
      return Promise.all([
        this.background.change(scene.background || '#ffffff'),
        this.foreground.change.apply(this.foreground, scene.foreground || ['#ffffff', 0]),
        this.content.hideMaterials(),
        this.content.hideCharacters(),
        this.content.showMaterials(),
      ]);
    }.bind(this)).then(function() {
      return this.content.showCharacters();
    }.bind(this)).then(function() {
      return this.controls.loadActions(scene.actions || [], this.medal).then(function() {
        return this.controls.showActions();
      }.bind(this)).then(function() {
        this.controls.enableActions();
      }.bind(this));
    }.bind(this)).then(function() {
      return this.sound.play();
    }.bind(this)).then(function() {
      dom.save('current', {
        medal: this.medal,
        scene: scene,
      });
    }.bind(this));
  };

  Main.prototype.loadSceneWithCallback = function(callback) {
    return this.loadScene(callback(this.history.slice()));
  };

  Main.prototype.loadMedal = function(name) {
    this.medal = name;
    return this.controls.loadMedal(name);
  };

  Main.prototype.oninit = function() {
    this.controls.on('action', this.onaction.bind(this));
    this.controls.on('mute', this.onmute.bind(this));
    this.controls.on('unmute', this.onunmute.bind(this));
    this.sound.mute();
  };

  Main.prototype.onaction = function(name, next) {
    this.history.push(Object.freeze({
      action: name,
      medal: next.medal,
      scene: next.scene,
    }));
    this.controls.disableActions();
    this.controls.playAction(name).then(function() {
      return Promise.all([
        this.controls.hidePlayer(),
        this.controls.hideActions(),
        this.loadMedal(next.medal),
      ]);
    }.bind(this)).then(function() {
      return dom.loadScript('scenes/' + next.scene + '.js');
    });
  };

  Main.prototype.onmute = function() {
    this.sound.mute();
  };

  Main.prototype.onunmute = function() {
    this.sound.unmute();
  };

  Main.Sound = (function() {
    var Sound = function() {
      this.name = '';
      this.howl = null;
    };

    Sound.prototype.load = function(name) {
      if (this.name === name) {
        return Promise.resolve();
      }
      this.name = name;
      return new Promise(function(resolve) {
        if (!this.howl) {
          return resolve();
        }
        this.howl.once('fade', function(){
          this.howl.unload();
          this.howl = null;
          resolve();
        }.bind(this));
        this.howl.fade(1, 0, 1000);
      }.bind(this)).then(function() {
        if (!name) {
          return Promise.resolve();
        }
        return new Promise(function(resolve) {
          this.howl = new howler.Howl({
            src: ['sounds/' + name + '.mp3'],
            loop: true,
          });
          resolve();
        }.bind(this));
      }.bind(this));
    };

    Sound.prototype.play = function() {
      if (!this.howl || this.howl.playing()) {
        return Promise.resolve();
      }
      return new Promise(function(resolve) {
        this.howl.play();
        resolve();
      }.bind(this));
    };

    Sound.prototype.mute = function() {
      howler.Howler.mute(true);
    };

    Sound.prototype.unmute = function() {
      howler.Howler.mute(false);
    };

    return Sound;
  })();

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = Main;
  } else {
    app.Main = Main;
  }
})(this.app || (this.app = {}));
