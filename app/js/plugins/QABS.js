//=============================================================================
// QABS
//=============================================================================

var Imported = Imported || {};
Imported.QABS = '1.0.0';

if (!Imported.QPlus || !QPlus.versionCheck(Imported.QPlus, '1.3.0')) {
  alert('Error: QABS requires QPlus 1.3.0 or newer to work.');
  throw new Error('Error: QABS requires QPlus 1.3.0 or newer to work.');
} else if (!Imported.QMovement || !QPlus.versionCheck(Imported.QMovement, '1.3.1')) {
  alert('Error: QABS requires QMovement 1.3.1 or newer to work.');
  throw new Error('Error: QABS requires QMovement 1.3.1 or newer to work.');
}

//=============================================================================
 /*:
 * @plugindesc <QABS>
 * Action Battle System for QMovement
 * @author Quxios  | Version 1.0.0
 *
 * @development
 *
 * @requires QMovement
 *
 * @video TODO
 *
 * @param Quick Target
 * @desc Ground target skills will instantly cast at mouse location
 * Default: false   Set to true or false
 * @default false
 *
 * @param Lock when Targeting
 * @desc Player can not move when using Ground / Select targeting skills
 * Default: false   Set to true or false
 * @default false
 *
 * @param Attack Towards Mouse
 * @desc All actions will be used towards your mouse location
 * Default: false   Set to true or false
 * @default false
 *
 * @param =====================
 * @desc Spacer
 * @default
 *
 * @param Loot Decay
 * @desc How long until the loot disappears, in frames.
 * Default: 600
 * @default 600
 *
 * @param AoE Loot
 * @desc Collect nearby loot or pick up one at a time.
 * Default: true   Set to true or false
 * @default true
 *
 * @param Loot Touch Trigger
 * @desc Pick up loot on player touch
 * Default: false  Set to true or false
 * @default false
 *
 * @param Gold Icon
 * @desc Icon Index to display for gold loot
 * Default: 314
 * @default 314
 *
 * @param Level Animation
 * @desc The animation ID to play on level up.
 * Default: 52   Set to 0 for no animation.
 * @default 52
 *
 * @param =====================
 * @desc Spacer
 * @default
 *
 * @param Move Resistance Rate Stat
 * @desc Which stat to use for Move Resistance Rate
 * Default: xparam(1)     //  This is Evasion
 * @default xparam(1)
 *
 * @param =====================
 * @desc Spacer
 * @default
 *
 * @param AI Default Sight Range
 * @desc Default range for enemies to go after player, in pixels
 * Default: 240
 * @default 240
 *
 * @param AI Action Wait
 * @desc How many frames to wait before running AI for next skill
 * Default: 30
 * @default 30
 *
 * @param AI Uses QSight
 * @desc Set to true or false if AI should use QSight
 * May decrease performance
 * @default true
 *
 * @param AI uses QPathfind
 * @desc Set to true or false if AI should use QPathfind
 * May decrease performance
 * @default true
 *
 * @param =====================
 * @desc Spacer
 * @default
 *
 * @param Skill Key 1
 * @desc Select which input key for Skill Key 1
 * Leave empty to disable
 * @default
 *
 * @param Skill Key 1 Rebind
 * @desc Set to true or false if the skill in this key
 * can be reassisgned
 * @default true
 *
 * @param Skill Key 1 Skill
 * @desc Select which skill is used by default for Skill Key 1
 * Leave empty to set ingame
 * @default
 *
 * @param Skill Key 2
 * @desc Select which input key for Skill Key 2
 * Leave empty to disable
 * @default
 *
 * @param Skill Key 2 Rebind
 * @desc Set to true or false if the skill in this key
 * can be reassisgned
 * @default true
 *
 * @param Skill Key 2 Skill
 * @desc Select which skill is used by default for Skill Key 2
 * Leave empty to set set ingame
 * @default
 *
 * @param Skill Key 3
 * @desc Select which input key for Skill Key 3
 * Leave empty to disable
 * @default
 *
 * @param Skill Key 3 Rebind
 * @desc Set to true or false if the skill in this key
 * can be reassisgned
 * @default true
 *
 * @param Skill Key 3 Skill
 * @desc Select which skill is used by default for Skill Key 3
 * Leave empty to set ingame
 * @default
 *
 * @param Skill Key 4
 * @desc Select which input key for Skill Key 4
 * Leave empty to disable
 * @default
 *
 * @param Skill Key 4 Rebind
 * @desc Set to true or false if the skill in this key
 * can be reassisgned
 * @default true
 *
 * @param Skill Key 4 Skill
 * @desc Select which skill is used by default for Skill Key 4
 * Leave empty to set ingame
 * @default
 *
 * @param Skill Key 5
 * @desc Select which input key for Skill Key 5
 * Leave empty to disable
 * @default
 *
 * @param Skill Key 5 Rebind
 * @desc Set to true or false if the skill in this key
 * can be reassisgned
 * @default true
 *
 * @param Skill Key 5 Skill
 * @desc Select which skill is used by default for Skill Key 5
 * Leave empty to set ingame
 * @default
 *
 * @param Skill Key 6
 * @desc Select which input key for Skill Key 6
 * Leave empty to disable
 * @default
 *
 * @param Skill Key 6 Rebind
 * @desc Set to true or false if the skill in this key
 * can be reassisgned
 * @default true
 *
 * @param Skill Key 6 Skill
 * @desc Select which skill is used by default for Skill Key 6
 * Leave empty to set ingame
 * @default
 *
 * @param Skill Key 7
 * @desc Select which input key for Skill Key 7
 * Leave empty to disable
 * @default
 *
 * @param Skill Key 7 Rebind
 * @desc Set to true or false if the skill in this key
 * can be reassisgned
 * @default true
 *
 * @param Skill Key 7 Skill
 * @desc Select which skill is used by default for Skill Key 7
 * Leave empty to set ingame
 * @default
 *
 * @param Skill Key 8
 * @desc Select which input key for Skill Key 8
 * Leave empty to disable
 * @default
 *
 * @param Skill Key 8 Rebind
 * @desc Set to true or false if the skill in this key
 * can be reassisgned
 * @default true
 *
 * @param Skill Key 8 Skill
 * @desc Select which skill is used by default for Skill Key 8
 * Leave empty to set ingame
 * @default
 *
 * @param Skill Key 9
 * @desc Select which input key for Skill Key 9
 * Leave empty to disable
 * @default
 *
 * @param Skill Key 9 Rebind
 * @desc Set to true or false if the skill in this key
 * can be reassisgned
 * @default true
 *
 * @param Skill Key 9 Skill
 * @desc Select which skill is used by default for Skill Key 9
 * Leave empty to set ingame
 * @default
 *
 * @param Skill Key 10
 * @desc Select which input key for Skill Key 10
 * Leave empty to disable
 * @default
 *
 * @param Skill Key 10 Rebind
 * @desc Set to true or false if the skill in this key
 * can be reassisgned
 * @default true
 *
 * @param Skill Key 10 Skill
 * @desc Select which skill is used by default for Skill Key 10
 * Leave empty to set ingame
 * @default
 *
 * @param Skill Key 11
 * @desc Select which input key for Skill Key 11
 * Leave empty to disable
 * @default
 *
 * @param Skill Key 11 Rebind
 * @desc Set to true or false if the skill in this key
 * can be reassisgned
 * @default true
 *
 * @param Skill Key 11 Skill
 * @desc Select which skill is used by default for Skill Key 11
 * Leave empty to set ingame
 * @default
 *
 * @param Skill Key 12
 * @desc Select which input key for Skill Key 12
 * Leave empty to disable this skill key
 * @default
 *
 * @param Skill Key 12 Rebind
 * @desc Set to true or false if the skill in this key
 * can be reassisgned
 * @default true
 *
 * @param Skill Key 12 Skill
 * @desc Select which skill is used by default for Skill Key 12
 * Leave empty to set ingame
 * @default
 *
 * @help
 * ============================================================================
 * ## About
 * ============================================================================
 *
 * ============================================================================
 * ## How to use
 * ============================================================================
 *
 * ----------------------------------------------------------------------------
 * **Sub section**
 * ----------------------------------------------------------------------------
 *
 * ============================================================================
 * ## Skill Sequences
 * ============================================================================
 * user ---
 * user casting [true|false]
 * user lock
 * user unlock
 * user speed [inc|dec] [amt]
 * user move [forward|backward] [dist] [wait? true|false]
 * user moveHere [wait? true|false]
 * user jump [forward|backward] [dist] [wait? true|false]
 * user jumpHere [wait? true|false]
 * user teleport
 * user setDirection [dir]
 * user directionFix [true|false]
 * user pose [pose] [wait? true|false]
 * user forceSkill [skillId] [angleOffset in degrees]
 * user animation [animationId]
 * store
 * move [forward|backward] [dist] [duration] [wait? true|false]
 * moveToStored [duration] [wait? true|false]
 * wave [forward|backward] [amplitude] [harm] [dist] [duration] [wait? true|false]
 * waveToStored [amplitude] [harm] [duration] [wait? true|false]
 * trigger
 * wait [duration]
 * picture [fileName] [rotatable? true|false] [base direction]
 * trail [fileName] [rotatable? true|false] [base direction]
 * collider
 * animation [animationId]
 * se [name] [volume] [pitch] [pan]
 * qaudio TODO
 * globalLock
 * globalUnlock
 *
 * ============================================================================
 * ## Skill OnDamage
 * ============================================================================
 * target ---
 * target move [towards|away] [dist]
 * target jump [towards|away] [dist]
 * target pose [pose]
 * target cancel
 * user
 * user forceSkill
 * animationTarget
 *
 * ============================================================================
 * ## Links
 * ============================================================================
 * RPGMakerWebs:
 *
 *   http://forums.rpgmakerweb.com/index.php?threads/qplugins.73023/
 *
 * Terms of use:
 *
 *   https://github.com/quxios/QMV-Master-Demo/blob/master/readme.md
 *
 * @tags QM-Addon, ABS, Battle
 */
//=============================================================================
//=============================================================================
// QABS Static Class

function QABS() {
  throw new Error('This is a static class');
}

(function() {
  var _PARAMS = QPlus.getParams('<QABS>');

  QABS.quickTarget = _PARAMS['Quick Target'] === 'true';
  QABS.lockTargeting = _PARAMS['Lock when Targeting'] === 'true';
  QABS.towardsMouse = _PARAMS['Attack Towards Mouse'] === 'true';
  QABS.radianAtks = QMovement.offGrid;

  QABS.lootDecay = Number(_PARAMS['Loot Decay']) || 1;
  QABS.aoeLoot = _PARAMS['AoE Loot'] === 'true';
  QABS.lootTrigger = _PARAMS['Loot Touch Trigger'] === 'true' ? 2 : 0;
  QABS.goldIcon = Number(_PARAMS['Gold Icon']) || 314;
  QABS.levelAni = Number(_PARAMS['Level Animation']) || 0;
  QABS.showDmg = _PARAMS['Show Damage'] === 'true';

  QABS.mrst = _PARAMS['Move Resistance Rate Stat'];

  QABS.aiLength = Number(_PARAMS['AI Default Sight Range']) || 0;
  QABS.aiWait = Number(_PARAMS['AI Action Wait']) || 30;
  QABS.aiSight = _PARAMS['AI Uses QSight'] === 'true';
  QABS.aiPathfind = _PARAMS['AI uses QPathfind'] === 'true';

  QABS.skillKey = {};
  for (var key in _PARAMS) {
    var input = _PARAMS[key];
    var skillN = /^Skill Key ([0-9]+)$/.exec(key);
    if (skillN && input !== '') {
      QABS.skillKey[skillN[1]] = {
        input: input.split(',').map(function(s) { return s.trim(); }),
        skillId: Number(_PARAMS[key + ' Skill']) || 0,
        rebind: _PARAMS[key + ' Rebind'] === 'true'
      }
    }
  }

  QABS.stringToSkillKeyObj = function(string) {
    var obj = QPlus.stringToObj(string);
    for (var key in obj) {
      var data = obj[key].split(' ').filter(function(i) {
        return i !== '';
      }).map(function(i) {
        return i.trim();
      })
      var skillId = Number(data[0]) || 0;
      var rebind = data[1] === 'true';
      if (!QABS.skillKey[key]) {
        var msg = 'ERROR: Attempted to apply a skill key that has not been setup';
        msg += ' in the plugin parameters.\n';
        msg += 'Skill Key Number: ' + key;
        alert(msg);
        continue;
      }
      var input = QABS.skillKey[key].input.clone();
      if (input) {
        obj[key] = {
          input: input,
          skillId: skillId,
          rebind: rebind
        }
      }
    }
    return obj;
  };

  QABS._skillSettings = {};
  QABS.getSkillSettings = function(skill) {
    if (!this._skillSettings.hasOwnProperty(skill.id)) {
      var settings = skill.qmeta.absSettings;
      this._skillSettings[skill.id] = false;
      if (settings) {
        settings = QPlus.stringToObj(settings);
        Object.assign(settings, {
          cooldown: Number(settings.cooldown) || 0,
          through: Number(settings.through) || 0,
          groundTarget: settings.groundtarget && !settings.selecttarget,
          selectTarget: !settings.groundtarget && settings.selecttarget
        })
        if (settings.groundtarget) var range = Number(settings.groundtarget);
        if (settings.selecttarget) var range = Number(settings.selecttarget);
        settings.range = range || 0;
        this._skillSettings[skill.id] = settings;
      }
    }
    return this._skillSettings[skill.id];
  };

  QABS._skillSequence = {};
  QABS.getSkillSequence = function(skill) {
    if (!this._skillSequence.hasOwnProperty(skill.id)) {
      var settings = skill.qmeta.absSequence;
      this._skillSequence[skill.id] = [];
      if (settings) {
        settings = settings.split('\n');
        var actions = [];
        for (var i = 0; i < settings.length; i++) {
          if (settings[i].trim() !== '') {
            actions.push(settings[i].trim());
          }
        }
        actions.push('collider hide');
        actions.push('user unlock');
        actions.push('user casting false');
        this._skillSequence[skill.id] = actions;
      }
    }
    return this._skillSequence[skill.id].clone();
  };

  QABS._skillOnDamage = {};
  QABS.getSkillOnDamage = function(skill) {
    if (!this._skillOnDamage.hasOwnProperty(skill.id)) {
      var settings = skill.qmeta.absOnDamage;
      var actions = [];
      actions.push('animation 0');
      if (settings) {
        settings = settings.split('\n');
        for (var i = 0; i < settings.length; i++) {
          if (settings[i].trim() !== '') {
            actions.push(settings[i].trim());
          }
        }
      }
      this._skillOnDamage[skill.id] = actions;
    }
    return this._skillOnDamage[skill.id].clone();
  };

  QABS._weaponSkills = {};
  QABS.weaponSkills = function(id) {
    if (!this._weaponSkills[id]) {
      var skills = $dataWeapons[id].qmeta.absSkills;
      this._weaponSkills[id] = {};
      if (skills) {
        this._weaponSkills[id] = this.stringToSkillKeyObj(skills);
      }
    }
    return this._weaponSkills[id];
  };

  QABS._aiRange = {};
  QABS.getAIRange = function(skill) {
    if (!this._aiRange.hasOwnProperty(skill.id)) {
      var actions = this.getSkillSequence(skill);
      var dist = 0;
      var maxDist = 0;
      actions.forEach(function(action) {
        var match = /^move(.*)/i.exec(action);
        if (match) {
          match = match[1].trim();
          match = match.split(' ');
          if (match[0] === 'forward') {
            dist += Number(match[1]) || 0;
          } else {
            dist -= Number(match[1]) || 0;
          }
          maxDist = Math.max(dist, maxDist);
        }
      })
      this._aiRange[skill.id] = maxDist;
    }
    return this._aiRange[skill.id];
  };

  QABS.enable = function() {
    $gameSystem._absEnabled = true;
  };

  QABS.disable = function() {
    $gameSystem._absEnabled = false;
  };

  QABS.debug = function() {
    $dataSkills.forEach(function(skill) {
      if (skill) {
        $gameParty.leader().learnSkill(skill.id);
      }
    })
  };
})();

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
    var preset = $gameSystem.qPopupPreset(type);
    Object.assign(options, {
      duration: 80,
      style: preset.style,
      transitions: preset.transitions
    })
    if (!options.transitions) {
      var start = options.duration - 30;
      var end = start + 30;
      var fadeout = start + ' 30 fadeout';
      var slideup = '0 ' + end + ' slideup 24';
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
})();

//-----------------------------------------------------------------------------
// Skill_Sequencer

function Skill_Sequencer() {
  this.initialize.apply(this, arguments);
}

(function() {
  Skill_Sequencer.prototype.constructor = Skill_Sequencer;

  Skill_Sequencer.prototype.initialize = function(character, skill) {
    this._character = character;
    this._skill = skill;
  };

  Skill_Sequencer.prototype.startAction = function(action) {
    var cmd = action.shift().toLowerCase();
    switch (cmd) {
      case 'user': {
          this.startUserAction(action);
          break;
        }
      case 'store': {
        this.actionStore();
        break;
      }
      case 'move': {
        this.actionMove(action);
        break;
      }
      case 'movetostored': {
        this.actionMoveToStored(action);
        break;
      }
      case 'wave': {
        this.actionWave(action);
        break;
      }
      case 'wavetostored': {
        this.actionWaveToStored(action);
        break;
      }
      case 'damage':
      case 'trigger': {
        this.actionTrigger(action);
        break;
      }
      case 'wait': {
        this.actionWait(action);
        break;
      }
      case 'picture': {
        this.actionPicture(action);
        break;
      }
      case 'trail': {
        this.actionTrail(action);
        break;
      }
      case 'collider': {
        this.actionCollider(action);
        break;
      }
      case 'animation': {
        this.actionAnimation(action);
        break;
      }
      case 'se': {
        this.actionSE(action);
        break;
      }
      case 'globallock': {
        $gameMap.globalLock(null, 0, 1);
        break;
      }
      case 'globalunlock': {
        $gameMap.globalUnlock(null, 0, 0);
        break;
      }
    }
  };

  Skill_Sequencer.prototype.startUserAction = function(action) {
    var cmd = action.shift().toLowerCase();
    switch (cmd) {
      case 'casting': {
        this.userCasting(action);
        break;
      }
      case 'lock': {
        this.userLock();
        break;
      }
      case 'unlock': {
        this.userUnlock();
        break;
      }
      case 'speed': {
        this.userSpeed(action);
        break;
      }
      case 'move': {
        this.userMove(action);
        break;
      }
      case 'movehere': {
        this.userMoveHere(action);
        break;
      }
      case 'jump': {
        this.userJump(action);
        break;
      }
      case 'jumphere': {
        this.userJumpHere(action);
        break;
      }
      case 'teleport': {
        this.userTeleport();
        break;
      }
      case 'setdirection': {
        this.userSetDirection(action);
        break;
      }
      case 'directionfix': {
        this.userDirectionFix(action);
        break;
      }
      case 'pose': {
        this.userPose(action);
        break;
      }
      case 'forceskill': {
        this.userForceSkill(action);
        break;
      }
      case 'animation': {
        this.userAnimation(action);
        break;
      }
    }
  };

  Skill_Sequencer.prototype.startOnDamageAction = function(action, targets) {
    var cmd = action.shift().toLowerCase();
    switch (cmd) {
      case 'target': {
        this.startOnDamageTargetAction(action, targets);
        break;
      }
      case 'user': {
        this.startOnDamageUserAction(action, targets);
        break;
      }
      case 'animationtarget': {
        this._skill.animationTarget = Number(action[1]) || 0;
        break;
      }
    }
  };

  Skill_Sequencer.prototype.startOnDamageTargetAction = function(action, targets) {
    var cmd = action.shift().toLowerCase();
    switch (cmd) {
      case 'move': {
        this.targetMove(action, targets);
        break;
      }
      case 'jump': {
        this.targetJump(action, targets);
        break;
      }
      case 'pose': {
        this.targetPose(action, targets);
        break;
      }
      case 'cancel': {
        this.targetCancel(action, targets);
        break;
      }
    }
  };

  Skill_Sequencer.prototype.startDamageUserAction = function(action, targets) {
    var cmd = action.shift().toLowerCase();
    switch (cmd) {
      case 'forceskill': {
        this.userForceSkill(action);
        break;
      }
    }
  };

  Skill_Sequencer.prototype.userCasting = function(action) {
    if (!this._skill.forced) {
      this._character._casting = action[0] === 'true' ? this._skill : false;
    }
  };

  Skill_Sequencer.prototype.userLock = function() {
    this._character._skillLocked.push(this._skill);
  };

  Skill_Sequencer.prototype.userUnlock = function() {
    var i = this._character._skillLocked.indexOf(this._skill);
    if (i >= 0) {
      this._character._skillLocked.splice(i, 1);
    }
  };

  Skill_Sequencer.prototype.userSpeed = function(action) {
    var amt = Number(action[1]) || 1;
    var spd = this._character.moveSpeed();
    if (action[0] === 'inc') {
      this._character.setMoveSpeed(spd + amt);
    } else if (action[0] === 'dec')  {
      this._character.setMoveSpeed(spd - amt);
    }
  };

  Skill_Sequencer.prototype.userMove = function(action) {
    var dist = Number(action[1]) || this._character.moveTiles();
    var route = {
      list: [],
      repeat: false,
      skippable: true,
      wait: false
    };
    var dir = action[0] === 'backward' ? 0 : 5;
    route.list.push({
      code: Game_Character.ROUTE_SCRIPT,
      parameters: ['qmove(' + dir + ',' + dist + ')']
    });
    route.list.push({
      code: 0
    });
    this._character.forceMoveRoute(route);
    this._character.updateRoutineMove();
    this._waitForUserMove = action[2] ? action[2] === 'true' : false;
  };

  Skill_Sequencer.prototype.userMoveHere = function(action) {
    var x1 = this._character.cx();
    var y1 = this._character.cy();
    var x2 = this._skill.collider.center.x;
    var y2 = this._skill.collider.center.y;
    var final = this.adjustPosition(x1, y1, x2, y2);
    var dx = final.x - x1;
    var dy = final.y - y1;
    var radian = Math.atan2(dy, dx);
    var dist = Math.sqrt(dx * dx + dy * dy);
    var route = {
      list: [],
      repeat: false,
      skippable: true,
      wait: false
    }
    route.list.push({
      code: Game_Character.ROUTE_SCRIPT,
      parameters: ['qmove2(' + radian + ',' + dist + ')']
    });
    route.list.push({
      code: 0
    });
    this._character.forceMoveRoute(route);
    this._character.updateRoutineMove();
    this._waitForUserMove = action[0] ? action[0] === 'true' : false;
  };

  Skill_Sequencer.prototype.userJump = function(action) {
    var dist = Number(action[1]) || 0;
    if (action[0] === 'backward') {
      this._character.pixelJumpBackward(dist);
    } else if (action[0] === 'forward')  {
      this._character.pixelJumpForward(dist);
    }
    this._waitForUserJump = action[2] ? action[2] === 'true' : false;
  };

  Skill_Sequencer.prototype.userJumpHere = function(action) {
    var x1 = this._character.cx();
    var y1 = this._character.cy();
    var x2 = this._skill.collider.center.x;
    var y2 = this._skill.collider.center.y;
    var final = this.adjustPosition(x1, y1, x2, y2);
    var dx = final.x - x1;
    var dy = final.y - y1;
    this._character.pixelJump(dx, dy);
    this._waitForUserJump = action[0] ? action[0] === 'true' : false;
  };

  Skill_Sequencer.prototype.userTeleport = function() {
    var x1 = this._skill.collider.x;
    var y1 = this._skill.collider.y;
    this._character.setPixelPosition(x1, y1);
  };

  Skill_Sequencer.prototype.userSetDirection = function(action) {
    var dir = Number(action[0]);
    if (dir) {
      this._character.setDirection(dir);
    }
  };

  Skill_Sequencer.prototype.userDirectionFix = function(action) {
    this._character.setDirectionFix(action[0] === 'true');
  };

  Skill_Sequencer.prototype.userPose = function(action) {
    if (Imported.QSprite) {
      this._character.playPose(action[0]);
      this._waitForPose = action[1] === 'true';
    }
  };

  Skill_Sequencer.prototype.userForceSkill = function(action) {
    var id = Number(action[0]);
    var angleOffset = Number(action[1]);
    if (angleOffset) {
      var radOffset = angleOffset * Math.PI / 180;
      this._character._radian = this._character.directionToRadian(this._character._direction);
      this._character._radian += radOffset;
      this._character._radian += this._character._radian < 0 ? Math.PI * 2 : 0;
    }
    this._character.forceSkill(id, true);
  };

  Skill_Sequencer.prototype.userAnimation = function(action) {
    var id = Number(action[0]);
    var x = this._character.cx();
    var y = this._character.cy();
    QABSManager.startAnimation(id, x, y);
  };

  Skill_Sequencer.prototype.targetMove = function(action, targets) {
    var dist = Number(action[1]) || this._character.moveTiles();
    for (var i = 0; i < targets.length; i++) {
      var dist2 = dist - dist * eval('targets[i].battler().' + QABS.mrst);
      if (dist2 <= 0) return;
      var dx = targets[i].cx() - this._character.cx();
      var dy = targets[i].cy() - this._character.cy();
      var radian = Math.atan2(dy, dx);
      radian += radian < 0 ? Math.PI * 2 : 0;
      var dir = this._character.radianToDirection(radian);
      if (action[0] === 'towards') {
        dir = this.this._character.reverseDir(dir);
        radian += Math.PI;
      }
      var route = {
        list: [],
        repeat: false,
        skippable: true,
        wait: false
      }
      route.list.push({ code: 35 });
      route.list.push({
        code: Game_Character.ROUTE_SCRIPT,
        parameters: ['qmove2(' + radian + ',' + dist + ')']
      })
      if (!targets[i].isDirectionFixed()) {
        route.list.push({ code: 36 });
      }
      route.list.push({
        code: 0
      })
      targets[i].forceMoveRoute(route);
      targets[i].updateRoutineMove();
    }
  };

  Skill_Sequencer.prototype.targetJump = function(action, targets) {
    var dist = Number(action[1]) || 0;
    for (var i = 0; i < targets.length; i++) {
      var dist2 = dist - dist * eval('targets[i].battler().' + QABS.mrst);
      if (dist2 <= 0) return;
      var dx = targets[i].cx() - this._character.cx();
      var dy = targets[i].cy() - this._character.cy();
      var radian = Math.atan2(dy, dx);
      radian += radian < 0 ? Math.PI * 2 : 0;
      var dir = this._character.radianToDirection(radian);
      if (action[0] === 'towards') {
        dir = this.this._character.reverseDir(dir);
      }
      var lastDirectionFix = targets[i].isDirectionFixed();
      targets[i].setDirectionFix(true);
      targets[i].pixelJump(dx, dy);
      targets[i].setDirectionFix(lastDirectionFix);
    }
  };

  Skill_Sequencer.prototype.targetPose = function(action, targets) {
    var pose = action[0];
    if (Imported.QSprite) {
      for (var i = 0; i < targets.length; i++) {
        targets[i].playPose(pose);
      }
    }
  };

  Skill_Sequencer.prototype.targetCancel = function(action, targets) {
    for (var i = 0; i < targets.length; i++) {
      if (targets[i]._casting) {
        targets[i]._casting.break = true;
      }
    }
  };

  Skill_Sequencer.prototype.actionStore = function() {
    this._stored = new Point(this._skill.collider.x, this._skill.collider.y);
  };

  Skill_Sequencer.prototype.actionMove = function(action) {
    var dir = action[0];
    var distance = Number(action[1]);
    var duration = Number(action[2]);
    ColliderManager.draw(this._skill.collider, duration);
    var radian = this._skill.radian;
    if (dir === 'backward') {
      radian -= Math.PI / 2;
    }
    radian += radian < 0 ? Math.PI * 2 : 0;
    this.setSkillRadian(Number(radian));
    this.actionMoveSkill(distance, duration);
    this._waitForMove = action[3] === 'true';
  };

  Skill_Sequencer.prototype.actionMoveToStored = function(action) {
    if (this._stored) {
      var x1 = this._skill.collider.x;
      var y1 = this._skill.collider.y;
      var x2 = this._stored.x;
      var y2 = this._stored.y;
      var dx = x2 - x1;
      var dy = y2 - y1;
      var dist = Math.sqrt(dx * dx + dy * dy);
      this._skill.radian = Math.atan2(y2 - y1, x2 - x1);
      this._skill.radian += this._skill.radian < 0 ? Math.PI * 2 : 0;
      this.actionMove(['forward', dist, action[0], action[1]]);
    }
  };

  Skill_Sequencer.prototype.actionWave = function(action) {
    var dir = action[0];
    var amp = Number(action[1]);
    var harm = Number(action[2]);
    var distance = Number(action[3]);
    var duration = Number(action[4]);
    ColliderManager.draw(this._skill.collider, duration);
    var radian = this._skill.radian;
    if (dir === 'backward') {
      radian -= Math.PI / 2;
    }
    radian += radian < 0 ? Math.PI * 2 : 0;
    this.setSkillRadian(Number(radian));
    this.actionWaveSkill(amp, harm, distance, duration);
    this._waitForMove = action[5] === "true";
  };

  Skill_Sequencer.prototype.actionWaveToStored = function(action) {
    if (this._stored) {
      var x1 = this._skill.collider.x;
      var y1 = this._skill.collider.y;
      var x2 = this._stored.x;
      var y2 = this._stored.y;
      var dx = x2 - x1;
      var dy = y2 - y1;
      var dist = Math.sqrt(dx * dx + dy * dy);
      this._skill.radian = Math.atan2(y2 - y1, x2 - x1);
      this._skill.radian += this._skill.radian < 0 ? Math.PI * 2 : 0;
      this.actionWave(['forward', action[0], action[1], dist, action[2], action[3]]);
    }
  };

  Skill_Sequencer.prototype.actionTrigger = function() {
    this._skill.targets = QABSManager.getTargets(this._skill, this._character);
    this.updateSkillDamage();
  };

  Skill_Sequencer.prototype.actionWait = function(action) {
    var duration = Number(action[0]);
    ColliderManager.draw(this._skill.collider, duration);
    this._waitCount = duration;
  };

  Skill_Sequencer.prototype.actionPicture = function(action) {
    var animated = /%\[(.*)\]/i.exec(action[0]);
    if (animated) {
      var settings = animated[1].split('-');
      this._skill.picture = new AnimatedSprite();
      this._skill.picture.bitmap = ImageManager.loadPicture(action[0]);
      this._skill.picture._frames = Number(settings[0]) || 1;
      this._skill.picture._speed = Number(settings[1]) || 15;
      this._skill.picture.bitmap.addLoadListener(function() {
        this._skill.picture.setFramePosition();
      }.bind(this));
    } else {
      this._skill.picture = new Sprite();
      this._skill.picture.bitmap = ImageManager.loadPicture(action[0]);
    }
    this._skill.picture.rotatable = action[1] === 'true';
    this._skill.picture.originDirection = Number(action[2]);
    this._skill.picture.z = 3;
    this._skill.picture.anchor.x = 0.5;
    this._skill.picture.anchor.y = 0.5;
    this.setSkillPictureRadian(this._skill.picture, this._skill.radian);
    QABSManager.addPicture(this._skill.picture);
  };

  Skill_Sequencer.prototype.actionTrail = function(action) {
    this._skill.trail = new TilingSprite();
    this._skill.trail.bitmap = ImageManager.loadPicture(action[0]);
    this._skill.trail.move(0, 0, Graphics.width, Graphics.height);
    this._skill.trail.rotatable = action[1] === 'true';
    this._skill.trail.originDirection = Number(action[2]);
    this._skill.trail.z = 3;
    this.setSkillPictureRadian(this._skill.trail, this._skill.radian);
    var x = this._skill.collider.center.x;
    var y = this._skill.collider.center.y;
    this._skill.trail.startX = x;
    this._skill.trail.startY = y;
    this._skill.trail.bitmap.addLoadListener(function() {
      var w = this._skill.trail.bitmap.width;
      var h = this._skill.trail.bitmap.height;
      this._skill.trail.move(x, y, w, h);
      QABSManager.addPicture(this._skill.trail);
    }.bind(this));
  };

  Skill_Sequencer.prototype.actionCollider = function(action) {
    var display = action[0];
    if (display === 'show') {
      this._skill.pictureCollider = new Sprite_SkillCollider(this._skill.collider);
      var x = this._skill.collider.center.x;
      var y = this._skill.collider.center.y;
      this._skill.pictureCollider.move(x, y);
      QABSManager.addPicture(this._skill.pictureCollider);
    } else if (display === 'hide' && this._skill.pictureCollider) {
      QABSManager.removePicture(this._skill.pictureCollider);
      this._skill.pictureCollider = null;
    }
  };

  Skill_Sequencer.prototype.actionAnimation = function(action) {
    var id = Number(action[0]);
    var x = this._skill.collider.center.x;
    var y = this._skill.collider.center.y;
    QABSManager.startAnimation(id, x, y);
  };

  Skill_Sequencer.prototype.actionSE = function(action) {
    var se ={};
    se.name = action[0];
    se.volume = Number(action[1]) || 90;
    se.pitch = Number(action[2]) || 100;
    se.pan = Number(action[3]) || 0;
    AudioManager.playSe(se);
  };

  Skill_Sequencer.prototype.actionQAudio = function(action) {
    // TODO
  };

  Skill_Sequencer.prototype.actionMoveSkill = function(distance, duration) {
    this._skill.newX = this._skill.collider.x + Math.round(distance * Math.cos(this._skill.radian));
    this._skill.newY = this._skill.collider.y + Math.round(distance * Math.sin(this._skill.radian));
    this._skill.speed = Math.abs(distance / duration);
    this._skill.speedX = Math.abs(this._skill.speed * Math.cos(this._skill.radian));
    this._skill.speedY = Math.abs(this._skill.speed * Math.sin(this._skill.radian));
    this._skill.moving = true;
  };

  Skill_Sequencer.prototype.actionWaveSkill = function(amp, harmonics, distance, duration) {
    this._skill.amp = amp;
    this._skill.distance = distance;
    this._skill.waveLength = harmonics * Math.PI;
    this._skill.waveSpeed = this._skill.waveLength / duration;
    this._skill.theta = 0;
    this._skill.xi = this._skill.collider.x;
    this._skill.yi = this._skill.collider.y;
    this._skill.waving = true;
    this._skill.moving = true;
  };

  Skill_Sequencer.prototype.setSkillRadian = function(radian) {
    var rotate = this._skill.settings.rotate === true;
    this._skill.radian = radian;
    this._skill.direction = this._character.radianToDirection(radian);
    this._skill.collider.setRadian(Math.PI / 2 + radian);
    if (this._skill.picture) {
      this.setSkillPictureRadian(this._skill.picture, this._skill.radian);
    }
  };

  Skill_Sequencer.prototype.setSkillPictureRadian = function(picture, radian) {
    if (!picture.rotatable) return;
    var originDirection = picture.originDirection;
    var originRadian = this._character.directionToRadian(originDirection);
    picture.rotation = originRadian + radian;
  };

  Skill_Sequencer.prototype.canSkillMove = function() {
    var collided = false;
    var through = this._skill.settings.through;
    var targets = QABSManager.getTargets(this._skill, this._character);
    if (targets.length > 0) {
      // remove targets that have already been hit
      for (var i = targets.length - 1; i >= 0; i--) {
        if (!this._skill.targetsHit.contains(targets[i].battler()._charaId)) {
          this._skill.targetsHit.push(targets[i].battler()._charaId);
        } else {
          targets.splice(i, 1);
        }
      }
      if (targets.length > 0) {
        this._skill.targets = targets;
        if (through === 1 || through === 3) {
          collided = true;
          this._skill.targets = [targets[0]];
        }
        this.updateSkillDamage();
      }
    }
    var edge = this._skill.collider.gridEdge();
    var maxW = $gameMap.width();
    var maxH = $gameMap.height();
    if (!$gameMap.isLoopHorizontal()) {
      if (edge.x2 < 0 || edge.x1 >= maxW) return false;
    }
    if (!$gameMap.isLoopVertical()) {
      if (edge.y2 < 0 || edge.y1 >= maxH) return false;
    }
    if (!collided && (through === 2 || through === 3)) {
      ColliderManager.getCollidersNear(this._skill.collider, function(collider) {
        if (collider === this._skill.collider) return false;
        if (this._skill.settings.overwater && (collider.isWater1 || collider.isWater2)) {
          return false;
        }
        if (this._skill.collider.intersects(collider)) {
          collided = true;
          return 'break';
        }
      }.bind(this));
    }
    return !collided;
  };

  Skill_Sequencer.prototype.isWaitingForCharacter = function() {
    return (this._waitForMove || this._waitForUserMove ||
      this._waitForUserJump || this._waitForPose);
  };

  Skill_Sequencer.prototype.onBreak = function() {
    var i = this._character._skillLocked.indexOf(this._skill);
    if (i >= 0) {
      this._character._skillLocked.splice(i, 1);
    }
    this._character._casting = false;
    this.onEnd();
  };

  Skill_Sequencer.prototype.onEnd = function() {
    this._skill.collider.kill = true;
    QABSManager.removePicture(this._skill.picture);
    QABSManager.removePicture(this._skill.trail);
    QABSManager.removePicture(this._skill.pictureCollider);
    var i = this._character._activeSkills.indexOf(this._skill);
    this._character._activeSkills.splice(i, 1);
  };

  Skill_Sequencer.prototype.update = function() {
    if (this._skill.break || this._character.battler().isStunned()) {
      return this.onBreak();
    }
    if (this._skill.moving) {
      this.updateSkillPosition();
    }
    if (this._waitCount > 0) {
      return this._waitCount--;
    }
    this.updateWaitingForCharacter();
    if (this.isWaitingForCharacter()) {
      return;
    }
    this.updateSequence();
  };

  Skill_Sequencer.prototype.updateWaitingForCharacter = function() {
    if (this._waitForUserMove || this._waitForUserJump || this._waitForPose) {
      if (!this._character.isMoving())   this._waitForUserMove = false;
      if (!this._character.isJumping())  this._waitForUserJump = false;
      if (!this._character._posePlaying) this._waitForPose = false;
    }
  };

  Skill_Sequencer.prototype.updateSequence = function() {
    var sequence = this._skill.sequence.shift();
    if (sequence) {
      var action = sequence.split(' ');
      this.startAction(action);
    }
    if (this._skill.sequence.length === 0 && !this._skill.moving) {
      return this.onEnd();
    }
  };

  Skill_Sequencer.prototype.updateSkillDamage = function() {
    var targets = this._skill.targets;
    for (var i = 0; i < this._skill.ondmg.length; i++) {
      var action = this._skill.ondmg[i].split(' ');
      this.startOnDamageAction(action, targets);
    }
    QABSManager.startAction(this._character, targets, this._skill);
  };

  Skill_Sequencer.prototype.updateSkillPosition = function() {
    if (this._skill.waving) {
      return this.updateSkillWavePosition();
    }
    var collider = this._skill.collider;
    var x1 = collider.x;
    var x2 = this._skill.newX;
    var y1 = collider.y;
    var y2 = this._skill.newY;
    if (x1 < x2) x1 = Math.min(x1 + this._skill.speedX, x2);
    if (x1 > x2) x1 = Math.max(x1 - this._skill.speedX, x2);
    if (y1 < y2) y1 = Math.min(y1 + this._skill.speedY, y2);
    if (y1 > y2) y1 = Math.max(y1 - this._skill.speedY, y2);
    collider.moveTo(x1, y1);
    var x3 = collider.center.x;
    var y3 = collider.center.y;
    if (this._skill.picture) {
      this._skill.picture.move(x3, y3);
    }
    if (this._skill.pictureCollider) {
      this._skill.pictureCollider.move(x3, y3);
    }
    if (this._skill.trail) {
      var x4 = this._skill.trail.startX;
      var y4 = this._skill.trail.startY;
      var x5 = x4 - x3;
      var y5 = y4 - y3;
      var dist = Math.sqrt(x5 * x5 + y5 * y5);
      var radian = this._skill.trail.rotation;
      var w = this._skill.trail.bitmap.width;
      var h = this._skill.trail.bitmap.height;
      var ox = w * Math.sin(radian);
      var oy = (h / 2) * -Math.cos(radian);
      x4 += dist * -Math.cos(radian) + ox;
      y4 += dist * -Math.sin(radian) + oy;
      this._skill.trail.move(x4, y4, dist, h);
    }
    if (!this.canSkillMove() || (x1 === x2 && y1 === y2)) {
      this._skill.targetsHit = [];
      this._skill.moving = false;
      this._waitForMove = false;
    }
  };

  Skill_Sequencer.prototype.updateSkillWavePosition = function() {
    var collider = this._skill.collider;
    var x1 = this._skill.xi;
    var y1 = this._skill.yi;
    var x2 = (this._skill.theta / this._skill.waveLength * this._skill.distance );
    var y2 = this._skill.amp * -Math.sin(this._skill.theta);
    var h = Math.sqrt(y2 * y2 + x2 * x2);
    var radian = Math.atan2(y2, x2);
    radian += this._skill.radian;
    var x3 = h * Math.cos(radian);
    var y3 = h * Math.sin(radian);
    collider.moveTo(x1 + x3, y1 + y3);
    var x4 = collider.center.x;
    var y4 = collider.center.y;
    if (this._skill.picture) {
      this._skill.picture.move(x4, y4);
    }
    if (this._skill.pictureCollider) {
      this._skill.pictureCollider.move(x4, y4);
    }
    if (this._skill.theta >= this._skill.waveLength) {
      this._skill.targetsHit = [];
      this._skill.waving = false;
      this._skill.moving = false;
      this._waitForMove = false;
    }
    this._skill.theta += this._skill.waveSpeed;
    if (this.canSkillMove()) {
      this._skill.waving = false;
    }
  };

  Skill_Sequencer.prototype.adjustPosition = function(xi, yi, xf, yf) {
    var final = new Point(xf, yf);
    var dx = xf - xi;
    var dy = yf - yi;
    var radian = Math.atan2(dy, dx);
    var vx = Math.cos(radian) * this._character.moveTiles();
    var vy = Math.sin(radian) * this._character.moveTiles();
    while (!this._character.canPixelPass(final.x, final.y, 5, 'collision')) {
      final.x -= vx;
      final.y -= vy;
    }
    this._character.collider('collision').moveTo(xi, yi);
    return final;
  };

})();

//-----------------------------------------------------------------------------
// Game_Interpreter

(function() {
  var Alias_Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
  Game_Interpreter.prototype.pluginCommand = function(command, args) {
    if (command.toLowerCase() === 'qabs') {
      return this.qABSCommand(args);
    }
    Alias_Game_Interpreter_pluginCommand.call(this, command, args);
  };

  Game_Interpreter.prototype.qABSCommand = function(args) {
    // TODO
  };
})();

//-----------------------------------------------------------------------------
// Game_System

(function() {
  var Alias_Game_System_initialize = Game_System.prototype.initialize;
  Game_System.prototype.initialize = function() {
    Alias_Game_System_initialize.call(this);
    this._absKeys = JSON.parse(JSON.stringify(QABS.skillKey));
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
      this.preloadSkills();
      this.checkAbsMouse();
    }
  };

  Game_System.prototype.absKeys = function() {
    return Object.assign({},
      this._absKeys,
      this._absClassKeys,
      this._absWeaponKeys
    );
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
    this.preloadSkills();
  };

  Game_System.prototype.changeABSWeaponSkills = function(skillSet) {
    this._absWeaponKeys = skillSet;
    this.preloadSkills();
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
    var gamepad = /^\$/.test(input);
    for (var i = 0; i < absKeys[skillNumber].input.length; i++) {
      var isGamepad = /^\$/.test(absKeys[skillNumber].input[i])
      if (gamepad && isGamepad) {
        absKeys[skillNumber].input[i] = input;
        break;
      } else if (!gamepad && !isGamepad) {
        absKeys[skillNumber].input[i] = input;
        break;
      }
    }
    absKeys[skillNumber].input = input;
    this.checkAbsMouse();
  };

  Game_System.prototype.preloadSkills = function() {
    var absKeys = this.absKeys();
    for (var key in absKeys) {
      var skill = $dataSkills[absKeys[key].skillId];
      if (skill) {
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
          var ani = /^animation(.*)/i.exec(action);
          var pic = /^picture(.*)/i.exec(action);
          if (ani) {
            ani = ani[1].trim();
            ani = $dataAnimations[ani];
            if (ani) {
              ImageManager.loadAnimation(ani.animation1Name, ani.animation1Hue);
              ImageManager.loadAnimation(ani.animation2Name, ani.animation2Hue);
            }
          }
        }
      }
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
      if (keys[key].input.contains('mouse1')) {
        this._absMouse1 = true;
      }
      if (keys[key].input.contains('mouse2')) {
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

//-----------------------------------------------------------------------------
// Game_Map

(function() {
  var Alias_Game_Map_setup = Game_Map.prototype.setup;
  Game_Map.prototype.setup = function(mapId) {
    Alias_Game_Map_setup.call(this, mapId);
    if (mapId !== QABSManager._mapId) {
      QABSManager.clear();
    }
  };

  var Alias_Game_Map_update = Game_Map.prototype.update;
  Game_Map.prototype.update = function(sceneActive) {
    Alias_Game_Map_update.call(this, sceneActive);
    if (QABS._needsUncompress) {
      this.uncompressBattlers();
      QABS._needsUncompress = false;
    }
  };

  Game_Map.prototype.compressBattlers = function() {
    for (var i = 0; i < this.events().length; i++) {
      if (this.events()[i]._battler) {
        var oldRespawn = this.events()[i]._respawn;
        this.events()[i].clearABS();
        this.events()[i]._battler = null;
        this.events()[i]._respawn = oldRespawn;
      }
      if (this.events()[i].constructor === Game_Loot) {
        QABSManager.removePicture(this.events()[i]._itemIcon);
        QABSManager.removeEvent(this.events()[i]);
      }
    }
    $gamePlayer.clearABS();
    QABSManager.clear();
  };

  Game_Map.prototype.uncompressBattlers = function() {
    for (var i = 0; i < this.events().length; i++) {
      if (this.events()[i]._respawn >= 0) {
        var wasDead = true;
        var oldRespawn = this.events()[i]._respawn;
      }
      this.events()[i].setupBattler();
      if (wasDead) {
        this.events()[i].clearABS();
        this.events()[i]._battler = null;
        this.events()[i]._respawn = oldRespawn;
      }
    }
    // TODO setup player?
  };


})();

//-----------------------------------------------------------------------------
// Game_Action

(function() {
  var Alias_Game_Action_setSubject = Game_Action.prototype.setSubject;
  Game_Action.prototype.setSubject = function(subject) {
    Alias_Game_Action_setSubject.call(this, subject);
    this._realSubject = subject;
  };

  var Alias_Game_Action_subject = Game_Action.prototype.subject;
  Game_Action.prototype.subject = function() {
    if (this._isAbs) return this._realSubject;
    return Alias_Game_Action_subject.call(this);
  };

  Game_Action.prototype.absApply = function(target) {
    this._isAbs = true;
    var result = target.result();
    this._realSubject.clearResult();
    result.clear();
    result.physical = this.isPhysical();
    result.drain = this.isDrain();
    if (this.item().damage.type > 0) {
      result.critical = (Math.random() < this.itemCri(target));
      var value = this.makeDamageValue(target, result.critical);
      this.executeDamage(target, value);
      target.startDamagePopup();
    }
    this.item().effects.forEach(function(effect) {
      this.applyItemEffect(target, effect);
    }, this);
    this.applyItemUserEffect(target);
    this.applyGlobal();
    this._isAbs = false;
  };

  var Alias_Game_ActionResult_clear = Game_ActionResult.prototype.clear;
  Game_ActionResult.prototype.clear = function() {
    Alias_Game_ActionResult_clear.call(this);
    this.damageIcon = null;
  };
})();

//-----------------------------------------------------------------------------
// Game_BattlerBase

(function() {
  var Alias_Game_BattlerBase_resetStateCounts = Game_BattlerBase.prototype.resetStateCounts;
  Game_BattlerBase.prototype.resetStateCounts = function(stateId) {
    Alias_Game_BattlerBase_resetStateCounts.call(this, stateId);
    this._stateSteps[stateId] = $dataStates[stateId].stepsToRemove || 0;
  };

  var Alias_Game_BattlerBase_addNewState = Game_BattlerBase.prototype.addNewState;
  Game_BattlerBase.prototype.addNewState = function(stateId) {
    Alias_Game_BattlerBase_addNewState.call(this, stateId);
    if ($dataStates[stateId].meta.moveSpeed) {
      this._moveSpeed += Number($dataStates[stateId].meta.moveSpeed) || 0;
    }
    if ($dataStates[stateId].meta.stun) {
      this._isStunned++;
    }
  };
})();

//-----------------------------------------------------------------------------
// Game_Battler

(function() {
  var Alias_Game_Battler_initMembers = Game_Battler.prototype.initMembers;
  Game_Battler.prototype.initMembers = function() {
    Alias_Game_Battler_initMembers.call(this);
    this._isStunned = 0;
    this._moveSpeed = 0;
    this._damageQueue = [];
  };

  var Alias_Game_Battler_startDamagePopup = Game_Battler.prototype.startDamagePopup;
  Game_Battler.prototype.startDamagePopup = function() {
    var result = Object.assign({}, this._result);
    this._damageQueue.push(result);
    Alias_Game_Battler_startDamagePopup.call(this);
  };

  Game_Battler.prototype.updateABS = function() {
    var states = this.states();
    for (var i = 0; i < states.length; i++) {
      this.updateStateSteps(states[i]);
    }
    //this.showAddedStates();   //Currently does nothing, so no need to run it
    //this.showRemovedStates(); //Currently does nothing, so no need to run it
  };

  Game_Battler.prototype.stepsForTurn = function() {
    return 60;
  };

  Game_Battler.prototype.updateStateSteps = function(state) {
    if (!state.removeByWalking) return;
    if (this._stateSteps[state.id] >= 0) {
      if (this._stateSteps[state.id] % this.stepsForTurn() === 0) {
        this.onTurnEnd();
        this.result().damageIcon = $dataStates[state.id].iconIndex;
        this.startDamagePopup();
        if (this._stateSteps[state.id] === 0) this.removeState(state.id);
      }
      this._stateSteps[state.id]--;
    }
  };

  Game_Battler.prototype.showAddedStates = function() {
    // TODO
    this.result().addedStateObjects().forEach(function(state) {
      // does nothing
    }, this);
  };

  Game_Battler.prototype.showRemovedStates = function() {
    // TODO
    this.result().removedStateObjects().forEach(function(state) {
      // Popup that state was removed?
    }, this);
  };

  var Alias_Game_Battler_removeState = Game_Battler.prototype.removeState;
  Game_Battler.prototype.removeState = function(stateId) {
    if (this.isStateAffected(stateId)) {
      if ($dataStates[stateId].meta.moveSpeed) {
        this._moveSpeed -= Number($dataStates[stateId].meta.moveSpeed) || 0;
      }
      if ($dataStates[stateId].meta.stun) {
        this._isStunned--;
      }
    }
    Alias_Game_Battler_removeState.call(this, stateId);
  };

  Game_Battler.prototype.moveSpeed = function() {
    return this._moveSpeed;
  };

  Game_Battler.prototype.isStunned = function() {
    return this._isStunned > 0;
  };
})();

//-----------------------------------------------------------------------------
// Game_Actor

(function() {
  var Alias_Game_Actor_changeClass = Game_Actor.prototype.changeClass;
  Game_Actor.prototype.changeClass = function(classId, keepExp) {
    Alias_Game_Actor_changeClass.call(this, classId, keepExp);
    if (this === $gameParty.leader()) $gameSystem.loadClassABSKeys();
  };

  var Alias_Game_Actor_initEquips = Game_Actor.prototype.initEquips;
  Game_Actor.prototype.initEquips = function(equips) {
    Alias_Game_Actor_initEquips.call(this, equips);
    if (this === $gameParty.leader()) this.initWeaponSkills();
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
    var oldId, equipId = 0;
    var wasWeapon;
    if (equips[slotId] && equips[slotId].object()) {
      oldId = equips[slotId].object().baseItemId || equips[slotId].object().id;
      wasWeapon = equips[i].isWeapon();
    }
    Alias_Game_Actor_changeEquip.call(this, slotId, item);
    if (equips[slotId] && equips[slotId].object()) {
      equipId = equips[slotId].object().baseItemId || equips[slotId].object().id;
    }
    if (equipId && equipId !== oldId && equips[slotId].isWeapon()) {
      this.changeWeaponSkill(equipId);
    } else if (wasWeapon) {
      this.changeWeaponSkill(0);
    }
  };

  Game_Actor.prototype.changeWeaponSkill = function(id) {
    if (this !== $gameParty.leader()) return;
    $gameSystem.changeABSWeaponSkills(QABS.weaponSkills(id));
  };

  Game_Actor.prototype.displayLevelUp = function(newSkills) {
    QABSManager.startPopup('level', {
      x: $gamePlayer.cx(),
      y: $gamePlayer.cy(),
      string: 'Level Up!'
    })
    QABSManager.startAnimation(QABS.levelAnimation, $gamePlayer.cx(), $gamePlayer.cy());
    //$gamePlayer.requestAnimation(QABS.levelAnimation);
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

//-----------------------------------------------------------------------------
// Game_Enemy

(function() {
  var Alias_Game_Enemy_setup = Game_Enemy.prototype.setup;
  Game_Enemy.prototype.setup = function(enemyId, x, y) {
    Alias_Game_Enemy_setup.call(this, enemyId, x, y);
    var meta = this.enemy().qmeta;
    this._noAI = meta.noAI;
    this._aiRange = Number(meta.range) || 0;
    this._noPopup = !!meta.noPopup;
    this._onDeath = meta.onDeath || '';
    this._dontErase = !!meta.dontErase;
    this._team  = Number(meta.team) || 2;
  };

  Game_Enemy.prototype.clearStates = function() {
    Game_Battler.prototype.clearStates.call(this);
    this._stateSteps = {};
  };

  Game_Enemy.prototype.eraseState = function(stateId) {
    Game_Battler.prototype.eraseState.call(this, stateId);
    delete this._stateSteps[stateId];
  };
})();

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
    if (this.battler()) {
      if (this._skillLocked.length > 0) return false;
      if (this.battler().isStunned()) return false;
    }
    if (this.realMoveSpeed() <= 0) return false;
    return Alias_Game_CharacterBase_canMove.call(this);
  };

  Game_CharacterBase.prototype.canInputSkill = function() {
    if (this._globalLocked > 0) return false;
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
      this.onTargetingCancel();
    }
    this.beforeSkill(skillId);
    this.forceSkill(skillId);
    this.afterSkill(skillId);
  };

  Game_CharacterBase.prototype.beforeSkill = function(skillId) {
    var meta = $dataSkills[skillId].qmeta;
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
        return this.onTargetingCancel();
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
      var radian;
      if (QABS.radianAtks) {
        radian = this._radian;
      } else {
        radian = this.directionToRadian(this._direction);
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
        if (Input.isTriggered(input)) {
          Input.stopPropagation();
          this.useSkill(absKeys[key].skillId);
          break;
        }
        if (input === 'mouse1' && TouchInput.isTriggered() && this.canClick()) {
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
        })
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

  Game_Event.prototype.updateABS = function() {
    Game_CharacterBase.prototype.updateABS.call(this);
    if (!this._isDead && this.hasAI() && this.isNearTheScreen()) {
      this.updateAI();
    } else if (this._respawn >= 0) {
      this.updateRespawn();
    }
  };

  Game_Event.prototype.updateAI = function() {
    // TODO split up into 2-3 functions
    var bestTarget = this.bestTarget() || $gamePlayer;
    if (!bestTarget) return;
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
        // TODO maybe move randomly to search for
        // target again before ending its combat
        console.log('start wait');
        this._endWait = this.wait(120).then(function() {
          console.log('end wait');
          this._endWait = null;
          this.endCombat();
        }.bind(this))
      }
      return;
    }
    var bestAction = null;
    var x1 = bestTarget.cx();
    var y1 = bestTarget.cy();
    var x2 = this.cx();
    var y2 = this.cy();
    var dx = x1 - x2;
    var dy = y1 - y2;
    if (this._aiWait >= QABS.aiWait) {
      this._radian = Math.atan2(dy, dx);
      this._radian += this._radian < 0 ? Math.PI * 2 : 0;
      bestAction = QABSManager.bestAction(this.charaId());
      this._aiWait = 0;
    } else {
      this._aiWait++;
    }
    if (bestAction) {
      this.useSkill(bestAction);
    } else if (this.canMove()) {
      // TODO add a how far away to stay away from target property
      if (this._freqCount < this.freqThreshold()) {
        if (this._aiPathfind) {
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
    this.setupBattler();
    this.findRespawnLocation();
    this.refresh();
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
    if (this._onDeath) eval(this._onDeath);
    if (this._agroList[0] > 0) {
      var exp = this.battler().exp();
      $gamePlayer.battler().gainExp(exp);
      if (exp > 0) {
        QABSManager.startPopup('exp', {
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
    var skill  = this._groundTargeting;
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

//-----------------------------------------------------------------------------
// Game_Loot

function Game_Loot() {
  this.initialize.apply(this, arguments);
}

(function() {
  Game_Loot.prototype = Object.create(Game_Event.prototype);
  Game_Loot.prototype.constructor = Game_Loot;

  Game_Loot.prototype.initialize = function(x, y) {
    Game_Character.prototype.initialize.call(this);
    this.isLoot = true;
    this._decay = QABS.lootDecay;
    this._eventId = -1;
    this._gold = null;
    this._loot = null;
    this._noSprite = true;
    this.locate(x, y);
    QABSManager.addEvent(this);
    this.refresh();
  };

  Game_Loot.prototype.event = function() {
    return {
      note: ''
    }
  };

  Game_Loot.prototype.shiftY = function() {
    return 0;
  };

  Game_Loot.prototype.setGold = function(value) {
    this._gold = value;
    this.setIcon(QABS.goldIcon);
  };

  Game_Loot.prototype.setItem = function(item) {
    this._loot = item;
    this.setIcon(item.iconIndex);
  };

  Game_Loot.prototype.setIcon = function(iconIndex) {
    this._iconIndex = iconIndex;
    this._itemIcon = new Sprite_Icon(iconIndex);
    this._itemIcon.move(this._px, this._py);
    this._itemIcon.z = 1;
    QABSManager.addPicture(this._itemIcon);
  };

  Game_Loot.prototype.page = function() {
    if (!this._lootPage) {
      this._lootPage = {
        conditions: {
          actorId: 1, actorValid: false,
          itemId: 1,  itemValid: false,
          selfSwitchCh: 'A', selfSwitchValid: false,
          switch1Id: 1,   switch1Valid: false,
          switch2Id: 1,   switch2Valid: false,
          variable1Id: 1, variable1Valid: false, variableValue: 0
        },
        image: {
          characterIndex: 0, characterName: '',
          direction: 2, pattern: 1, tileId: 0
        },
        moveRoute: {
          list: [{code: 0, parameters: []}],
          repeat: false, skippable: false, wait: false
        },
        list: [],
        directionFix: false,
        moveFrequency: 4,
        moveSpeed: 3,
        moveType: 0,
        priorityType: 0,
        stepAnime: false,
        through: true,
        trigger: QABS.lootTrigger,
        walkAnime: true
      };
      this._lootPage.list = [];
      this._lootPage.list.push({
        code: 355,
        indent: 0,
        parameters: ['this.character().collectDrops();']
      });
      this._lootPage.list.push({
        code: 0,
        indent: 0,
        parameters: [0]
      });
    }
    return this._lootPage;
  };

  Game_Loot.prototype.findProperPageIndex = function() {
    return 0;
  };

  Game_Loot.prototype.collectDrops = function() {
    if (QABS.aoeLoot) {
      return this.aoeCollect();
    }
    if (this._loot) $gameParty.gainItem(this._loot, 1);
    if (this._gold) $gameParty.gainGold(this._gold);
    var string = this._gold ? String(this._gold) : this._loot.name;
    if (this._iconIndex) {
      string = '\\I[' + this._iconIndex + ']' + string;
    }
    QABSManager.startPopup('QABS-ITEM', {
      x: this.cx(), y: this.cy(),
      string: string
    })
    this.erase();
    QABSManager.removeEvent(this);
    QABSManager.removePicture(this._itemIcon);
  };

  Game_Loot.prototype.aoeCollect = function() {
    // TODO add aoe collider
    var loot = ColliderManager.getCharactersNear(this.collider('aoe'), function(chara) {
      return chara.constructor === Game_Loot && chara.collider().intersects(this.collider('aoe'));
    }.bind(this));
    var x = this.cx();
    var y = this.cy();
    var totalLoot = [];
    var totalGold = 0;
    var i;
    for (i = 0; i < loot.length; i++) {
      if (loot[i]._loot) totalLoot.push(loot[i]._loot);
      if (loot[i]._gold) totalGold += loot[i]._gold;
      QABSManager.removeEvent(loot[i]);
      QABSManager.removePicture(loot[i]._itemIcon);
    }
    var display = {};
    for (i = 0; i < totalLoot.length; i++) {
      var item = totalLoot[i];
      $gameParty.gainItem(item, 1);
      display[item.name] = display[item.name] || {};
      display[item.name].iconIndex = item.iconIndex;
      display[item.name].total = display[item.name].total + 1 || 1;
    }
    for (var name in display) {
      var iconIndex = display[name].iconIndex;
      var string = 'x' + display[name].total + ' ' + name;
      if (iconIndex) {
        string = '\\I[' + iconIndex + ']' + string;
      }
      QABSManager.startPopup('QABS-ITEM', {
        x: x, y: y,
        string: string
      });
      y += 22;
    }
    if (totalGold > 0) {
      $gameParty.gainGold(totalGold);
      var string = String(totalGold);
      if (QABS.goldIcon) {
        string = '\\I[' + QABS.goldIcon + ']' + string;
      }
      QABSManager.startPopup('QABS-ITEM', {
        x: x, y: y,
        string: string
      });
    }
  };

  Game_Loot.prototype.update = function() {
    if (this._decay <= 0) {
      this.erase();
      QABSManager.removeEvent(this);
      QABSManager.removePicture(this._itemIcon);
      return;
    }
    this._decay--;
  };

  Game_Loot.prototype.defaultColliderConfig = function() {
    return 'box,32,32,0,0';
  };
})();

//-----------------------------------------------------------------------------
// Scene_Map

(function() {
  var Alias_Scene_Map_initialize = Scene_Map.prototype.initialize;
  Scene_Map.prototype.initialize = function() {
    Alias_Scene_Map_initialize.call(this);
    $gameSystem.preloadSkills();
  };

  var Alias_Scene_Map_isMenuCalled = Scene_Map.prototype.isMenuCalled;
  Scene_Map.prototype.isMenuCalled = function() {
    if ($gameSystem.anyAbsMouse2()) return Input.isTriggered('menu');
    return Alias_Scene_Map_isMenuCalled(this);
  };
})();

//-----------------------------------------------------------------------------
// Sprite_Character

(function() {
  var Alias_Sprite_Character_initMembers = Sprite_Character.prototype.initMembers;
  Sprite_Character.prototype.initMembers = function() {
    Alias_Sprite_Character_initMembers.call(this);
    this._damages = [];
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
      if (result.missed || result.evaded) {
        string = 'Missed';
      } else if (result.hpAffected) {
        var dmg = result.hpDamage;
        if (dmg >= 0) {
          string = String(dmg);
          fill = '#ffffff';
        } else {
          string = String(Math.abs(dmg));
          fill = '#00ff00';
        }
      } else if (result.mpDamage) {
        string = String(result.mpDamage);
        fill = '#0000ff';
      }
      if (!string && string !== '0') return;
      var iconIndex = result.damageIcon;
      if (iconIndex) {
        string = '\\I[' + iconIndex + ']' + string;
      }
      if (result.critical) fill = '#FF8C00';
      var fadeout = '50 30 fadeout';
      var slideup = '0 80 slideup 24';
      var preset = $gameSystem.qPopupPreset('QABS-DMG');
      var sprite = QPopup.start({
        string: string,
        oy: -(this.height - 20),
        bindTo: this._character.charaId(),
        duration: 80,
        transitions: preset.transitions || [fadeout, slideup],
        style: Object.assign({},
          preset.style,
          { fill: fill }
        )
      })
      this._damages.push(sprite);
      this._battler.clearDamagePopup();
      this._battler.clearResult();
    }
  };
})();

//-----------------------------------------------------------------------------
// Sprite_Icon

function Sprite_Icon() {
  this.initialize.apply(this, arguments);
}

(function() {
  Sprite_Icon.prototype = Object.create(Sprite.prototype);
  Sprite_Icon.prototype.constructor = Sprite_Icon;

  Sprite_Icon.prototype.initialize = function(index, sheet, w, h) {
    Sprite.prototype.initialize.call(this);
    this._iconIndex = index;
    this._iconSheet = sheet || 'IconSet';
    this._iconW = w || 32;
    this._iconH = h || 32;
    this.setBitmap();
  };

  Sprite_Icon.prototype.setBitmap = function() {
    this.bitmap = ImageManager.loadSystem(this._iconSheet);
    var pw = this._iconW;
    var ph = this._iconH;
    var sx = this._iconIndex % 16 * pw;
    var sy = Math.floor(this._iconIndex / 16) * ph;
    this.setFrame(sx, sy, pw, ph);
  };
})();

//-----------------------------------------------------------------------------
// Sprite_SkillCollider

function Sprite_SkillCollider() {
  this.initialize.apply(this, arguments);
}

(function() {
  Sprite_SkillCollider.prototype = Object.create(Sprite_Collider.prototype);
  Sprite_SkillCollider.prototype.constructor = Sprite_SkillCollider;

  Sprite_SkillCollider.prototype.initialize = function(collider) {
    Sprite_Collider.prototype.initialize.call(this, collider, -1);
    this.z = 2;
    this.alpha = 0.4;
    this.anchor.x = 0.5;
    this.anchor.y = 0.5;
    this._frameCount = 0;
  };

  Sprite_SkillCollider.prototype.update = function() {
    Sprite_Collider.prototype.update.call(this);
    this.updateAnimation();
  };

  Sprite_SkillCollider.prototype.updateAnimation = function() {
    this._frameCount++;
    if (this._frameCount > 30) {
      this.alpha += 0.2 / 30;
      this.scale.x += 0.1 / 30;
      this.scale.y = this.scale.x;
      if (this._frameCount === 60) this._frameCount = 0;
    } else {
      this.alpha -= 0.2 / 30;
      this.scale.x -= 0.1 / 30;
      this.scale.y = this.scale.x;
    }
  };
})();

//-----------------------------------------------------------------------------
// Spriteset_Map

(function() {
  var Alias_Spriteset_Map_createLowerLayer = Spriteset_Map.prototype.createLowerLayer;
  Spriteset_Map.prototype.createLowerLayer = function() {
    Alias_Spriteset_Map_createLowerLayer.call(this);
    this._pictures = [];
    this._tempAnimations = [];
  };

  Spriteset_Map.prototype.addPictures = function() {
    this._pictures = QABSManager._pictures;
    if (this._pictures.length === 0) return;
    for (var i = 0; i < this._pictures.length; i++) {
      if (this.children.indexOf(this._pictures[i]) !== -1) continue;
      this._tilemap.addChild(this._pictures[i]);
    }
  };

  Spriteset_Map.prototype.addAnimations = function() {
    this._tempAnimations = QABSManager._animations;
    if (this._tempAnimations.length === 0) return;
    for (var i = 0; i < this._tempAnimations.length; i++) {
      if (this.children.indexOf(this._tempAnimations[i]) !== -1) continue;
      this._tilemap.addChild(this._tempAnimations[i]);
      if (this._tempAnimations[i].isAnimationPlaying()) {
        for (var j = 0; j < this._tempAnimations[i]._animationSprites.length; j++) {
          this._tilemap.addChild(this._tempAnimations[i]._animationSprites[j]);
        }
      }
    }
  };

  var Alias_Spriteset_Map_updateTilemap = Spriteset_Map.prototype.updateTilemap;
  Spriteset_Map.prototype.updateTilemap = function() {
    Alias_Spriteset_Map_updateTilemap.call(this);
    this.updateTempAnimations();
    this.updatePictures();
  };

  Spriteset_Map.prototype.updatePictures = function() {
    if (this._pictures !== QABSManager._pictures) this.addPictures();
    for (var i = 0; i < this._pictures.length; i++) {
      this._pictures[i].x = this._pictures[i].realX;
      this._pictures[i].x -= $gameMap.displayX() * QMovement.tileSize;
      this._pictures[i].y = this._pictures[i].realY;
      this._pictures[i].y -= $gameMap.displayY() * QMovement.tileSize;
    }
  };

  Spriteset_Map.prototype.updateTempAnimations = function() {
    if (this._tempAnimations !== QABSManager._animations) this.addAnimations();
    if (this._tempAnimations.length > 0) {
      for (var i = this._tempAnimations.length - 1; i >= 0; i--) {
        this._tempAnimations[i].x = this._tempAnimations[i].realX;
        this._tempAnimations[i].x -= $gameMap.displayX() * QMovement.tileSize;
        this._tempAnimations[i].y = this._tempAnimations[i].realY;
        this._tempAnimations[i].y -= $gameMap.displayY() * QMovement.tileSize;
        this._tempAnimations[i].update();
        if (!this._tempAnimations[i].isAnimationPlaying()) {
          this._tilemap.removeChild(this._tempAnimations[i].sprite);
          this._tempAnimations[i] = null;
          this._tempAnimations.splice(i, 1);
        }
      }
    }
  };

  var Alias_Sprite_move = Sprite.prototype.move;
  Sprite.prototype.move = function(x, y) {
    Alias_Sprite_move.call(this, x, y);
    this.realX = x;
    this.realY = y;
  };

  var Alias_TilingSprite_move = TilingSprite.prototype.move;
  TilingSprite.prototype.move = function(x, y, width, height) {
    Alias_TilingSprite_move.call(this, x, y, width, height);
    this.realX = x;
    this.realY = y;
  };
})();
