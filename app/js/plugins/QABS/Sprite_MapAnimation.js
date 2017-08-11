//-----------------------------------------------------------------------------
// Sprite_MapAnimation

function Sprite_MapAnimation() {
  this.initialize.apply(this, arguments);
}

(function() {
  Sprite_MapAnimation.prototype = Object.create(Sprite_Base.prototype);
  Sprite_MapAnimation.prototype.constructor = Sprite_MapAnimation;

  Sprite_MapAnimation.prototype.initialize = function(animation) {
    Sprite_Base.prototype.initialize.call(this);
    this.z = 8;
    this._realX = this.x;
    this._realY = this.y;
    this._animation = animation;
    this._hasStarted = false;
  };

  Sprite_MapAnimation.prototype.update = function() {
    Sprite_Base.prototype.update.call(this);
    this.updatePosition();
    if (!this._hasStarted && this.parent) {
      this.startAnimation(this._animation, false, 0);
      this._hasStarted = true;
    }
    if (this._hasStarted && !this.isAnimationPlaying()) {
      QABSManager.removeAnimation(this);
    }
  };

  Sprite_MapAnimation.prototype.updatePosition = function() {
    this.x = this._realX;
    this.x -= $gameMap.displayX() * QMovement.tileSize;
    this.y = this._realY;
    this.y -= $gameMap.displayY() * QMovement.tileSize;
  };

  Sprite_MapAnimation.prototype.move = function(x, y) {
    Sprite_Base.prototype.move.call(this, x, y);
    this._realX = x;
    this._realY = y;
    this.updatePosition();
  };
})();
