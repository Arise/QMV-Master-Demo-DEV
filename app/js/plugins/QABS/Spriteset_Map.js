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
    if (this._pictures !== QABSManager._pictures) this.addPictures();
    if (this._tempAnimations !== QABSManager._animations) this.addAnimations();
  };
})();
