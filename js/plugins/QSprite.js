//=============================================================================
// QSprite
//=============================================================================

var Imported = Imported || {};
Imported.QSprite = '2.0.0';
Imported.Quasi_Sprite = true; // backwards compatibility

if (!Imported.QPlus) {
  var msg = 'Error: QSprite requires QPlus to work.';
  alert(msg);
  throw new Error(msg);
}

//=============================================================================
 /*:
 * @plugindesc <QSprite>
 * Lets you configure Spritesheets
 * @author Quxios  | Version 2.0.0
 *
 * @param File Name Identifier
 * @desc Set the file name identifier for QSprites
 * Default: %{config}-
 * @default %{config}-
 *
 * @param Random Idle Interval
 * @desc Set the time interval between random Idles (in frames)
 * Set as a range seperated with a space. min value first
 * @default 60 300
 *
 * @param Use New Adjust
 * @desc Use new pose speed adjust?
 * Set to true or false
 * @default true
 *
 * @help
 * ============================================================================
 * ** Links
 * ============================================================================
 * For a guide on how to use this plugin go to:
 *
 *   http://forums.rpgmakerweb.com/index.php?/topic/57648-quasi-sprite/
 *
 * Sprite App:
 *   https://github.com/quxios/SpriteAnimator
 *
 * Terms of use:
 *   https://github.com/quxios/somerepo/readme.md#terms
 *
 */
//=============================================================================

//=============================================================================
// QSprite Static Class

function QSprite() {
 throw new Error('This is a static class');
}

QSprite.json = null;

//=============================================================================
// QSprite

(function() {
  var _params = QPlus.getParams('<QSprite>');
  var _identifier   = _params['File Name Identifier'] || '%{config}-';
  var _idleInterval = _params['Random Idle Interval'].trim().split(' ').map(Number);
  if (!_idleInterval[1] || _idleInterval[1] < _idleInterval[0]) {
    _idleInterval[1] = _idleInterval[0];
  }
  var _useNewAdjust = _params['Use New Adjust'] === 'true';

  (function() {
    var xhr = new XMLHttpRequest();
    var url = 'data/SpriteAnim.json';
    xhr.open('GET', url, true);
    xhr.overrideMimeType('application/json');
    xhr.onload = function() {
      if (xhr.status < 400) {
        QSprite.json = JSON.parse(xhr.responseText);
      }
    }
    xhr.onerror = function() {
      alert('Error: data/SpriteAnim.json could not be loaded.');
      throw new Error('data/SpriteAnim.json could not be loaded.')
    }
    xhr.send();
  })()

  var Alias_Scene_Base_isReady = Scene_Base.prototype.isReady;
  Scene_Base.prototype.isReady = function() {
    return Alias_Scene_Base_isReady.call(this) && QSprite.json;
  };

  //-----------------------------------------------------------------------------
  // Game_Interpreter
  //
  // The interpreter for running event commands.

  var Alias_Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
  Game_Interpreter.prototype.pluginCommand = function(command, args) {
    if (command.toLowerCase() === 'quasi') {
      this.qSpriteCommandOld(args);
    }
    if (command.toLowerCase() === 'qsprite') {
      this.qSpriteCommand(args);
      return;
    }
    Alias_Game_Interpreter_pluginCommand.call(this, command, args);
  };

  Game_Interpreter.prototype.qSpriteCommand = function(args) {
    var chara = QPlus.getCharacter(args[0]);
    if (!chara) return;
    var cmd = args[1].toLowerCase();
    var args2 = args.slice(2);
    if (cmd === 'play') {
      var pose = args2.shift();
      var locked   = !!QPlus.getArg(args2, /lock/i);
      var pause    = !!QPlus.getArg(args2, /pause/i);
      var canBreak = !!QPlus.getArg(args2, /breakable/i);
      var wait     = !!QPlus.getArg(args2, /wait/i);
      chara.playPose(pose, locked, pause, false, canBreak);
      if (wait) {
        this.wait(chara.calcPoseWait());
      }
    }
    if (cmd === 'loop') {
      var pose = args2.shift();
      var locked = args2.contains('lock');
      var canBreak = args2.contains('breakable');
      var wait = args2.contains('wait');
      chara.loopPose(pose, locked, canBreak);
      if (wait) {
        this.wait(chara.calcPoseWait());
      }
    }
    if (cmd === 'clear') {
      chara.clearPose();
    }
  };

  Game_Interpreter.prototype.qSpriteCommandOld = function(args) { // backwards compatibility
    if (args[0].toLowerCase() === "playpose") {
      var charaId = Number(args[1]);
      var chara = charaId === 0 ? $gamePlayer : $gameMap.event(charaId);
      var pose = args[2];
      var locked = args[3] === "true";
      var pause = args[4] === "true";
      chara.playPose(pose, locked, pause);
      return;
    }
    if (args[0].toLowerCase() === "looppose") {
      var charaId = Number(args[1]);
      var chara = charaId === 0 ? $gamePlayer : $gameMap.event(charaId);
      var pose = args[2];
      var locked = args[3] === "true";
      chara.loopPose(pose, locked);
      return;
    }
    if (args[0].toLowerCase() === "clearpose") {
      var charaId = Number(args[1]);
      var chara = charaId === 0 ? $gamePlayer : $gameMap.event(charaId);
      chara.clearPose();
      return;
    }
  };

  //-----------------------------------------------------------------------------
  // Game_CharacterBase
  //
  // The superclass of Game_Character. It handles basic information, such as
  // coordinates and images, shared by all characters.

  var Alias_Game_CharacterBase_initMembers = Game_CharacterBase.prototype.initMembers;
  Game_CharacterBase.prototype.initMembers = function() {
    Alias_Game_CharacterBase_initMembers.call(this);
    this._pose = '';
    this._availableIdlePoses = [];
    this._idleTimer = 0;
    this._idleIntervalWait = Math.randomIntBetween(_idleInterval);
  };

  Game_CharacterBase.prototype.moveSpeedMultiplier = function() {
    var speed = this.realMoveSpeed();
    var multipliers = {
      1: 0.125,
      2: 0.25,
      3: 0.5,
      4: 1,
      5: 2,
      6: 4
    }
    return multipliers[speed];
  };

  var Alias_Game_CharacterBase_animationWait = Game_CharacterBase.prototype.animationWait;
  Game_CharacterBase.prototype.animationWait = function() {
    if (this.qSprite() && this.qSprite().poses[this._pose]) {
      var pose = this.qSprite().poses[this._pose];
      if (pose.adjust) {
        if (_useNewAdjust) {
          return pose.speed / this.moveSpeedMultiplier();
        } else {
          return (pose.speed - this.realMoveSpeed()) * 3;
        }
      }
      return pose.speed;
    }
    return Alias_Game_CharacterBase_animationWait.call(this);
  };

  Game_CharacterBase.prototype.calcPoseWait = function() {
    if (!this.qSprite()) return 0;
    var frameWait = this.animationWait();
    var frames = this.qSprite().poses[this._pose].pattern.length;
    return Math.ceil(frameWait * frames);
  };

  var Alias_Game_CharacterBase_update = Game_CharacterBase.prototype.update;
  Game_CharacterBase.prototype.update = function() {
    var wasMoving = this.isMoving();
    Alias_Game_CharacterBase_update.call(this);
    if (this.qSprite()) {
      this.updatePose(wasMoving);
    } else {
      this._pose = '';
    }
  };

  Game_CharacterBase.prototype.updatePose = function(wasMoving) {
    var isMoving = wasMoving || this.isMoving();
    if (this._posePlaying) {
      if (!this._posePlaying.canBreak) return;
      if (!isMoving) return;
      this.clearPose();
    }
    var dir = this._direction;
    if (Imported.Quasi_Movement && this.isDiagonal()) {
      var diag = this.isDiagonal();
    }
    if (!isMoving && this.hasPose('idle' + dir)) {
      this.updateIdlePose(dir, diag);
    } else {
      this.updateSteppingPose(isMoving, wasMoving);
      if (this._posePlaying) return;
      if (this.isDashing() && isMoving) {
        this.updateDashingPose(dir, diag);
      } else {
        this.updateMovingPose(dir, diag);
      }
    }
  };

  Game_CharacterBase.prototype.updateIdlePose = function(dir, diag) {
    if (diag && this.hasPose('idle' + diag)) {
      dir = diag;
    }
    if (this._pose !== 'idle' + dir) {
      this._pattern = 0;
      this._animationCount = 0;
      this._isIdle = true;
    }
    this._pose = 'idle' + dir;
    this.updateIdleInterval();
  };

  Game_CharacterBase.prototype.updateSteppingPose = function(isMoving, wasMoving) {
    this._isIdle = !isMoving;
    if (this._isIdle && wasMoving) {
      this._pattern = 0;
    } else if (this._isIdle) {
      if (!this.hasStepAnime()) {
        this._pattern = 0;
      }
      this.updateIdleInterval();
    } else if (!this._isIdle) {
      this._idleTimer = 0;
      this._idleIntervalWait = Math.randomIntBetween(_idleInterval);
    }
  };

  Game_CharacterBase.prototype.updateIdleInterval = function() {
    this._idleTimer++;
    if (this._availableIdlePoses.length > 0) {
      if (this._idleTimer >= this._idleIntervalWait) {
        var i = Math.randomInt(this._availableIdlePoses.length);
        var pose = this._availableIdlePoses[i];
        this.playPose(pose, false, false, false, true);
        this._idleIntervalWait = Math.randomIntBetween(_idleInterval);
        this._idleTimer = 0;
      }
    }
  };

  Game_CharacterBase.prototype.updateDashingPose = function(dir, diag) {
    if (diag && this.hasPose('dash' + diag)) {
      dir = diag;
    }
    if (this.hasPose('dash' + dir)) {
      this._pose = 'dash' + dir;
    }
  };

  Game_CharacterBase.prototype.updateMovingPose = function(dir, diag) {
    if (diag && this.hasPose('move' + diag)) {
      dir = diag;
    }
    if (this.hasPose('move' + dir)) {
      this._pose = 'move' + dir;
    }
  };

  var Alias_Game_CharacterBase_updateAnimationCount = Game_CharacterBase.prototype.updateAnimationCount;
  Game_CharacterBase.prototype.updateAnimationCount = function() {
    if (this._isIdle || this._posePlaying) {
      this._animationCount++;
      return;
    }
    Alias_Game_CharacterBase_updateAnimationCount.call(this);
  };

  var Alias_Game_CharacterBase_updatePattern = Game_CharacterBase.prototype.updatePattern;
  Game_CharacterBase.prototype.updatePattern = function() {
    if (this._isIdle || this._posePlaying || this.qSprite()) {
      this._pattern++;
      if (this._pattern >= this.maxPattern()) {
        if (this._posePlaying) {
          if (this._posePlaying.pause) {
            this._pattern--;
            return;
          }
          if (!this._posePlaying.loop) {
            this.clearPose();
            return;
          }
        }
        this.resetPattern();
      }
      return;
    }
    return Alias_Game_CharacterBase_updatePattern.call(this);
  };

  var Alias_Game_CharacterBase_maxPattern = Game_CharacterBase.prototype.maxPattern;
  Game_CharacterBase.prototype.maxPattern = function() {
    if (this.qSprite()) {
      return this.qSprite().poses[this._pose].pattern.length;
    }
    return Alias_Game_CharacterBase_maxPattern.call(this);
  };

  Game_CharacterBase.prototype.resetPattern = function() {
    this.qSprite() ? this.setPattern(0) : this.setPattern(1);
  };

  var Alias_Game_CharacterBase_straighten = Game_CharacterBase.prototype.straighten;
  Game_CharacterBase.prototype.straighten = function() {
    Alias_Game_CharacterBase_straighten.call(this);
    if (this.qSprite() && (this.hasWalkAnime() || this.hasStepAnime())) {
      this._pattern = 0;
    }
  };

  Game_CharacterBase.prototype.hasPose = function(pose) {
    if (this.qSprite()) {
      return this.qSprite().poses.hasOwnProperty(pose);
    }
    return false;
  };

  var Alias_Game_CharacterBase_setImage = Game_CharacterBase.prototype.setImage;
  Game_CharacterBase.prototype.setImage = function(characterName, characterIndex) {
    Alias_Game_CharacterBase_setImage.call(this, characterName, characterIndex);
    this._isQChara = undefined;
    this.getAvailableIdlePoses();
  };

  Game_CharacterBase.prototype.getAvailableIdlePoses = function() {
    this._availableIdlePoses = [];
    if (this.isQCharacter()) {
      var poses = this.qSprite().poses;
      for (var pose in poses) {
        if (/^idle[a-zA-Z][12346789]$/.test(pose)) {
          var name = pose.slice(0, -1);
          if (!this._availableIdlePoses.contains(name)) {
            this._availableIdlePoses.push(name);
          }
        }
      }
    }
  };

  Game_CharacterBase.prototype.playPose = function(pose, lock, pause, looping, canBreak) {
    if (!this.qSprite()) return;
    var dir = this._direction;
    if (Imported.Quasi_Movement && this.isDiagonal()) {
      var diag = this.isDiagonal();
      if (this.hasPose(pose + diag)) {
        dir = diag;
      }
    }
    pose += dir;
    if (!this.hasPose(pose)) return;
    this._pose = pose;
    this._posePlaying = {
      lock: lock,
      pause: pause,
      loop: looping,
      canBreak: canBreak
    }
    this._animationCount = 0;
    this._pattern = 0;
  };

  Game_CharacterBase.prototype.loopPose = function(pose, lock, canBreak) {
    // function kept for backwards compatibility
    return this.playPose(pose, lock, false, true, canBreak);
  };

  Game_CharacterBase.prototype.clearPose = function() {
    this._posePlaying = null;
    this._locked = false;
    this._animationCount = 0;
    this._pattern = 0;
  };

  Game_CharacterBase.prototype.isQCharacter = function() {
    if (this._isQChara === undefined) {
      var string = _identifier.replace('{config}', '(.+)?');
      var regex  = new RegExp(string);
      this._isQChara = this._characterName.match(regex);
    }
    return this._isQChara ? this._isQChara[1] : false;
  };

  Game_CharacterBase.prototype.qSprite = function() {
    return this.isQCharacter() ? QSprite.json[this.isQCharacter()] : null;
  };

  //-----------------------------------------------------------------------------
  // Game_Player
  //
  // The game object class for the player. It contains event starting
  // determinants and map scrolling functions.

  var Alias_Game_Player_canMove = Game_Player.prototype.canMove;
  Game_Player.prototype.canMove = function() {
    if (this._posePlaying && this._posePlaying.lock) return false;
    return Alias_Game_Player_canMove.call(this);
  };

  Game_Player.prototype.actor = function() {
    return $gameParty.leader();
  };

  //-----------------------------------------------------------------------------
  // Game_Event
  //
  // The game object class for an event. It contains functionality for event page
  // switching and running parallel process events.

  var Alias_Game_Event_clearPageSettings = Game_Event.prototype.clearPageSettings;
  Game_Event.prototype.clearPageSettings = function() {
    Alias_Game_Event_clearPageSettings.call(this);
    this._prevPageDirection = null;
  };

  var Alias_Game_Event_setupPageSettings = Game_Event.prototype.setupPageSettings;
  Game_Event.prototype.setupPageSettings = function() {
    Alias_Game_Event_setupPageSettings.call(this);
  };

  //-----------------------------------------------------------------------------
  // Sprite_Character
  //
  // The sprite for displaying a character.

  var Alias_Sprite_Character_updateBitmap = Sprite_Character.prototype.updateBitmap;
  Sprite_Character.prototype.updateBitmap = function() {
    if (this.isImageChanged()) {
      Alias_Sprite_Character_updateBitmap.call(this);
      if (this._character.isQCharacter()) {
        this.anchor.x = this._character.qSprite().anchorX || 0.5;
        this.anchor.y = this._character.qSprite().anchorY || 1;
      }
    }
  };

  var Alias_Sprite_Character_characterBlockX = Sprite_Character.prototype.characterBlockX;
  Sprite_Character.prototype.characterBlockX = function() {
    if (this._character.isQCharacter()) return 0;
    return Alias_Sprite_Character_characterBlockX.call(this);
  };

  var Alias_Sprite_Character_characterBlockY = Sprite_Character.prototype.characterBlockY;
  Sprite_Character.prototype.characterBlockY = function() {
    if (this._character.isQCharacter()) return 0;
    return Alias_Sprite_Character_characterBlockY.call(this);
  };

  var Alias_Sprite_Character_characterPatternX = Sprite_Character.prototype.characterPatternX;
  Sprite_Character.prototype.characterPatternX = function() {
    if (this._character.isQCharacter()) {
      var pose = this._character.qSprite().poses[this._character._pose];
      if (!pose) return 0;
      var pattern = pose.pattern;
      var i = pattern[this._character._pattern];
      var x = i % this._character.qSprite().cols;
      return x;
    }
    return Alias_Sprite_Character_characterPatternX.call(this);
  };

  var Alias_Sprite_Character_characterPatternY = Sprite_Character.prototype.characterPatternY;
  Sprite_Character.prototype.characterPatternY = function() {
    if (this._character.isQCharacter()) {
      var pose = this._character.qSprite().poses[this._character._pose];
      if (!pose) return 0;
      var pattern = pose.pattern;
      var i = pattern[this._character._pattern];
      var x = i % this._character.qSprite().cols;
      var y = (i - x) / this._character.qSprite().cols;
      return y;
    }
    return Alias_Sprite_Character_characterPatternY.call(this);
  };

  var Alias_Sprite_Character_patternWidth = Sprite_Character.prototype.patternWidth;
  Sprite_Character.prototype.patternWidth = function() {
    if (this._character.isQCharacter()) {
      return this.bitmap.width / this._character.qSprite().cols;
    }
    return Alias_Sprite_Character_patternWidth.call(this);
  };

  var Alias_Sprite_Character_patternHeight = Sprite_Character.prototype.patternHeight;
  Sprite_Character.prototype.patternHeight = function() {
    if (this._character.isQCharacter()) {
      return this.bitmap.height / this._character.qSprite().rows;
    }
    return Alias_Sprite_Character_patternHeight.call(this);
  };

  //-----------------------------------------------------------------------------
  // Sprite_Actor
  //
  // The sprite for displaying an actor.

  Sprite_Actor.prototype.isQCharacter = function() {
    if (this._isQChara === undefined) {
      var string = _identifier.replace('{config}', '(.+?)');
      var regex  = new RegExp(string);
      this._isQChara = this._battlerName.match(regex);
    }
    return this._isQChara ? this._isQChara[1] : false;
  };

  var Alias_Sprite_Actor_startMotion = Sprite_Actor.prototype.startMotion;
  Sprite_Actor.prototype.startMotion = function(motionType) {
    if (this.isQCharacter()) {
      var pose = motionType;
      var motion = this._qSprite.poses[pose];
      if (motion) {
        this._pose = pose;
        this._pattern = 0;
        this._motionCount = 0;
      }
    } else {
      Alias_Sprite_Actor_startMotion.call(this, motionType);
    }
  };


  var Alias_Sprite_Actor_updateBitmap = Sprite_Actor.prototype.updateBitmap;
  Sprite_Actor.prototype.updateBitmap = function() {
    var oldBattlerName = this._battlerName;
    Alias_Sprite_Actor_updateBitmap.call(this);
    if (oldBattlerName !== this._battlerName) {
      this._isQChara = undefined;
      if (this.isQCharacter()) {
        this._qSprite = QSprite.json[this.isQCharacter()];
      }
    }
  };

  var Alias_Sprite_Actor_updateFrame = Sprite_Actor.prototype.updateFrame;
  Sprite_Actor.prototype.updateFrame = function() {
    if (this.isQCharacter()) {
      Sprite_Battler.prototype.updateFrame.call(this);
      var bitmap = this._mainSprite.bitmap;
      if (bitmap) {
        var motion = this._qSprite.poses[this._pose];
        if (!motion) {
          this._mainSprite.visible = false;
          return;
        }
        this._mainSprite.visible = true;
        var pattern = motion.pattern;
        var i = pattern[this._pattern];
        var cw = bitmap.width / this._qSprite.cols;
        var ch = bitmap.height / this._qSprite.rows;
        var cx = i % this._qSprite.cols;
        var cy = (i - cx) / this._qSprite.cols;
        this._mainSprite.setFrame(cx * cw, cy * ch, cw, ch);
      }
    } else {
      Alias_Sprite_Actor_updateFrame.call(this);
    }
  };

  var Alias_Sprite_Actor_updateMotionCount = Sprite_Actor.prototype.updateMotionCount;
  Sprite_Actor.prototype.updateMotionCount = function() {
    if (this.isQCharacter()) {
      var motion = this._qSprite.poses[this._pose];
      if (!motion) return;
      var poseWait = motion.speed;
      if (++this._motionCount >= poseWait) {
        this._pattern++;
        var maxPattern = motion.pattern.length;
        if (this._pattern === maxPattern) {
          this.refreshMotion();
        }
        this._motionCount = 0;
      }
    } else {
      Alias_Sprite_Actor_updateMotionCount.call(this);
    }
  };

  var Alias_Sprite_Actor_refreshMotion = Sprite_Actor.prototype.refreshMotion;
  Sprite_Actor.prototype.refreshMotion = function() {
    if (this.isQCharacter()) {
      var actor = this._actor;
      if (actor) {
        var stateMotion = actor.stateMotionIndex();
        if (actor.isInputting()) {
          this.startMotion('idle2');
        } else if (actor.isActing()) {
          this.startMotion('walk');
        } else if (stateMotion === 3) {
          this.startMotion('dead');
        } else if (stateMotion === 2) {
          this.startMotion('sleep');
        } else if (actor.isChanting()) {
          this.startMotion('chant');
        } else if (actor.isGuard() || actor.isGuardWaiting()) {
          this.startMotion('guard');
        } else if (stateMotion === 1) {
          this.startMotion('abnormal');
        } else if (actor.isDying()) {
          this.startMotion('dying');
        } else if (actor.isUndecided()) {
          this.startMotion('idle1');
        } else {
          this.startMotion('idle2');
        }
      }
    } else {
      Alias_Sprite_Actor_refreshMotion.call(this);
    }
  };

  if (Imported.YEP_BattleEngineCore) {
    var Alias_Sprite_Actor_forceMotion = Sprite_Actor.prototype.forceMotion;
    Sprite_Actor.prototype.forceMotion = function(motionType) {
      if (this.isQCharacter()) {
        var pose = motionType;
        var motion = this._qSprite.poses[pose];
        if (motion) {
          this._pose = pose;
          this._pattern = 0;
          this._motionCount = 0;
        }
      } else {
        Alias_Sprite_Actor_forcetMotion.call(this, motionType);
      }
    };
  }

  if (Imported.YEP_X_ActSeqPack2) {
    var Alias_BattleManager_processActionSequence = BattleManager.processActionSequence;
    BattleManager.processActionSequence = function(actionName, actionArgs) {
      if (actionName.match(/qmotion[ ](.*)/i)) {
        return this.actionQMotionTarget(String(RegExp.$1), actionArgs);
      }
      return Alias_BattleManager_processActionSequence.call(this, actionName, actionArgs);
    };

    BattleManager.actionQMotionTarget = function(name, actionArgs) {
      var movers = this.makeActionTargets(actionArgs[0]);
      if (movers.length < 1) return true;
      var motion = name.toLowerCase();
      movers.forEach(function(mover) {
        mover.forceMotion(motion);
      });
      return false;
    };
  }
  //-----------------------------------------------------------------------------
  // Game_Actor
  //
  // The game object class for an actor.

  var Alias_Game_Actor_performAction = Game_Actor.prototype.performAction;
  Game_Actor.prototype.performAction = function(action) {
    Alias_Game_Actor_performAction.call(this, action);
    if (action._item._dataClass === 'skill') {
      var id = action._item._itemId;
      var skill = $dataSkills[id];
      var motion = skill.meta.motion;
      if (motion) {
        this.requestMotion(motion);
      }
    }
  };
})()