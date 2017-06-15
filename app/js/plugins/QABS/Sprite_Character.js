//-----------------------------------------------------------------------------
// Sprite_Character

(function() {
  var Alias_Sprite_Character_initMembers = Sprite_Character.prototype.initMembers;
  Sprite_Character.prototype.initMembers = function() {
    Alias_Sprite_Character_initMembers.call(this);
    this.createStateSprite();
  };

  Sprite_Character.prototype.createStateSprite = function() {
    this._stateSprite = new Sprite_StateOverlay();
    this.addChild(this._stateSprite);
  };

  var Alias_Sprite_Character_update = Sprite_Character.prototype.update;
  Sprite_Character.prototype.update = function() {
    Alias_Sprite_Character_update.call(this);
    if (this._character) this.updateBattler();
    if (this._battler) this.updateDamagePopup();
  };

  Sprite_Character.prototype.updateDamagePopup = function() {
    this.setupDamagePopup();
  };

  Sprite_Character.prototype.updateBattler = function() {
    if (this._battler !== this._character.battler()) {
      this.setBattler(this._character.battler());
    }
  };

  Sprite_Character.prototype.setBattler = function(battler) {
    this._battler = battler;
    this._stateSprite.setup(this._battler);
  };

  Sprite_Character.prototype.setupDamagePopup = function() {
    if (!Imported.QPopup || this._character._noPopup) return;
    if (this._battler._damageQueue.length > 0) {
      var string;
      var fill = '#ffffff';
      var result = this._battler._damageQueue.shift();
      var type = 'DMG';
      if (result.missed || result.evaded) {
        string = 'Missed';
        type = 'MISSED';
      } else if (result.hpAffected) {
        var dmg = result.hpDamage;
        string = String(Math.abs(dmg));
        if (dmg >= 0) {
          type = 'DMG';
        } else {
          type = 'HEAL';
        }
      } else if (result.mpDamage) {
        string = String(result.mpDamage);
        type = 'MP';
      }
      if (!string && string !== '0') return;
      var iconIndex = result.damageIcon;
      if (iconIndex) {
        string = '\\I[' + iconIndex + ']' + string;
      }
      if (result.critical) {
        type += '-CRIT';
      }
      QABSManager.startPopup('QABS-' + type, {
        string: string,
        oy: this._battler._popupOY,
        bindTo: this._character.charaId(),
        duration: 80
      });
      this._battler.clearDamagePopup();
      this._battler.clearResult();
    }
  };
})();
