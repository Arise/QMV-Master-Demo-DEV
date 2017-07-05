//-----------------------------------------------------------------------------
// Game_CharacterBase

(function() {
  Object.defineProperties(Game_CharacterBase.prototype, {
    x: {
      get: function() {
        return Math.floor(this.cx() / QMovement.tileSize);
      },
      configurable: true
    },
    y: {
      get: function() {
        return Math.floor(this.cy() / QMovement.tileSize);
      },
      configurable: true
    },
    px: {
      get: function() { return this._px; },
      configurable: true
    },
    py: {
      get: function() { return this._py; },
      configurable: true
    }
  });

  var Alias_Game_CharacterBase_initMembers = Game_CharacterBase.prototype.initMembers;
  Game_CharacterBase.prototype.initMembers = function() {
    Alias_Game_CharacterBase_initMembers.call(this);
    this._px = 0;
    this._py = 0;
    this._realPX = 0;
    this._realPY = 0;
    this._radian = this.directionToRadian(this._direction);
    this._forwardRadian = this.directionToRadian(this._direction);
    this._adjustFrameSpeed = false;
    this._freqCount = 0;
    this._diagonal = false;
    this._currentRad = 0;
    this._targetRad = 0;
    this._pivotX = 0;
    this._pivotY = 0;
    this._radiusL = 0;
    this._radisuH = 0;
    this._angularSpeed;
    this._passabilityLevel = 0; // TODO
    this._isMoving = false;
    this._smartMove = 0;
    this._colliders = null;
    this._overrideColliders = {};
  };

  Game_CharacterBase.prototype.direction8 = function(horz, vert) {
    if (horz === 4 && vert === 8) return 7;
    if (horz === 4 && vert === 2) return 1;
    if (horz === 6 && vert === 8) return 9;
    if (horz === 6 && vert === 2) return 3;
    return 5;
  };

  Game_CharacterBase.prototype.isMoving = function() {
    return this._isMoving;
  };

  Game_CharacterBase.prototype.startedMoving = function() {
    return this._realPX !== this._px || this._realPY !== this._py;
  };

  Game_CharacterBase.prototype.isDiagonal = function() {
    return this._diagonal;
  };

  Game_CharacterBase.prototype.isArcing = function() {
    return this._currentRad !== this._targetRad;
  };

  Game_CharacterBase.prototype.setPixelPosition = function(x, y) {
    this.setPosition(x / QMovement.tileSize, y / QMovement.tileSize);
  };

  var Alias_Game_CharacterBase_setPosition = Game_CharacterBase.prototype.setPosition;
  Game_CharacterBase.prototype.setPosition = function(x, y) {
    Alias_Game_CharacterBase_setPosition.call(this, x, y);
    this._px = this._realPX = x * QMovement.tileSize;
    this._py = this._realPY = y * QMovement.tileSize;
    if (!this._colliders) this.collider();
    this.moveColliders();
  };

  var Alias_Game_CharacterBase_copyPosition = Game_CharacterBase.prototype.copyPosition;
  Game_CharacterBase.prototype.copyPosition = function(character) {
    Alias_Game_CharacterBase_copyPosition.call(this, character);
    this._px = character._px;
    this._py = character._py;
    this._realPX = character._realPX;
    this._realPY = character._realPY;
    if (!this._colliders) this.collider();
    this.moveColliders();
  };

  var Alias_Game_CharacterBase_setDirection = Game_CharacterBase.prototype.setDirection;
  Game_CharacterBase.prototype.setDirection = function(d) {
    if (d) this._radian = this.directionToRadian(d);
    if (!this.isDirectionFixed() && d) {
      if ([1, 3, 7, 9].contains(d)) {
        this._diagonal = d;
        var horz = [1, 7].contains(d) ? 4 : 6;
        var vert = [1, 3].contains(d) ? 2 : 8;
        if (this._direction === this.reverseDir(horz)) {
          this._direction = horz;
        }
        if (this._direction === this.reverseDir(vert)) {
          this._direction = vert;
        }
        this.resetStopCount();
        return;
      } else {
        this._diagonal = false;
      }
    }
    Alias_Game_CharacterBase_setDirection.call(this, d);
  };

  Game_CharacterBase.prototype.setRadian = function(radian) {
    radian = QPlus.adjustRadian(radian);
    this.setDirection(this.radianToDirection(radian, QMovement.diagonal));
    this._radian = radian;
  };

  Game_CharacterBase.prototype.moveTiles = function() {
    if (QMovement.grid < this.frameSpeed()) {
      return QMovement.offGrid ? this.frameSpeed() : QMovement.grid;
    }
    return QMovement.grid;
  };

  Game_CharacterBase.prototype.frameSpeed = function(multi) {
    var multi = multi === undefined ? 1 : Math.abs(multi);
    return this.distancePerFrame() * QMovement.tileSize * multi;
  };

  Game_CharacterBase.prototype.angularSpeed = function() {
    return this._angularSpeed || this.frameSpeed() / this._radiusL;
  };

  Game_CharacterBase.prototype.forwardV = function() {
    return {
      x: Math.cos(this._forwardRadian) * this.frameSpeed(),
      y: Math.sin(this._forwardRadian) * this.frameSpeed()
    }
  };

  var Alias_Game_CharacterBase_canMove = Game_CharacterBase.prototype.canMove;
  Game_CharacterBase.prototype.canMove = function() {
    if (this._locked) return false;
    return Alias_Game_CharacterBase_canMove.call(this);
  };

  Game_CharacterBase.prototype.canPass = function(x, y, dir) {
    return this.canPixelPass(x * QMovement.tileSize, y * QMovement.tileSize, dir);
  };

  Game_CharacterBase.prototype.canPixelPass = function(x, y, dir, dist, type) {
    dist = dist || this.moveTiles();
    type = type || 'collision';
    var x1 = $gameMap.roundPXWithDirection(x, dir, dist);
    var y1 = $gameMap.roundPYWithDirection(y, dir, dist);
    if (!this.collisionCheck(x1, y1, dir, dist, type)) {
      this.collider(type).moveTo(this._px, this._py);
      return false;
    }
    if (type[0] !== '_') {
      this.moveColliders(x1, y1);
    }
    return true;
  };

  Game_CharacterBase.prototype.canPassDiagonally = function(x, y, horz, vert) {
    return this.canPixelPassDiagonally(x * QMovement.tileSize, y * QMovement.tileSize, horz, vert);
  };

  Game_CharacterBase.prototype.canPixelPassDiagonally = function(x, y, horz, vert, dist, type) {
    dist = dist || this.moveTiles();
    type = type || 'collision';
    var x1 = $gameMap.roundPXWithDirection(x, horz, dist);
    var y1 = $gameMap.roundPYWithDirection(y, vert, dist);
    if (dist === this.moveTiles()) {
      if (!this.canPixelPass(x1, y1, 5, null, type)) return false;
      if (QMovement.midPass) {
        var x2 = $gameMap.roundPXWithDirection(x, horz, dist / 2);
        var y2 = $gameMap.roundPYWithDirection(y, vert, dist / 2);
        if (!this.canPixelPass(x2, y2, 5, null, type)) return false;
      }
    } else {
      return (this.canPixelPass(x, y, vert, dist, type) && this.canPixelPass(x, y1, horz, dist, type)) &&
             (this.canPixelPass(x, y, horz, dist, type) && this.canPixelPass(x1, y, vert, dist, type));
    }
    return true;
  };

  Game_CharacterBase.prototype.collisionCheck = function(x, y, dir, dist, type) {
    this.collider(type).moveTo(x, y);
    if (!this.valid(type)) return false;
    if (this.isThrough() || this.isDebugThrough()) return true;
    if (QMovement.midPass && dir !== 5) {
      if (!this.middlePass(x, y, dir, dist, type)) return false;
    }
    if (this.collidesWithAnyTile(type)) return false;
    if (this.collidesWithAnyCharacter(type)) return false;
    return true;
  };

  Game_CharacterBase.prototype.middlePass = function(x, y, dir, dist, type) {
    var dist = dist / 2 || this.moveTiles() / 2;
    var x2 = $gameMap.roundPXWithDirection(x, this.reverseDir(dir), dist);
    var y2 = $gameMap.roundPYWithDirection(y, this.reverseDir(dir), dist);
    this.collider(type).moveTo(x2, y2);
    if (this.collidesWithAnyTile(type)) return false;
    if (this.collidesWithAnyCharacter(type)) return false;
    this.collider(type).moveTo(x, y);
    return true;
  };

  Game_CharacterBase.prototype.collidesWithAnyTile = function(type) {
    var collider = this.collider(type);
    var collided = false;
    ColliderManager.getCollidersNear(collider, (function(collider) {
      collided = this.collidedWithTile(type, collider);
      if (collided) return 'break';
    }).bind(this));
    return collided;
  };

  Game_CharacterBase.prototype.collidedWithTile = function(type, collider) {
    if (collider.color && this.passableColors().contains(collider.color)) {
      return false;
    }
    if (collider.type && (collider.type !== 'collision' || collider.type !== 'default')) {
      return false;
    }
    return collider.intersects(this.collider(type));
  };

  Game_CharacterBase.prototype.collidesWithAnyCharacter = function(type) {
    var collider = this.collider(type);
    var collided = false;
    ColliderManager.getCharactersNear(collider, function(chara) {
      collided = this.collidedWithCharacter(type, chara);
      if (collided) return 'break';
    }.bind(this));
    return collided;
  };

  Game_CharacterBase.prototype.collidedWithCharacter = function(type, chara) {
    if (chara.isThrough() || chara === this || !chara.isNormalPriority()) {
      return false;
    }
    if (this.ignoreCharacters(type).contains(chara.charaId())) {
      return false;
    }
    return chara.collider('collision').intersects(this.collider(type));
  };

  Game_CharacterBase.prototype.ignoreCharacters = function(type) {
    // This function is to be aliased by plugins to return a list
    // of charaId's this character can pass through
    return [];
  };

  Game_CharacterBase.prototype.valid = function(type) {
    var edge = this.collider(type).gridEdge();
    var maxW = $gameMap.width();
    var maxH = $gameMap.height();
    if (!$gameMap.isLoopHorizontal()) {
      if (edge.x1 < 0 || edge.x2 >= maxW) return false;
    }
    if (!$gameMap.isLoopVertical()) {
      if (edge.y1 < 0 || edge.y2 >= maxH) return false;
    }
    return true;
  };

  Game_CharacterBase.prototype.passableColors = function() {
    // #00000000 is a transparent return value in collisionmap addon
    var colors = ['#ffffff', '#00000000'];
    switch (this._passabilityLevel) {
      case 1:
      case 3: {
        colors.push(QMovement.water1);
        break;
      }
      case 2:
      case 4: {
        colors.push(QMovement.water1);
        colors.push(QMovement.water2);
        break;
      }
    }
    return colors;
  };

  Game_CharacterBase.prototype.canPassToFrom = function(xf, yf, xi, yi, type) {
    xi = xi === undefined ? this._px : xi;
    yi = yi === undefined ? this._py : yi;
    type = type || 'collision';
    // TODO remove this check by having the start and end colliders
    // be included in the _stretched collider
    if (!this.canPixelPass(xi, yi, 5, null, type) || !this.canPixelPass(xf, yf, 5, null, type)) {
      this.collider(type).moveTo(this._px, this._py);
      return false;
    }
    var dx = xf - xi;
    var dy = yf - yi;
    var radian = Math.atan2(dy, dx);
    if (radian < 0) radian += Math.PI * 2;
    var dist = Math.sqrt(dx * dx + dy * dy);
    this._colliders['_stretched'] = this.collider(type).stretchedPoly(radian, dist);
    if (!this.canPixelPass(xi, yi, 5, null, '_stretched')) {
      delete this._colliders['_stretched'];
      return false;
    }
    delete this._colliders['_stretched'];
    return true;
  };

  Game_CharacterBase.prototype.checkEventTriggerTouchFront = function(d) {
    var horz = vert = d;
    if ([1,3,7,9].contains(d)) {
      horz = (d === 1 || d === 7) ? 4 : 6;
      vert = (d === 1 || d === 3) ? 2 : 8;
    }
    var x2 = $gameMap.roundPXWithDirection(this.px, horz, this.moveTiles());
    var y2 = $gameMap.roundPYWithDirection(this.py, vert, this.moveTiles());
    this.checkEventTriggerTouch(x2, y2);
  };

  Game_CharacterBase.prototype.isOnLadder = function() {
    if (!this.collider()) return false;
    var collider = this.collider('collision');
    var collided = false;
    var colliders = ColliderManager.getCollidersNear(collider, function(tile) {
      if (!tile.isTile) return false;
      if (tile.isLadder && tile.intersects(collider)) {
        collided = true;
        return 'break';
      }
      return false;
    });
    return collided;
  };

  Game_CharacterBase.prototype.isOnBush = function() {
    if (!this.collider()) return false;
    var collider = this.collider('collision');
    var collided = false;
    var colliders = ColliderManager.getCollidersNear(collider, function(tile) {
      if (!tile.isTile) return false;
      if (tile.isBush && tile.intersects(collider)) {
        collided = true;
        return 'break';
      }
      return false;
    });
    return collided;
  };

  Game_CharacterBase.prototype.freqThreshold = function() {
    return QMovement.tileSize;
  };

  Game_CharacterBase.prototype.terrainTag = function() {
    return $gameMap.terrainTag(this.x, this.y);
  };

  Game_CharacterBase.prototype.regionId = function() {
    return $gameMap.regionId(this.x, this.y);
  };

  var Alias_Game_CharacterBase_update = Game_CharacterBase.prototype.update;
  Game_CharacterBase.prototype.update = function() {
    var prevX = this._realPX;
    var prevY = this._realPY;
    if (this.startedMoving()) {
      this._isMoving = true;
    } else {
      this.updateStop();
    }
    if (this.isArcing()) {
      this.updateArc();
    } else if (this.isJumping()) {
      this.updateJump();
    } else if (this.isMoving()) {
      this.updateMove();
    }
    this.updateAnimation();
    this.updateColliders();
    if (prevX !== this._realPX || prevY !== this._realPY) {
      this.onPositionChange();
    } else {
      this._isMoving = false;
    }
  };

  Game_CharacterBase.prototype.updateMove = function() {
    var xSpeed = 1;
    var ySpeed = 1;
    if (this._adjustFrameSpeed) {
      xSpeed = Math.cos(this._radian);
      ySpeed = Math.sin(this._radian);
    }
    if (this._px < this._realPX) {
      this._realPX = Math.max(this._realPX - this.frameSpeed(xSpeed), this._px);
    }
    if (this._px > this._realPX) {
      this._realPX = Math.min(this._realPX + this.frameSpeed(xSpeed), this._px);
    }
    if (this._py < this._realPY) {
      this._realPY = Math.max(this._realPY - this.frameSpeed(ySpeed), this._py);
    }
    if (this._py > this._realPY) {
      this._realPY = Math.min(this._realPY + this.frameSpeed(ySpeed), this._py);
    }
    this._x = this._realX = this._realPX / QMovement.tileSize;
    this._y = this._realY = this._realPY / QMovement.tileSize;
    this._freqCount += this.frameSpeed();
  };

  Game_CharacterBase.prototype.updateArc = function() {
    if (this._currentRad < this._targetRad) {
      var newRad = Math.min(this._currentRad + this.angularSpeed(), this._targetRad);
    }
    if (this._currentRad > this._targetRad) {
      var newRad = Math.max(this._currentRad - this.angularSpeed(), this._targetRad);
    }
    var x1 = this._pivotX + this._radiusL * Math.cos(newRad);
    var y1 = this._pivotY + this._radiusH * Math.sin(newRad);
    this._currentRad = newRad;
    this._px = this._realPX = x1;
    this._py = this._realPY = y1;
    this._x = this._realX = this._realPX / QMovement.tileSize;
    this._y = this._realY = this._realPY / QMovement.tileSize;
    this.moveColliders(x1, y1);
    this.checkEventTriggerTouchFront(this._direction);
  };

  var Alias_Game_CharacterBase_updateJump = Game_CharacterBase.prototype.updateJump;
  Game_CharacterBase.prototype.updateJump = function() {
    Alias_Game_CharacterBase_updateJump.call(this);
    this._px = this._realPX = this._x * QMovement.tileSize;
    this._py = this._realPY = this._y * QMovement.tileSize;
    this.moveColliders(this._px, this._py);
  };

  Game_CharacterBase.prototype.updateColliders = function() {
    var colliders = this._colliders;
    if (!colliders) return;
    var hidden = false;
    hidden = this.isTransparent() || this._erased;
    if (!hidden && this.isVisible) {
      hidden = !this.isVisible();
    }
    for (var type in colliders) {
      if (colliders.hasOwnProperty(type)) {
        colliders[type]._isHidden = !!hidden;
      }
    }
  };

  Game_CharacterBase.prototype.onPositionChange = function() {
    this.refreshBushDepth();
  };

  Game_CharacterBase.prototype.refreshBushDepth = function() {
    if (this.isNormalPriority() && !this.isObjectCharacter() &&
        this.isOnBush() && !this.isJumping()) {
      if (!this.startedMoving()) this._bushDepth = 12;
    } else {
      this._bushDepth = 0;
    }
  };

  Game_CharacterBase.prototype.pixelJump = function(xPlus, yPlus) {
    return this.jump(xPlus / QMovement.tileSize, yPlus / QMovement.tileSize);
  };

  Game_CharacterBase.prototype.pixelJumpForward = function(dist, dir) {
    dir = dir || this._direction;
    dist = dist / QMovement.tileSize;
    var x = dir === 6 ? dist : dir === 4 ? -dist : 0;
    var y = dir === 2 ? dist : dir === 8 ? -dist : 0;
    this.jump(x, y);
  };

  Game_CharacterBase.prototype.pixelJumpBackward = function(dist) {
    this.pixelJumpFixed(this.reverseDir(this.direction()), dist);
  };

  Game_CharacterBase.prototype.pixelJumpFixed = function(dir, dist) {
    var lastDirectionFix = this.isDirectionFixed();
    this.setDirectionFix(true);
    this.pixelJumpForward(dist, dir);
    this.setDirectionFix(lastDirectionFix);
  };

  Game_CharacterBase.prototype.moveStraight = function(dir, dist) {
    dist = dist || this.moveTiles();
    this.setMovementSuccess(this.canPixelPass(this._px, this._py, dir, dist));
    var originalSpeed = this._moveSpeed;
    if (this.smartMove() === 1 || this.smartMove() > 2) {
      this.smartMoveSpeed(dir);
    }
    this.setDirection(dir);
    if (this.isMovementSucceeded()) {
      this._forwardRadian = this.directionToRadian(dir);
      this._diagonal = false;
      this._adjustFrameSpeed = false;
      this._px = $gameMap.roundPXWithDirection(this._px, dir, dist);
      this._py = $gameMap.roundPYWithDirection(this._py, dir, dist);
      this._realPX = $gameMap.pxWithDirection(this._px, this.reverseDir(dir), dist);
      this._realPY = $gameMap.pyWithDirection(this._py, this.reverseDir(dir), dist);
      this.increaseSteps();
    } else {
      this.checkEventTriggerTouchFront(dir);
    }
    this._moveSpeed = originalSpeed;
    if (!this.isMovementSucceeded() && this.smartMove() > 1) {
      this.smartMoveDir8(dir);
    }
  };

  Game_CharacterBase.prototype.moveDiagonally = function(horz, vert, dist) {
    dist = dist || this.moveTiles();
    this.setMovementSuccess(this.canPixelPassDiagonally(this._px, this._py, horz, vert, dist));
    var originalSpeed = this._moveSpeed;
    if (this.smartMove() === 1 || this.smartMove() > 2) {
      this.smartMoveSpeed([horz, vert]);
    }
    this.setDirection(this.direction8(horz, vert));
    if (this.isMovementSucceeded()) {
      this._forwardRadian = this.directionToRadian(this.direction8(horz, vert));
      this._adjustFrameSpeed = false;
      this._px = $gameMap.roundPXWithDirection(this._px, horz, dist);
      this._py = $gameMap.roundPYWithDirection(this._py, vert, dist);
      this._realPX = $gameMap.pxWithDirection(this._px, this.reverseDir(horz), dist);
      this._realPY = $gameMap.pyWithDirection(this._py, this.reverseDir(vert), dist);
      this.increaseSteps();
    } else {
      this.checkEventTriggerTouchFront(this.direction8(horz, vert));
    }
    this._moveSpeed = originalSpeed;
    if (!this.isMovementSucceeded() && this.smartMove() > 1) {
      if (this.canPixelPass(this._px, this._py, horz)) {
        this.moveStraight(horz);
      } else if (this.canPixelPass(this._px, this._py, vert)) {
        this.moveStraight(vert);
      }
    }
  };

  Game_CharacterBase.prototype.moveRadian = function(radian, dist) {
    dist = dist || this.moveTiles();
    this.fixedRadianMove(radian, dist);
    if (!this.isMovementSucceeded() && this.smartMove() > 1) {
      var realDir = this.radianToDirection(radian, true);
      var xAxis = Math.cos(radian);
      var yAxis = Math.sin(radian);
      var horz = xAxis > 0 ? 6 : xAxis < 0 ? 4 : 0;
      var vert = yAxis > 0 ? 2 : yAxis < 0 ? 8 : 0;
      if ([1, 3, 7, 9].contains(realDir)) {
        if (this.canPixelPass(this._px, this._py, horz, dist)) {
          this.moveStraight(horz, dist);
        } else if (this.canPixelPass(this._px, this._py, vert, dist)) {
          this.moveStraight(vert, dist);
        }
      } else {
        var dir = this.radianToDirection(radian);
        this.smartMoveDir8(dir);
      }
    }
  };

  Game_CharacterBase.prototype.fixedMove = function(dir, dist) {
    dist = dist || this.moveTiles();
    dir = dir === 5 ? this.direction() : dir;
    if ([1, 3, 7, 9].contains(dir)) {
      var horz = (dir === 1 || dir === 7) ? 4 : 6;
      var vert = (dir === 1 || dir === 3) ? 2 : 8;
      return this.fixedDiagMove(horz, vert, dist);
    }
    this.setMovementSuccess(this.canPixelPass(this._px, this._py, dir, dist));
    this.setDirection(dir);
    if (this.isMovementSucceeded()) {
      this._forwardRadian = this.directionToRadian(dir);
      this._adjustFrameSpeed = false;
      this._px = $gameMap.roundPXWithDirection(this._px, dir, dist);
      this._py = $gameMap.roundPYWithDirection(this._py, dir, dist);
      this._realPX = $gameMap.pxWithDirection(this._px, this.reverseDir(dir), dist);
      this._realPY = $gameMap.pyWithDirection(this._py, this.reverseDir(dir), dist);
      this.increaseSteps();
    } else {
      this.checkEventTriggerTouchFront(dir);
    }
  };

  Game_CharacterBase.prototype.fixedDiagMove = function(horz, vert, dist) {
    dist = dist || this.moveTiles();
    this.setMovementSuccess(this.canPixelPassDiagonally(this._px, this._py, horz, vert));
    this.setDirection(this.direction8(horz, vert));
    if (this.isMovementSucceeded()) {
      this._forwardRadian = this.directionToRadian(this.direction8(horz, vert));
      this._adjustFrameSpeed = false;
      this._px = $gameMap.roundPXWithDirection(this._px, horz, dist);
      this._py = $gameMap.roundPYWithDirection(this._py, vert, dist);
      this._realPX = $gameMap.pxWithDirection(this._px, this.reverseDir(horz), dist);
      this._realPY = $gameMap.pyWithDirection(this._py, this.reverseDir(vert), dist);
      this.increaseSteps();
    } else {
      this.checkEventTriggerTouchFront(this.direction8(horz, vert));
    }
  };

  Game_CharacterBase.prototype.fixedRadianMove = function(radian, dist) {
    dist = dist || this.moveTiles();
    var dir = this.radianToDirection(radian, true);
    var xAxis = Math.cos(radian);
    var yAxis = Math.sin(radian);
    var horzSteps = Math.abs(xAxis) * dist;
    var vertSteps = Math.abs(yAxis) * dist;
    var horz = xAxis > 0 ? 6 : xAxis < 0 ? 4 : 0;
    var vert = yAxis > 0 ? 2 : yAxis < 0 ? 8 : 0;
    var x2 = $gameMap.roundPXWithDirection(this._px, horz, horzSteps);
    var y2 = $gameMap.roundPYWithDirection(this._py, vert, vertSteps);
    this.setMovementSuccess(this.canPassToFrom(x2, y2, this._px, this._py));
    this.setRadian(radian);
    if (this.isMovementSucceeded()) {
      this._forwardRadian = QPlus.adjustRadian(radian);
      this._adjustFrameSpeed = true;
      this._px = x2;
      this._py = y2;
      this._realPX = $gameMap.pxWithDirection(this._px, this.reverseDir(horz), horzSteps);
      this._realPY = $gameMap.pyWithDirection(this._py, this.reverseDir(vert), vertSteps);
      this.increaseSteps();
    } else {
      this.checkEventTriggerTouchFront(dir);
    }
  };

  Game_CharacterBase.prototype.fixedMoveBackward = function(dist) {
    var lastDirectionFix = this.isDirectionFixed();
    this.setDirectionFix(true);
    this.fixedMove(this.reverseDir(this.direction()), dist);
    this.setDirectionFix(lastDirectionFix);
  };

  Game_CharacterBase.prototype.arc = function(pivotX, pivotY, radians, cc, frames) {
    var cc = cc ? 1 : -1;
    var dx = this._px - pivotX;
    var dy = this._py - pivotY;
    var rad = Math.atan2(dy, dx);
    frames = frames || 1;
    rad += rad < 0 ? 2 * Math.PI : 0;
    this._currentRad = rad;
    this._targetRad  = rad + radians * cc;
    this._pivotX = pivotX;
    this._pivotY = pivotY;
    this._radiusL = this._radiusH = Math.sqrt(dy * dy + dx * dx);
    this._angularSpeed = radians / frames;
  };

  Game_CharacterBase.prototype.smartMove = function() {
    return this._smartMove;
  };

  Game_CharacterBase.prototype.smartMoveDir8 = function(dir) {
    var dist = this.moveTiles();
    var collider = this.collider('collision');
    var x1 = this._px;
    var y1 = this._py;
    var x2 = $gameMap.roundPXWithDirection(x1, dir, dist);
    var y2 = $gameMap.roundPYWithDirection(y1, dir, dist);
    collider.moveTo(x2, y2);
    var collided = false;
    ColliderManager.getCharactersNear(collider, (function(chara) {
      if (chara.isThrough() || chara === this || !chara.isNormalPriority() ||
          /<smartdir>/i.test(chara.notes())) {
        return false;
      }
      if (chara.collider('collision').intersects(collider)) {
        collided = true;
        return 'break';
      }
      return false;
    }).bind(this));
    collider.moveTo(x1, y1);
    if (collided) return;
    var horz = [4, 6].contains(dir) ? true : false;
    var steps = horz ? collider.height : collider.width;
    steps /= 2;
    var pass = false;
    for (var i = 0; i < 2; i++) {
      var sign = i === 0 ? 1 : -1;
      var j = 0;
      var x2 = x1;
      var y2 = y1;
      if (horz) {
        x2 = $gameMap.roundPXWithDirection(x1, dir, dist);
      } else {
        y2 = $gameMap.roundPYWithDirection(y1, dir, dist);
      }
      while (j < steps) {
        j += dist;
        if (horz) {
          y2 = y1 + j * sign;
        } else {
          x2 = x1 + j * sign;
        }
        pass = this.canPixelPass(x2, y2, 5);
        if (pass) break;
      }
      if (pass) break;
    }
    if (!pass) return;
    var radian = QPlus.adjustRadian(Math.atan2(y2 - y1, x2 - x1));
    this._forwardRadian = radian;
    this._px = x2;
    this._py = y2;
    this._realPX = x1;
    this._realPY = y1;
    this._adjustFrameSpeed = false;
    this.setRadian(radian);
    this.increaseSteps();
  };

  Game_CharacterBase.prototype.smartMoveSpeed = function(dir) {
    var diag = dir.constructor === Array;
    while (!this.isMovementSucceeded()) {
      // should improve by figuring out what 1 pixel is in terms of movespeed
      // and subtract by that value instead
      this._moveSpeed--;
      if (diag) {
        this.setMovementSuccess(this.canPixelPassDiagonally(this._px, this._py, dir[0], dir[1]));
      } else {
        this.setMovementSuccess(this.canPixelPass(this._px, this._py, dir));
      }
      if (this._moveSpeed < 1) break;
    }
  };

  Game_CharacterBase.prototype.reloadColliders = function() {
    this.removeColliders();
    this.setupColliders();
  };

  Game_CharacterBase.prototype.removeColliders = function() {
    ColliderManager.remove(this);
    for (var collider in this._colliders) {
      if (!this._colliders.hasOwnProperty(collider)) continue;
      ColliderManager.remove(this._colliders[collider]);
      this._colliders[collider] = null;
    }
    this._colliders = null;
  };

  Game_CharacterBase.prototype.collider = function(type) {
    if (!this._colliders) this.setupColliders();
    return this._colliders[type] || this._colliders['default'];
  };

  Game_CharacterBase.prototype.defaultColliderConfig = function() {
    return 'box,0,0';
  };

  Game_CharacterBase.prototype.setupColliders = function() {
    this._colliders = {};
    var defaultCollider = this.defaultColliderConfig();
    var notes = this.notes(true);
    var configs = {};
    var multi = /<colliders>([\s\S]*)<\/colliders>/i.exec(notes);
    var single = /<collider[:|=](.*?)>/i.exec(notes);
    if (multi) {
      configs = QPlus.stringToObj(multi[1]);
    }
    if (single) {
      configs.default = QPlus.stringToAry(single[1]);
    } else if (!configs.default) {
      configs.default = QPlus.stringToAry(defaultCollider);
    }
    Object.assign(configs, this._overrideColliders);
    for (var collider in configs) {
      this.makeCollider(collider, configs[collider]);
    }
    this.makeBounds();
    this.moveColliders();
  };

  Game_CharacterBase.prototype.makeCollider = function(type, settings) {
    this._colliders[type] = ColliderManager.convertToCollider(settings);
    this._colliders[type].oy -= this.shiftY();
    this._colliders[type]._charaId = this.charaId();
    ColliderManager.addCollider(this._colliders[type], -1, true);
  };

  Game_CharacterBase.prototype.changeCollider = function(type, settings) {
    this._overrideColliders[type] = settings;
    this.reloadColliders();
  };

  Game_CharacterBase.prototype.makeBounds = function() {
    var minX = null;
    var maxX = null;
    var minY = null;
    var maxY = null;
    for (var type in this._colliders) {
      if (!this._colliders.hasOwnProperty(type)) continue;
      var edge = this._colliders[type].edge();
      if (minX === null || minX > edge.x1) {
        minX = edge.x1;
      }
      if (maxX === null || maxX < edge.x2) {
        maxX = edge.x2;
      }
      if (minY === null || minY > edge.y1) {
        minY = edge.y1;
      }
      if (maxY === null || maxY < edge.y2) {
        maxY = edge.y2;
      }
    }
    var w = maxX - minX + 1;
    var h = maxY - minY + 1;
    this._colliders['bounds'] = new Box_Collider(w, h, minX, minY);
    this._colliders['bounds']._charaId = String(this.charaId());
    ColliderManager.addCharacter(this, 0);
  };

  Game_CharacterBase.prototype.moveColliders = function(x, y) {
    x = typeof x === 'number' ? x : this.px;
    y = typeof y === 'number' ? y : this.py;
    var prev = this._colliders['bounds'].sectorEdge();
    for (var collider in this._colliders) {
      if (this._colliders.hasOwnProperty(collider)) {
        this._colliders[collider].moveTo(x, y);
      }
    }
    ColliderManager.updateGrid(this, prev);
  };

  Game_CharacterBase.prototype.cx = function() {
    return this.collider('collision').center.x;
  };

  Game_CharacterBase.prototype.cy = function() {
    return this.collider('collision').center.y;
  };
})();
