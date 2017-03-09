//=============================================================================
// QPathfind
//=============================================================================

var Imported = Imported || {};
Imported.QPathfind = '1.1.0';

if (!Imported.QPlus) {
  var msg = 'Error: QPathfind requires QPlus to work.';
  alert(msg);
  throw new Error(msg);
} else if (!QPlus.versionCheck(Imported.QPlus, '1.1.3')) {
  var msg = 'Error: QName requires QPlus 1.1.3 or newer to work.';
  alert(msg);
  throw new Error(msg);
}

//=============================================================================
 /*:
 * @plugindesc <QPathfind>
 * A* Pathfinding algorithm
 * @author Quxios  | Version 1.1.0
 *
 * @requires QPlus
 *
 * @video
 *
 * @param Diagonals
 * @desc Set to true to enable diagonals in the route
 * Set to false to disable diagonals
 * @default false
 *
 * @param Intervals
 * @desc Set to the number of calculations per frame
 * Higher value will calculate faster but can lower frames
 * @default 100
 *
 * @param Smart Wait
 * @desc How long should the pathfind smart 2 wait until it tries again.
 * Default: 60
 * @default 60
 *
 * @param =============
 * @desc Spacer
 * @default
 *
 * @param Half Opt
 * @desc (Only for QMovement) Uses half the value from Optimize Move Tiles.
 * Slightly increases pathfinding accuracy.
 * @default true
 *
 * @help
 * ============================================================================
 * ## About
 * ============================================================================
 * This plugin will calculate a path for a character to take to reach a target
 * position. You can also use this plugin to make a character chase a target.
 * ============================================================================
 * ## How to use
 * ============================================================================
 * **Pathfind**
 * ----------------------------------------------------------------------------
 * To start a pathfind, you need to use a plugin command:
 * ~~~
 *  qPathfind [CHARAID] [list of options]
 * ~~~
 * CHARAID - The character identifier.
 *
 *  - For player: 0, p, or player
 *  - For events: EVENTID, eEVENTID, eventEVENTID or this for the event that called this
 *  (replace EVENTID with a number)
 *
 * Possible options:
 *  - xX     - where X is the x position in grid terms
 *  - yY     - where Y is the y position in grid terms
 *  - pxX    - where X is the x position in pixel terms (QMovement only)
 *  - pyY    - where Y is the y position in pixel terms (QMovement only)
 *  - smartX - where X is 1 or 2.
 *   When 1, pathfind will recalculate when its path is blocked
 *   When 2, pathfind will also recalucate at a set interval
 *  - wait   - the event that called this will wait until the pathfind is complete
 * ----------------------------------------------------------------------------
 * **Pathfind Towards**
 * ----------------------------------------------------------------------------
 * To start a pathfind towards a character, you need to use a plugin command:
 * ~~~
 *  qPathfind [CHARAID] towards [TARGETCHARAID] [list of options]
 * ~~~
 * CHARAID - The character identifier.
 *
 *  - For player: 0, p, or player
 *  - For events: EVENTID, eEVENTID, eventEVENTID or this for the event that called this
 *  (replace EVENTID with a number)
 *
 * TARGETCHARAID - The CharaID of who you want the CHARAID to move towards
 *
 * Possible options:
 *  - xX     - where X is the x position in grid terms
 *  - yY     - where Y is the y position in grid terms
 *  - pxX    - where X is the x position in pixel terms (QMovement only)
 *  - pyY    - where Y is the y position in pixel terms (QMovement only)
 *  - smartX - where X is 1 or 2.
 *   When 1, pathfind will recalculate when its path is blocked
 *   When 2, pathfind will also recalucate at a set interval
 *  - wait   - the event that called this will wait until the pathfind is complete
 * ----------------------------------------------------------------------------
 * **Chase**
 * ----------------------------------------------------------------------------
 * To start a chase, use the plugin command:
 * ~~~
 *  qPathfind [CHARAID] chase [TARGETCHARAID]
 * ~~~
 * CHARAID - The character identifier.
 *
 *  - For player: 0, p, or player
 *  - For events: EVENTID, eEVENTID, eventEVENTID or this for the event that called this
 *  (replace EVENTID with a number)
 *
 * TARGETCHARAID - The CharaID of who you want the CHARAID to chase
 *
 * * Chasing ends when event page changes.
 * * To force end a chase, you'll need to clear it.
 * ----------------------------------------------------------------------------
 * **Clear / End Pathfind**
 * ----------------------------------------------------------------------------
 * If you need to end a pathfind early, for example to end a chase. Then use
 * the plugin command:
 * ~~~
 *  qPathfind [CHARAID] clear
 * ~~~
 * CHARAID - The character identifier.
 *
 *  - For player: 0, p, or player
 *  - For events: EVENTID, eEVENTID, eventEVENTID or this for the event that called this
 *  (replace EVENTID with a number)
 * ----------------------------------------------------------------------------
 * **Examples**
 * ----------------------------------------------------------------------------
 * Make the player pathfind to 5, 1. With no smart
 * ~~~
 *  qPathfind 0 x5 y1
 *  qPathfind p x5 y1
 *  qPathfind player x5 y1
 * ~~~
 * (Note: All 3 are the same, just using a different character id method)
 *
 * Make the player pathfind to 2, 4. With smart 1
 * ~~~
 *  qPathfind 0 x2 y4 smart1
 *  qPathfind p x2 y4 smart1
 *  qPathfind player x2 y4 smart1
 * ~~~
 *
 * Make the event 1 pathfind to 2, 4. With a wait
 * ~~~
 *  qPathfind 1 x2 y4 wait
 *  qPathfind e1 x2 y4 wait
 *  qPathfind event1 x2 y4 wait
 * ~~~
 *
 * Make the event 1 chase player
 * ~~~
 *  qPathfind 1 chase 0
 *  qPathfind e1 chase p
 *  qPathfind event1 chase player1
 * ~~~
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
 * @tags pathfind, chase, character, map
 */
//=============================================================================


//=============================================================================
// QPathfind

function QPathfind() {
  this.initialize.apply(this, arguments);
}

(function() {
  var _params = QPlus.getParams('<QPathfind>');

  var _diagonals = _params['Diagonals'] === 'true';
  var _intervals = Number(_params['Intervals']);
  var _smartWait = Number(_params['Smart Wait']);
  var _halfOpt = _params['Half Opt'] === 'true';
  var _defaultOptions = {
    smart: 0, // 0 no smart, 1 recalc on blocked, 2 recalc at intervals
    chase: null, // charaID of character it's chasing
    breakable: false, // moving with input breaks pathfind
    earlyEnd: true, // end early if final point isn't passable
    adjustEnd: false, // adjust end point if not passable
    towards: false // a short A*, returns first 2 steps (similar to Game_Character.prototype.findDirectionTo)
  }
  // value to use to offset smart ticker when target is far away
  // when target is far away no need to calc as often, so we slow it down with offset
  var _smartOT = 300;

  //-----------------------------------------------------------------------------
  // QPathfind
  // Life Cycle:
  // Game_Character.initPathfind >
  // QPathfind.initialize > QPathfind.initMembers > Qpathfind.beforeStart
  // QPathfind.update > QPathfind.aStar
  // if path found:
  //   QPathfind.onComplete > Game_Character.startPathfind
  //   when character completes route:
  //     Game_Character.onPathfindComplete
  // if path wasn't found
  //   QPathfind.onFail > Game_Character.clearPathfind

  QPathfind.prototype.initialize = function(charaId, endPoint, options) {
    this.initMembers(charaId, endPoint, options);
    this.beforeStart();
    this.update();
  };

  QPathfind.prototype.initMembers = function(charaId, endPoint, options) {
    this.options = options;
    this.options.smart = this.options.smart === undefined ? _defaultOptions.smart : this.options.smart;
    this.options.chase = this.options.chase === undefined ? _defaultOptions.chase : this.options.chase;
    this.options.breakable = this.options.breakable === undefined ? _defaultOptions.breakable : this.options.breakable;
    this.options.earlyEnd  = this.options.earlyEnd === undefined ? _defaultOptions.earlyEnd : this.options.earlyEnd;
    this.options.adjustEnd = this.options.adjustEnd === undefined ? _defaultOptions.adjustEnd : this.options.adjustEnd;
    this.options.towards   = this.options.towards === undefined ? _defaultOptions.towards : this.options.towards;
    if (this.options.towards) {
      this.options.earlyEnd = false;
      this.options.adjustEnd = false;
    }
    if (options.chase !== null) {
      var chasing = QPlus.getCharacter(options.chase);
      if (Imported.QMovement) {
        endPoint = new Point(chasing.px, chasing.py);
      } else {
        endPoint = new Point(chasing.x, chasing.y);
      }
    }
    this._charaId = charaId;
    var startPoint;
    if (Imported.QMovement) {
      this._mapWidth = $gameMap.width() * QMovement.tileSize;
      startPoint = new Point(this.character().px, this.character().py);
    } else {
      this._mapWidth = $gameMap.width();
      startPoint = new Point(this.character().x, this.character().y);
    }
    this._startNode = this.node(null, startPoint);
    this._startNode.visited = true;
    this._endNode = this.node(null, endPoint);
    this._openNodes = [this._startNode];
    this._grid = {};
    this._grid[this._startNode.value] = this._startNode;
    this._closed = {};
    this._current = null;
    this._completed = false;
    this._tick = 0;
    if (this.options.smart > 1) {
      // TODO smart wait should probably be calculated
      // based on how many pathfinders there are
      // The random is to try to have pathfinders run at different frames
      // inorder to stretch the performance on multiple frames instead of on the same frames
      this._smartTime = _smartWait + Math.randomIntBetween(0, 10);
    }
    this._intervals = _intervals;
  };

  QPathfind.prototype.beforeStart = function() {
    var x = this._endNode.x;
    var y = this._endNode.y;
    var canPass = true;
    if (Imported.QMovement) {
      canPass = this.character().canPixelPass(x, y, 5, null, '_pathfind');
    } else {
      canPass = this.character().canPass(x, y, 5);
    }
    if (!canPass && !this.options.chase && this.options.adjustEnd) {
      canPass = true;
      if (!this.adjustEndNode()) {
        canPass = false;
      }
    }
    if (!canPass && !this.options.chase && this.options.earlyEnd) {
      this.onFail();
    }
    return canPass;
  };

  QPathfind.prototype.adjustEndNode = function() {
    var x1 = this._endNode.x;
    var y1 = this._endNode.y;
    var x2 = x1;
    var y2 = y1;
    var steps = 0;
    var horz = 0;
    var vert = 0;
    var maxDist = Imported.QMovement ? QMovement.tileSize : 1;
    var neighbors = [];
    var dirs = _diagonals ? 9 : 5
    for (var i = 1; i < dirs; i++) {
      if (i < 5) {
        horz = vert = i * 2;
      } else {
        horz = i === 5 || i === 6 ? 4 : 6;
        vert = i === 5 || i === 7 ? 2 : 8;
      }
      x2 = x1;
      y2 = y1;
      steps = 0;
      if (Imported.QMovement) {
        while (!this.character().canPixelPass(x2, y2, 5, null, '_pathfind')) {
          x2 = $gameMap.roundPXWithDirection(x2, horz, this.character().moveTiles());
          y2 = $gameMap.roundPYWithDirection(y2, vert, this.character().moveTiles());
          steps += this.character().moveTiles();
          if (steps >= maxDist) break;
        }
      } else {
        x2 = $gameMap.roundXWithDirection(x1, horz);
        y2 = $gameMap.roundYWithDirection(y1, vert);
        if (!this.character().canPass(x2, y2, 5)) {
          continue;
        }
      }
      if (Imported.QMovement && !this.character().canPixelPass(x2, y2, 5, null, '_pathfind')) continue;
      var distx1 = Imported.QMovement ? Math.abs(this.character().px - x2) : Math.abs(this.character().x - x2);
      var distx2 = Math.abs(x1 - x2);
      var disty1 = Imported.QMovement ? Math.abs(this.character().py - y2) : Math.abs(this.character().y - y2);
      var disty2 = Math.abs(y1 - y2);
      var score = this.heuristic(new Point(distx1, disty1), new Point(distx2, disty2));
      neighbors.push({
        x: x2,
        y: y2,
        score: score
      })
    }
    if (neighbors.length === 0) return false;
    neighbors.sort(function(a, b) {
      return a.score - b.score;
    })
    this._endNode = this.node(null, new Point(neighbors[0].x, neighbors[0].y));
    return true;
  };

  QPathfind.prototype.update = function() {
    if (this._completed && this.options.smart > 1) {
      this.updateSmart();
    } else if (!this._completed) {
      var stepsPerFrame = this._intervals;
      if (this.options.towards) {
        stepsPerFrame = Math.min(stepsPerFrame, 50);
      }
      for (var i = 0; i < stepsPerFrame; i++) {
        if (this.options.chase) {
          var chasing = QPlus.getCharacter(this.options.chase);
          var oldThrough = chasing._through;
          chasing.setThrough(true);
        }
        this.aStar();
        if (this.options.chase) {
          chasing.setThrough(oldThrough);
        }
        if (this._completed) {
          break;
        } else if (this._openNodes.length === 0) {
          this.onFail();
          break;
        }
      }
      if (this.options.towards) {
        this.onComplete();
      }
    }
  };

  QPathfind.prototype.updateSmart = function() {
    // TODO try to make this even "smarter"
    this._tick++;
    var ot = 0;
    if (this.options.chase !== null) {
      var chasing = QPlus.getCharacter(this.options.chase);
      var p1 = new Point(chasing.x, chasing.y);
      var p2 = new Point(this.character().x, this.character().y);
      var dist = this.heuristic(p1, p2);
      var range = 5;
      if (dist > range) {
        ot = _smartOT;
      }
      // If endpoint hasn't changed, no need to recalc
      if (Imported.QMovement) {
        if (this._endNode.x === chasing.px && this._endNode.y === chasing.py) {
          return;
        }
      } else {
        if (this._endNode.x === chasing.x && this._endNode.y === chasing.y) {
          return;
        }
      }
    }
    if (this._tick > this._smartTime + ot) {
      return this.character().restartPathfind();
    }
  };

  QPathfind.prototype.node = function(parent, point) {
    return {
      parent: parent,
      visited: false,
      x: point.x,
      y: point.y,
      value: point.x + (point.y * this._mapWidth),
      f: 0,
      g: 0,
      h: 0
    }
  };

  QPathfind.prototype.character = function() {
    return QPlus.getCharacter(this._charaId);
  };

  // TODO
  // + Try a heap again, last time heap didn't inc performace
  //   may have been a bad heap class
  // + Look for other ways to inc performance, ex; mix in jump point
  QPathfind.prototype.aStar = function() {
    var currI = 0;
    var i, j;
    this._current = this._openNodes[0];
    j = this._openNodes.length;
    for (i = 0; i < j; i++) {
      if (this._openNodes[i].f < this._current.f) {
        this._current = this._openNodes[i];
        currI = i;
      }
    }
    if (this._current.value === this._endNode.value) {
      return this.onComplete();
    }
    this._openNodes.splice(currI, 1);
    this._closed[this._current.value] = true;
    var neighbors = this.findNeighbors(this._current);
    j = neighbors.length;
    for (i = 0; i < j; i++) {
      if (this._closed[neighbors[i].value]) continue;
      var gScore = this._current.g + this.heuristic(this._current, neighbors[i]);
      if (!neighbors[i].visited) {
        neighbors[i].visited = true;
        this._openNodes.push(neighbors[i]);
      } else if (gScore >= neighbors[i].g) {
        continue;
      }
      neighbors[i].g = gScore;
      neighbors[i].f = gScore + this.heuristic(this._current, this._endNode);
      neighbors[i].parent = this._current;
    }
  };

  QPathfind.prototype.onComplete = function() {
    //console.timeEnd('Pathfind');
    this._completed = true;
    if (this.options.towards) {
      var firstSteps = this.createFinalPath().slice(0, 2);
      return this.character().startPathfind(firstSteps);
    }
    this.character().startPathfind(this.createFinalPath());
  };

  QPathfind.prototype.onFail = function() {
    //console.timeEnd('Pathfind');
    this._completed = true;
    if (this.options.chase !== null) {
      return;
    }
    if (this.options.towards) {
      return this.onComplete();
    }
    this.character().clearPathfind();
  };

  QPathfind.prototype.createFinalPath = function() {
    var node = this._current;
    var path = [node];
    while (node.parent) {
      node = node.parent;
      path.unshift(node);
    }
    return path;
  };

  QPathfind.prototype.findNeighbors = function(current) {
    var chara = this.character();
    var x = current.x;
    var y = current.y;
    var xf = this._endNode.x;
    var yf = this._endNode.y;
    var neighbors = [];
    var stepDist = 1;
    if (Imported.QMovement) {
      stepDist = chara.moveTiles();
      var nearEnd = Math.abs(x - xf) < chara.optTiles() &&
                    Math.abs(y - yf) < chara.optTiles();
      var tiles = nearEnd ? chara.moveTiles() : chara.optTiles();
    }
    var dirs = _diagonals ? 9 : 5
    var i;
    for (i = 1; i < dirs; i++) {
      var horz = 5;
      var vert = 5;
      var dir = 5;
      if (i < 5) {
        horz = vert = dir = i * 2;
      } else {
        horz = i === 5 || i === 6 ? 4 : 6;
        vert = i === 5 || i === 7 ? 2 : 8;
      }
      var passed = false;
      var onEnd = false;
      var x2, y2;
      if (Imported.QMovement) {
        x2 = $gameMap.roundPXWithDirection(x, horz, tiles);
        y2 = $gameMap.roundPYWithDirection(y, vert, tiles);
        if (i >= 5) {
          passed = chara.canPixelPassDiagonally(x, y, horz, vert, tiles, '_pathfind');
        } else {
          passed = chara.canPixelPass(x, y, dir, tiles, '_pathfind');
        }
      } else {
        x2 = $gameMap.roundXWithDirection(x, horz);
        y2 = $gameMap.roundYWithDirection(y, vert);
        if (i >= 5) {
          passed = chara.canPassDiagonally(x, y, horz, vert);
        } else {
          passed = chara.canPass(x, y, dir);
        }
      }
      var val = x2 + (y2 * this._mapWidth);
      if (passed || val === this._endNode.value) {
        var node;
        if (Imported.QMovement) {
          if (Math.abs(x2 - xf) < stepDist && Math.abs(y2 - yf) < stepDist) {
            // this is as close as we can get
            // so force in endnode
            neighbors.push(this._endNode);
            continue;
          }
        }
        if (this._grid[val]) {
          node = this._grid[val];
        } else {
          node = this.node(current, new Point(x2, y2));
          this._grid[val] = node;
        }
        neighbors.push(node)
      }
    }
    return neighbors;
  };

  // http://theory.stanford.edu/~amitp/GameProgramming/Heuristics.html
  QPathfind.prototype.heuristic = function(initial, final) {
    var dx = Math.abs(initial.x - final.x);
    var dy = Math.abs(initial.y - final.y);
    if (!_diagonals) {
      return dx + dy;
    } else {
      var D = 1;
      var D2 = Math.sqrt(2);
      return D * (dx + dy) + (D2 - 2 * D) * Math.min(dx, dy);
    }
  };

  // static
  QPathfind.pathToRoute = function(chara, path) {
    var route = {
      list: [],
      repeat: false,
      skippable: false,
      wait: false
    }
    var current = path[0];
    var codes = {
      2: 1, 4: 2,
      6: 3, 8: 4,
      1: 5, 3: 6,
      7: 7, 9: 8
    }
    for (var i = 1; i < path.length; i++) {
      var sx = current.x - path[i].x;
      var sy = current.y - path[i].y;
      var dist, dir;
      if (sx !== 0 && sy !== 0) { // diag
        var horz = sx > 0 ? 4 : 6;
        var vert = sy > 0 ? 8 : 2;
        if (horz === 4 && vert === 8) dir = 7;
        if (horz === 4 && vert === 2) dir = 1;
        if (horz === 6 && vert === 8) dir = 9;
        if (horz === 6 && vert === 2) dir = 3;
        dist = Math.abs(sx);
      } else if (sx !== 0) { // horz
        dir = sx > 0 ? 4 : 6;
        dist = Math.abs(sx);
      } else if (sy !== 0) { // vert
        dir = sy > 0 ? 8 : 2;
        dist = Math.abs(sy);
      }
      var command = {};
      if (Imported.QMovement) {
        command.code = Game_Character.ROUTE_SCRIPT;
        command.parameters = ['qmove(' + dir + ',' + dist + ')'];
      } else {
        command.code = codes[dir];
      }
      route.list.push(command);
      current = path[i];
    }
    route.list.push({
      code: 0
    })
    return route;
  };

  //-----------------------------------------------------------------------------
  // Game_Interpreter

  var Alias_Game_Interpreter_updateWaitMode = Game_Interpreter.prototype.updateWaitMode;
  Game_Interpreter.prototype.updateWaitMode = function() {
    var waiting = false
    if (this._waitMode === 'pathfind') {
      waiting = this._character._pathfind || this._character._isPathfinding;
      if (!waiting) {
        this._waitMode = '';
      }
    }
    return waiting || Alias_Game_Interpreter_updateWaitMode.call(this);
  };

  var Alias_Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
  Game_Interpreter.prototype.pluginCommand = function(command, args) {
    if (command.toLowerCase() === 'qpathfind') {
      this.qPathfindCommand(args);
      return;
    }
    Alias_Game_Interpreter_pluginCommand.call(this, command, args);
  };

  Game_Interpreter.prototype.qPathfindCommand = function(args) {
    // qPathfind CHARAID X Y
    // qPathfind CHARAID chase CHARAID2
    // qPathfind CHARAID clear
    var chara;
    if (args[0].toLowerCase() === 'this') {
      chara = this.character(0);
    } else {
      chara = QPlus.getCharacter(args[0]);
    }
    if (!chara) return;
    var args2 = args.slice(1);
    if (args2[0].toLowerCase() === 'chase') {
      if (args2[1].toLowerCase() === 'this') {
        chara.initChase(this.character(0).charaId());
      } else {
        chara.initChase(args2[1]);
      }
      return;
    }
    if (args2[0].toLowerCase() === 'clear') {
      chara.clearPathfind();
      return;
    }
    var x;
    var y;
    if (args2[0].toLowerCase() === 'towards') {
      var chara2;
      if (args2[1].toLowerCase() === 'this') {
        chara2 = this.character(0);
      } else {
        chara2 = QPlus.getCharacter(args2[1]);
      }
      if (Imported.QMovement) {
        var pos = chara.centerWith(chara2);
        x = pos.x;
        y = pos.y;
      } else {
        x = chara2.x;
        y = chara2.y;
      }
    } else {
      x = QPlus.getArg(args2, /^x(\d+)/i);
      y = QPlus.getArg(args2, /^y(\d+)/i);
      if (Imported.QMovement) {
        if (x === null) {
          x = QPlus.getArg(args2, /^px(\d+)/i);
        } else {
          x = Number(x) * QMovement.tileSize;
        }
        if (y === null) {
          y = QPlus.getArg(args2, /^py(\d+)/i);
        } else {
          y = Number(y) * QMovement.tileSize;
        }
      }
    }
    if (x === null && y === null) return;
    chara.initPathfind(Number(x), Number(y), {
      smart: Number(QPlus.getArg(args2, /^smart(\d+)/i)),
      adjustEnd: true
    })
    var wait = QPlus.getArg(args2, /^wait$/i);
    if (wait) {
      this._character = chara;
      this.setWaitMode('pathfind');
    }
  };

  //-----------------------------------------------------------------------------
  // Game_CharacterBase

  if (Imported.QMovement) {
    Game_CharacterBase.prototype.optTiles = function() {
      if (!QMovement.offGrid) {
        return this.moveTiles();
      }
      if (!this._optTiles) {
        var w = Math.round(this.collider('collision').width);
        if (_halfOpt) w /= 2;
        var h = Math.round(this.collider('collision').height);
        if (_halfOpt) h /= 2;
        while (w % this.moveTiles() !== 0) {
          w--;
          if (w <= this.moveTiles()) break;
        }
        while (h % this.moveTiles() !== 0) {
          h--;
          if (h <= this.moveTiles()) break;
        }
        this._optTiles = Math.max(Math.min(w, h), this.moveTiles());
      }
      return this._optTiles;
    };

    var Alias_Game_CharacterBase_setupColliders = Game_CharacterBase.prototype.setupColliders;
    Game_CharacterBase.prototype.setupColliders = function() {
      Alias_Game_CharacterBase_setupColliders.call(this);
      var collider = this.collider('collision');
      this._colliders['_pathfind'] = JsonEx.parse(JsonEx.stringify(collider));
      this._optTiles = null;
    };
  }

  //-----------------------------------------------------------------------------
  // Game_Character

  var Alias_Game_Character_initMembers = Game_Character.prototype.initMembers;
  Game_Character.prototype.initMembers = function() {
    Alias_Game_Character_initMembers.call(this);
    this._pathfind = null;
    this._isPathfinding = false;
    this._isChasing = false;
  };

  var Alias_Game_Character_update = Game_Character.prototype.update;
  Game_Character.prototype.update = function() {
    Alias_Game_Character_update.call(this);
    if (this._pathfind) {
      this._pathfind.update();
    }
  };

  if (Imported.QMovement) {
    // TODO might not be needed
    var Alias_Game_CharacterBase_ignoreCharacters = Game_CharacterBase.prototype.ignoreCharacters;
    Game_CharacterBase.prototype.ignoreCharacters = function(type) {
      var ignores = Alias_Game_CharacterBase_ignoreCharacters.call(this, type);
      if (this._isChasing !== false) {
        if (!ignores['_pathfind']) ignores['_pathfind'] = [];
        ignores['_pathfind'].push(this._isChasing);
      }
      return ignores[type] || [];
    };
  }

  // if using QMovement, x and y are pixel values
  Game_Character.prototype.initPathfind = function(x, y, options) {
    if (this._isPathfinding) {
      this.clearPathfind();
    }
    options = options || {};
    this._pathfind = new QPathfind(this.charaId(), new Point(x, y), options);
    this._isChasing = options.chase !== null ? options.chase : false;
  };

  Game_Character.prototype.initChase = function(charaId) {
    if (this.charaId() === charaId) return;
    if (!QPlus.getCharacter(charaId)) return;
    this.initPathfind(0, 0, {
      smart: 2,
      chase: charaId
    })
    this._isChasing = charaId;
  };

  Game_Character.prototype.restartPathfind = function() {
    var x = this._pathfind._endNode.x;
    var y = this._pathfind._endNode.y;
    this._isPathfinding = false;
    if (this._moveRoute) {
      this.processRouteEnd();
    }
    var options = this._pathfind.options;
    this._pathfind = new QPathfind(this.charaId(), new Point(x, y), options);
    this._isChasing = options.chase !== null ? options.chase : false;
  };

  Game_Character.prototype.startPathfind = function(path) {
    this._isPathfinding = true;
    this.forceMoveRoute(QPathfind.pathToRoute(this, path));
  };

  Game_Character.prototype.onPathfindComplete = function() {
    if (this._isChasing !== false) {
      this._pathfind._smartTime -= _smartOT;
      return;
    }
    this._isPathfinding = false;
    this._pathfind = null;
  };

  Game_Character.prototype.clearPathfind = function() {
    this._pathfind = null;
    this._isChasing = false;
    if (this._isPathfinding) {
      this.processRouteEnd();
    }
  };

  var Alias_Game_Character_processRouteEnd = Game_Character.prototype.processRouteEnd;
  Game_Character.prototype.processRouteEnd = function() {
    Alias_Game_Character_processRouteEnd.call(this);
    if (this._isPathfinding) {
      this.onPathfindComplete();
    }
  };

  var Alias_Game_Character_isMoveRouteForcing = Game_Character.prototype.isMoveRouteForcing;
  Game_Character.prototype.isMoveRouteForcing = function() {
    if (this._isPathfinding && this._pathfind.options.breakable) {
      return false;
    }
    return Alias_Game_Character_isMoveRouteForcing.call(this);
  };

  var Alias_Game_Character_advanceMoveRouteIndex = Game_Character.prototype.advanceMoveRouteIndex;
  Game_Character.prototype.advanceMoveRouteIndex = function() {
    if (this._isPathfinding) {
      var moveRoute = this._moveRoute;
      if (moveRoute && (!this.isMovementSucceeded() && this._pathfind.options.smart > 0)) {
        return this.restartPathfind();
      }
    }
    Alias_Game_Character_advanceMoveRouteIndex.call(this);
  };

  //-----------------------------------------------------------------------------
  // Game_Player

  if (Imported.QMovement) {
    var Alias_Game_Player_requestMouseMove = Game_Player.prototype.requestMouseMove;
    Game_Player.prototype.requestMouseMove = function() {
      Alias_Game_Player_requestMouseMove.call(this);
      if (this._isPathfinding) {
        this._isPathfinding = false;
        this.processRouteEnd();
      }
      this._pathfind = null;
    };

    var Alias_Game_Player_moveByMouse = Game_Player.prototype.moveByMouse;
    Game_Player.prototype.moveByMouse = function(x, y) {
      var half = QMovement.tileSize / 2;
      this.initPathfind(x - half, y - half, {
        smart: 2,
        breakable: true,
        adjustEnd: true
      })
      Alias_Game_Player_moveByMouse.call(this, x, y);
    };

    var Alias_Game_Player_clearMouseMove = Game_Player.prototype.clearMouseMove;
    Game_Player.prototype.clearMouseMove = function() {
      Alias_Game_Player_clearMouseMove.call(this);
      this.clearPathfind();
    };

    Game_Player.prototype._clearPathfind = function() {
      Game_Character.prototype.clearPathfind.call(this);
      if (this._movingWithMouse) {
        this.clearMouseMove();
      }
    };

    Game_Player.prototype.onPathfindComplete = function() {
      Game_Character.prototype.onPathfindComplete.call(this);
      if (this._movingWithMouse) {
        this.clearMouseMove();
      }
    };

    var Alias_Game_Player_triggerTouchAction = Game_Player.prototype.triggerTouchAction;
    Game_Player.prototype.triggerTouchAction = function() {
      var triggered = Alias_Game_Player_triggerTouchAction.call(this);
      if (triggered && this._movingWithMouse) {
        this.clearMouseMove();
      }
      return triggered;
    };
  }

  //-----------------------------------------------------------------------------
  // Game_Event

  var Alias_Game_Event_setupPage = Game_Event.prototype.setupPage;
  Game_Event.prototype.setupPage = function() {
    if (this._isChasing !== false) {
      this.clearPathfind();
    }
    Alias_Game_Event_setupPage.call(this);
  };
})()
