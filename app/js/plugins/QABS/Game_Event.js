//-----------------------------------------------------------------------------
// Game_Event

(function() {
  var Alias_Game_Event_initialize = Game_Event.prototype.initialize;
  Game_Event.prototype.initialize = function(mapId, eventId) {
    Alias_Game_Event_initialize.call(this, mapId, eventId);
    this.setupBattler();
  };

  Game_Event.prototype.battler = function() {
    if (this._battlerId) {
      return this._battler;
    }
    return null;
  };

  Game_Event.prototype.setupBattler = function() {
    var foe = /<enemy:([0-9]*?)>/i.exec(this.notes());
    var disabled = $gameSystem.isDisabled(this._mapId, this._eventId);
    if (foe && !disabled) {
      this.clearABS();
      this._battlerId = Number(foe[1]);
      this._battler = new Game_Enemy(this._battlerId, 0, 0);
      this._battler._charaId = this.charaId();
      this._skillList = [];
      this._aiRange = this._battler._aiRange || QABS.aiLength;
      this._aiWait = 0;
      this._aiPathfind = Imported.QPathfind && QABS.aiPathfind;
      this._aiSight = Imported.QSight && QABS.aiSight;
      if (this._aiSight && this.hasAI()) {
        this.setupSight({
          shape: 'circle',
          range: this._aiRange / QMovement.tileSize,
          handler: 'AI',
          targetId: '0'
        });
      }
      var actions = this._battler.enemy().actions;
      for (var i = 0; i < actions.length; i++) {
        this._skillList.push(actions[i].skillId);
      }
      this._respawn = -1;
      this._onDeath = this._battler._onDeath;
      this._noPopup = this._battler._noPopup;
      this._dontErase = this._battler._dontErase;
      this._team = this._battler._team;
      this._isDead = false;
    }
  };

  Game_Event.prototype.disableEnemy = function() {
    $gameSystem.disableEnemy(this._mapId, this._eventId);
    this.clearABS();
    this._battler = null;
  };

  Game_Event.prototype.team = function() {
    return this._battler ? this._team : 0;
  };

  Game_Event.prototype.hasAI = function() {
    return !this._battler._noAI;
  };

  Game_Event.prototype.usableSkills = function() {
    if (!this._battler) return [];
    return this._skillList.filter(function(skillId) {
      return !this._skillCooldowns[skillId];
    }, this)
  };

  var Alias_Game_Event_bestTarget = Game_Event.prototype.bestTarget;
  Game_Event.prototype.bestTarget = function() {
    var best = Alias_Game_Event_bestTarget.call(this);
    if (!best && this.team() === 2) {
      return $gamePlayer;
    }
    return best;
  };

  Game_Event.prototype.updateABS = function() {
    Game_CharacterBase.prototype.updateABS.call(this);
    if (!this._isDead && this.hasAI() && this.isNearTheScreen()) {
      this.updateAI();
    } else if (this._respawn >= 0) {
      this.updateRespawn();
    }
  };

  Game_Event.prototype.updateAI = function() {
    var bestTarget = this.bestTarget();
    if (!bestTarget) return;
    var targetId = bestTarget.charaId();
    if (this.updateAIRange(bestTarget)) return;
    this.updateAIAction(bestTarget, this.updateAIGetAction(bestTarget));
  };

  Game_Event.prototype.updateAIRange = function(bestTarget) {
    var targetId = bestTarget.charaId();
    if (this.isTargetInRange(bestTarget)) {
      if (!this._agroList.hasOwnProperty(targetId)) {
        this._aiWait = QABS.aiWait;
        this.addAgro(targetId);
      }
      if (this._endWait) {
        this.removeWaitListener(this._endWait);
        this._endWait = null;
      }
    } else {
      if (!this._endWait && this.inCombat()) {
        bestTarget.removeAgro(this.charaId());
        if (this._aiPathfind) {
          this.clearPathfind();
        }
        this._endWait = this.wait(120).then(function() {
          this._endWait = null;
          this.endCombat();
        }.bind(this))
      }
      return true;
    }
    return false;
  };

  Game_Event.prototype.updateAIGetAction = function(bestTarget, dx, dy) {
    var bestAction = null;
    if (this._aiWait >= QABS.aiWait) {
      var dx = bestTarget.cx() - this.cx();
      var dy = bestTarget.cy() - this.cy();
      this._radian = Math.atan2(dy, dx);
      this._radian += this._radian < 0 ? Math.PI * 2 : 0;
      bestAction = QABSManager.bestAction(this.charaId());
      this._aiWait = 0;
    } else {
      this._aiWait++;
    }
    return bestAction;
  };

  Game_Event.prototype.updateAIAction = function(bestTarget, bestAction) {
    if (bestAction) {
      this.useSkill(bestAction);
    } else if (this.canMove() && this._freqCount < this.freqThreshold()) {
      if (this._aiPathfind) {
        var dx = bestTarget.cx() - this.cx();
        var dy = bestTarget.cy() - this.cy();
        var mw = this.collider('collision').width + bestTarget.collider('collision').width;
        var mh = this.collider('collision').height + bestTarget.collider('collision').height;
        if (Math.abs(dx) <= mw && Math.abs(dy) <= mh) {
          this.clearPathfind();
          this.moveTowardCharacter(bestTarget);
        } else {
          this.initChase(bestTarget.charaId());
        }
      } else {
        this.moveTowardCharacter(bestTarget);
      }
    }
  };

  Game_Event.prototype.updateRespawn = function() {
    if (this._respawn === 0) {
      this.respawn();
    } else {
      this._respawn--;
    }
  };

  Game_Event.prototype.isTargetInRange = function(target) {
    if (!target) return false;
    if (this._aiSight) {
      var prev = this._sight.range;
      if (this.inCombat()) {
        this._sight.range = this._aiRange + QMovement.tileSize * 3;
      } else {
        this._sight.range = this._aiRange;
      }
      this._sight.range /= QMovement.tileSize;
      if (prev !== this._sight.range) {
        if (this._sight.base) this._sight.base.kill = true;
        this._sight.base = null;
        this._sight.cache.dir = null;
      }
      if (this._sight.targetId !== target.charaId()) {
        delete this._sight.cache.charas[this._sight.targetId];
        this._sight.targetId = target.charaId();
        this._sight.cache.dir = null;
      }
      var key = [this._mapId, this._eventId, this._sight.handler];
      return $gameSelfSwitches.value(key);
    }
    var dx = Math.abs(target.cx() - this.cx());
    var dy = Math.abs(target.cy() - this.cy());
    var range = this._aiRange + (this._inCombat ? 96 : 0);
    return dx <= range && dy <= range;
  };

  Game_Event.prototype.respawn = function() {
    this._erased = false;
    this.refresh();
    this.findRespawnLocation();
    this.setupBattler();
  };

  Game_Event.prototype.endCombat = function() {
    if (this._aiPathfind) {
      this.clearPathfind();
    }
    this._inCombat = false;
    this.clearAgro();
    if (this._aiPathfind) {
      var x = this.event().x * QMovement.tileSize;
      var y = this.event().y * QMovement.tileSize;
      this.initPathfind(x, y, {
        smart: 1
      });
    } else {
      this.findRespawnLocation();
    }
    this.refresh();
  };

  Game_Event.prototype.findRespawnLocation = function() {
    var x = this.event().x * QMovement.tileSize;
    var y = this.event().y * QMovement.tileSize;
    var dist = this.moveTiles();
    // TODO change this to a Dijkstra's algorithm
    while (true) {
      var stop;
      for (var i = 1; i < 5; i++) {
        var dir = i * 2;
        var x2 = $gameMap.roundPXWithDirection(x, dir, dist);
        var y2 = $gameMap.roundPYWithDirection(y, dir, dist);
        if (this.canPixelPass(x2, y2, 5)) {
          stop = true;
          break;
        }
      }
      if (stop) break;
      dist += this.moveTiles();
    }
    this.setPixelPosition(x2, y2);
    this.straighten();
    this.refreshBushDepth();
  };

  Game_Event.prototype.onDeath = function() {
    if (this._isDead) return;
    if (this._onDeath) {
      try {
        eval(this._onDeath);
      } catch (e) {
        var id = this.battler()._enemyId;
        console.error('Error with `onDeath` meta inside enemy ' + id, e);
      }
    }
    if (this._agroList[0] > 0) {
      var exp = this.battler().exp();
      $gamePlayer.battler().gainExp(exp);
      if (exp > 0) {
        QABSManager.startPopup('QABS-EXP', {
          x: $gamePlayer.cx(), y: $gamePlayer.cy(),
          string: 'Exp: ' + exp
        });
      }
      this.setupLoot();
    }
    this.clearABS();
    this._respawn = Number(this.battler().enemy().meta.respawn) || -1;
    this._isDead = true;
    if (!this._dontErase) this.erase();
  };

  Game_Event.prototype.setupLoot = function() {
    var x, y;
    this.battler().makeDropItems().forEach(function(item) {
      x = this.x + (Math.random() / 2) - (Math.random() / 2);
      y = this.y + (Math.random() / 2) - (Math.random() / 2);
      var type = 0;
      if (DataManager.isWeapon(item)) type = 1;
      if (DataManager.isArmor(item))  type = 2;
      QABSManager.createItem(x, y, item.id, type);
    }.bind(this));
    if (this.battler().gold() > 0) {
      x = this.x + (Math.random() / 2) - (Math.random() / 2);
      y = this.y + (Math.random() / 2) - (Math.random() / 2);
      QABSManager.createGold(x, y, this.battler().gold());
    }
  };

  Game_Event.prototype.onTargetingEnd = function() {
    var skill = this._groundTargeting;
    var target = skill.targets[Math.floor(Math.random() * skill.targets.length)];
    var w = skill.collider.width;
    var h = skill.collider.height;
    var x = target.cx() - w / 2;
    var y = target.cy() - h / 2;
    skill.collider.moveTo(x, y);
    skill.picture.move(x + w / 2, y + h / 2);
    Game_CharacterBase.prototype.onTargetingEnd.call(this);
  };
})();
