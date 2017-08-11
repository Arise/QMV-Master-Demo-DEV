//-----------------------------------------------------------------------------
// Sprite_SkillTrail

function Sprite_SkillTrail() {
  this.initialize.apply(this, arguments);
}

(function() {
  Sprite_SkillTrail.prototype = Object.create(TilingSprite.prototype);
  Sprite_SkillTrail.prototype.constructor = Sprite_SkillTrail;

  Sprite_SkillTrail.prototype.initialize = function() {
    TilingSprite.prototype.initialize.call(this);
    this._realX = this.x;
    this._realY = this.y;
  };

  Sprite_SkillTrail.prototype.update = function() {
    TilingSprite.prototype.update.call(this);
    this.updatePosition();
  };

  Sprite_SkillTrail.prototype.updatePosition = function() {
    this.x = this._realX;
    this.x -= $gameMap.displayX() * QMovement.tileSize;
    this.y = this._realY;
    this.y -= $gameMap.displayY() * QMovement.tileSize;
  };

  Sprite_SkillTrail.prototype.move = function(x, y, width, height) {
    TilingSprite.prototype.move.call(this, x, y, width, height);
    this._realX = x;
    this._realY = y;
    this.updatePosition();
  };
})();
