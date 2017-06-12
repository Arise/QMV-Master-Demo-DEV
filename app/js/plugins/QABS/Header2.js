//=============================================================================
// QABS Static Class

function QABS() {
  throw new Error('This is a static class');
}

(function() {
  var _PARAMS = QPlus.getParams('<QABS>', true);

  QABS.quickTarget = _PARAMS['Quick Target'];
  QABS.lockTargeting = _PARAMS['Lock when Targeting'];
  QABS.towardsMouse = _PARAMS['Attack Towards Mouse'];
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
        delete obj[key];
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
      this._skillSettings[skill.id] = {
        cooldown: 0,
        through: 0,
        groundTarget: false,
        selectTarget: false
      }
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
        // TODO calc for moveToStored / waveToStored
        var match = /^[move|wave](.*)/i.exec(action);
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

})();
