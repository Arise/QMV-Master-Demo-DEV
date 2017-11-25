//=============================================================================
// QMFaceMouse
//=============================================================================

var Imported = Imported || {};

if (!Imported.QMovement || !QPlus.versionCheck(Imported.QMovement, '1.3.8')) {
  alert('Error: QM+FaceMouse requires QMovement 1.3.8 or newer to work.');
  throw new Error('Error: QM+FaceMouse requires QMovement 1.3.8 or newer to work.');
}

Imported.QMFaceMouse = '1.0.0';

//=============================================================================
/*:
 * @plugindesc <QMFaceMouse>
 * QMovement Addon: Player will always face towards mouse position
 * @version 1.0.0
 * @author Quxios  | Version 1.0.0
 * @site https://quxios.github.io/
 * @updateurl https://quxios.github.io/data/pluginsMin.json
 *
 * @requires QMovement

 * @help
 * ============================================================================
 * ## About
 * ============================================================================
 * The player will always face towards the mouse.
 *
 * TODO add a plugin command to turn on / off
 * ============================================================================
 * ## Links
 * ============================================================================
 * RPGMakerWebs:
 *
 *  http://forums.rpgmakerweb.com/index.php?threads/qplugins.73023/
 *
 * Terms of use:
 *
 *  https://github.com/quxios/QMV-Master-Demo/blob/master/readme.md
 *
 * Like my plugins? Support me on Patreon!
 *
 *  https://www.patreon.com/quxios
 *
 * @tags QM-Addon
 */
//=============================================================================


//=============================================================================
// QMFaceMouse

(function() {
  //-----------------------------------------------------------------------------
  // Game_Player

  if (Imported.QSprite) {
    var Alias_Game_Player_updatePose = Game_Player.prototype.updatePose;
    Game_Player.prototype.updatePose = function(wasMoving) {
      if (this.canMove()) this.faceTowardsMouse();
      Alias_Game_Player_updatePose.call(this, wasMoving);
    };
  } else {
    var Alias_Game_Player_update = Game_Player.prototype.update;
    Game_Player.prototype.update = function(sceneActive) {
      Alias_Game_Player_update.call(this, sceneActive);
      if (this.canMove()) this.faceTowardsMouse();
    };
  }

  Game_Player.prototype.faceTowardsMouse = function() {
    var dx = TouchInput.x - this.screenX();
    var dy = TouchInput.y - this.screenY();
    this.setRadian(Math.atan2(dy, dx));
  };

  var Alias_Game_Player_moveStraight = Game_Player.prototype.moveStraight;
  Game_Player.prototype.moveStraight = function(d, dist) {
    Alias_Game_Player_moveStraight.call(this, d, dist);
  };

})()
