//-----------------------------------------------------------------------------
// Game_Enemy

(function() {
  var Alias_Game_Enemy_setup = Game_Enemy.prototype.setup;
  Game_Enemy.prototype.setup = function(enemyId, x, y) {
    Alias_Game_Enemy_setup.call(this, enemyId, x, y);
    var meta = this.enemy().qmeta;
    this._aiType = (meta.AIType || 'simple').toLowerCase();
    this._aiRange = Number(meta.range) || 0;
    this._noPopup = !!meta.noPopup;
    this._popupOY = Number(meta.popupOY) || 0;
    this._onDeath = meta.onDeath || '';
    this._dontErase = !!meta.dontErase;
    this._team = Number(meta.team || 2);
  };

  Game_Enemy.prototype.clearStates = function() {
    Game_Battler.prototype.clearStates.call(this);
    this._stateSteps = {};
  };

  Game_Enemy.prototype.eraseState = function(stateId) {
    Game_Battler.prototype.eraseState.call(this, stateId);
    delete this._stateSteps[stateId];
  };
})();
