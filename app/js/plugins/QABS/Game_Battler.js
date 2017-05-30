//-----------------------------------------------------------------------------
// Game_Battler

(function() {
  var Alias_Game_Battler_initMembers = Game_Battler.prototype.initMembers;
  Game_Battler.prototype.initMembers = function() {
    Alias_Game_Battler_initMembers.call(this);
    this._isStunned = 0;
    this._moveSpeed = 0;
    this._damageQueue = [];
  };

  var Alias_Game_Battler_startDamagePopup = Game_Battler.prototype.startDamagePopup;
  Game_Battler.prototype.startDamagePopup = function() {
    var result = Object.assign({}, this._result);
    this._damageQueue.push(result);
    Alias_Game_Battler_startDamagePopup.call(this);
  };

  Game_Battler.prototype.updateABS = function() {
    var states = this.states();
    for (var i = 0; i < states.length; i++) {
      this.updateStateSteps(states[i]);
    }
    //this.showAddedStates();   //Currently does nothing, so no need to run it
    //this.showRemovedStates(); //Currently does nothing, so no need to run it
  };

  Game_Battler.prototype.stepsForTurn = function() {
    return 60;
  };

  Game_Battler.prototype.updateStateSteps = function(state) {
    if (!state.removeByWalking) return;
    if (this._stateSteps[state.id] >= 0) {
      if (this._stateSteps[state.id] % this.stepsForTurn() === 0) {
        this.onTurnEnd();
        this.result().damageIcon = $dataStates[state.id].iconIndex;
        this.startDamagePopup();
        if (this._stateSteps[state.id] === 0) this.removeState(state.id);
      }
      this._stateSteps[state.id]--;
    }
  };

  Game_Battler.prototype.showAddedStates = function() {
    // TODO
    this.result().addedStateObjects().forEach(function(state) {
      // does nothing
    }, this);
  };

  Game_Battler.prototype.showRemovedStates = function() {
    // TODO
    this.result().removedStateObjects().forEach(function(state) {
      // Popup that state was removed?
    }, this);
  };

  var Alias_Game_Battler_removeState = Game_Battler.prototype.removeState;
  Game_Battler.prototype.removeState = function(stateId) {
    if (this.isStateAffected(stateId)) {
      if ($dataStates[stateId].meta.moveSpeed) {
        this._moveSpeed -= Number($dataStates[stateId].meta.moveSpeed) || 0;
      }
      if ($dataStates[stateId].meta.stun) {
        this._isStunned--;
      }
    }
    Alias_Game_Battler_removeState.call(this, stateId);
  };

  Game_Battler.prototype.moveSpeed = function() {
    return this._moveSpeed;
  };

  Game_Battler.prototype.isStunned = function() {
    return this._isStunned > 0;
  };
})();
