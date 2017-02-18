//=============================================================================
// QPathfind
//=============================================================================

var Imported = Imported || {};
Imported.QPathfind = '0.1.0';

if (!Imported.QPlus) {
  var msg = 'Error: QPathfind requires QPlus to work.';
  alert(msg);
  throw new Error(msg);
}

//=============================================================================
 /*:
 * @plugindesc <QPathfind>
 * desc
 * @author Quxios  | Version 0.1.0
 *
 * @requires QPlus
 *
 * @param
 * @desc
 * @default
 *
 * @video
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
 *   http://forums.rpgmakerweb.com/index.php?threads/qplugins.73023/
 *
 * Terms of use:
 *
 *   https://github.com/quxios/QMV-Master-Demo/blob/master/readme.md
 *
 * @tags
 */
//=============================================================================


//=============================================================================
// QPathfind

function QPathfind() {
  this.initialize.apply(this, arguments);
}

(function() {
  var _diagonals = !true;
  var _halfOpt = true;

  QPathfind.prototype.initialize = function(charaId, endPoint, options) {
    this.initMembers(charaId, endPoint, options);
    this.beforeStart();
  };

  QPathfind.prototype.initMembers = function(charaId, endPoint, options) {
    this.options = options;
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
    this._steps = 0;
  };

  QPathfind.prototype.beforeStart = function() {
    // test if end point is valid, if not send fail
    console.time('Pathfind');
  };

  QPathfind.prototype.update = function() {
    if (this._completed && this.options.smart) {
      this._tick++;
      if (this._tick % 90 === 0) {
        return this.character().restartPathfind();
      }
    } else if (!this._completed) {
      var intervals = 1000;
      for (var i = 0; i < intervals; i++) {
        this.aStar();
        this._steps++;
        if (this._completed) {
          break;
        } else if (this._openNodes.length === 0) {
          this.onFail();
          break;
        }
      }
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

  QPathfind.prototype.aStar = function() {
    var currI = 0;
    var i;
    this._current = this._openNodes[0];
    for (i = 0; i < this._openNodes.length; i++) {
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
    for (var i = 0; i < neighbors.length; i++) {
      if (this._closed[neighbors[i]]) continue;
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
    console.timeEnd('Pathfind');
    this._completed = true;
    this.character().startPathfind(this.createFinalPath());
  };

  QPathfind.prototype.onFail = function() {
    console.timeEnd('Pathfind');
    this._completed = true;
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
    if (Imported.QMovement) {
      var nearEnd = Math.abs(x - xf) < chara.optTiles() &&
                    Math.abs(y - yf) < chara.optTiles();
      var tiles = nearEnd ? chara.moveTiles() : chara.optTiles();
    }
    var i;
    for (i = 1; i < 5; i++) {
      var dir = i * 2;
      var passed = false;
      var onEnd = false;
      var x2, y2;
      if (Imported.QMovement) {
        x2 = $gameMap.roundPXWithDirection(x, dir, tiles);
        y2 = $gameMap.roundPYWithDirection(y, dir, tiles);
        passed = chara.canPixelPass(x, y, dir, tiles, '_pathfind');
      } else {
        x2 = $gameMap.roundXWithDirection(x, dir);
        y2 = $gameMap.roundYWithDirection(y, dir);
        passed = chara.canPass(x, y, dir);
      }
      var val = x2 + (y2 * this._mapWidth);
      if (passed || onEnd) {
        var node;
        if (Imported.QMovement) {
          if (Math.abs(x2 - xf) < tiles && Math.abs(y2 - yf) < tiles) {
            node = this.node(current, new Point(xf, yf));
            neighbors.push(node);
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
    if (_diagonals) {
      var diags = {
        1: [4, 2],
        3: [6, 2],
        7: [4, 8],
        9: [6, 8]
      }
      for (i = 1; i < 5; i++) {
        var dir = i * 2;
        dir = dir < 5 ? dir - 1 : dir + 1;
        var horz = diags[dir][0];
        var vert = diags[dir][1];
        var passed = false;
        var x2, y2;
        if (Imported.QMovement) {
          x2 = $gameMap.roundPXWithDirection(x, horz, tiles);
          y2 = $gameMap.roundPYWithDirection(y, vert, tiles);
          passed = chara.canPixelPassDiagonally(x, y, horz, vert, tiles, '_pathfind');
        } else {
          x2 = $gameMap.roundXWithDirection(x, horz);
          y2 = $gameMap.roundYWithDirection(y, vert);
          passed = chara.canPassDiagonally(x, y, horz, vert);
        }
        var val = x2 + (y2 * this._mapWidth);
        if (passed || val === this._endNode.value) {
          var node;
          if (Imported.QMovement) {
            if (Math.abs(x2 - xf) < tiles && Math.abs(y2 - yf) < tiles) {
              node = this.node(current, new Point(xf, yf));
              neighbors.push(node);
              continue;
            }
          }
          if (this._grid[val]) {
            node = this._grid[val];
          } else {
            node = this.node(current, new Point(x2, y2));
            this._grid[val] = node;
          }
          neighbors.push(node);
        }
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
        // TODO route isn't correct
        /*
        var radian = Math.atan2(sy, -sx);
        radian += radian < 0 ? 2 * Math.PI : 0;
        dist = Math.sqrt(sx * sx + sy * sy);
        console.log(radian, dist);
        command.code = 'moveRadian';
        command.parameters = [radian, dist];
        */
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

  if (Imported.QMovement) {
    //-----------------------------------------------------------------------------
    // Game_CharacterBase

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

  Game_Character.prototype.initPathfind = function(x, y, options) {
    if (this._isPathfinding) {
      this.clearPathfind();
    }
    options = options || {};
    this._pathfind = new QPathfind(this.charaId(), new Point(x, y), options);
  };

  Game_Character.prototype.restartPathfind = function() {
    var x = this._pathfind._endNode.x;
    var y = this._pathfind._endNode.y;
    this.initPathfind(x, y, this._pathfind.options);
    //this._pathfind = new QPathfind(this.charaId(), new Point(x, y), this._pathfind.options);
  };

  Game_Character.prototype.startPathfind = function(path) {
    this._isPathfinding = true;
    this.forceMoveRoute(QPathfind.pathToRoute(this, path));
  };

  Game_Character.prototype.onPathfindComplete = function() {
    this._isPathfinding = false;
    this._pathfind = null;
  };

  Game_Character.prototype.clearPathfind = function() {
    if (this._isPathfinding) {
      this.processRouteEnd();
    }
    this._pathfind = null;
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
      if (moveRoute && (!this.isMovementSucceeded() && this._pathfind.options.smart)) {
        return this.restartPathfind();
      }
    }
    Alias_Game_Character_advanceMoveRouteIndex.call(this);
  };

  //-----------------------------------------------------------------------------
  // Game_Player



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
})()
