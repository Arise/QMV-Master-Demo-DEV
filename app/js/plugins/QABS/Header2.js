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
        input: input,
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
      var input = QABS.skillKey[key].input;
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
