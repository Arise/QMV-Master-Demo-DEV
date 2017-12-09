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
    if ($gameMap.isEventRunning() || $gameMessage.isBusy()) {
      return false;
    }
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
    this.clearABS();
    this._isDead = true;
    SceneManager.goto(Scene_Gameover);
  };

  var Alias_Game_Player_onPositionChange = Game_Player.prototype.onPositionChange;
  Game_Player.prototype.onPositionChange = function() {
    Alias_Game_Player_onPositionChange.call(this);
    if (this._groundTargeting && !QABS.lockTargeting) {
      this.onTargetingCancel();
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
      var inputs = absKeys[key].input;
      for (var i = 0; i < inputs.length; i++) {
        var input = inputs[i];
        if (Input.isTriggered(input) || Input.isPressed(input)) {
          Input.stopPropagation();
          this.useSkill(absKeys[key].skillId);
          break;
        }
        if (input === 'mouse1' && (TouchInput.isTriggered() || TouchInput.isPressed()) && this.canClick()) {
          TouchInput.stopPropagation();
          this.useSkill(absKeys[key].skillId);
          break;
        }
        if (input === 'mouse2' && TouchInput.isCancelled() && this.canClick()) {
          TouchInput.stopPropagation();
          this.useSkill(absKeys[key].skillId);
          break;
        }
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
    if (Imported.QInput && Input.preferGamepad()) {
      var x1 = skill.collider.center.x;
      var y1 = skill.collider.center.y;
      x1 += Input._dirAxesB.x * 5;
      y1 += Input._dirAxesB.y * 5;
    } else {
      var x1 = $gameMap.canvasToMapPX(TouchInput.x);
      var y1 = $gameMap.canvasToMapPY(TouchInput.y);
    }
    var x2 = x1 - w / 2;
    var y2 = y1 - h / 2;
    this.setRadian(Math.atan2(y1 - this.cy(), x1 - this.cx()));
    skill.radian = this._radian;
    skill.collider.moveTo(x2, y2);
    var dx = Math.abs(this.cx() - x2 - w / 2);
    var dy = Math.abs(this.cy() - y2 - h / 2);
    var distance = Math.sqrt(dx * dx + dy * dy);
    skill.isOk = distance <= skill.settings.range;
    skill.collider.color = skill.isOk ? '#00ff00' : '#ff0000';
  };

  Game_Player.prototype.beforeSkill = function(skill) {
    var meta = skill.data.qmeta;
    var isGamepad = Imported.QInput && Input.preferGamepad();
    if (!meta.dontTurn) {
      if (isGamepad && QABS.towardsAnalog) {
        var horz = Input._dirAxesB.x;
        var vert = Input._dirAxesB.y;
        if (horz !== 0 || vert !== 0) {
          this.setRadian(Math.atan2(vert, horz));
          skill.radian = this._radian;
        }
      } else if (!isGamepad && QABS.towardsMouse) {
        var x1 = $gameMap.canvasToMapPX(TouchInput.x);
        var y1 = $gameMap.canvasToMapPY(TouchInput.y);
        var x2 = this.cx();
        var y2 = this.cy();
        this.setRadian(Math.atan2(y1 - y2, x1 - x2));
        skill.radian = this._radian;
      }
    }
    if (meta.towardsMove) {
      var radian;
      if (isGamepad) {
        var horz = Input._dirAxesA.x;
        var vert = Input._dirAxesA.y;
        if (horz === 0 && vert === 0) {
          radian = skill.radian;
        } else {
          radian = Math.atan2(vert, horz);
        }
      } else {
        var direction = QMovement.diagonal ? Input.dir8 : Input.dir4;
        if (direction === 0) {
          radian = skill.radian;
        } else {
          radian = this.directionToRadian(direction);
        }
      }
      skill.radian = radian;
    }
    Game_CharacterBase.prototype.beforeSkill.call(this, skill);
  };

  Game_Player.prototype.makeTargetingSkill = function(skill) {
    Game_CharacterBase.prototype.makeTargetingSkill.call(this, skill);
    if (this._selectTargeting) {
      this.updateSkillTarget();
    }
  };

  var Alias_Game_Player_requestMouseMove = Game_Player.prototype.requestMouseMove;
  Game_Player.prototype.requestMouseMove = function() {
    if ($gameSystem.anyAbsMouse()) return this.clearMouseMove();
    if (this._groundTargeting) return this.clearMouseMove();
    Alias_Game_Player_requestMouseMove.call(this);
  };
})();
