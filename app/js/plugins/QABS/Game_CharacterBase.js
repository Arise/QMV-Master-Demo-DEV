//-----------------------------------------------------------------------------
// Game_CharacterBase

(function() {
  Game_CharacterBase.prototype.battler = function() {
    return null;
  };

  Game_CharacterBase.prototype.clearABS = function() {
    if (this._activeSkills && this._activeSkills.length > 0) {
      this.clearSkills();
    }
    if (this._agroList) {
      this.clearAgro();
    }
    this._activeSkills = [];
    this._skillCooldowns = {};
    this._agroList = {};
    this._agrodList = [];
    this._inCombat = false;
    this._casting = null;
    this._skillLocked = [];
  };

  Game_CharacterBase.prototype.clearSkills = function() {
    for (var i = this._activeSkills.length - 1; i >= 0; i--) {
      var skill = this._activeSkills[i];
      QABSManager.removePicture(skill.picture);
      QABSManager.removePicture(skill.trail);
      QABSManager.removePicture(skill.pictureCollider);
      this._activeSkills.splice(i, 1);
    }
  };

  Game_CharacterBase.prototype.team = function() {
    return 0;
  };

  Game_CharacterBase.prototype.isFriendly = function(target) {
    return target.team() === this.team();
  };

  Game_CharacterBase.prototype.inCombat = function() {
    if (!this.battler()) return false;
    return this._inCombat;
  };

  Game_CharacterBase.prototype.isCasting = function() {
    if (this._casting) {
      if (this._casting.break) {
        this._casting = null;
        return false;
      }
      return true;
    }
    return false;
  };

  var Alias_Game_CharacterBase_canMove = Game_CharacterBase.prototype.canMove;
  Game_CharacterBase.prototype.canMove = function() {
    if (this.battler() && this._skillLocked.length > 0) return false;
    return Alias_Game_CharacterBase_canMove.call(this);
  };

  Game_CharacterBase.prototype.canInputSkill = function() {
    // check if locked
    if ($gameMap.isEventRunning()) return false;
    if (!$gameSystem._absEnabled) return false;
    if (!this.battler()) return false;
    if (this.battler().isDead()) return false;
    if (this.battler().isStunned()) return false;
    if (this.isCasting()) return false;
    if (this._skillLocked.length > 0) return false;
    return true;
  };

  Game_CharacterBase.prototype.canUseSkill = function(id) {
    var skill = $dataSkills[id];
    return this.usableSkills().contains(id) && this.battler().canPaySkillCost(skill);
  };

  Game_CharacterBase.prototype.usableSkills = function() {
    return [];
  };

  var Alias_Game_CharacterBase_realMoveSpeed = Game_CharacterBase.prototype.realMoveSpeed;
  Game_CharacterBase.prototype.realMoveSpeed = function() {
    var value = Alias_Game_CharacterBase_realMoveSpeed.call(this);
    if (this.battler()) {
      value += this.battler().moveSpeed();
    }
    return value;
  };

  Game_CharacterBase.prototype.addAgro = function(charaId, skill) {
    var chara = QPlus.getCharacter(charaId);
    if (!chara || chara === this || this.isFriendly(chara)) return;
    this._agroList[charaId] = this._agroList[charaId] || 0;
    this._agroList[charaId] += skill && skill.agroPoints ? skill.agroPoints : 1;
    if (!chara._agrodList.contains(this.charaId())) {
      chara._agrodList.push(this.charaId());
    }
    this._inCombat = true;
    chara._inCombat = true;
  };

  Game_CharacterBase.prototype.removeAgro = function(charaId) {
    delete this._agroList[charaId];
    var i = this._agrodList.indexOf(charaId);
    if (i !== -1) {
      this._agrodList.splice(i, 1);
      this._inCombat = (this.totalAgro() + this._agrodList.length) > 0;
      if (!this._inCombat && typeof this.endCombat === 'function') {
        this.endCombat();
      }
    }
  };

  Game_CharacterBase.prototype.clearAgro = function() {
    for (var charaId in this._agroList) {
      var chara = QPlus.getCharacter(charaId);
      if (chara) chara.removeAgro(this.charaId());
    }
    for (var i = this._agrodList.length - 1; i >= 0; i--) {
      var chara = QPlus.getCharacter(this._agrodList[i]);
      if (chara) chara.removeAgro(this.charaId());
    }
    this._agroList = {};
    this._agrodList = [];
    this._inCombat = false;
  };

  Game_CharacterBase.prototype.totalAgro = function() {
    var total = 0;
    for (var agro in this._agroList) {
      total += this._agroList[agro] || 0;
    }
    return total;
  };

  Game_CharacterBase.prototype.bestTarget = function() {
    // TODO consider team
    var mostAgro = 0;
    var bestChara = null;
    for (var charaId in this._agroList) {
      if (this._agroList[charaId] > mostAgro) {
        mostAgro = this._agroList[charaId];
        bestChara = charaId;
      }
    }
    if (bestChara !== null) {
      return QPlus.getCharacter(bestChara);
    }
    return null;
  };

  var Alias_Game_CharacterBase_update = Game_CharacterBase.prototype.update;
  Game_CharacterBase.prototype.update = function() {
    if (this.battler()) this.updateABS();
    Alias_Game_CharacterBase_update.call(this);
  };

  Game_CharacterBase.prototype.updateABS = function() {
    if (this.battler().hp <= 0) return this.onDeath();
    this.updateSkills();
    this.battler().updateABS();
  };

  Game_CharacterBase.prototype.onDeath = function() {
    // Placeholder method, overwritten in Game_Player and Game_Event
  };

  Game_CharacterBase.prototype.updateSkills = function() {
    if (this._groundTargeting) this.updateTargeting();
    if (this._activeSkills.length > 0) this.updateSkillSequence();
    this.updateSkillCooldowns();
  };

  Game_CharacterBase.prototype.updateTargeting = function() {
    return this.onTargetingEnd();
  };

  Game_CharacterBase.prototype.updateSkillSequence = function() {
    for (var i = this._activeSkills.length - 1; i >= 0; i--) {
      this._activeSkills[i].sequencer.update();
    }
  };

  Game_CharacterBase.prototype.updateSkillCooldowns = function() {
    for (var id in this._skillCooldowns) {
      if (this._skillCooldowns[id] === 0) {
        delete this._skillCooldowns[id];
      } else {
        this._skillCooldowns[id]--;
      }
    }
  };

  Game_CharacterBase.prototype.onTargetingEnd = function() {
    var skill = this._groundTargeting;
    this.battler().paySkillCost(skill.data);
    this._activeSkills.push(skill);
    this._skillCooldowns[skill.data.id] = skill.settings.cooldown;
    ColliderManager.draw(skill.collider, skill.sequence.length + 60);
    this.onTargetingCancel();
  };

  Game_CharacterBase.prototype.onTargetingCancel = function() {
    QABSManager.removePicture(this._groundTargeting.picture);
    this._groundTargeting.targeting.kill = true;
    this._groundTargeting = null;
    this._selectTargeting = null;
  };

  Game_CharacterBase.prototype.useSkill = function(skillId) {
    if (!this.canInputSkill()) return;
    if (!this.canUseSkill(skillId)) return;
    if (this._groundTargeting) {
      QABSManager.removePicture(this._groundTargeting.picture);
      this._groundTargeting = null;
      this._selectTargeting = null;
    }
    this.beforeSkill(skillId);
    this.forceSkill(skillId);
    this.afterSkill(skillId);
  };

  Game_CharacterBase.prototype.beforeSkill = function(skillId) {
    var meta = Object.assign({}, $dataSkills[skillId].meta, $dataSkills[skillId].qmeta);
    var before = meta.beforeSkill || '';
    if (before !== '') {
      eval(before[1]);
    }
  };

  Game_CharacterBase.prototype.afterSkill = function(skillId) {
    if (!this._groundTargeting) {
      this.battler().paySkillCost($dataSkills[skillId]);
    }
  };

  Game_CharacterBase.prototype.forceSkill = function(skillId, forced) {
    var data = $dataSkills[skillId];
    var skill = {
      data: data,
      settings: QABS.getSkillSettings(data),
      sequence: QABS.getSkillSequence(data),
      ondmg: QABS.getSkillOnDamage(data)
    }
    if (!skill.settings || data.scope === 0) return;
    Object.assign(skill, {
      collider: this.makeSkillCollider(skill.settings),
      sequencer: new Skill_Sequencer(this, skill),
      direction: this._direction,
      userDirection: this._direction,
      radian: this._radian,
      targetsHit: [],
      forced: forced
    })
    if (skill.settings.groundTarget || skill.settings.selectTarget) {
      return this.makeTargetingSkill(skill);
    }
    this._activeSkills.push(skill);
    this._skillCooldowns[skillId] = skill.settings.cooldown;
    ColliderManager.draw(skill.collider, skill.sequence.length + 60);
  };

  Game_CharacterBase.prototype.makeTargetingSkill = function(skill) {
    this._groundTargeting = skill;
    this._selectTargeting = this.constructor === Game_Event ? true : skill.settings.selectTarget;
    var collider = skill.collider;
    var diameter = skill.settings.range * 2;
    skill.targeting = new Circle_Collider(diameter, diameter);
    skill.targeting.moveTo(this.cx() - diameter / 2, this.cy() - diameter / 2);
    ColliderManager.draw(skill.targeting, -1);
    skill.collider = skill.targeting;
    this._groundTargeting.targets = QABSManager.getTargets(skill, this);
    skill.collider = collider;
    skill.picture = new Sprite_SkillCollider(skill.collider);
    if (this._selectTargeting) {
      if (this._groundTargeting.targets.length === 0 ) {
        this._groundTargeting = null;
        this._selectTargeting = null;
        QABSManager.removePicture(skill.picture);
        return;
      }
      var target = this._groundTargeting.targets[0];
      var w = skill.collider.width;
      var h = skill.collider.height;
      var x = target.cx() - w / 2;
      var y = target.cy() - h / 2;
      skill.collider.color = '#00ff00';
      skill.collider.moveTo(x, y);
      skill.picture.move(x + w / 2, y + h / 2);
      skill.index = 0;
    } else {
      var x = $gameMap.canvasToMapPX(TouchInput.x) - skill.collider.width / 2;
      var y = $gameMap.canvasToMapPY(TouchInput.y) - skill.collider.height / 2;
      skill.picture.move(x, y);
    }
    QABSManager.addPicture(skill.picture);
  };

  Game_CharacterBase.prototype.makeSkillCollider = function(settings) {
    var w1 = this.collider('collision').width;
    var h1 = this.collider('collision').height;
    settings.collider = settings.collider || ['box', w1, h1];
    var collider = ColliderManager.convertToCollider(settings.collider);
    var infront = settings.infront === true;
    var rotate = settings.rotate === true;
    if (rotate) {
      if (QABS.radianAtks) {
        collider.rotate(Math.PI / 2 + this._radian);
      } else {
        collider.rotate(Math.PI / 2 + this.directionToRadian(this._direction));
      }
    }
    var x1 = this.cx() - collider.center.x;
    var y1 = this.cy() - collider.center.y;
    if (infront) {
      var w2 = collider.width;
      var h2 = collider.height;
      var radian = this.directionToRadian(this._direction);
      if (QABS.radianAtks) {
        radian = this._radian;
      }
      var w3 = Math.cos(radian) * w1 / 2 + Math.cos(radian) * w2 / 2;
      var h3 = Math.sin(radian) * h1 / 2 + Math.sin(radian) * h2 / 2;
      x1 += w3;
      y1 += h3;
    }
    collider.moveTo(x1, y1);
    return collider;
  };
})();
