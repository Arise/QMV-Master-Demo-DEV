//=============================================================================
// QYScale
//=============================================================================

var Imported = Imported || {};
Imported.QYScale = '1.0.0';

if (!Imported.QPlus) {
  var msg = 'Error: QYScale requires QPlus to work.';
  alert(msg);
  throw new Error(msg);
}

//=============================================================================
 /*:
 * @plugindesc <QYScale>
 * Change characters scale based off their Y value
 * @author Quxios  | Version 1.0.0
 *
 * @requires QPlus
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
 * **Map Notetag**
 * ----------------------------------------------------------------------------
 * ~~~
 *   <scale:min, max>
 * ~~~
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
 * @tags
 */
//=============================================================================

//=============================================================================
// QYScale

(function() {
  //-----------------------------------------------------------------------------
  // Game_Map

  var Alias_Game_Map_setup = Game_Map.prototype.setup;
  Game_Map.prototype.setup = function(mapId) {
    Alias_Game_Map_setup.call(this, mapId);
    this._hasYScale = null;
  };

  Game_Map.prototype.hasYScale = function() {
    if (this._hasYScale === null) {
      var meta = $dataMap.meta.scale;
      if (meta) {
        var settings = meta.split(',').map(Number);
        this._hasYScale = {
          min: settings[0] || 1,
          max: settings[1] || 1
        }
      } else {
        this._hasYScale = false;
      }
    }
    return this._hasYScale;
  };

  //-----------------------------------------------------------------------------
  // Game_CharacterBase

  var Alias_Game_CharacterBase_initMembers = Game_CharacterBase.prototype.initMembers;
  Game_CharacterBase.prototype.initMembers = function() {
    Alias_Game_CharacterBase_initMembers.call(this);
    this._yScale = null;
  }

  var Alias_Game_CharacterBase_update = Game_CharacterBase.prototype.update;
  Game_CharacterBase.prototype.update = function() {
    var oldY = this._realY;
    Alias_Game_CharacterBase_update.call(this);
    if ($gameMap.hasYScale() && (this._realY !== oldY || this._yScale === null)) {
      this.updateYScale();
    } else if (!$gameMap.hasYScale()) {
      this._yScale = 1;
    }
  };

  Game_CharacterBase.prototype.updateYScale = function() {
    var settings = $gameMap.hasYScale();
    var min = settings.min;
    var max = settings.max;
    var yMax = $gameMap.height() - 1;
    var ds = max - min;
    var ry = (yMax - this._realY) / yMax;
    this._yScale = max - ry * ds;
    if (Imported.QMovement) {
      var colliders = this._colliders;
      for (var type in colliders) {
        if (colliders.hasOwnProperty(type)) {
          colliders[type].setScale(this._yScale, this._yScale);
        }
      }
    }
  };

  var Alias_Game_CharacterBase_distancePerFrame = Game_CharacterBase.prototype.distancePerFrame;
  Game_CharacterBase.prototype.distancePerFrame = function() {
    var spd = Alias_Game_CharacterBase_distancePerFrame.call(this);
    return spd * this._yScale;
  };

  //-----------------------------------------------------------------------------
  // Sprite_Character

  var Alias_Sprite_Character_update = Sprite_Character.prototype.update;
  Sprite_Character.prototype.update = function() {
    Alias_Sprite_Character_update.call(this);
    if ($gameMap.hasYScale()) {
      this.updateYScale();
    }
  };

  Sprite_Character.prototype.updateYScale = function() {
    if (this._yScale !== this._character._yScale) {
      this.scale.x = this._character._yScale;
      this.scale.y = this._character._yScale;
      this._yScale = this._character._yScale;
    };
  };
})()
