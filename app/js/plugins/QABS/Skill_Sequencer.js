//-----------------------------------------------------------------------------
// Skill_Sequencer

function Skill_Sequencer() {
  this.initialize.apply(this, arguments);
}

(function() {

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
      case 'adjustaim': {
        this.actionAdjustAim(action);
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
      case 'qaudio': {
        this.actionQAudio(action);
        break;
      }
      case 'forceskill': {
        this.actionForceSkill(action);
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
      case 'qaudio': {
        this.userQAudio(action);
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
      case 'qaudio': {
        this.targetQAudio(action, targets);
        break;
      }
    }
  };

  Skill_Sequencer.prototype.startOnDamageUserAction = function(action, targets) {
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
    var i = this._character._skillLocked.indexOf(this._skill);
    if (i >= 0) return;
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
    }
    var radian = this._character._radian;
    if (action[0] === 'backward') {
      radian -= Math.PI / 2;
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
    this._waitForUserMove = action[2] ? action[2] === 'true' : false;
  };

  Skill_Sequencer.prototype.userMoveHere = function(action) {
    var center = this._character.centerWithCollider(this._skill.collider);
    var final = this._character.adjustPosition(center.x, center.y);
    var dx = final.x - this._character.px;
    var dy = final.y - this._character.py;
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
    var x1 = x2 = this._character.px;
    var y1 = y2 = this._character.py;
    var dir = this._character._direction;
    if (action[0] === 'backward') {
      x2 -= dir === 6 ? dist : dir === 4 ? -dist : 0;
      y2 -= dir === 2 ? dist : dir === 8 ? -dist : 0;
    } else if (action[0] === 'forward') {
      x2 += dir === 6 ? dist : dir === 4 ? -dist : 0;
      y2 += dir === 2 ? dist : dir === 8 ? -dist : 0;
    }
    var final = this._character.adjustPosition(x2, y2);
    var dx = final.x - x1;
    var dy = final.y - y1;
    dist = Math.sqrt(dx * dx + dy * dy);
    if (action[0] === 'backward') {
      this._character.pixelJumpBackward(dist);
    } else if (action[0] === 'forward') {
      this._character.pixelJumpForward(dist);
    }
    this._waitForUserJump = action[2] ? action[2] === 'true' : false;
  };

  Skill_Sequencer.prototype.userJumpHere = function(action) {
    var center = this._character.centerWithCollider(this._skill.collider);
    var final = this._character.adjustPosition(center.x, center.y);
    var dx = final.x - this._character.px;
    var dy = final.y - this._character.py;
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
      this._waitForUserPose = action[1] === 'true';
    }
  };

  Skill_Sequencer.prototype.userForceSkill = function(action) {
    var id = Number(action[0]);
    var angleOffset = Number(action[1]);
    var radian = this._character._radian;
    if (angleOffset) {
      radian += angleOffset * Math.PI / 180;
    }
    var skill = this._character.forceSkill(id, true);
    skill.radian = radian;
    skill._target = this._skill._target;
  };

  Skill_Sequencer.prototype.userAnimation = function(action) {
    var id = Number(action[0]);
    var x = this._character.cx();
    var y = this._character.cy();
    QABSManager.startAnimation(id, x, y);
  };

  Skill_Sequencer.prototype.userQAudio = function(action) {
    if (!Imported.QAudio) return;
    var id = Game_Interpreter.prototype.getUniqueQAudioId.call();
    var name = action[0];
    var loop = !!QPlus.getArg(action, /^loop$/i);
    var dontPan = !!QPlus.getArg(action, /^noPan$/i);
    var fadein = QPlus.getArg(action, /^fadein(\d+)/i);
    var type = QPlus.getArg(action, /^(bgm|bgs|me|se)$/i) || 'bgm';
    type = type.toLowerCase();
    var max = QPlus.getArg(action, /^max(\d+)/i);
    if (max === null) {
      max = 90;
    }
    max = Number(max) / 100;
    var radius = QPlus.getArg(action, /^radius(\d+)/i);
    if (radius === null) {
      radius = 5;
    }
    var audio = {
      name: name,
      volume: 100,
      pitch: 0,
      pan: 0
    }
    AudioManager.playQAudio(id, audio, {
      type: type,
      loop: loop,
      maxVolume: Number(max),
      radius: Number(radius),
      bindTo: this._character.charaId(),
      doPan: !dontPan,
      fadeIn: Number(fadein) || 0
    });
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
    this._waitForMove = action[3] === 'true';
    this.setSkillRadian(Number(radian));
    this.actionMoveSkill(distance, duration);
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
      this._skill.radian = Math.atan2(dy, dx);
      this.actionWave(['forward', action[0], action[1], dist, action[2], action[3]]);
    }
  };

  Skill_Sequencer.prototype.actionTrigger = function() {
    this._skill.targets = QABSManager.getTargets(this._skill, this._character);
    this.updateSkillDamage();
  };

  Skill_Sequencer.prototype.actionAdjustAim = function() {
    if (!this._skill._target) return;
    var x1 = this._skill.collider.x;
    var y1 = this._skill.collider.y;
    var forward = this._skill._target.forwardV();
    var dt = Math.randomInt(5) || 1;
    var x2 = this._skill._target.px + forward.x * dt;
    var y2 = this._skill._target.py + forward.y * dt;
    var dx = x2 - x1;
    var dy = y2 - y1;
    this._skill.radian = Math.atan2(dy, dx);
  };

  Skill_Sequencer.prototype.actionWait = function(action) {
    var duration = Number(action[0]);
    ColliderManager.draw(this._skill.collider, duration);
    this._waitCount = duration;
  };

  Skill_Sequencer.prototype.actionPicture = function(action) {
    // TODO add animated
    this._skill.picture = new Sprite();
    this._skill.picture.bitmap = ImageManager.loadPicture(action[0]);
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
    if (!Imported.QAudio) return;
    var x = this._skill.collider.center.x;
    var y = this._skill.collider.center.x;
    var id = Game_Interpreter.prototype.getUniqueQAudioId.call();
    var name = action[0];
    var loop = !!QPlus.getArg(action, /^loop$/i);
    var dontPan = !!QPlus.getArg(action, /^noPan$/i);
    var fadein = QPlus.getArg(action, /^fadein(\d+)/i);
    var type = QPlus.getArg(action, /^(bgm|bgs|me|se)$/i) || 'bgm';
    type = type.toLowerCase();
    var max = QPlus.getArg(action, /^max(\d+)/i);
    if (max === null) {
      max = 90;
    }
    max = Number(max) / 100;
    var radius = QPlus.getArg(action, /^radius(\d+)/i);
    if (radius === null) {
      radius = 5;
    }
    var audio = {
      name: name,
      volume: 100,
      pitch: 0,
      pan: 0
    }
    AudioManager.playQAudio(id, audio, {
      type: type,
      loop: loop,
      maxVolume: Number(max),
      radius: Number(radius),
      x: x / QMovement.tileSize,
      y: y / QMovement.tileSize,
      doPan: !dontPan,
      fadeIn: Number(fadein) || 0
    });
  };

  Skill_Sequencer.prototype.actionForceSkill = function(action) {
    var id = Number(action[0]);
    var angleOffset = Number(action[1]);
    var radian = this._skill.radian;
    if (angleOffset) {
      radian += angleOffset * Math.PI / 180;
    }
    var center = this._skill.collider.center;
    var skill = this._character.makeSkill(id);
    var w = skill.collider.width;
    var h = skill.collider.height;
    skill.collider.moveTo(center.x - w / 2, center.y - w / 2);
    skill.radian = radian;
    skill._target = this._skill._target;
    this._character._activeSkills.push(skill);
    this._character._skillCooldowns[id] = skill.settings.cooldown;
  };

  Skill_Sequencer.prototype.actionMoveSkill = function(distance, duration) {
    var instant = duration === 0;
    if (duration <= 0) duration = 1;
    this._skill.newX = this._skill.collider.x + Math.round(distance * Math.cos(this._skill.radian));
    this._skill.newY = this._skill.collider.y + Math.round(distance * Math.sin(this._skill.radian));
    this._skill.speed = Math.abs(distance / duration);
    this._skill.speedX = Math.abs(this._skill.speed * Math.cos(this._skill.radian));
    this._skill.speedY = Math.abs(this._skill.speed * Math.sin(this._skill.radian));
    this._skill.moving = true;
    if (instant) {
      this.updateSkillPosition();
    }
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
        dir = this._character.reverseDir(dir);
        radian += Math.PI;
      } else if (action[0] === 'into') {
        var dxi = this._skill.collider.center.x - targets[i].cx();
        var dyi = this._skill.collider.center.y - targets[i].cy();
        radian = Math.atan2(dyi, dxi);
        dist2 = Math.min(dist2, Math.sqrt(dxi * dxi + dyi * dyi));
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
      });
      if (!targets[i].isDirectionFixed()) {
        route.list.push({ code: 36 });
      }
      route.list.push({
        code: 0
      });
      targets[i].forceMoveRoute(route);
      targets[i].updateRoutineMove();
    }
  };

  Skill_Sequencer.prototype.targetJump = function(action, targets) {
    var dist = Number(action[1]) || 0;
    for (var i = 0; i < targets.length; i++) {
      var dist2 = dist - dist * eval('targets[i].battler().' + QABS.mrst);
      if (dist2 <= 0) return;
      var radian = this._skill.radian;
      if (action[0] === 'towards') {
        radian += Math.PI;
      } else if (action[0] === 'into') {
        var dxi = this._skill.collider.center.x - targets[i].cx();
        var dyi = this._skill.collider.center.y - targets[i].cy();
        radian = Math.atan2(dyi, dxi);
        dist2 = Math.min(dist2, Math.sqrt(dxi * dxi + dyi * dyi));
      }
      var dx = Math.round(dist2 * Math.cos(radian));
      var dy = Math.round(dist2 * Math.sin(radian));
      var x1 = targets[i].px;
      var y1 = targets[i].py;
      var x2 = x1 + dx;
      var y2 = y1 + dy;
      var final = targets[i].adjustPosition(x2, y2);
      dx = final.x - x1;
      dy = final.y - y1;
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

  Skill_Sequencer.prototype.targetQAudio = function(action, targets) {
    if (!Imported.QAudio) return;
    var id = Game_Interpreter.prototype.getUniqueQAudioId.call();
    var name = action[0];
    var loop = !!QPlus.getArg(action, /^loop$/i);
    var dontPan = !!QPlus.getArg(action, /^noPan$/i);
    var fadein = QPlus.getArg(action, /^fadein(\d+)/i);
    var type = QPlus.getArg(action, /^(bgm|bgs|me|se)$/i) || 'bgm';
    type = type.toLowerCase();
    var max = QPlus.getArg(action, /^max(\d+)/i);
    if (max === null) {
      max = 90;
    }
    max = Number(max) / 100;
    var radius = QPlus.getArg(action, /^radius(\d+)/i);
    if (radius === null) {
      radius = 5;
    }
    var audio = {
      name: name,
      volume: 100,
      pitch: 0,
      pan: 0
    }
    for (var i = 0; i < targets.length; i++) {
      AudioManager.playQAudio(id, audio, {
        type: type,
        loop: loop,
        maxVolume: Number(max),
        radius: Number(radius),
        bindTo: targets[i].charaId(),
        doPan: !dontPan,
        fadeIn: Number(fadein) || 0
      });
    };
  };

  Skill_Sequencer.prototype.setSkillRadian = function(radian) {
    var rotate = this._skill.settings.rotate === true;
    this._skill.radian = radian;
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
      for (var i = targets.length - 1; i >= 0; i--) {
        if (!this._skill.targetsHit.contains(targets[i].charaId())) {
          this._skill.targetsHit.push(targets[i].charaId());
        } else {
          targets.splice(i, 1);
        }
      }
      if (targets.length > 0) {
        this._skill.targets = targets;
        if (through === 1 || through === 3) {
          collided = true;
          // TODO select the nearest target
          this._skill.targets = [targets[0]];
        }
        this.updateSkillDamage();
      }
    }
    if (collided) return false;
    var edge = this._skill.collider.gridEdge();
    var maxW = $gameMap.width();
    var maxH = $gameMap.height();
    if (!$gameMap.isLoopHorizontal()) {
      if (edge.x2 < 0 || edge.x1 >= maxW) return false;
    }
    if (!$gameMap.isLoopVertical()) {
      if (edge.y2 < 0 || edge.y1 >= maxH) return false;
    }
    if (through === 2 || through === 3) {
      ColliderManager.getCollidersNear(this._skill.collider, function(collider) {
        if (collider === this.collider) return false;
        if (this.settings.throughTerrain.contains(collider.terrain)) {
          return false;
        }
        if (this.collider.intersects(collider)) {
          collided = true;
          return 'break';
        }
      }.bind(this._skill));
    }
    if (through === 1 || through === 3) {
      ColliderManager.getCharactersNear(this._skill.collider, function(chara) {
        if (chara === this._character) return false;
        if (this._skill.collider.intersects(chara.collider('collision'))) {
          collided = true;
          return 'break';
        }
      }.bind(this));
    }
    return !collided;
  };

  Skill_Sequencer.prototype.isWaiting = function() {
    return this._waitCount > 0 || this._waitForMove ||
      this._waitForUserMove || this._waitForUserJump ||
      this._waitForUserJump || this._waitForUserPose;
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
    if (!this.isWaiting()) {
      this.updateSequence();
    } else {
      this.updateWait();
    }
  };

  Skill_Sequencer.prototype.updateWait = function() {
    if (this._waitCount > 0) {
      this._waitCount--;
    }
    if (this._waitForUserMove && !this._character.isMoving()) {
      this._waitForUserMove = false;
    }
    if (this._waitForUserJump && !this._character.isJumping()) {
      this._waitForUserJump = false;
    }
    if (this._waitForUserPose && !this._character._posePlaying) {
      this._waitForUserPose = false;
    }
  };

  Skill_Sequencer.prototype.updateSequence = function() {
    var sequence = this._skill.sequence;
    while (sequence.length !== 0) {
      var action = QPlus.makeArgs(sequence.shift());
      this.startAction(action);
      if (this.isWaiting()) {
        break;
      }
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

})();
