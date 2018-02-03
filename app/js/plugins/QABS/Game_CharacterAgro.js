//-----------------------------------------------------------------------------
// Game_CharacterAgro

function Game_CharacterAgro() {
  this.initialize.apply(this, arguments);
}

(function() {
  Game_CharacterAgro.agroTimer = 300;

  Game_CharacterAgro.prototype.initialize = function(charaId) {
    this._charaId = charaId;
    this.clear();
  };

  Game_CharacterAgro.prototype.clear = function() {
    this._agrod = 0;
    this._points = {};
    this._tick = {};
    this._total = 0;
    this._highest = null;
    this._recalcHighest = false;
  };

  Game_CharacterAgro.prototype.has = function(charaId) {
    return !!this._points[charaId];
  };

  Game_CharacterAgro.prototype.inCombat = function() {
    return this._agrod > 0 || this._total > 0;
  };

  Game_CharacterAgro.prototype.character = function() {
    return QPlus.getCharacter(this._charaId) || null;
  };

  Game_CharacterAgro.prototype.highest = function() {
    if (this._recalcHighest) {
      this.calcHighest();
    }
    return this._highest;
  };

  Game_CharacterAgro.prototype.add = function(charaId, amount) {
    this._points[charaId] = this._points[charaId] ? this._points[charaId] + amount : amount;
    this._tick[charaId] = Game_CharacterAgro.agroTimer;
    var points = this._points[charaId];
    this._total += amount;
    this._recalcHighest = true;
  };

  Game_CharacterAgro.prototype.remove = function(charaId) {
    this._total -= this._points[charaId] || 0;
    delete this._points[charaId];
    delete this._tick[charaId];
    this._recalcHighest = true;
  };

  Game_CharacterAgro.prototype.placeInCombat = function() {
    this._agro = Game_CharacterAgro.agroTimer;
  };

  Game_CharacterAgro.prototype.calcHighest = function() {
    var highest = 0;
    var highestId = null;
    for (var charaId in this._points) {
      if (this._points[charaId] > highest) {
        highest = this._points[charaId];
        highestId = charaId;
      }
    }
    this._highest = highestId ? QPlus.getCharacter(highestId) : null;
    this._recalcHighest = false;
  };

  Game_CharacterAgro.prototype.update = function() {
    for (var charaId in this._tick) {
      this._tick[charaId] = this._tick[charaId] - 1;
      if (this._tick[charaId] === 0) {
        this.remove(charaId);
      }
    }
    if (this._agro > 0) this._agro--;
  };

})();