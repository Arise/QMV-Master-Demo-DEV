//-----------------------------------------------------------------------------
// Sprite_Collider

function Sprite_Collider() {
  this.initialize.apply(this, arguments);
}

(function() {
  Sprite_Collider.prototype = Object.create(Sprite.prototype);
  Sprite_Collider.prototype.constructor = Sprite_Collider;

  Sprite_Collider.prototype.initialize = function(collider, options) {
    Sprite.prototype.initialize.call(this);
    this.z = 7;
    this._duration = options.duration || -1;
    this._color = options.color || '#ff0000';
    this.setupCollider(collider);
  };

  Sprite_Collider.prototype._setupCollider = function(collider) {
    this._collider = collider;
    this.bitmap = new Bitmap(collider.width, collider.height);
    this.drawCollider();
  };


  Sprite_Collider.prototype.setupCollider = function(collider) {
    this._collider = collider;
    var isNew = false;
    if (!this._colliderSprite) {
      this._colliderSprite = new PIXI.Graphics();
      isNew = true;
    }
    this.drawCollider();
    if (isNew) {
      this.addChild(this._colliderSprite);
    }
  };

  Sprite_Collider.prototype._drawCollider = function() {
    var collider = this._collider;
    this.bitmap.clear();
    var color = this._color.replace('#', '');
    color = parseInt(color, 16);
    if (collider.isCircle()) {
      var radiusX = collider._radiusX;
      var radiusY = collider._radiusY;
      this.bitmap.drawEllipse(0, 0, radiusX, radiusY, color);
      this.bitmap.rotation = collider.radian;
    } else {
      this.bitmap.drawPolygon(collider._baseVertices, color);
    }
  };

  Sprite_Collider.prototype.drawCollider = function() {
    var collider = this._collider;
    this._colliderSprite.clear();
    var color = this._color.replace('#', '');
    color = parseInt(color, 16);
    this._colliderSprite.beginFill(color);
    if (collider.isCircle()) {
      var radiusX = collider._radiusX;
      var radiusY = collider._radiusY;
      this._colliderSprite.drawEllipse(0, 0, radiusX, radiusY);
      this._colliderSprite.rotation = collider.radian;
    } else {
      this._colliderSprite.drawPolygon(collider._baseVertices);
    }
    this._colliderSprite.endFill();
  };

  Sprite_Collider.prototype.update = function() {
    Sprite.prototype.update.call(this);
    this.checkChanges();
    if (this._duration > 0 || this._collider.kill) {
      this.updateDecay();
    }
  };

  Sprite_Collider.prototype.checkChanges = function() {
    this.alpha = this._collider._isHidden ? 0 : 1;
    this.x = this._collider.x + this._collider.ox;
    this.x -= $gameMap.displayX() * QMovement.tileSize;
    this.y = this._collider.y + this._collider.oy;
    this.y -= $gameMap.displayY() * QMovement.tileSize;
    if (this._cachedw !== this._collider.width ||
        this._cachedh !== this._collider.height) {
      this._cachedw = this._collider.width;
      this._cachedh = this._collider.height;
      this.drawCollider();
    }
    this._colliderSprite.z = this.z;
    this._colliderSprite.alpha = this.alpha;
  };

  Sprite_Collider.prototype.updateDecay = function() {
    this._duration--;
    if (this._duration <= 0) {
      ColliderManager.removeSprite(this);
      this._collider = null;
    }
  };
})();