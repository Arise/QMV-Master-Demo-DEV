//-----------------------------------------------------------------------------
// Game_Event

(function() {
  var Alias_Game_Event_initialize = Game_Event.prototype.initialize;
  Game_Event.prototype.initialize = function(mapId, eventId) {
    Alias_Game_Event_initialize.call(this, mapId, eventId);
    this.setupBattler();
  };

  Game_Event.prototype.battler = function() {
    if ($gameSystem.isDisabled(this._mapId, this._eventId)) return null;
    if (!this.page() || this._isDead) return null;
    return this._battler;
  };

  Game_Event.prototype.setupBattler = function() {
    var foe = /<enemy:([0-9]*?)>/i.exec(this.notes());
    if (foe) {
      this.clearABS();
      this._battlerId = Number(foe[1]);
      this._battler = new Game_Enemy(this._battlerId, 0, 0);
      this._battler._charaId = this.charaId();
      this._skillList = [];
      this._aiType = this._battler._aiType;
      this._aiRange = this._battler._aiRange || QABS.aiLength;
      this._aiWait = 0;
      this._aiPathfind = Imported.QPathfind && QABS.aiPathfind;
      this._aiSight = Imported.QSight && QABS.aiSight;
      if (this._aiSight) {
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

  var Alias_Game_Event_comments = Game_Event.prototype.comments;
  Game_Event.prototype.comments = function() {
    var comments = Alias_Game_Event_comments.call(this);
    if (!this._aiSight) return comments;
    var range = this._aiRange / QMovement.tileSize;
    return comments + '<sight:circle,' + range + ', AI, 0>';
  };

  Game_Event.prototype.disableEnemy = function() {
    $gameSystem.disableEnemy(this._mapId, this._eventId);
    this.clearABS();
    this._battler = null;
  };

  Game_Event.prototype.team = function() {
    return this._battler ? this._team : 0;
  };

  Game_Event.prototype.usableSkills = function() {
    if (!this._battler) return [];
    return this._skillList.filter(function(skillId) {
      return !this._skillCooldowns[skillId];
    }, this);
  };

  var Alias_Game_Event_bestTarget = Game_Event.prototype.bestTarget;
  Game_Event.prototype.bestTarget = function() {
    var best = Alias_Game_Event_bestTarget.call(this);
    if (!best && this.team() === 2) {
      return $gamePlayer;
    }
    return best;
  };

  Game_Event.prototype.addAgro = function(charaId, skill) {
    var isNew = !this._agroList[charaId];
    Game_CharacterBase.prototype.addAgro.call(this, charaId, skill);
    if (isNew) {
      if (this._aiPathfind) {
        this.clearPathfind();
      }
      if (this._endWait) {
        this.removeWaitListener(this._endWait);
        this._endWait = null;
      }
    }
  };

  Game_Event.prototype.updateABS = function() {
    if ($gameSystem.isDisabled(this._mapId, this._eventId)) return;
    Game_CharacterBase.prototype.updateABS.call(this);
    if (this.page() && !this._isDead && this.isNearTheScreen()) {
      return this.updateAI(this._aiType);
    }
    if (this._respawn >= 0) {
      this.updateRespawn();
    }
  };

  Game_Event.prototype.updateAI = function(type) {
    if (type === 'simple') {
      return this.updateAISimple();
    }
    // to add more AI types, alias this function
    // and do something similar to above
  };

  Game_Event.prototype.updateAISimple = function() {
    var bestTarget = this.bestTarget();
    if (!bestTarget) return;
    var targetId = bestTarget.charaId();
    if (this.AISimpleRange(bestTarget)) return;
    this.AISimpleAction(bestTarget, this.AISimpleGetAction(bestTarget));
  };

  Game_Event.prototype.AISimpleRange = function(bestTarget) {
    var targetId = bestTarget.charaId();
    if (this.isTargetInRange(bestTarget)) {
      if (!this._agroList.hasOwnProperty(targetId)) {
        this._aiWait = QABS.aiWait;
        this.addAgro(targetId);
        if (this._aiPathfind) {
          this.clearPathfind();
        }
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
        }.bind(this));
      }
      if (this._endWait && this.canMove()) {
        this.moveTowardCharacter(bestTarget);
      }
      return true;
    }
    return false;
  };

  Game_Event.prototype.AISimpleGetAction = function(bestTarget) {
    var bestAction = null;
    if (this._aiWait >= QABS.aiWait) {
      this.turnTowardCharacter(bestTarget);
      bestAction = QABSManager.bestAction(this.charaId());
      this._aiWait = 0;
    } else {
      this._aiWait++;
    }
    return bestAction;
  };

  Game_Event.prototype.AISimpleAction = function(bestTarget, bestAction) {
    if (bestAction) {
      var skill = this.useSkill(bestAction);
      if (skill) skill._target = bestTarget;
    } else if (this.canMove()) {
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
        if (this._sight.base) {
          this._sight.base.kill = true;
          this._sight.base.id = 'sightOld' + this.charaId();
        }
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
        smart: 1,
        adjustEnd: true
      });
    } else {
      this.findRespawnLocation();
    }
    this.refresh();
  };

  Game_Event.prototype.findRespawnLocation = function() {
    var x = this.event().x * QMovement.tileSize;
    var y = this.event().y * QMovement.tileSize;
    if (this.canPixelPass(x, y, 5)) {
      this.setPixelPosition(x, y);
      this.straighten();
      this.refreshBushDepth();
      return;
    }
    var dist = Math.min(this.collider('collision').width, this.collider('collision').height);
    dist = Math.max(dist / 2, this.moveTiles());
    var open = [x + ',' + y];
    var closed = [];
    var current;
    var x2;
    var y2;
    while (open.length) {
      current = open.shift();
      closed.push(current);
      current = current.split(',').map(Number);
      var passed;
      for (var i = 1; i < 5; i++) {
        var dir = i * 2;
        x2 = Math.round($gameMap.roundPXWithDirection(current[0], dir, dist));
        y2 = Math.round($gameMap.roundPYWithDirection(current[1], dir, dist));
        if (this.canPixelPass(x2, y2, 5)) {
          passed = true;
          break;
        }
        var key = x2 + ',' + y2;
        if (!closed.contains(key) && !open.contains(key)) {
          open.push(key);
        }
      }
      if (passed) break;
    }
    this.setPixelPosition(x2, y2);
    this.straighten();
    this.refreshBushDepth();
  };

  Game_Event.prototype.onDeath = function() {
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
