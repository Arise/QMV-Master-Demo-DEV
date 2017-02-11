//-----------------------------------------------------------------------------
// Game_CharacterBase

(function() {
  Object.defineProperties(Game_CharacterBase.prototype, {
      px: { get: function() { return this._px; }, configurable: true },
      py: { get: function() { return this._py; }, configurable: true }
  });

  var Alias_Game_CharacterBase_initMembers = Game_CharacterBase.prototype.initMembers;
  Game_CharacterBase.prototype.initMembers = function() {
    Alias_Game_CharacterBase_initMembers.call(this);
    this._px = 0;
    this._py = 0;
    this._realPX = 0;
    this._realPY = 0;
    this._radian = 0;
    this._adjustFrameSpeed = false;
    this._moveCount = 0;
    this._freqCount = 0;
    this._diagonal = false;
    this._currentRad = 0;
    this._targetRad = 0;
    this._pivotX = 0;
    this._pivotY = 0;
    this._radiusL = 0;
    this._radisuH = 0;
    this._angularSpeed;
    this._passabilityLevel = 0; // todo
  };

  Game_CharacterBase.prototype.direction8 = function(horz, vert) {
    if (horz === 4 && vert === 8) return 7;
    if (horz === 4 && vert === 2) return 1;
    if (horz === 6 && vert === 8) return 9;
    if (horz === 6 && vert === 2) return 3;
    return 5;
  };

  Game_CharacterBase.prototype.isMoving = function() {
    return this._moveCount > 0;
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
    if (!this.isDirectionFixed() && d) {
      this._radian = this.directionToRadian(d);
      if ([1, 3, 7, 9].contains(d)) {
        this._diagonal = d;
        this.resetStopCount();
        return;
      } else {
        this._diagonal = false;
      }
    }
    Alias_Game_CharacterBase_setDirection.call(this, d);
  };

  Game_CharacterBase.prototype.moveTiles = function() {
    if (QMovement.grid < this.frameSpeed()) {
      return QMovement.offGrid ? this.frameSpeed() : QMovement.grid
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

  Game_CharacterBase.prototype.canMove = function() {
    return !this._locked;
  };

  Game_CharacterBase.prototype.canPass = function(x, y, dir) {
    return this.canPixelPass(x * QMovement.tileSize, y * QMovement.tileSize, dir);
  };

  Game_CharacterBase.prototype.canPixelPass = function(x, y, dir, dist) {
    var dist = dist || this.moveTiles();
    var x1 = $gameMap.roundPXWithDirection(x, dir, dist);
    var y1 = $gameMap.roundPYWithDirection(y, dir, dist);
    if (!this.collisionCheck(x1, y1, dir, dist)) {
      this.collider('collision').moveTo(this._px, this._py);
      return false;
    }
    this.moveColliders(x1, y1);
    return true;
  };

  Game_CharacterBase.prototype.canPassDiagonally = function(x, y, horz, vert) {
    return this.canPixelPassDiagonally(x * QMovement.tileSize, y * QMovement.tileSize, horz, vert);
  };

  Game_CharacterBase.prototype.canPixelPassDiagonally = function(x, y, horz, vert, dist) {
    var dist = dist || this.moveTiles();
    var x1 = $gameMap.roundPXWithDirection(x, horz, dist);
    var y1 = $gameMap.roundPYWithDirection(y, vert, dist);
    if (this._smartMoveDir) {
      return (this.canPixelPass(x, y, vert, dist) && this.canPixelPass(x, y1, horz, dist)) ||
             (this.canPixelPass(x, y, horz, dist) && this.canPixelPass(x1, y, vert, dist));
    } else {
      return (this.canPixelPass(x, y, vert, dist) && this.canPixelPass(x, y1, horz, dist)) &&
             (this.canPixelPass(x, y, horz, dist) && this.canPixelPass(x1, y, vert, dist));
    }
  };

  Game_CharacterBase.prototype.collisionCheck = function(x, y, dir, dist) {
    this.collider('collision').moveTo(x, y);
    if (!this.valid()) return false;
    if (this.isThrough() || this.isDebugThrough()) return true;
    if (this.collideWithTile()) return false;
    if (this.collideWithCharacter()) return false;
    return true;
  };

  Game_CharacterBase.prototype.collideWithTile = function() {
    var collider = this.collider('collision');
    var collided = false;
    ColliderManager.getCollidersNear(collider, (function(tile) {
      if (!tile.isTile) return false;
      if (this.passableColors().contains(tile.color)) {
        return false;
      }
      collided = tile.intersects(collider);
      if (collided) return 'break';
    }).bind(this));
    return collided;
  };

  Game_CharacterBase.prototype.collideWithCharacter = function() {
    var collider = this.collider('collision');
    var collided = false;
    ColliderManager.getCharactersNear(collider, (function(chara) {
      if (chara.isThrough() || chara === this || !chara.isNormalPriority()) {
        return false;
      }
      collided = chara.collider('collision').intersects(collider);
      if (collided) return 'break';
    }).bind(this));
    return collided;
  };

  Game_CharacterBase.prototype.valid = function() {
    var edge = this.collider('collision').gridEdge();
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
    var colors = ["#ffffff", "#000000"];
    switch (this._passabilityLevel) {
      case 1:
      case 3:
        colors.push(QMovement.water1);
        break;
      case 2:
      case 4:
        colors.push(QMovement.water1);
        colors.push(QMovement.water2);
        break;
    }
    return colors;
  };

  Game_CharacterBase.prototype.checkEventTriggerTouchFront = function(d) {
    var x2 = $gameMap.roundPXWithDirection(this.px, d, this.moveTiles());
    var y2 = $gameMap.roundPYWithDirection(this.py, d, this.moveTiles());
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

  var Alias_Game_CharacterBase_update = Game_CharacterBase.prototype.update;
  Game_CharacterBase.prototype.update = function() {
    var prevX = this._realPX;
    var prevY = this._realPY;
    if (this.isStopping()) {
      this.updateStop();
    }
    if (this.isArcing()) {
      this.updateArc();
    } else if (this.isJumping()) {
      this.updateJump();
    } else if (this.startedMoving()) {
      this.updateMove();
    }
    this.updateAnimation();
    this.updateColliders();
    if ((prevX !== this._realPX || prevY !== this._realPY) || this.startedMoving()) {
      this.onPositionChange();
    } else {
      this._moveCount = 0;
    }
  };

  Game_CharacterBase.prototype.updateMove = function() {
    if (this.isArcing()) return;
    var xSpeed = 1;
    var ySpeed = 1;
    if (this._adjustFrameSpeed) {
      xSpeed = Math.round(Math.cos(this._radian) * 10000) / 10000;
      ySpeed = Math.round(Math.sin(this._radian) * 10000) / 10000;
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
    this._x = this._px / QMovement.tileSize;
    this._y = this._py / QMovement.tileSize;
    this._realX = this._realPX / QMovement.tileSize;
    this._realY = this._realPY / QMovement.tileSize;
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
    var y1 = this._pivotY + this._radiusH * -Math.sin(newRad);
    this._currentRad = newRad;
    this._px = this._realPX = x1;
    this._py = this._realPY = y1;
    this._x = this._realX = this._px / QMovement.tileSize;
    this._y = this._realY = this._py / QMovement.tileSize;
    this.moveColliders(x1, y1);
    this.checkEventTriggerTouchFront(this._direction);
  };

  var Alias_Game_CharacterBase_updateJump = Game_CharacterBase.prototype.updateJump;
  Game_CharacterBase.prototype.updateJump = function() {
    Alias_Game_CharacterBase_updateJump.call(this);
    this._px = this._realPX = this._x * QMovement.tileSize;
    this._py = this._realPY = this._y * QMovement.tileSize;
    this.moveAllBoxes(this._px, this._py);
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

  Game_CharacterBase.prototype._refreshBushDepth = function() {
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

  Game_CharacterBase.prototype.moveStraight = function(d) {
    this.setMovementSuccess(this.canPixelPass(this.px, this.py, d));
    var originalSpeed = this._moveSpeed;
    if (this.smartMove() > 0) this.smartMoveSpeed(d);
    if (this.isMovementSucceeded()) {
      this._diagonal = false;
      this._adjustFrameSpeed = false;
      this.setDirection(d);
      this._px = $gameMap.roundPXWithDirection(this._px, d, this.moveTiles());
      this._py = $gameMap.roundPYWithDirection(this._py, d, this.moveTiles());
      this._realPX = $gameMap.pxWithDirection(this._px, this.reverseDir(d), this.moveTiles());
      this._realPY = $gameMap.pyWithDirection(this._py, this.reverseDir(d), this.moveTiles());
      this._moveCount++;
      this.increaseSteps();
    } else {
      this.setDirection(d);
      this.checkEventTriggerTouchFront(d);
    }
    this._moveSpeed = originalSpeed;
    if (!this.isMovementSucceeded() && this.smartMove() > 1) {
      this.smartMoveDir8(d);
    }
  };

  Game_CharacterBase.prototype.moveDiagonally = function(horz, vert) {
    this.setMovementSuccess(this.canPixelPassDiagonally(this.px, this.py, horz, vert));
    var originalSpeed = this._moveSpeed;
    if (this.smartMove() > 0) this.smartMoveSpeed([horz, vert], true);
    if (this.isMovementSucceeded()) {
      this._diagonal = this.direction8(horz, vert);
      this._adjustFrameSpeed = false;
      this._px = $gameMap.roundPXWithDirection(this._px, horz, this.moveTiles());
      this._py = $gameMap.roundPYWithDirection(this._py, vert, this.moveTiles());
      this._realPX = $gameMap.pxWithDirection(this._px, this.reverseDir(horz), this.moveTiles());
      this._realPY = $gameMap.pyWithDirection(this._py, this.reverseDir(vert), this.moveTiles());
      this._moveCount++;
      this.increaseSteps();
    } else {
      this._diagonal = false;
    }
    if (this._direction === this.reverseDir(horz)) {
      this.setDirection(horz);
    }
    if (this._direction === this.reverseDir(vert)) {
      this.setDirection(vert);
    }
    this._moveSpeed = originalSpeed;
    if (!this.isMovementSucceeded() && this.smartMove() > 1) {
      if (this.canPixelPass(this.px, this.py, horz)) {
        this.moveStraight(horz);
      } else if (this.canPixelPass(this.px, this.py, vert)) {
        this.moveStraight(vert);
      }
    }
  };

  Game_CharacterBase.prototype.fixedMove = function(dir, dist) {
    dir = dir === 5 ? this.direction() : dir;
    if ([1, 3, 7, 9].contains(dir)) {
      var diag = {
        1: [4, 2],
        3: [6, 2],
        7: [4, 8],
        9: [6, 8]
      }
      return this.fixedDiagMove(diag[dir][0], diag[dir][1], dist);
    }
    this.setMovementSuccess(this.canPixelPass(this.px, this.py, dir, dist));
    if (this.isMovementSucceeded()) {
      this._diagonal = false;
      this._adjustFrameSpeed = false;
      this.setDirection(dir);
      this._px = $gameMap.roundPXWithDirection(this._px, dir, dist);
      this._py = $gameMap.roundPYWithDirection(this._py, dir, dist);
      this._realPX = $gameMap.pxWithDirection(this._px, this.reverseDir(dir), dist);
      this._realPY = $gameMap.pyWithDirection(this._py, this.reverseDir(dir), dist);
      this._moveCount++;
      this.increaseSteps();
    } else {
      this.setDirection(dir);
      this.checkEventTriggerTouchFront(dir);
    }
  };

  Game_CharacterBase.prototype.fixedDiagMove = function(horz, vert, dist) {
    this.setMovementSuccess(this.canPixelPassDiagonally(this.px, this.py, horz, vert));
    if (this.isMovementSucceeded()) {
      this._diagonal = this.direction8(horz, vert);
      this._adjustFrameSpeed = false;
      this._px = $gameMap.roundPXWithDirection(this._px, horz, dist);
      this._py = $gameMap.roundPYWithDirection(this._py, vert, dist);
      this._realPX = $gameMap.pxWithDirection(this._px, this.reverseDir(horz), dist);
      this._realPY = $gameMap.pyWithDirection(this._py, this.reverseDir(vert), dist);
      this._moveCount++;
      this.increaseSteps();
    } else {
      this._diagonal = false;
    }
    if (this._direction === this.reverseDir(horz)) {
      this.setDirection(horz);
    }
    if (this._direction === this.reverseDir(vert)) {
      this.setDirection(vert);
    }
  };

  Game_CharacterBase.prototype.fixedMoveBackward = function(dist) {
    var lastDirectionFix = this.isDirectionFixed();
    this.setDirectionFix(true);
    this.fixedMove(this.reverseDir(this.direction()), dist);
    this.setDirectionFix(lastDirectionFix);
  };

  Game_CharacterBase.prototype.slideTo = function(x, y) {
    this._radian = Math.atan2(this._py - y, this._px - x);
    this._radian = this._radian < 0 ? rad + 2 * Math.PI : this._radian;
    this._adjustFrameSpeed = true;
    this._px = x;
    this._py = y;
    this._moveCount++;
    this.increaseSteps();
  };

  Game_CharacterBase.prototype.arc = function(pivotX, pivotY, radians, cc, frames) {
    var cc = cc ? 1 : -1;
    var dx = this._px - pivotX;
    var dy = this._py - pivotY;
    var rad = Math.atan2(-dy, dx);
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
    return 0;
  };

  Game_CharacterBase.prototype.smartMoveDir8 = function(dir) {
    var x1 = this._px;
    var y1 = this._py;
    var dist = this.moveTiles();
    var horz = [4, 6].contains(dir) ? true : false;
    var collider = this.collider('collision');
    var steps = horz ? collider.height : collider.width;
    steps /= 2;
    for (var i = 0; i < 2; i++) {
      var sign = i === 0 ? 1 : -1;
      var j = 0;
      var x2 = x1;
      var y2 = y1;
      while (j < steps) {
        j += dist;
        if (horz) {
          x2 = $gameMap.roundPXWithDirection(x1, dir, dist);
          y2 = y1 + j * sign;
        } else {
          y2 = $gameMap.roundPYWithDirection(y1, dir, dist);
          x2 = x1 + j * sign;
        }
        var pass = this.canPixelPass(x2, y2, 5);
        if (pass) break;
      }
      if (pass) break;
    }
    if (pass) {
      var x3 = $gameMap.roundPXWithDirection(x1, dir, dist);
      var y3 = $gameMap.roundPYWithDirection(y1, dir, dist);
      collider.moveTo(x3, y3);
      var collided = false;
      ColliderManager.getCharactersNear(collider, function(chara) {
        if (chara.notes && /<nosmartdir>/i.test(chara.notes())) {
          collided = true;
          return 'break';
        }
        return false;
      });
      if (collided) {
        collider.moveTo(x1, y1);
        return;
      }
      collider.moveTo(x2, y2);
      this._realPX = x1;
      this._realPY = y1;
      this._px = x2;
      this._py = y2;
      this._radian = Math.atan2(y1 - y2, x2 - x1);
      this._radian += this._radian < 0 ? 2 * Math.PI : 0;
      this._adjustFrameSpeed = false;
      this._moveCount++;
      this.increaseSteps();
    }
  };

  Game_CharacterBase.prototype.smartMoveSpeed = function(dir, diag) {
    while (!this.isMovementSucceeded()) {
      this._moveSpeed--;
      if (diag) {
        this.setMovementSuccess(this.canPixelPassDiagonally(this.px, this.py, dir[0], dir[1]));
      } else {
        this.setMovementSuccess(this.canPixelPass(this.px, this.py, dir));
      }
      if (this._moveSpeed < 1) break;
    }
  };

  Game_CharacterBase.prototype.reloadColliders = function() {
    for (var collider in this._colliders) {
      if (!this._colliders.hasOwnProperty(collider)) continue;
      ColliderManager.remove(this._colliders[collider]);
      this._colliders[collider] = null;
    }
    this.setupColliders();
  };

  Game_CharacterBase.prototype.collider = function(type) {
    if (!$dataMap) return;
    if (!this._colliders) this.setupColliders();
    return this._colliders[type] || this._colliders['default'];
  };

  Game_CharacterBase.prototype.setupColliders = function() {
    this._colliders = {};
    var defaultCollider = 'box, 36, 24, 6, 24';
    var notes = this.notes(true);
    var configs = {};
    var multi = /<colliders>([\s\S]*)<\/colliders>/i.exec(notes);
    var single = /<collider[=|:]([0-9a-z,-\s]*?)>/i.exec(notes);
    if (multi) {
      configs = QPlus.stringToObj(multi[1]);
    }
    if (single) {
      configs.default = QPlus.stringToAry(single[1]);
    }
    if (!configs.default) {
      configs.default = QPlus.stringToAry(defaultCollider);
    }
    for (var collider in configs) {
      if (!configs.hasOwnProperty(collider)) continue;
      configs[collider][4] = configs[collider][4] || 0;
      configs[collider][4] -= this.shiftY();
      this._colliders[collider] = ColliderManager.convertToCollider(configs[collider]);
      this._colliders[collider]._charaId = String(this.charaId());
      ColliderManager.addCollider(this._colliders[collider], -1, true);
    }
    this.makeBounds();
    this.moveColliders();
  };

  Game_CharacterBase.prototype.makeBounds = function() {
    var minX;
    var maxX;
    var minY;
    var maxY;
    for (var type in this._colliders) {
      if (!this._colliders.hasOwnProperty(type)) continue;
      var edge = this._colliders[type].edge();
      if (!minX || minX > edge.x1 - this._px) {
        minX = edge.x1;
      }
      if (!maxX || maxX < edge.x2 - this._px) {
        maxX = edge.x2;
      }
      if (!minY || minY > edge.y1 - this._py) {
        minY = edge.y1;
      }
      if (!maxY || maxY < edge.y2 - this._py) {
        maxY = edge.y2;
      }
    }
    var w = maxX - minX;
    var h = maxY - minY;
    this._colliders['bounds'] = new Box_Collider(w, h, minX, minY);
    this._colliders['bounds'].isTile = false;
    this._colliders['bounds']._charaId = String(this.charaId());
    ColliderManager.addCharacter(this, 0);
  };

  Game_CharacterBase.prototype.moveColliders = function(x, y) {
    if (!$dataMap) return;
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
