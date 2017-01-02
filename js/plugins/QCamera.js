//=============================================================================
// QCamera
//=============================================================================

var Imported = Imported || {};
Imported.QCamera = '1.0.0';

if (!Imported.QPlus) {
  var msg = 'Error: QCamera requires QPlus to work.';
  alert(msg);
  throw new Error(msg);
}

//=============================================================================
 /*:
 * @plugindesc <QCamera>
 * desc
 * @author Quxios  | Version 1.0.0
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
 *   -rmwlink-
 *
 * Terms of use:
 *
 *   https://github.com/quxios/QMV-Master-Demo/blob/master/readme.md
 *
 * @tags
 */
//=============================================================================

//=============================================================================
// New Classes

function Sprite_Bars() {
  this.initialize.apply(this, arguments);
}

//=============================================================================
// QCamera

(function() {
  var _offset = 0.5;
  var _delay = 15;

  //-----------------------------------------------------------------------------
  // Game_Map

  var Alias_Game_Map_setupScroll = Game_Map.prototype.setupScroll;
  Game_Map.prototype.setupScroll = function() {
    Alias_Game_Map_setupScroll.call(this);
    this._scrollTarget = $gamePlayer;
    this._scrollFrames = null;
    this._scrollRadian = null;
  };

  Game_Map.prototype.displayX = function() {
    return Math.round(this._displayX * this.tileWidth()) / this.tileWidth();
  };

  Game_Map.prototype.displayY = function() {
    return Math.round(this._displayY * this.tileHeight()) / this.tileHeight();
  };

  var Alias_Game_Map_startScroll = Game_Map.prototype.startScroll;
  Game_Map.prototype.startScroll = function(direction, distance, speed) {
    Alias_Game_Map_startScroll.call(this, direction, distance, speed);
    this._scrollFrames = null;
    this._scrollRadian = null;
  };

  Game_Map.prototype.startQScroll = function(distanceX, distanceY, speed, frames) {
    var directionX = distanceX > 0 ? 6 : distanceX < 0 ? 4 : 0;
    var directionY = distanceY > 0 ? 2 : distanceY < 0 ? 8 : 0;
    this._scrollDirection = [directionX, directionY];
    this._scrollRest      = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
    this._scrollDistance  = this._scrollRest;
    this._scrollSpeed     = speed || null;
    this._scrollFrames    = frames || null;
    this._scrollRadian    = Math.atan2(-distanceY, distanceX);
  };

  var Alias_Game_Map_scrollDistance = Game_Map.prototype.scrollDistance;
  Game_Map.prototype.scrollDistance = function() {
    if (this._scrollFrames !== null) {
      var dist = Math.abs(this._scrollDistance / this._scrollFrames);
      return dist;
    }
    return Alias_Game_Map_scrollDistance.call(this);
  }

  Game_Map.prototype.scrollDistanceX = function() {
    return Math.abs(this.scrollDistance() * Math.cos(this._scrollRadian));
  };

  Game_Map.prototype.scrollDistanceY = function() {
    return Math.abs(this.scrollDistance() * Math.sin(this._scrollRadian));
  };

  Game_Map.prototype.displayCenterX = function() {
    var half = this.screenTileX() / 2;
    var x = this._displayX + half;
    if (!this.isLoopHorizontal()) {
      if (x < half) {
        x = half;
      }
      if (x > this.width() - half) {
        x = this.width() - half;
      }
    }
    return x;
  };

  Game_Map.prototype.displayCenterY = function() {
    var half = this.screenTileY() / 2;
    var y = this._displayY + half;
    if (!this.isLoopVertical()) {
      if (y < half) {
        y = half;
      }
      if (y > this.height() - half) {
        y = this.height() - half;
      }
    }
    return y;
  };

  var Alias_Game_Map_doScroll = Game_Map.prototype.doScroll;
  Game_Map.prototype.doScroll = function(direction, distance) {
    if (direction.constructor === Array) {
      if (direction[0] === 4) {
        this.scrollLeft(this.scrollDistanceX());
      } else if (direction[0] === 6) {
        this.scrollRight(this.scrollDistanceX());
      }
      if (direction[1] === 2) {
        this.scrollDown(this.scrollDistanceY());
      } else if (direction[1] === 8) {
        this.scrollUp(this.scrollDistanceY());
      }
    } else {
      Alias_Game_Map_doScroll.call(this, direction, distance);
    }
  };

  Game_Map.prototype.scrollTo = function(chara, speed, frames) {
    var centerX = this.displayCenterX();
    var centerY = this.displayCenterY();
    if (!this.isLoopHorizontal()) {
      if (centerX < this.screenTileX() / 2) {
        centerX = this.screenTileX() / 2;
      }
      if (centerX > this.width() - this.screenTileX() / 2) {
        centerX = this.width() - this.screenTileX() / 2;
      }
    }
    if (!this.isLoopVertical()) {
      if (centerY < this.screenTileY() / 2) {
        centerY = this.screenTileY() / 2;
      }
      if (centerY > this.height() - this.screenTileY() / 2) {
        centerY = this.height() - this.screenTileY() / 2;
      }
    }
    var distanceX = (chara._realX + 0.5) - centerX;
    var distanceY = (chara._realY + 0.5) - centerY;
    this.startQScroll(distanceX, distanceY, speed, frames);
  };

  Game_Map.prototype.focusOn = function(target) {
    this.scrollTo(target, null, 15);
    this._scrollTarget = target;
  };

  //-----------------------------------------------------------------------------
  // Game_Character

  var Alias_Game_CharacterBase_initMembers = Game_CharacterBase.prototype.initMembers;
  Game_CharacterBase.prototype.initMembers = function() {
    Alias_Game_CharacterBase_initMembers.call(this);
    this._cameraCounter = 0;
    this._lastFrameDist = this.distancePerFrame();
  };

  var Alias_Game_CharacterBase_setPosition = Game_CharacterBase.prototype.setPosition;
  Game_CharacterBase.prototype.setPosition = function(x, y) {
    Alias_Game_CharacterBase_setPosition.call(this, x, y);
    this._lastX = this._realX;
    this._lastY = this._realY;
  };

  var Alias_Game_CharacterBase_copyPosition = Game_CharacterBase.prototype.copyPosition;
  Game_CharacterBase.prototype.copyPosition = function(character) {
    Alias_Game_CharacterBase_copyPosition.call(this, character);
    this._lastX = this._realX;
    this._lastY = this._realY;
  };

  var Alias_Game_Character_update = Game_Character.prototype.update;
  Game_Character.prototype.update = function() {
    var lastScrolledX  = this.scrolledX();
    var lastScrolledY  = this.scrolledY();
    Alias_Game_Character_update.call(this);
    if ($gameMap._scrollTarget === this) {
      if (_offset === 0) {
        this.updateNormalScroll(lastScrolledX, lastScrolledY)
      } else {
        this.updateQScroll();
      }
    }
  };

  Game_Character.prototype.updateQScroll = function() {
    if ($gameMap._scrollTarget === this) {
      var x1 = this._lastX;
      var y1 = this._lastY;
      var x2 = this._realX;
      var y2 = this._realY;
      var dx = $gameMap.deltaX(x2, x1);
      var dy = $gameMap.deltaY(y2, y1);
      if (dx !== 0 || dy !== 0) {
        if (this._cameraCounter < _delay) {
          this._cameraCounter++;
        } else if (this._cameraCounter > _delay) {
          this._cameraCounter--;
        }
        if (this.distancePerFrame() !== this._lastFrameDist) {
          var ratio = this.distancePerFrame() / this._lastFrameDist;
          var frames = Math.round(_offset / this.distancePerFrame());
          this._cameraCounter = (_delay + frames) * ratio;
        }
        if ($gameMap.isScrolling()) return;
        this._lastX = x2;
        this._lastY = y2;
        this._lastFrameDist = this.distancePerFrame();
        var frames = _offset / this.distancePerFrame();
        frames *= this._cameraCounter / _delay;
        $gameMap.scrollTo(this, null, Math.round(frames) || 1);
      } else {
        this._cameraCounter = 0;
      }
    }
  };

  Game_Character.prototype.updateNormalScroll = function(lastScrolledX, lastScrolledY) {
    var x1 = lastScrolledX;
    var y1 = lastScrolledY;
    var x2 = this.scrolledX();
    var y2 = this.scrolledY();
    // old updateScroll
    if (y2 > y1 && y2 > this.centerY()) {
      $gameMap.scrollDown(y2 - y1);
    }
    if (x2 < x1 && x2 < this.centerX()) {
      $gameMap.scrollLeft(x1 - x2);
    }
    if (x2 > x1 && x2 > this.centerX()) {
      $gameMap.scrollRight(x2 - x1);
    }
    if (y2 < y1 && y2 < this.centerY()) {
      $gameMap.scrollUp(y1 - y2);
    }
  };

  Game_Character.prototype._updateScrollTarget = function(wasMoving) {
    if ($gameMap._scrollTarget === this) {
      var x1 = this._lastX;
      var y1 = this._lastY;
      var x2 = this._realX;
      var y2 = this._realY;
      var dx = $gameMap.deltaX(x2, x1);
      var dy = $gameMap.deltaY(y2, y1);
      if (this.isMoving()) {
        if (dx !== 0 && Math.abs(dx) < _offset) {
          return;
        }
        if (dy !== 0 && Math.abs(dy) < _offset) {
          return;
        }
      }
      if ($gameMap.isScrolling()) return;
      if (dx !== 0 || dy !== 0) {
        this._lastX = x2;
        this._lastY = y2;
        var frames = _offset / this.distancePerFrame();
        $gameMap.scrollTo(this, null, Math.round(frames) || 1);
      }
    }
  };

  Game_Player.prototype.updateScroll = function(lastScrolledX, lastScrolledY) {
    // removed
  };

  //-----------------------------------------------------------------------------
  // Spriteset_Map

  var Alias_Spriteset_Map_createUpperLayer = Spriteset_Map.prototype.createUpperLayer;
  Spriteset_Map.prototype.createUpperLayer = function() {
    this.createBars();
    Alias_Spriteset_Map_createUpperLayer.call(this);
  };

  Spriteset_Map.prototype.createBars = function() {
    this._bars = new Sprite_Bars();
    this.addChild(this._bars);
  };

  //-----------------------------------------------------------------------------
  // Sprite_Bars

  Sprite_Bars.prototype = Object.create(Sprite.prototype);
  Sprite_Bars.prototype.constructor = Sprite_Base;

  Sprite_Bars.prototype.initialize = function() {
    Sprite.prototype.initialize.call(this);
    this.bitmap = new Bitmap(Graphics.width, Graphics.height);
    this.x = Graphics.width / 2;
    this.y = Graphics.height / 2;
    this.anchor.x = 0.5;
    this.anchor.y = 0.5;
    this._barHeight = 0;
    this._newBarHeight = 0;
    this._barSpeed = 0;
  };

  Sprite_Bars.prototype.update = function() {
    Sprite.prototype.update.call(this);
    if ($gameMap.requestBars) {
      this.startBar();
    }
    if (this._barHeight !== this._newBarHeight) {
      if (this._newBarHeight > this._barHeight) {
        this._barHeight = Math.min(this._barHeight + this._barSpeed, this._newBarHeight);
      } else if (this._newBarHeight < this._barHeight) {
        this._barHeight = Math.max(this._barHeight - this._barSpeed, this._newBarHeight);
      }
      this.drawBar();
    }
  };

  Sprite_Bars.prototype.startBar = function() {
    this._newBarHeight = $gameMap.requestBars.height;
    var dh = Math.abs(this._newBarHeight - this._barHeight);
    this._barSpeed = dh / $gameMap.requestBars.frames;
    $gameMap.requestBars = null;
  };

  Sprite_Bars.prototype.drawBar = function() {
    console.log(1);
    this.bitmap.clear();
    this.bitmap.fillRect(0, 0, Graphics.width, this._barHeight, '#000000');
    var y = Graphics.height - this._barHeight;
    this.bitmap.fillRect(0, y, Graphics.width, this._barHeight, '#000000');
  };

})()
