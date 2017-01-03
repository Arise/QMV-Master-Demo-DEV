//=============================================================================
// QSpeed
//=============================================================================

var Imported = Imported || {};
Imported.QSpeed = '1.0.0';

if (!Imported.QPlus) {
  var msg = 'Error: QSpeed requires QPlus to work.';
  alert(msg);
  throw new Error(msg);
}

//=============================================================================
 /*:
 * @plugindesc <QSpeed>
 * desc
 * @author Quxios  | Version 1.0.0
 *
 * @requires
 *
 * @param
 * @desc
 * @default
 *
 * @video
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
 * ## Links
 * ============================================================================
 * RPGMakerWebs:
 *
 *   http://forums.rpgmakerweb.com/index.php?/topic/73023-qplugins/
 *
 * Terms of use:
 *
 *   https://github.com/quxios/QMV-Master-Demo/blob/master/readme.md
 *
 * @tags
 */
//=============================================================================

//=============================================================================
// QSpeed

(function() {
  //-----------------------------------------------------------------------------
  // Game_Interpreter

  var Alias_Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
  Game_Interpreter.prototype.pluginCommand = function(command, args) {
    if (command.toLowerCase() === 'qspeed') {
      this.qPluginCommand(args);
      return;
    }
    Alias_Game_Interpreter_pluginCommand.call(this, command, args);
  };

  Game_Interpreter.prototype.qPluginCommand = function(args) {
    var chara = QPlus.getCharacter(args[0]);
    var cmd = args[1].toLowerCase();
    var args2 = args.slice(2);
    if (cmd === 'enableaccel') {
      chara._useAccel = true;
    }
    if (cmd === 'disableaccel') {
      chara._useAccel = false;
    }
    if (cmd === 'duration') {
      chara._moveSpeedDuration = Number(args2[0]) || 1;
    }
    if (cmd === 'set') {
      var spd = Number(args2[0]);
      var accel = args2[1] === 'accel';
      chara.setMoveSpeed(spd, accel);
    }
  };

  //-----------------------------------------------------------------------------
  // Game_CharacterBase

  var Alias_Game_CharacterBase_initMembers = Game_CharacterBase.prototype.initMembers;
  Game_CharacterBase.prototype.initMembers = function() {
    Alias_Game_CharacterBase_initMembers.call(this);
    this._realMoveSpeed = 4;
    this._moveSpeedDuration = 30;
    this._moveSpeedSpd  = 0;
    this._useAccel   = false;
    this._wasDashing = false;
  };

  var Alias_Game_CharacterBase_setMoveSpeed = Game_CharacterBase.prototype.setMoveSpeed;
  Game_CharacterBase.prototype.setMoveSpeed = function(moveSpeed, accel) {
    Alias_Game_CharacterBase_setMoveSpeed.call(this, moveSpeed);
    var duration = this._moveSpeedDuration;
    if (!accel && !this._useAccel) {
      duration = 1;
    }
    this._moveSpeedSpd = Math.abs(this._realMoveSpeed - moveSpeed) / duration;
  };

  Game_CharacterBase.prototype.realMoveSpeed = function() {
    return this._realMoveSpeed;
  };

  var Alias_Game_CharacterBase_update = Game_CharacterBase.prototype.update;
  Game_CharacterBase.prototype.update = function() {
    Alias_Game_CharacterBase_update.call(this);
    this.updateMoveSpeed();
  };

  Game_CharacterBase.prototype.updateMoveSpeed = function() {
    if (this._realMoveSpeed < this._moveSpeed) {
      this._realMoveSpeed = Math.min(this._realMoveSpeed + this._moveSpeedSpd, this._moveSpeed);
    } else if (this._realMoveSpeed > this._moveSpeed) {
      this._realMoveSpeed = Math.max(this._realMoveSpeed - this._moveSpeedSpd, this._moveSpeed);
    }
    if (!this._wasDashing && this.isDashing()) {
      this.setMoveSpeed(this._moveSpeed + 1, true);
    }
    if (this._wasDashing && !this.isDashing()) {
      this.setMoveSpeed(this._moveSpeed - 1, true);
    }
    this._wasDashing = this.isDashing();
  };

  //-----------------------------------------------------------------------------
  // Game_Event

  var Alias_Game_Event_setupPageSettings = Game_Event.prototype.setupPageSettings;
  Game_Event.prototype.setupPageSettings = function() {
    Alias_Game_Event_setupPageSettings.call(this);
    var match = /<speed:(\d+\.?\d*?)>/i.exec(this.comments());
    if (match) {
      this.setMoveSpeed(Number(match[1]) || 4);
    }
  };
})()
