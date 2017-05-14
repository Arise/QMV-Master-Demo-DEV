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
        this.subQMove('2, 1,' + QMovement.tileSize);
        break;
      }
      case gc.ROUTE_MOVE_LEFT: {
        this.subQMove('4, 1,' + QMovement.tileSize);
        break;
      }
      case gc.ROUTE_MOVE_RIGHT: {
        this.subQMove('6, 1,' + QMovement.tileSize);
        break;
      }
      case gc.ROUTE_MOVE_UP: {
        this.subQMove('8, 1,' + QMovement.tileSize);
        break;
      }
      case gc.ROUTE_MOVE_LOWER_L: {
        this.subQMove('1, 1,' + QMovement.tileSize);
        break;
      }
      case gc.ROUTE_MOVE_LOWER_R: {
        this.subQMove('3, 1,' + QMovement.tileSize);
        break;
      }
      case gc.ROUTE_MOVE_UPPER_L: {
        this.subQMove('7, 1,' + QMovement.tileSize);
        break;
      }
      case gc.ROUTE_MOVE_UPPER_R: {
        this.subQMove('9, 1,' + QMovement.tileSize);
        break;
      }
      case gc.ROUTE_MOVE_FORWARD: {
        this.subQMove('5, 1,' + QMovement.tileSize);
        break;
      }
      case gc.ROUTE_MOVE_BACKWARD: {
        this.subQMove('0, 1,' + QMovement.tileSize);
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
      var qmove  = /^qmove\((.*)\)/i.exec(params[0]);
      var qmove2 = /^qmove2\((.*)\)/i.exec(params[0]);
      var arc    = /^arc\((.*)\)/i.exec(params[0]);
      if (qmove)  this.subQMove(qmove[1]);
      if (qmove2) this.subQMove2(qmove2[1]);
      if (arc)    this.subArc(arc[1]);
      if (qmove || qmove2 || arc) return true;
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
      case 'fixedRadianMove': {
        this.fixedRadianMove(params[0], params[1]);
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
    var i;
    for (i = 0; i < steps; i++) {
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

  Game_Character.prototype.subQMove2 = function(settings) {
    settings  = QPlus.stringToAry(settings);
    var radian = settings[0];
    var dist = settings[1];
    var maxSteps = Math.floor(dist / this.moveTiles());
    var steps = 0;
    var i;
    for (i = 0; i < maxSteps; i++) {
      steps += this.moveTiles();
      var cmd = {};
      cmd.code = 'fixedRadianMove';
      cmd.parameters = [radian, this.moveTiles()];
      this._moveRoute.list.splice(this._moveRouteIndex + 1, 0, cmd);
    }
    if (steps < dist) {
      var cmd = {};
      cmd.code = 'fixedRadianMove';
      cmd.parameters = [radian, dist - steps];
      this._moveRoute.list.splice(this._moveRouteIndex + 1 + i, 0, cmd);
    }
    this._moveRoute.list.splice(this._moveRouteIndex, 1);
  };

  Game_Character.prototype.moveRandom = function() {
    var d = 2 + Math.randomInt(4) * 2;
    if (this.canPixelPass(this._px, this._py, d)) {
      this.moveStraight(d);
    }
  };

  var Alias_Game_Character_moveTowardCharacter = Game_Character.prototype.moveTowardCharacter;
  Game_Character.prototype.moveTowardCharacter = function(character) {
    if (QMovement.offGrid) {
      var dx = this.deltaPXFrom(character.cx());
      var dy = this.deltaPYFrom(character.cy());
      var radian = Math.atan2(-dy, -dx);
      if (radian < 0) radian += Math.PI * 2;
      var oldSM = this._smartMove;
      if (oldSM <= 1) this._smartMove = 2;
      this.moveRadian(radian);
      this._smartMove = oldSM;
    } else {
      Alias_Game_Character_moveTowardCharacter.call(this, character);
    }
  };

  var Alias_Game_Character_moveAwayFromCharacter = Game_Character.prototype.moveAwayFromCharacter;
  Game_Character.prototype.moveAwayFromCharacter = function(character) {
    if (QMovement.offGrid) {
      var dx = this.deltaPXFrom(character.cx());
      var dy = this.deltaPYFrom(character.cy());
      var radian = Math.atan2(dy, dx);
      if (radian < 0) radian += Math.PI * 2;
      var oldSM = this._smartMove;
      if (oldSM <= 1) this._smartMove = 2;
      this.moveRadian(radian);
      this._smartMove = oldSM;
    } else {
      Alias_Game_Character_moveAwayFromCharacter.call(this, character);
    }
  };

  Game_Character.prototype.turnTowardCharacter = function(character) {
    var dx = this.deltaPXFrom(character.cx());
    var dy = this.deltaPYFrom(character.cy());
    var radian = Math.atan2(-dy, -dx);
    this.setDirection(this.radianToDirection(radian, QMovement.diagonal));
  };

  Game_Character.prototype.turnAwayFromCharacter = function(character) {
    var dx = this.deltaPXFrom(character.cx());
    var dy = this.deltaPYFrom(character.cy());
    var radian = Math.atan2(dy, dx);
    this.setDirection(this.radianToDirection(radian, QMovement.diagonal));
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

  // Returns the px, py needed for this character to be center aligned
  // with the character passed in (align is based off collision collider)
  Game_Character.prototype.centerWith = function(character) {
    var dx1 = this.cx() - this._px;
    var dy1 = this.cy() - this._py;
    var dx2 = character.cx() - character._px;
    var dy2 = character.cy() - character._py;
    var dx = dx1 - dx2;
    var dy = dy1 - dy2;
    return new Point(character._px + dx, character._py + dy);
  };
})();
