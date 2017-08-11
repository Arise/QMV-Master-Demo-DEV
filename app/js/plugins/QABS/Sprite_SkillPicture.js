//-----------------------------------------------------------------------------
// Sprite_SkillPicture

function Sprite_SkillPicture() {
  this.initialize.apply(this, arguments);
}

(function() {
  Sprite_SkillPicture.prototype = Object.create(Sprite.prototype);
  Sprite_SkillPicture.prototype.constructor = Sprite_SkillPicture;

  Sprite_SkillPicture.prototype.initialize = function() {
    Sprite.prototype.initialize.call(this);
    this._maxFrames = 1;
    this._speed = 0;
    this._isAnimated = false;
    this._tick = 0;
    this._frameI = 0;
    this._lastFrameI = null;
    this._realX = this.x;
    this._realY = this.y;
  };

  Sprite_SkillPicture.prototype.setupAnim = function(frames, speed) {
    this._isAnimated = true;
    this._maxFrames = frames;
    this._speed = speed;
  };

  Sprite_SkillPicture.prototype.update = function() {
    Sprite.prototype.update.call(this);
    this.updatePosition();
    if (this._isAnimated) this.updateAnimation();
    this.updateFrame();
  };

  Sprite_SkillPicture.prototype.updatePosition = function() {
    this.x = this._realX;
    this.x -= $gameMap.displayX() * QMovement.tileSize;
    this.y = this._realY;
    this.y -= $gameMap.displayY() * QMovement.tileSize;
  };

  Sprite_SkillPicture.prototype.updateAnimation = function() {
    if (this._tick % this._speed === 0) {
      this._frameI = (this._frameI + 1) % this._maxFrames;
    }
    this._tick = (this._tick + 1) % this._speed;
  };

  Sprite_SkillPicture.prototype.updateFrame = function() {
    if (this._lastFrameI !== null) {
      if (this._lastFrameI === this._frameI) return;
    }
    var i = this._frameI;
    var pw = this.bitmap.width / this._maxFrames;
    var ph = this.bitmap.height;
    var sx = i * pw;
    this.setFrame(sx, 0, pw, ph);
    this._lastFrameI = i;
  };

  Sprite_SkillPicture.prototype.move = function(x, y) {
    Sprite.prototype.move.call(this, x, y);
    this._realX = x;
    this._realY = y;
    this.updatePosition();
  };
})();
