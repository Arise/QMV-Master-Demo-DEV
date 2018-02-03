//-----------------------------------------------------------------------------
// QABS Manager Static Class

function QABSManager() {
  throw new Error('This is a static class');
}

(function() {
  QABSManager.clear = function() {
    this._animations = [];
    this._pictures = [];
    this._mapId = $gameMap._mapId;
  };

  QABSManager.getTargets = function(item, self) {
    return ColliderManager.getCharactersNear(item.collider, function(chara) {
      if (typeof chara.battler !== 'function' || !chara.battler()) return false;
      if (chara.battler().isDeathStateAffected()) return false;
      if (chara.isFriendly(self) && [1, 2, 3, 4, 5, 6].contains(item.data.scope)) {
        return false;
      }
      if (!chara.isFriendly(self) && [7, 8, 9, 10].contains(item.data.scope)) {
        return false;
      }
      if (item.data.scope === 11 && chara !== self) return false;
      var type = item.settings.collides || 'collision';
      return item.collider.intersects(chara.collider(type));
    });
  };

  QABSManager.bestAction = function(userId) {
    var chara = QPlus.getCharacter(userId);
    if (!chara.battler()) return null;
    var targets;
    var skills = chara.usableSkills().filter(function(skillId) {
      if (!skillId) return false;
      targets = QABSManager.skillWillHit(skillId, userId);
      if (targets && targets.length > 0) {
        return true;
      }
      return false;
    })
    if (skills.length === 0) return null;
    return skills[Math.floor(Math.random() * skills.length)];
  };

  QABSManager.skillWillHit = function(skillId, userId) {
    var skill = $dataSkills[skillId];
    var chara = QPlus.getCharacter(userId);
    var settings = QABS.getSkillSettings(skill);
    var collider = chara.collider('collision');
    var skillCollider = chara.makeSkillCollider(settings);
    var w1 = settings.collider[1] || chara.collider('collision').width;
    var h1 = settings.collider[2] || chara.collider('collision').height;
    var x1 = chara.cx() - w1 / 2;
    var y1 = chara.cy() - h1 / 2;
    var targets = [];
    var aiRange = QABS.getAIRange(skill);
    if (aiRange > 0) {
      var r1 = aiRange * 2;
      range = new Circle_Collider(w1 + r1, h1 + r1);
      range.moveTo(x1 - r1 / 2, y1 - r1 / 2);
      targets = this.getTargets({
        settings: settings,
        data: skill,
        collider: range
      }, chara);
      ColliderManager.draw(range, QABS.aiWait / 2);
    } else {
      targets = this.getTargets({
        settings: settings,
        data: skill,
        collider: skillCollider
      }, chara);
      ColliderManager.draw(skillCollider, QABS.aiWait / 2);
    }
    return targets;
  };

  QABSManager.startAction = function(self, targets, item) {
    if (!item.animationTarget || targets.length === 0) {
      this.startAnimation(item.data.animationId, item.collider.center.x, item.collider.center.y);
    }
    self._agro.placeInCombat();
    var action = new Game_ABSAction(self.battler(), true);
    action.setSkill(item.data.id);
    for (var i = 0; i < targets.length; i++) {
      if (item.animationTarget === 1) {
        var x = targets[i].cx();
        var y = targets[i].cy();
        this.startAnimation(item.data.animationId, x, y);
      }
      action.absApply(targets[i].battler());
      targets[i].addAgro(self.charaId(), item.data);
    }
    action.applyGlobal();
  };

  QABSManager.startPopup = function(type, options) {
    if (!Imported.QPopup) return;
    var preset = $gameSystem.qPopupPreset(type);
    Object.assign(options, {
      style: preset.style,
      transitions: preset.transitions
    })
    if (!options.duration) options.duration = 80;
    if (!options.transitions) {
      var start = options.duration - 30;
      var end = start + 30;
      var fadeout = start + ' 30 fadeout';
      var slideup = '0 ' + end + ' slideup 24';
      options.transitions = [fadeout, slideup];
    }
    return QPopup.start(options);
  };

  QABSManager._animations = [];
  QABSManager.startAnimation = function(id, x, y) {
    var scene = SceneManager._scene;
    if (scene.constructor !== Scene_Map) return;
    if (id < 0) id = 1;
    if (id <= 0) return;
    var animation = $dataAnimations[id];
    var temp = new Sprite_MapAnimation(animation);
    temp.move(x, y);
    this._animations.push(temp);
    scene._spriteset._tilemap.addChild(temp);
  };

  QABSManager.removeAnimation = function(sprite) {
    var scene = SceneManager._scene;
    if (scene.constructor !== Scene_Map) return;
    var i = this._animations.indexOf(sprite);
    if (i < 0) return;
    this._animations[i] = null;
    this._animations.splice(i, 1);
    scene._spriteset._tilemap.removeChild(sprite);
  };

  QABSManager._pictures = [];
  QABSManager.addPicture = function(sprite) {
    var scene = SceneManager._scene;
    if (scene.constructor !== Scene_Map) return;
    this._pictures.push(sprite);
    scene._spriteset._tilemap.addChild(sprite);
  };

  QABSManager.removePicture = function(sprite) {
    var scene = SceneManager._scene;
    if (scene.constructor !== Scene_Map) return;
    var i = this._pictures.indexOf(sprite);
    if (i < 0) return;
    this._pictures[i] = null;
    this._pictures.splice(i, 1);
    scene._spriteset._tilemap.removeChild(sprite);
  };

  QABSManager.createItem = function(x, y, itemId, type) {
    var loot = new Game_Loot(x, y);
    var data = $dataItems;
    if (type === 1) data = $dataWeapons;
    if (type === 2) data = $dataArmors;
    loot.setItem(data[itemId]);
    return loot;
  };

  QABSManager.createGold = function(x, y, value) {
    var loot = new Game_Loot(x, y);
    loot.setGold(value);
    return loot;
  };

  QABSManager._freeEventIds = [];
  QABSManager.addEvent = function(event) {
    var id = this._freeEventIds.unshift() || 0;
    if (!id || $gameMap._events[id]) {
      id = $gameMap._events.length;
    }
    event._eventId = id;
    $gameMap._events[id] = event;
    if (!event._noSprite) {
      var scene = SceneManager._scene;
      if (scene === Scene_Map) {
        var spriteset = scene._spriteset;
        var sprite = new Sprite_Character(event);
        spriteset._characterSprites.push(sprite);
        spriteset._tilemap.addChild(sprite);
      }
    }
  };

  QABSManager.removeEvent = function(event) {
    var id = event._eventId;
    if (!id || !$gameMap._events[id]) return;
    event.removeColliders();
    if (!event._noSprite) {
      var scene = SceneManager._scene;
      if (scene === Scene_Map) {
        var spriteset = scene._spriteset;
        var spriteCharas = spriteset._characterSprites;
        for (var i = 0; i < spriteCharas.length; i++) {
          if (spriteCharas[i] && spriteCharas[i]._character === event) {
            spriteset._tilemap.removeChild(spriteCharas[i]);
            spriteCharas.splice(i, 1);
            break;
          }
        }
      }
    }
    $gameMap._events[id].clearABS();
    $gameMap._events[id] = null;
    this._freeEventIds.push(id);
  };

  QABSManager.preloadSkill = function(skill) {
    var aniId = skill.animationId;
    aniId = aniId < 0 ? 1 : aniId;
    var ani = $dataAnimations[aniId];
    if (ani) {
      ImageManager.loadAnimation(ani.animation1Name, ani.animation1Hue);
      ImageManager.loadAnimation(ani.animation2Name, ani.animation2Hue);
    }
    var sequence = QABS.getSkillSequence(skill);
    for (var i = 0; i < sequence.length; i++) {
      var action = sequence[i];
      var ani = /^animation (.*)/i.exec(action);
      var pic = /^picture (.*)/i.exec(action);
      var forced = /forceSkill (\d+)/i.exec(action);
      if (ani) {
        ani = ani[1].trim();
        ani = $dataAnimations[ani];
        if (ani) {
          ImageManager.loadAnimation(ani.animation1Name, ani.animation1Hue);
          ImageManager.loadAnimation(ani.animation2Name, ani.animation2Hue);
        }
      }
      if (pic) {
        pic = QPlus.makeArgs(pic[1])[0];
        ImageManager.loadPicture(pic);
      }
      if (forced) {
        var forcedSkill = $dataSkills[Number(forced[1])];
        if (forcedSkill) this.preloadSkill(forcedSkill);
      }
    }
  };
})();
