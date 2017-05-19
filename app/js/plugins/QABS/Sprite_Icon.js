//-----------------------------------------------------------------------------
// Sprite_Icon

function Sprite_Icon() {
  this.initialize.apply(this, arguments);
}

(function() {
  Sprite_Icon.prototype = Object.create(Sprite.prototype);
  Sprite_Icon.prototype.constructor = Sprite_Icon;

  Sprite_Icon.prototype.initialize = function(index, sheet, w, h) {
    Sprite.prototype.initialize.call(this);
    this._iconIndex = index;
    this._iconSheet = sheet || 'IconSet';
    this._iconW = w || 32;
    this._iconH = h || 32;
    this.setBitmap();
  };

  Sprite_Icon.prototype.setBitmap = function() {
    this.bitmap = ImageManager.loadSystem(this._iconSheet);
    var pw = this._iconW;
    var ph = this._iconH;
    var sx = this._iconIndex % 16 * pw;
    var sy = Math.floor(this._iconIndex / 16) * ph;
    this.setFrame(sx, sy, pw, ph);
  };
})();
