//=============================================================================
// QPopup
//=============================================================================

var Imported = Imported || {};
Imported.QPopup = '1.0.0';

if (!Imported.QPlus || !QPlus.versionCheck(Imported.QPlus, '1.2.2')) {
  alert('Error: QPopup requires QPlus 1.2.2 or newer to work.');
  throw new Error('Error: QPopup requires QPlus 1.2.2 or newer to work.');
}

//=============================================================================
 /*:
 * @plugindesc <QPopup>
 * desc
 * @author Quxios  | Version 1.0.0
 *
 * @requires QPlus
 *
 * @development
 *
 * @param
 * @desc
 * @default
 *
 * @param ===========
 * @desc spacer
 * @default
 *
 * @help
 * ============================================================================
 * ## About
 * ============================================================================
 *
 * ============================================================================
 * ## How to use
 * ============================================================================
 *
 * ----------------------------------------------------------------------------
 * **Sub section**
 * ----------------------------------------------------------------------------
 *
 * ============================================================================
 * ## Links
 * ============================================================================
 * RPGMakerWebs:
 *
 *  http://forums.rpgmakerweb.com/index.php?threads/qplugins.73023/
 *
 * Terms of use:
 *
 *  https://github.com/quxios/QMV-Master-Demo/blob/master/readme.md
 *
 * Like my plugins? Support me on Patreon!
 *
 *  https://www.patreon.com/quxios
 *
 * @tags
 */
//=============================================================================

//=============================================================================
// QPopup Static Class

function QPopup() {
  throw new Error('This is a static class');
}

//=============================================================================
// New Classes

function Sprite_QPopup() {
  this.initialize.apply(this, arguments);
}

//=============================================================================
// QPopup

(function() {
  var _PARAMS = QPlus.getParams('<QPopup>');

  //-----------------------------------------------------------------------------
  // QPopup

  QPopup._popups = {};
  QPopup._mapId = -1;
  QPopup._defaultOptions = {
    id: '*',
    x: 0, y: 0, ox: 0, oy: 0,
    string: '',
    isNotification: false
  }
  QPopup._defaultSettings = {
    bindTo: null,
    duration: 120,
    transitions: []
  }
  QPopup._defaultStyle = {
    fontFace: 'GameFont',
    fontSize: 28,
    color: '#ffffff',
    padding: 18,
    window: false
  }

  QPopup.start = function(options) {
    options = Object.assign({}, this._defaultOptions, options);
    options.settings = Object.assign({}, this._defaultSettings, options.settings);
    options.style = Object.assign({}, this._defaultStyle, options.style);
    if (options.id === '*') {
      options.id = this.getUniqueQPopupId();
    }
    var popup = new Sprite_QPopup(options);
    this.add(popup);
  };

  QPopup.getUniqueQPopupId = function() {
    var id = '*0';
    var counter = 0;
    var newId = false;
    while(!newId) {
      if (this._popups.length === 0) {
        newId = true;
        break;
      }
      counter++;
      id = '*' + counter;
      var j = 0;
      for (var i = 0; i < this._popups.length; i++) {
        if (this._popups[i].id !== id) {
          j++;
        }
      }
      newId = j === i;
    }
    return id;
  };

  QPopup.add = function(popup) {
    if (popup.constructor !== Sprite_QPopup) return;
    if (this._popups[popup.id]) this.remove(this._popups[popup.id]);
    this._popups[popup.id] = popup;
    var scene = SceneManager._scene;
    if (scene.constructor !== Scene_Map) {
      scene.addChild(popup);
    } else {
      scene._spriteset._tilemap.addChild(popup);
    }
  };

  QPopup.remove = function(popup) {
    if (typeof popup === 'string') {
      popup = this._popups[popup];
      if (popup === null) return;
    }
    if (popup.constructor !== Sprite_QPopup) return;
    var scene = SceneManager._scene;
    delete this._popups[popup.id];
    if (scene.constructor !== Scene_Map) {
      scene.removeChild(popup);
    } else {
      scene._spriteset._tilemap.removeChild(popup);
    }
  };

  //-----------------------------------------------------------------------------
  // Game_Interpreter

  var Alias_Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
  Game_Interpreter.prototype.pluginCommand = function(command, args) {
    if (command.toLowerCase() === 'qplugin') {
      this.qPluginCommand(args);
      return;
    }
    Alias_Game_Interpreter_pluginCommand.call(this, command, args);
  };

  Game_Interpreter.prototype.qPluginCommand = function(args) {
    //var args2 = args.slice(2);
    //QPlus.getCharacter(args[0]);
    //QPlus.getArg(args2, /lock/i)
  };

  //-----------------------------------------------------------------------------
  // Game_Map

  var Alias_Game_Map_setup = Game_Map.prototype.setup;
  Game_Map.prototype.setup = function(mapId) {
    Alias_Game_Map_setup.call(this, mapId);
    if (mapId !== QPopup._mapId) {
      QPopup._mapId = mapId;
      QPopup._popups = [];
    }
  };

  //-----------------------------------------------------------------------------
  // Sprite_QPopup

  Sprite_QPopup.prototype = Object.create(Sprite.prototype);
  Sprite_QPopup.prototype.constructor = Sprite_QPopup;

  Sprite_QPopup.prototype.initialize = function(options) {
    Sprite.prototype.initialize.call(this);
    this.bitmap = new Bitmap(0, 0);
    this.realX = this.x = options.x - options.ox;
    this.realY = this.y = options.y - options.oy;
    this.id = options.id;
    this.z = 9;
    this._ox = 0;
    this._oy = 0;
    this.anchor.x = 0.5;
    this.anchor.y = 1;
    this.duration = 0;
    this._timeline = {};
    this._isNotification = options.isNotification;
    this._style = options.style;
    this._settings = options.settings;
    this.formatString(options.string);
    this.formatTransitions();
  };

  Object.defineProperty(Sprite_QPopup.prototype, 'realX', {
    get: function() {
      return this._realX + this._ox;
    },
    set: function(value) {
      this._realX = value;
    },
    configurable: true
  });

  Object.defineProperty(Sprite_QPopup.prototype, 'realY', {
    get: function() {
      return this._realY + this._oy;
    },
    set: function(value) {
      this._realY = value;
    },
    configurable: true
  });

  Sprite_QPopup.prototype.formatString = function(string) {
    this._base = new Window_Base(-18, -18, 0, 0);
    this._base.normalColor = function() {
      return this._style.color;
    }.bind(this)
    this._base.standardFontFace = function() {
      return this._style.fontFace
    }.bind(this)
    this._base.standardFontSize = function() {
      return this._style.fontSize
    }.bind(this)
    this._base.standardPadding = function() {
      return this._style.padding;
    }.bind(this)
    this._base.resetFontSettings();
    this._base.updatePadding();
    if (!this._style.window) {
      this._base.opacity = 0;
    }
    var lines = string.split(/\n|\r/);
    var largestW = 0;
    for (var i = 0; i < lines.length; i++) {
      var w = this._base.contents.measureTextWidth(lines[i]);
      if (w > largestW) largestW = w;
    }
    this._base.width = largestW + this._base.standardPadding() * 2;
    this._base.height = this._base.calcTextHeight({
      text: string,
      index: 0
    }, true) + this._base.standardPadding() * 2;
    this._base.createContents();
    this._base.drawTextEx(string, 0, 0);
    this.addChild(this._base);
  };

  Sprite_QPopup.prototype.formatTransitions = function() {
    var transitions = this._settings.transitions;
    for (var i = 0; i < transitions.length; i++) {
      var params = transitions[i].split(' ');
      var transition = params[2] + ' ' + params[1] +  ' ';
      var j;
      for (j = 3; j < params.length; j++) {
        transition += params[j];
        if (j !== params.length - 1) {
          transition += ' ';
        }
      }
      var startTime = Number(params[0]);
      var totalTime = Number(params[1]);
      for (j = 0; j < totalTime; j++) {
        if (!this._timeline[startTime + j]) {
          this._timeline[startTime + j] = [];
        }
        this._timeline[startTime + j].push(transition);
      }
    }
  };

  Sprite_QPopup.prototype.update = function() {
    Sprite.prototype.update.call(this);
    if (!this._settings) return;
    if (this._settings.bindTo !== null) {
      var chara = QPlus.getCharacter(this._settings.bindTo);
      if (chara) {
        var x = chara.x * $gameMap.tileWidth();
        x +=  $gameMap.tileWidth() / 2;
        var y = chara.y * $gameMap.tileHeight();
        this.realX = x;
        this.realY = y;
      }
    }
    if (!this._isNotification) {
      this.x = this.realX;
      this.x -= $gameMap.displayX() * $gameMap.tileWidth();
      this.y = this.realY;
      this.y -= $gameMap.displayY() * $gameMap.tileHeight();
    }
    this.updateTransition();
    if (this.isPlaying()) {
      this.duration++;
    } else {
      QPopup.remove(this);
    }
  };

  Sprite_QPopup.prototype.updateTransition = function() {
    var currentFrame = this._timeline[this.duration];
    if (currentFrame) {
      for (var i = 0; i < currentFrame.length; i++) {
        this.processAction(currentFrame[i].split(' '));
      }
    }
  };

  Sprite_QPopup.prototype.processAction = function(action) {
    switch (action[0].toLowerCase()) {
      case 'slideup':
        this.slideup(action);
        break;
      case 'slidedown':
        this.slidedown(action);
        break;
      case 'fadein':
        this.fadein(action);
        break;
      case 'fadeout':
        this.fadeout(action);
        break;
    }
  };

  Sprite_QPopup.prototype.slideup = function(action) {
    var duration = Number(action[1]);
    var distance = Number(action[2]);
    var speed = distance / duration;
    this._oy -= speed;
  };

  Sprite_QPopup.prototype.slidedown = function(action) {
    var duration = Number(action[1]);
    var distance = Number(action[2]);
    var speed = distance / duration;
    this._oy += speed;
  };

  Sprite_QPopup.prototype.fadeout = function(action) {
    var duration = Number(action[1]);
    var speed = 255 / duration;
    if (this.opacity > 0) {
      this.opacity -= speed;
    }
  };

  Sprite_QPopup.prototype.fadein = function(action) {
    var duration = Number(action[1]);
    var speed = 255 / duration;
    if (this.opacity < 255) {
      this.opacity += speed;
    }
  };

  Sprite_QPopup.prototype.isPlaying = function() {
    if (this._settings.duration === -1) return true;
    return this.duration < this._settings.duration;
  };
})()
