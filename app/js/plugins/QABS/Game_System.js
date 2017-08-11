//-----------------------------------------------------------------------------
// Game_System

(function() {
  var Alias_Game_System_initialize = Game_System.prototype.initialize;
  Game_System.prototype.initialize = function() {
    Alias_Game_System_initialize.call(this);
    this._absKeys = QABS.getDefaultSkillKeys();
    this._absClassKeys = {};
    this._absWeaponKeys = {};
    this._absEnabled = true;
    this._disabledEnemies = {};
    this.checkAbsMouse();
  };

  Game_System.prototype.disableEnemy = function(mapId, eventId) {
    if (!this._disabledEnemies[mapId]) {
      this._disabledEnemies[mapId] = [];
    }
    this._disabledEnemies[mapId][eventId] = true;
  };

  Game_System.prototype.enableEnemy = function(mapId, eventId) {
    if (!this._disabledEnemies[mapId]) {
      this._disabledEnemies[mapId] = [];
    }
    this._disabledEnemies[mapId][eventId] = false;
  };

  Game_System.prototype.isDisabled = function(mapId, eventId) {
    if (!this._disabledEnemies[mapId]) {
      return false;
    }
    return this._disabledEnemies[mapId][eventId];
  };

  Game_System.prototype.loadClassABSKeys = function() {
    if (!$gameParty.leader()) return;
    var playerClass = $gameParty.leader().currentClass();
    var classKeys = /<skillKeys>([\s\S]*)<\/skillKeys>/i.exec(playerClass.note);
    if (classKeys && classKeys[1].trim() !== '') {
      this._absClassKeys = QABS.stringToSkillKeyObj(classKeys[1]);
      this.resetABSKeys();
    }
  };

  Game_System.prototype.resetABSKeys = function() {
    this._absKeys = Object.assign({},
      QABS.getDefaultSkillKeys(),
      this._absClassKeys,
      this._absWeaponKeys
    );
    this.preloadAllSkills();
    this.checkAbsMouse();
  };

  Game_System.prototype.absKeys = function() {
    return this._absKeys;
  };

  Game_System.prototype.changeABSSkill = function(skillNumber, skillId, forced) {
    var absKeys = this.absKeys();
    if (!absKeys[skillNumber]) return;
    if (!forced && !absKeys[skillNumber].rebind) return;
    for (var key in absKeys) {
      if (absKeys[key].skillId === skillId) {
        if (absKeys[key].rebind) {
          absKeys[key].skillId = null;
        }
        break;
      }
    }
    absKeys[skillNumber].skillId = skillId;
    this.resetABSKeys();
  };

  Game_System.prototype.changeABSWeaponSkills = function(skillSet) {
    this._absWeaponKeys = skillSet;
    this.resetABSKeys();
  };

  Game_System.prototype.changeABSSkillInput = function(skillNumber, input) {
    var absKeys = this.absKeys();
    if (!absKeys[skillNumber]) return;
    for (var key in absKeys) {
      var i = absKeys[key].input.indexOf(input);
      if (i !== -1) {
        absKeys[key].input.splice(i, 1);
        break;
      }
    }
    var i = /^\$/.test(input) ? 1 : 0;
    absKeys[skillNumber].input[i] = input;
    this.checkAbsMouse();
  };

  Game_System.prototype.preloadAllSkills = function() {
    var absKeys = this.absKeys();
    for (var key in absKeys) {
      var skill = $dataSkills[absKeys[key].skillId];
      if (skill) QABSManager.preloadSkill(skill);
    }
  };

  Game_System.prototype.anyAbsMouse = function() {
    return this._absMouse1;
  };

  Game_System.prototype.anyAbsMouse2 = function() {
    return this._absMouse2;
  };

  Game_System.prototype.checkAbsMouse = function() {
    this._absMouse1 = false;
    this._absMouse2 = false;
    var keys = this.absKeys();
    for (var key in keys) {
      if (keys[key].input[0] === 'mouse1') {
        this._absMouse1 = true;
      }
      if (keys[key].input[0] === 'mouse2') {
        this._absMouse2 = true;
      }
    }
  };

  var Alias_Game_System_onBeforeSave = Game_System.prototype.onBeforeSave;
  Game_System.prototype.onBeforeSave = function() {
    Alias_Game_System_onBeforeSave.call(this);
    $gameMap.compressBattlers();
    QABS._needsUncompress = true;
  };

  var Alias_Game_System_onAfterLoad = Game_System.prototype.onAfterLoad;
  Game_System.prototype.onAfterLoad = function() {
    Alias_Game_System_onAfterLoad.call(this);
    QABS._needsUncompress = true;
  };
})();
