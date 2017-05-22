//-----------------------------------------------------------------------------
// Game_Player

(function() {
  var Alias_Game_Player_refresh = Game_Player.prototype.refresh;
  Game_Player.prototype.refresh = function() {
    Alias_Game_Player_refresh.call(this);
    if (this.battler() && this._battlerId !== this.battler()._actorId) {
      this.setupBattler();
    }
  };

  Game_Player.prototype.battler = function() {
    return this.actor();
  };

  Game_Player.prototype.setupBattler = function() {
    if (!this.battler()) return;
    this.clearABS();
    this._battlerId = this.battler()._actorId;
    this.battler()._charaId = 0;
    $gameSystem.loadClassABSKeys();
    $gameSystem.changeABSWeaponSkills({});
    this.battler().initWeaponSkills();
    this._isDead = false;
  };

  Game_Player.prototype.team = function() {
    return 1;
  };

  var Alias_Game_Player_canMove = Game_Player.prototype.canMove;
  Game_Player.prototype.canMove = function() {
    if (QABS.lockTargeting && this._groundTargeting) return false;
    return Alias_Game_Player_canMove.call(this);
  };

  Game_Player.prototype.canInput = function() {
    return this.canInputSkill() && !this._groundTargeting;
  };

  Game_Player.prototype.usableSkills = function() {
    return this.battler().skills().filter(function(skill) {
      return !this._skillCooldowns[skill.id];
    }, this).map(function(skill) {
      return skill.id;
    });
  };

  Game_Player.prototype.onDeath = function() {
    if (this._isDead) return;
    this.clearABS();
    this._isDead = true;
    SceneManager.goto(Scene_Gameover);
  };

  var Alias_Game_Player_onPositionChange = Game_Player.prototype.onPositionChange;
  Game_Player.prototype.onPositionChange = function() {
    Alias_Game_Player_onPositionChange.call(this);
    if (this._groundTargeting) {
      QABSManager.removePicture(this._groundTargeting.picture);
      this._groundTargeting = null;
      this._selectTargeting = null;
    }
  };

  var Alias_Game_Player_collidesWithEvent = Game_Player.prototype.collidesWithEvent;
  Game_Player.prototype.collidesWithEvent = function(event, type) {
    if (event.constructor === Game_Loot) {
      return event.collider('interaction').intersects(this.collider(type));
    }
    return Alias_Game_Player_collidesWithEvent.call(this, event, type);
  };

  Game_Player.prototype.updateABS = function() {
    if (this._isDead) return;
    if (this.battler() && this.canInput()) this.updateABSInput();
    Game_CharacterBase.prototype.updateABS.call(this);
    if (this._battlerId !== this.actor()._actorId) {
      this.clearABS();
      this.setupBattler();
    }
  };

  Game_Player.prototype.updateABSInput = function() {
    var absKeys = $gameSystem.absKeys();
    for (var key in absKeys) {
      if (!absKeys[key]) continue;
      var input = absKeys[key].input;
      if (Input.isTriggered(input)) {
        Input.stopPropagation();
        this.useSkill(absKeys[key].skillId);
      }
      if (input === 'mouse1' && TouchInput.isTriggered() && this.canClick()) {
        TouchInput.stopPropagation();
        this.useSkill(absKeys[key].skillId);
      }
      if (input === 'mouse2' && TouchInput.isCancelled() && this.canClick()) {
        TouchInput.stopPropagation();
        this.useSkill(absKeys[key].skillId);
      }
    }
  };

  Game_Player.prototype.updateTargeting = function() {
    return this._selectTargeting ? this.updateSelectTargeting() : this.updateGroundTargeting();
  };

  Game_Player.prototype.updateSelectTargeting = function() {
    // TODO add mouse support
    if (Input.isTriggered('pageup')) {
      Input.stopPropagation();
      this._groundTargeting.index++;
      this.updateSkillTarget();
    }
    if (Input.isTriggered('pagedown')) {
      Input.stopPropagation();
      this._groundTargeting.index--;
      this.updateSkillTarget();
    }
    if (Input.isTriggered('ok')) {
      Input.stopPropagation();
      this.onTargetingEnd();
    }
    if (Input.isTriggered('escape') || TouchInput.isCancelled()) {
      TouchInput.stopPropagation();
      Input.stopPropagation();
      this.onTargetingCancel();
    }
  };

  Game_Player.prototype.updateSkillTarget = function() {
    var skill = this._groundTargeting;
    if (skill.index < 0) skill.index = skill.targets.length - 1;
    if (skill.index >= skill.targets.length) skill.index = 0;
    var target = skill.targets[skill.index];
    var w = skill.collider.width;
    var h = skill.collider.height;
    var x = target.cx() - w / 2;
    var y = target.cy() - h / 2;
    skill.collider.moveTo(x, y);
    skill.picture.move(x + w / 2, y + h / 2);
  };

  Game_Player.prototype.updateGroundTargeting = function() {
    this.updateGroundTargetingPosition();
    if (Input.isTriggered('escape') || TouchInput.isCancelled()) {
      TouchInput.stopPropagation();
      Input.stopPropagation();
      this.onTargetingCancel();
    }
    if (Input.isTriggered('ok') || (this.canClick() && TouchInput.isTriggered()) ||
        QABS.quickTarget) {
      if (!this._groundTargeting.isOk) {
        TouchInput.stopPropagation();
        Input.stopPropagation();
        this.onTargetingCancel();
      } else {
        this.onTargetingEnd();
      }
    }
  };

  Game_Player.prototype.updateGroundTargetingPosition = function() {
    var skill = this._groundTargeting;
    var w = skill.collider.width;
    var h = skill.collider.height;
    var x1 = $gameMap.canvasToMapPX(TouchInput.x);
    var y1 = $gameMap.canvasToMapPY(TouchInput.y);
    var x2 = x1 - w / 2;
    var y2 = y1 - h / 2;
    var radian = Math.atan2(y1 - this.cy(), x1 - this.cx());
    this.setDirection(this.radianToDirection(radian, QMovement.diagonal));
    skill.collider.moveTo(x2, y2);
    skill.picture.move(x2 + w / 2, y2 + h / 2);
    var dx = Math.abs(this.cx() - x2 - w / 2);
    var dy = Math.abs(this.cy() - y2 - h / 2);
    var distance = Math.sqrt(dx * dx + dy * dy);
    skill.isOk = distance <= skill.settings.range;
    skill.collider.color = skill.isOk ? '#00ff00' : '#ff0000';
  };

  Game_Player.prototype.beforeSkill = function(skillId) {
    var skill = $dataSkills[skillId];
    if (QABS.towardsMouse && !skill.meta.dontTurn) {
      var x1 = $gameMap.canvasToMapPX(TouchInput.x);
      var y1 = $gameMap.canvasToMapPY(TouchInput.y);
      var x2 = this.cx();
      var y2 = this.cy();
      var radian = Math.atan2(y1 - y2, x1 - x2);
      radian += radian < 0 ? Math.PI * 2 : 0;
      this.setDirection(this.radianToDirection(radian, true));
      this._radian = radian;
    }
    Game_CharacterBase.prototype.beforeSkill.call(this, skillId);
  };

  var Alias_Game_Player_requestMouseMove = Game_Player.prototype.requestMouseMove;
  Game_Player.prototype.requestMouseMove = function() {
    if ($gameSystem.anyAbsMouse()) return this.clearMouseMove();
    if (this._groundTargeting) return this.clearMouseMove();
    Alias_Game_Player_requestMouseMove.call(this);
  };
})();
