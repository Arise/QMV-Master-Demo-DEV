//-----------------------------------------------------------------------------
// Game_Character

(function() {
  var Alias_Game_Character_processMoveCommand = Game_Character.prototype.processMoveCommand;
  Game_Character.prototype.processMoveCommand = function(command) {
    this.subMVMoveCommands(command);
    if (this.subQMoveCommand(command)) {
      command = this._moveRoute.list[this._moveRouteIndex];
    }
    this.processQMoveCommands(command);
    Alias_Game_Character_processMoveCommand.call(this, command);
  };

  Game_Character.prototype.subMVMoveCommands = function(command) {
    var gc = Game_Character;
    var params = command.parameters;
    switch (command.code) {
      case gc.ROUTE_MOVE_DOWN: {
        this.subQMove("2, 1," + QMovement.tileSize);
        //this._moveRouteIndex++;
        break;
      }
      case gc.ROUTE_MOVE_LEFT: {
        this.subQMove("4, 1," + QMovement.tileSize);
        //this._moveRouteIndex++;
        break;
      }
      case gc.ROUTE_MOVE_RIGHT: {
        this.subQMove("6, 1," + QMovement.tileSize);
        //this._moveRouteIndex++;
        break;
      }
      case gc.ROUTE_MOVE_UP: {
        this.subQMove("8, 1," + QMovement.tileSize);
        //this._moveRouteIndex++;
        break;
      }
      case gc.ROUTE_MOVE_LOWER_L: {
        this.subQMove("1, 1," + QMovement.tileSize);
        //this._moveRouteIndex++;
        break;
      }
      case gc.ROUTE_MOVE_LOWER_R: {
        this.subQMove("3, 1," + QMovement.tileSize);
        //this._moveRouteIndex++;
        break;
      }
      case gc.ROUTE_MOVE_UPPER_L: {
        this.subQMove("7, 1," + QMovement.tileSize);
        //this._moveRouteIndex++;
        break;
      }
      case gc.ROUTE_MOVE_UPPER_R: {
        this.subQMove("9, 1," + QMovement.tileSize);
        //this._moveRouteIndex++;
        break;
      }
      case gc.ROUTE_MOVE_FORWARD: {
        this.subQMove("5, 1," + QMovement.tileSize);
        //this._moveRouteIndex++;
        break;
      }
      case gc.ROUTE_MOVE_BACKWARD: {
        this.subQMove("0, 1," + QMovement.tileSize);
        //this._moveRouteIndex++;
        break;
      }
      case gc.ROUTE_TURN_DOWN:
      case gc.ROUTE_TURN_LEFT:
      case gc.ROUTE_TURN_RIGHT:
      case gc.ROUTE_TURN_UP:
      case gc.ROUTE_TURN_90D_R:
      case gc.ROUTE_TURN_90D_L:
      case gc.ROUTE_TURN_180D:
      case gc.ROUTE_TURN_90D_R_L:
      case gc.ROUTE_TURN_RANDOM:
      case gc.ROUTE_TURN_TOWARD:
      case gc.ROUTE_TURN_AWAY: {
        this._freqCount = this.freqThreshold();
        break;
      }
    }
  };

  Game_Character.prototype.subQMoveCommand = function(command) {
    var gc = Game_Character;
    var code = command.code;
    var params = command.parameters;
    if (command.code === gc.ROUTE_SCRIPT) {
      var qmove = /^qmove\((.*)\)/i.exec(params[0]);
      var arc   = /^arc\((.*)\)/i.exec(params[0]);
      if (qmove) this.subQMove(qmove[1]);
      if (arc)   this.subArc(arc[1]);
      if (qmove || arc) return true;
    }
    return false;
  };

  Game_Character.prototype.processQMoveCommands = function(command) {
    var params = command.parameters;
    switch (command.code) {
      case 'arc': {
        this.arc(params[0], params[1], eval(params[2]), params[3], params[4]);
        break;
      }
      case 'moveRadian': {
        this.moveRadian(params[0], params[1]);
        break;
      }
      case 'fixedMove': {
        this.fixedMove(params[0], params[1]);
        break;
      }
      case 'fixedMoveBackward': {
        this.fixedMoveBackward(params[0]);
        break;
      }
      case 'fixedMoveForward': {
        this.fixedMove(this.direction(), params[0]);
        break;
      }
    }
  };

  Game_Character.prototype.subArc = function(settings) {
    var cmd = {};
    cmd.code = 'arc';
    cmd.parameters = QPlus.stringToAry(settings);
    this._moveRoute.list[this._moveRouteIndex] = cmd;
  };

  Game_Character.prototype.subQMove = function(settings) {
    settings  = QPlus.stringToAry(settings);
    var dir   = settings[0];
    if (dir === 5) dir = this._direction;
    var amt   = settings[1];
    var multi = settings[2] || 1;
    var tot   = amt * multi;
    var steps = Math.floor(tot / this.moveTiles());
    var moved = 0;
    for (var i = 0; i < steps; i++) {
      moved += this.moveTiles();
      var cmd = {};
      cmd.code = 'fixedMove';
      cmd.parameters = [dir, this.moveTiles()];
      if (dir ===0) {
        cmd.code = 'fixedMoveBackward';
        cmd.parameters = [this.moveTiles()];
      }
      this._moveRoute.list.splice(this._moveRouteIndex + 1, 0, cmd);
    }
    if (moved < tot) {
      var cmd = {};
      cmd.code = 'fixedMove';
      cmd.parameters = [dir, tot - moved];
      if (dir === 0) {
        cmd.code = 'fixedMoveBackward';
        cmd.parameters = [tot - moved];
      }
      this._moveRoute.list.splice(this._moveRouteIndex + 1 + i, 0, cmd);
    }
    this._moveRoute.list.splice(this._moveRouteIndex, 1);
  };

  Game_Character.prototype.moveRandom = function() {
    var d = 2 + Math.randomInt(4) * 2;
    if (this.canPixelPass(this.px, this.py, d)) {
      this.moveStraight(d);
    }
  };

  Game_Character.prototype.deltaPXFrom = function(x) {
    return $gameMap.deltaPX(this.cx(), x);
  };

  Game_Character.prototype.deltaPYFrom = function(y) {
    return $gameMap.deltaPY(this.cy(), y);
  };

  Game_Character.prototype.pixelDistanceFrom = function(x, y) {
    return $gameMap.distance(this.cx(), this.cy(), x, y);
  };
})();
