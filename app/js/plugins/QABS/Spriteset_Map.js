//-----------------------------------------------------------------------------
// Spriteset_Map

(function() {
  var Alias_Spriteset_Map_createLowerLayer = Spriteset_Map.prototype.createLowerLayer;
  Spriteset_Map.prototype.createLowerLayer = function() {
    Alias_Spriteset_Map_createLowerLayer.call(this);
    this._pictures = [];
    this._tempAnimations = [];
  };

  Spriteset_Map.prototype.addPictures = function() {
    this._pictures = QABSManager._pictures;
    if (this._pictures.length === 0) return;
    for (var i = 0; i < this._pictures.length; i++) {
      if (this.children.indexOf(this._pictures[i]) !== -1) continue;
      this._tilemap.addChild(this._pictures[i]);
    }
  };

  Spriteset_Map.prototype.addAnimations = function() {
    this._tempAnimations = QABSManager._animations;
    if (this._tempAnimations.length === 0) return;
    for (var i = 0; i < this._tempAnimations.length; i++) {
      if (this.children.indexOf(this._tempAnimations[i]) !== -1) continue;
      this._tilemap.addChild(this._tempAnimations[i]);
      if (this._tempAnimations[i].isAnimationPlaying()) {
        for (var j = 0; j < this._tempAnimations[i]._animationSprites.length; j++) {
          this._tilemap.addChild(this._tempAnimations[i]._animationSprites[j]);
        }
      }
    }
  };

  var Alias_Spriteset_Map_updateTilemap = Spriteset_Map.prototype.updateTilemap;
  Spriteset_Map.prototype.updateTilemap = function() {
    Alias_Spriteset_Map_updateTilemap.call(this);
    this.updateTempAnimations();
    this.updatePictures();
  };

  Spriteset_Map.prototype.updatePictures = function() {
    if (this._pictures !== QABSManager._pictures) this.addPictures();
    for (var i = 0; i < this._pictures.length; i++) {
      this._pictures[i].x = this._pictures[i].realX;
      this._pictures[i].x -= $gameMap.displayX() * QMovement.tileSize;
      this._pictures[i].y = this._pictures[i].realY;
      this._pictures[i].y -= $gameMap.displayY() * QMovement.tileSize;
    }
  };

  Spriteset_Map.prototype.updateTempAnimations = function() {
    if (this._tempAnimations !== QABSManager._animations) this.addAnimations();
    if (this._tempAnimations.length > 0) {
      for (var i = this._tempAnimations.length - 1; i >= 0; i--) {
        this._tempAnimations[i].x = this._tempAnimations[i].realX;
        this._tempAnimations[i].x -= $gameMap.displayX() * QMovement.tileSize;
        this._tempAnimations[i].y = this._tempAnimations[i].realY;
        this._tempAnimations[i].y -= $gameMap.displayY() * QMovement.tileSize;
        this._tempAnimations[i].update();
        if (!this._tempAnimations[i].isAnimationPlaying()) {
          this._tilemap.removeChild(this._tempAnimations[i].sprite);
          this._tempAnimations[i] = null;
          this._tempAnimations.splice(i, 1);
        }
      }
    }
  };

  var Alias_Sprite_move = Sprite.prototype.move;
  Sprite.prototype.move = function(x, y) {
    Alias_Sprite_move.call(this, x, y);
    this.realX = x;
    this.realY = y;
  };

  var Alias_TilingSprite_move = TilingSprite.prototype.move;
  TilingSprite.prototype.move = function(x, y, width, height) {
    Alias_TilingSprite_move.call(this, x, y, width, height);
    this.realX = x;
    this.realY = y;
  };
})();
