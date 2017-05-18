//-----------------------------------------------------------------------------
// Sprite_SkillCollider

function Sprite_SkillCollider() {
  this.initialize.apply(this, arguments);
}

(function() {
  Sprite_SkillCollider.prototype = Object.create(Sprite_Collider.prototype);
  Sprite_SkillCollider.prototype.constructor = Sprite_SkillCollider;

  Sprite_SkillCollider.prototype.initialize = function(collider) {
    Sprite_Collider.prototype.initialize.call(this, collider, -1);
    this.z = 2;
    this.alpha = 0.4;
    this.anchor.x = 0.5;
    this.anchor.y = 0.5;
    this._frameCount = 0;
  };

  Sprite_SkillCollider.prototype.update = function() {
    Sprite_Collider.prototype.update.call(this);
    this.updateAnimation();
  };

  Sprite_SkillCollider.prototype.updateAnimation = function() {
    this._frameCount++;
    if (this._frameCount > 30) {
      this.alpha += 0.2 / 30;
      this.scale.x += 0.1 / 30;
      this.scale.y = this.scale.x;
      if (this._frameCount === 60) this._frameCount = 0;
    } else {
      this.alpha -= 0.2 / 30;
      this.scale.x -= 0.1 / 30;
      this.scale.y = this.scale.x;
    }
  };
})();
