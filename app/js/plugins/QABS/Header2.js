//=============================================================================
// QABS Static Class

function QABS() {
  throw new Error('This is a static class');
}

(function() {
  var _PARAMS = QPlus.getParams('<QABS>', {
    'Default Skills': []
  });

  QABS.quickTarget = _PARAMS['Quick Target'];
  QABS.lockTargeting = _PARAMS['Lock when Targeting'];
  QABS.towardsMouse = _PARAMS['Aim with Mouse'];
  QABS.towardsAnalog = _PARAMS['Aim with Analog']
  QABS.radianAtks = QMovement.offGrid;

  QABS.lootDecay = _PARAMS['Loot Decay'];
  QABS.aoeLoot = _PARAMS['AoE Loot'];
  QABS.lootTrigger = _PARAMS['Loot Touch Trigger'] ? 2 : 0;
  QABS.goldIcon = _PARAMS['Gold Icon'];
  QABS.levelAni = _PARAMS['Level Animation'];
  QABS.showDmg = _PARAMS['Show Damage'];

  QABS.mrst = _PARAMS['Move Resistance Rate Stat'];

  QABS.aiLength = _PARAMS['AI Default Sight Range'];
  QABS.aiWait = _PARAMS['AI Action Wait'];
  QABS.aiSight = _PARAMS['AI Uses QSight'];
  QABS.aiPathfind = _PARAMS['AI uses QPathfind'];

  QABS.getDefaultSkillKeys = function() {
    var obj = {};
    var skills = _PARAMS['Default Skills'];
    for (var i = 0; i < skills.length; i++) {
      var skill = skills[i];
      obj[i + 1] = {
        input: [skill['Keyboard Input'].trim(), skill['Gamepad Input'].trim()],
        rebind: skill.Rebind,
        skillId: skill['Skill Id']
      }
    }
    return obj;
  };

  QABS.skillKey = QABS.getDefaultSkillKeys();

  QABS.stringToSkillKeyObj = function(string) {
    var obj = QPlus.stringToObj(string);
    for (var key in obj) {
      var data = String(obj[key]).split(' ').filter(function(i) {
        return i !== '';
      }).map(function(i) {
        return i.trim();
      });
      var skillId = Number(data[0]) || 0;
      var rebind = data[1] === 'true';
      if (!QABS.skillKey[key]) {
        var msg = 'ERROR: Attempted to apply a skill key that has not been setup';
        msg += ' in the plugin parameters.\n';
        msg += 'Skill Key Number: ' + key;
        alert(msg);
        delete obj[key];
        continue;
      }
      obj[key] = {
        input: QABS.skillKey[key].input.clone(),
        skillId: skillId,
        rebind: rebind
      }
    }
    return obj;
  };

  QABS._skillSettings = {};
  QABS.getSkillSettings = function(skill) {
    if (!this._skillSettings.hasOwnProperty(skill.id)) {
      var settings = skill.qmeta.absSettings;
      this._skillSettings[skill.id] = {
        cooldown: 0,
        through: 0,
        groundTarget: false,
        selectTarget: false,
        throughTerrain: []
      }
      if (settings) {
        // TODO change this, hate how it looks
        settings = QPlus.stringToObj(settings);
        Object.assign(settings, {
          cooldown: Number(settings.cooldown) || 0,
          through: Number(settings.through) || 0,
          groundTarget: settings.groundtarget && !settings.selecttarget,
          selectTarget: !settings.groundtarget && settings.selecttarget,
          throughTerrain: settings.throughTerrain || ''
        });
        if (settings.throughTerrain.constructor !== Array) {
          settings.throughTerrain = [settings.throughTerrain];
        }
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
      var skills = $dataWeapons[id].qmeta.skillKeys || $dataWeapons[id].qmeta.absSkills;
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
      this._aiRange[skill.id] = this.calcAIRange(skill);
    }
    return this._aiRange[skill.id];
  };

  QABS.calcAIRange = function(skill) {
    var actions = this.getSkillSequence(skill);
    var currDist = 0;
    var stored = 0;
    var maxDist = 0;
    actions.forEach(function(action) {
      var move = /^(?:move|wave) (.*)/i.exec(action);
      if (move) {
        move = move[1].trim().split(' ');
        if (move[0] === 'forward') {
          currDist += Number(move[1]) || 0;
        } else {
          currDist -= Number(move[1]) || 0;
        }
        maxDist = Math.max(currDist, maxDist);
      }
      var store = /^store/i.exec(action);
      if (store) {
        stored = currDist;
      }
      var toStore = /^(?:move|wave)ToStored/i.exec(action);
      if (toStore) {
        currDist = stored;
        maxDist = Math.max(currDist, maxDist);
      }
      var userForce = /^user forceSkill (.*)/i.exec(action);
      if (userForce) {
        userForce = Number(userForce[1].trim().split(' ')[0]);
        var dist2 = QABS.getAIRange($dataSkills[userForce]);
        maxDist = Math.max(dist2, maxDist);
      }
      var skillForce = /^forceSkill (.*)/i.exec(action);
      if (skillForce) {
        skillForce = Number(skillForce[1].trim().split(' ')[0]);
        var dist3 = QABS.getAIRange($dataSkills[skillForce]);
        dist3 += currDist;
        maxDist = Math.max(dist3, maxDist);
      }
    });
    return maxDist;
  };

})();
