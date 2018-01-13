//-----------------------------------------------------------------------------
// Game_Actor

(function() {
  var Alias_Game_Actor_setup = Game_Actor.prototype.setup;
  Game_Actor.prototype.setup = function(actorId) {
    Alias_Game_Actor_setup.call(this, actorId);
    var meta = this.actor().qmeta;
    this._popupOY = Number(meta.popupOY) || 0;
  };

  var Alias_Game_Actor_changeClass = Game_Actor.prototype.changeClass;
  Game_Actor.prototype.changeClass = function(classId, keepExp) {
    Alias_Game_Actor_changeClass.call(this, classId, keepExp);
    if (this === $gameParty.leader()) $gameSystem.loadClassABSKeys();
  };

  Game_Actor.prototype.initWeaponSkills = function() {
    var equips = this._equips;
    for (var i = 0; i < equips.length; i++) {
      if (equips[i].object()) {
        var equipId = equips[i].object().baseItemId || equips[i].object().id;
        if (equips[i].isWeapon() && equipId) {
          this.changeWeaponSkill(equipId);
        }
      }
    }
  };

  var Alias_Game_Actor_changeEquip = Game_Actor.prototype.changeEquip;
  Game_Actor.prototype.changeEquip = function(slotId, item) {
    if (this !== $gameParty.leader()) {
      return Alias_Game_Actor_changeEquip.call(this, slotId, item);
    }
    var equips = this._equips;
    var oldId, newId = 0;
    var wasWeapon;
    if (equips[slotId] && equips[slotId].object()) {
      oldId = equips[slotId].object().baseItemId || equips[slotId].object().id;
      wasWeapon = equips[slotId].isWeapon();
    }
    Alias_Game_Actor_changeEquip.call(this, slotId, item);
    if (equips[slotId] && equips[slotId].object()) {
      newId = equips[slotId].object().baseItemId || equips[slotId].object().id;
    }
    if (newId && newId !== oldId && equips[slotId].isWeapon()) {
      this.changeWeaponSkill(newId);
    } else if (wasWeapon) {
      this.changeWeaponSkill(0);
    }
  };

  Game_Actor.prototype.changeWeaponSkill = function(id) {
    if (this !== $gameParty.leader()) return;
    var weaponSkills;
    if (!$dataWeapons[id]) {
      weaponSkills = {};
    } else {
      weaponSkills = QABS.weaponSkills(id);
    }
    $gameSystem.changeABSWeaponSkills(weaponSkills);
  };

  Game_Actor.prototype.displayLevelUp = function(newSkills) {
    QABSManager.startPopup('QABS-LEVEL', {
      x: $gamePlayer.cx(),
      y: $gamePlayer.cy(),
      string: 'Level Up!'
    })
    QABSManager.startAnimation(QABS.levelAnimation, $gamePlayer.cx(), $gamePlayer.cy());
  };

  Game_Actor.prototype.onPlayerWalk = function() {
    this.clearResult();
    this.checkFloorEffect();
  };

  Game_Actor.prototype.updateStateSteps = function(state) {
    Game_Battler.prototype.updateStateSteps.call(this, state);
  };

  Game_Actor.prototype.showAddedStates = function() {
    Game_Battler.prototype.showAddedStates.call(this);
  };

  Game_Actor.prototype.showRemovedStates = function() {
    Game_Battler.prototype.showRemovedStates.call(this);
  };

  Game_Actor.prototype.resetStateCounts = function(stateId) {
    Game_Battler.prototype.resetStateCounts.call(this, stateId);
  };

  Game_Actor.prototype.stepsForTurn = function() {
    return Game_Battler.prototype.stepsForTurn.call(this);
  };
})();
