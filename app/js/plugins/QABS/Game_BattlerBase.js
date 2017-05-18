//-----------------------------------------------------------------------------
// Game_BattlerBase

(function() {
  var Alias_Game_BattlerBase_resetStateCounts = Game_BattlerBase.prototype.resetStateCounts;
  Game_BattlerBase.prototype.resetStateCounts = function(stateId) {
    Alias_Game_BattlerBase_resetStateCounts.call(this, stateId);
    this._stateSteps[stateId] = $dataStates[stateId].stepsToRemove || 0;
  };

  var Alias_Game_BattlerBase_addNewState = Game_BattlerBase.prototype.addNewState;
  Game_BattlerBase.prototype.addNewState = function(stateId) {
    Alias_Game_BattlerBase_addNewState.call(this, stateId);
    if ($dataStates[stateId].meta.moveSpeed) {
      this._moveSpeed += Number($dataStates[stateId].meta.moveSpeed) || 0;
    }
    if ($dataStates[stateId].meta.stun) {
      this._isStunned++;
    }
  };
})();
