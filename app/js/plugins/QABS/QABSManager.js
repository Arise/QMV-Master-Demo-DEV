//-----------------------------------------------------------------------------
// QABS Static Class

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
      if (!chara.battler()) return false;
      if (chara.battler().isDeathStateAffected()) return false;
      if (chara.isFriendly(self) && [1, 2, 3, 4, 5, 6].contains(item.data.scope)) {
        return false;
      }
      if (!chara.isFriendly(self) && [7, 8, 9, 10].contains(item.data.scope)) {
        return false;
      }
      if (item.data.scope === 11 && chara !== self) return false;
      return item.collider.intersects(chara.collider('collision'));
    });
  };

  QABSManager.bestAction = function(userId) {
    var chara = QPlus.getCharacter(userId);
    if (!chara.battler()) return null;
    var targets;
    var action = {};
    var skills = chara.usableSkills().filter(function(skillId) {
      if (!skillId) return false;
      targets = QABSManager.skillWillHit(skillId, userId);
      if (targets && targets.length > 0) {
        action[skillId] = targets;
        return true;
      }
      return false;
    })
    if (skills.length === 0) return null;
    return skills[Math.floor(Math.random() * skills.length)]
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
      targets = QABSManager.getTargets({
        data: skill,
        collider: range
      }, chara);
      ColliderManager.draw(range, 60);
    } else {
      targets = QABSManager.getTargets({
        data: skill,
        collider: skillCollider
      }, chara);
      ColliderManager.draw(skillCollider, 60);
    }
    return targets;
  };

  QABSManager.startAction = function(self, targets, item) {
    if (!item.animationTarget || targets.length === 0) {
      this.startAnimation(item.data.animationId, item.collider.center.x, item.collider.center.y);
    }
    for (var i = 0; i < targets.length; i++) {
      if (item.animationTarget === 1) {
        var x = targets[i].cx();
        var y = targets[i].cy();
        this.startAnimation(item.data.animationId, x, y);
      }
      var action = new Game_Action(self.battler(), true);
      action.setSkill(item.data.id);
      action.absApply(targets[i].battler());
      targets[i].addAgro(self.charaId(), item.data);
    }
  };

  QABSManager.startPopup = function(type, options) {
    if (!Imported.QPopup) return;
    if (!options.transitions) {
      var start = options.duration ? options.duration - 30 : 90;
      var fadeout = start + ' 30 fadeout';
      var slideup = '0 120 slideup 48';
      options.transitions = [fadeout, slideup];
    }
    QPopup.start(options);
  };

  // TODO QABSManager.startNotification

  QABSManager._animations = [];
  QABSManager.startAnimation = function(id, x, y) {
    var scene = SceneManager._scene;
    if (scene.constructor !== Scene_Map) return;
    var temp = new Sprite_Base();
    temp.realX = x;
    temp.realY = y;
    temp.z = 8;
    if (id < 0) id = 1;
    if (id <= 0) return;
    var animation = $dataAnimations[id];
    this._animations.push(temp);
    scene._spriteset._tilemap.addChild(temp);
    temp.startAnimation(animation, false, 0);
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
})();
