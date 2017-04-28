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
 * @requires
 *
 * @video
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
    duration: 120,
    window: false,
    bindTo: null
  }
  QPopup._defaultStyle = {
    fontFamily: 'GameFont',
    fontSize: '28px',
    fontStyle: 'normal',
    fill: '#ffffff',
    stroke: 'rgba(0, 0, 0, 0.5)',
    strokeThickness: 4,
    align: 'left'
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
    this.window = null;
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
    var style = this._style;
    var lines = string.split(/\r?\n/);
    var currentY = 0;
    var largestW = 0;
    for (var i = 0; i < lines.length; i++) {
      var lineContainer = new Sprite();
      var currentX = 0;
      var bold = false;
      var italic = false;
      var string = lines[i];
      var regex = /(.*?)<\/?(b|i|icon:(\d+))>/;
      var match = regex.exec(string);
      var originalStyle = style.fontStyle;
      var ran = 0;
      var icon = 0;
      while (match) {
        style.fontStyle = bold ? 'bold ' : style.fontStyle;
        style.fontStyle = italic ? 'italic ' : style.fontStyle;
        string = string.slice(match[0].length, string.length);
        if (match[3] === undefined) {
          var preLine = new PIXI.Text(match[1] || '', style);
        } else {
          var iconIndex = Number(match[3]) || 0;
          var preLine = new Sprite();
          preLine.y -= 16;
          preLine.bitmap = ImageManager.loadSystem('IconSet');
          var sx = iconIndex % 16 * 32;
          var sy = Math.floor(iconIndex / 16) * 32;
          preLine.setFrame(sx, sy, 32, 32);
          icon = 32;
        }
        preLine.x = currentX;
        currentX += preLine.width;
        lineContainer.addChild(preLine);
        bold = /<b>/.test(match[0]) || bold;
        italic = /<i>/.test(match[0]) || italic;
        if (/<\/b>/.test(match[0])) bold = false;
        if (/<\/i>/.test(match[0])) italic = false;
        match = regex.exec(string);
      }
      style.fontStyle = originalStyle;
      var line = new PIXI.Text(string, style);
      line.x = currentX;
      lineContainer.addChild(line);
      currentX += line.width;
      currentY += Math.max(line.height, icon);
      largestW = currentX > largestW ? currentX : largestW;
      lineContainer.width = currentX;
      lineContainer.y = currentY;
      this.addChild(lineContainer);
    }
    var wx = 0;
    var wy = 0;
    for (var i = 0; i < this.children.length; i++) {
      var container = this.children[i];
      var ow = 0;
      if (this._style.align === 'center') {
        ow = largestW / 2 - container.width / 2;
        container.x = ow;
      } else if (this._style.align === 'right') {
        ow = largestW  - container.width;
        container.x = ow;
      }
      wx = wx > container.x ? container.x : wx;
      wy = wy > container.y ? container.y : wy;
    }
    this.width = largestW;
    this.height = currentY;
    if (this._settings.window === true) {
      var windowBg = new Window_Base(wx - 18, wy - 18, this.width + 36, this.height + 36);
      this.addChildAt(windowBg, 0);
    }
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
