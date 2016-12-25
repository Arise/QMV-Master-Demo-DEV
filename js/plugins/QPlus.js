//=============================================================================
// QPlus
//=============================================================================

var Imported = Imported || {};
Imported.QPlus = '1.0.0';

//=============================================================================
 /*:
 * @plugindesc <QPlus> (Should go above all Q Plugins)
 * Some small changes to MV for easier plugin development.
 * @author Quxios  | Version 1.0.0
 *
 * @param Quick Test
 * @desc Enable quick testing.
 * Set to true or false
 * @default true
 *
 * @param Default Enabled Switches
 * @desc Turns on a list of switches on by default
 * Each switch should be seperated by a comma.
 * @default
 *
 */
//=============================================================================

//=============================================================================
// QPlus Static Class

function QPlus() {
 throw new Error('This is a static class');
}

QPlus.getParams = function(id) {
  return $plugins.filter(function(p) {
    return p.description.contains(id) && p.status
  })[0].parameters;
};

QPlus.versionCheck = function(version, targetVersion) {
  version = version.split('.').map(Number);
  targetVersion = version.split('.').map(Number);
  if (version[0] < targetVersion[0]) return false;
  if (version[1] < targetVersion[1]) return false;
  if (version[2] < targetVersion[2]) return false;
  return true;
};

QPlus.getArg = function(args, regex) {
  var arg = null;
  for (var i = 0; i < args.length; i++) {
    var match = regex.exec(args[i]);
    if (match) {
      if (match.length === 1) {
        arg = true;
      } else {
        arg = match[match.length - 1];
      }
      break;
    }
  }
  return arg;
};

QPlus.getCharacter = function(string) {
  string = string.toLowerCase();
  if (/^[0-9]+$/.test(string)) {
    var id = Number(string);
    return id === 0 ? $gamePlayer : $gameMap.event(id);
  } else if (/^(player|p)$/.test(string)) {
    return $gamePlayer;
  } else {
    var isEvent = /^(event|e)([0-9]+)$/.exec(string);
    if (isEvent) {
      var eventId = Number(isEvent[2]);
      return eventId > 0 ? $gameMap.event(eventId) : null;
    }
    return null;
  }
};

QPlus.stringToObj = function(string) {
  var lines = string.split('\n');
  var obj = {};
  lines.forEach(function(value) {
    var match = /^(.*):(.*)/.exec(value);
    if (match) {
      var key, newKey = match[1].trim();
      if (obj.hasOwnProperty(key)) {
        var i = 1;
        while (obj.hasOwnProperty(newKey)) {
          newKey = key + String(i);
          i++;
        }
      }
      obj[newKey] = QPlus.stringToAry(match[2], true);
    }
  })
  return obj;
};

QPlus.stringToAry = function(string, returnString) {
  var arr = string.split(',').map(function(s) {
    s = s.trim();
    if (/^-?\d+\.?\d*$/.test(s)) return Number(s);
    if (s === "true") return true;
    if (s === "false") return false;
    if (s === "null" || s === "") return null;
    return s;
  })
  if (returnString && arr.length === 1) return arr[0];
  return arr;
};

QPlus.pointToIndex = function(point, maxCols, maxRows) {
  if (point.x >= maxCols) return -1;
  if (maxRows && point.y >= maxRows) return -1;
  var index = (point.x + point.y * (maxCols));
  return index + ((maxCols * maxRows) * point.z);
};

QPlus.indexToPoint = function(index, maxCols, maxRows) {
  if (index < 0) return new Point(-1, -1);
  var x = index % maxCols;
  var y = Math.floor(index / maxCols);
  var z = 0;
  if (maxRows && index >= maxCols * maxRows) {
    z = Math.floor(index / (maxCols * maxRows));
    y -= maxRows * z;
  }
  return new Point(x, y, z);
};

//=============================================================================
// QPlus edits to existing classes

(function() {
  //-----------------------------------------------------------------------------
  // Get QPlus params

  var _params    = QPlus.getParams('<QPlus>');
  var _quickTest = _params['Quick Test'].toLowerCase() == 'true';
  var _switches  = _params['Default Enabled Switches'].split(',').map(Number);

  //-----------------------------------------------------------------------------
  // Math

  Math.randomIntBetween = function(min, max) {
    if (min.constructor === Array) {
      max = Math.floor(min[1]);
      min = Math.ceil(min[0]);
    } else {
      min = Math.ceil(min);
      max = Math.floor(max);
    }
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  //-----------------------------------------------------------------------------
  // Point

  Point.prototype.initialize = function(x, y, z) {
    PIXI.Point.call(this, x, y);
    this.z = z || 0;
  };

  Point.prototype.clone = function() {
    return new Point(this.x, this.y, this.z);
  };

  Point.prototype.copy = function(p) {
    this.set(p.x, p.y, p.z);
  };

  Point.prototype.equals = function(p) {
    return (p.x === this.x) && (p.y === this.y) && (p.z === this.z);
  }

  Point.prototype.set = function(x, y, z) {
    this.x = x || 0;
    this.y = y || ((y !== 0) ? this.x : 0);
    this.z = z || 0;
  }

  //-----------------------------------------------------------------------------
  // Scene_Boot

  var Alias_Scene_Boot_start = Scene_Boot.prototype.start;
  Scene_Boot.prototype.start = function() {
    if (DataManager.isBattleTest() || DataManager.isEventTest()) {
      Alias_Scene_Boot_start.call(this);
    } else if (_quickTest && Utils.isOptionValid('test')) {
      Scene_Base.prototype.start.call(this);
      SoundManager.preloadImportantSounds();
      this.checkPlayerLocation();
      DataManager.setupNewGame();
      for (var i = 0; i < _switches.length; i++) {
        $gameSwitches.setValue(_switches[i], true);
      }
      SceneManager.goto(Scene_Map);
      this.updateDocumentTitle();
    } else {
      Alias_Scene_Boot_start.call(this);
    }
  };

  //-----------------------------------------------------------------------------
  // Game_Interpreter
  //
  // The interpreter for running event commands.

  var Alias_Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
  Game_Interpreter.prototype.pluginCommand = function(command, args) {
    if (command.toLowerCase() === 'wait') {
      var min  = Number(args[0]);
      var max  = Number(args[1]);
      if (!max) {
        max = min;
        min = 0;
      }
      var wait = Math.randomIntBetween(min, max);
      this.wait(wait);
      return;
    }
    if (command.toLowerCase() === 'globallock') {
      var level  = Number(args[0]);
      var args2  = args.slice(1);
      var charas = args2.map(QPlus.getCharacter);
      var only = args2.contains('only');
      var mode = only ? 1 : 0;
      $gameMap.globalLock(charas, mode, level);
      return;
    }
    Alias_Game_Interpreter_pluginCommand.call(this, command, args);
  };

  //-----------------------------------------------------------------------------
  // Game_Map
  //
  // The game object class for a map. It contains scrolling and passage
  // determination functions.

  /**
   * @param  {arr} charas
   *               array of characters
   * @param  {int} mode
   *               0 - ignore characters in charas arr
   *               1 - only apply to charas in charas arr
   * @param  {int} level
   *               0 - clear lock
   *               1 - lock movement
   *               2 - lock movement and character animation
   */
  Game_Map.prototype.globalLock = function(charas, mode, level) {
    charas = charas || [];
    mode   = mode  === undefined ? 0 : mode;
    level  = level === undefined ? 1 : level;
    if (mode === 0) {
      $gamePlayer._globalLocked = !charas.contains($gamePlayer) ? level : 0;
      this.events().forEach(function(event) {
        if (ignore.contains(event)) return;
        event._globalLocked = level;
      })
    } else {
      charas.forEach(function(chara) {
        if (chara) {
          chara._globalLocked = level;
        }
      })
    }
  };

  // kept for backwars compatibility
  Game_Map.prototype.globalUnlock = function(charas) {
    this.globalLock(charas, 0, 0);
  };

  //-----------------------------------------------------------------------------
  // Game_CharacterBase

  var Alias_Game_CharacterBase_initMembers = Game_CharacterBase.prototype.initMembers;
  Game_CharacterBase.prototype.initMembers = function() {
    Alias_Game_CharacterBase_initMembers.call(this);
    this._globalLocked = 0;
    this._comments = "";
  };

  var Alias_Game_CharacterBase_updateAnimation = Game_CharacterBase.prototype.updateAnimation;
  Game_CharacterBase.prototype.updateAnimation = function() {
    if (this._globalLocked >= 2) {
      return;
    }
    Alias_Game_CharacterBase_updateAnimation.call(this);
  };

  var Alias_Game_CharacterBase_updateMove = Game_CharacterBase.prototype.updateMove;
  Game_CharacterBase.prototype.updateMove = function() {
    if (this._globalLocked >= 1) {
      return;
    }
    Alias_Game_CharacterBase_updateMove.call(this);
  };

  /**
   * east is 0, north is 90, west is 180 and south is 270
   */
  Game_CharacterBase.prototype.directionToRadian = function(dir) {
    dir = dir || this._direction;
    if (dir === 2) return Math.PI * 3 / 2;
    if (dir === 4) return Math.PI;
    if (dir === 6) return 0;
    if (dir === 8) return Math.PI / 2;
    if (dir === 1) return Math.PI * 5 / 4;
    if (dir === 3) return Math.PI * 7 / 2;
    if (dir === 7) return Math.PI * 3 / 4;
    if (dir === 9) return Math.PI / 4;
    return 0;
  };

  Game_CharacterBase.prototype.radianToDirection = function(radian, useDiag) {
    if (useDiag) {
      if (radian >= Math.PI / 6 && radian < Math.PI / 3) {
        return 9;
      } else if (radian >= Math.PI * 2 / 3 && radian < Math.PI * 5 / 6) {
        return 7;
      } else if (radian >= Math.PI * 7 / 6 && radian < Math.PI * 4 / 3) {
        return 1;
      } else if (radian >= Math.PI * 5 / 3 && radian < Math.PI * 11 / 6) {
        return 3;
      }
    }
    if (radian >= 0 && radian < Math.PI / 4) {
      return 6;
    } else if (radian >= Math.PI / 4 && radian < 3 * Math.PI / 4) {
      return 8;
    } else if (radian >= Math.PI * 3 / 4 && radian < Math.PI * 5 / 4) {
      return 4;
    } else if (radian >= Math.PI * 5 / 4 && radian < Math.PI * 7 / 4) {
      return 2;
    } else if (radian >= Math.PI * 7 / 4) {
      return 6;
    }
  };

  var Alias_Game_Character_updateRoutineMove = Game_Character.prototype.updateRoutineMove;
  Game_Character.prototype.updateRoutineMove = function() {
    if (this._globalLocked >= 1) {
      return;
    }
    Alias_Game_Character_updateRoutineMove.call(this);
  };

  //-----------------------------------------------------------------------------
  // Game_Player

  var Alias_Game_Player_canMove = Game_Player.prototype.canMove;
  Game_Player.prototype.canMove = function() {
    return Alias_Game_Player_canMove.call(this) && this._globalLocked === 0;
  };

  //-----------------------------------------------------------------------------
  // Game_Event

  Game_Event.prototype.comments = function() {
    if (this._comments === null) {
      this.setupComments();
    }
    return this._comments;
  };

  Game_Event.prototype.setupComments = function() {
    if (!this.page() || !this.list()) {
      this._comments = "";
    } else {
      this._comments = this.list().filter(function(list) {
        return list.code === 108 || list.code === 408;
      }).map(function(list) {
        return list.parameters;
      }).join('\n')
    }
  };

  var Alias_Game_Event_clearPageSettings = Game_Event.prototype.clearPageSettings;
  Game_Event.prototype.clearPageSettings = function() {
    Alias_Game_Event_clearPageSettings.call(this);
    this._comments = "";
  };

  var Alias_Game_Event_setupPageSettings = Game_Event.prototype.setupPageSettings;
  Game_Event.prototype.setupPageSettings = function() {
    Alias_Game_Event_setupPageSettings.call(this);
    this.setupComments();
  };
})()
