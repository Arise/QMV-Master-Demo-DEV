//=============================================================================
// QName
//=============================================================================

var Imported = Imported || {};
Imported.QName = '1.0.0';

if (!Imported.QPlus) {
  var msg = 'Error: QName requires QPlus to work.';
  alert(msg);
  throw new Error(msg);
}

//=============================================================================
 /*:
 * @plugindesc <QName>
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
// QName

(function() {
  //-----------------------------------------------------------------------------
  // Game_Map

  var Alias_Game_Map_setup = Game_Map.prototype.setup;
  Game_Map.prototype.setup = function(mapId) {
    Alias_Game_Map_setup.call(this, mapId);
    this._hasZoomDepth = null;
  };

  Game_Map.prototype.hasZoomDepth = function() {
    if (this._hasZoomDepth === null) {
      var meta = $dataMap.meta.scale;
      if (meta) {
        this._hasZoomDepth = meta.split(',').map(Number);
      } else {
        this._hasZoomDepth = false;
      }
    }
    return this._hasZoomDepth;
  };

  //-----------------------------------------------------------------------------
  // Game_CharacterBase

  var Alias_Game_CharacterBase_initMembers = Game_CharacterBase.prototype.initMembers;
  Game_CharacterBase.prototype.initMembers = function() {
    Alias_Game_CharacterBase_initMembers.call(this);
    this._zoomDepth = 1;
  }

  var Alias_Game_CharacterBase_update = Game_CharacterBase.prototype.update;
  Game_CharacterBase.prototype.update = function() {
    var oldY = this._realY;
    Alias_Game_CharacterBase_update.call(this);
    if ($gameMap.hasZoomDepth() && this._realY !== oldY) {
      this.updateZoomDepth();
    }
  };

  Game_CharacterBase.prototype.updateZoomDepth = function() {
    var scale = $gameMap.hasZoomDepth();
    var scaleMin = scale[0];
    var scaleMax = scale[1];
    var ds = scaleMax - scaleMin;
    var yMax = $gameMap.height() - 1;
    var dy = (yMax - this._realY) / yMax;
    this._zoomDepth = scaleMax - dy * ds
  };

  var Alias_Game_CharacterBase_distancePerFrame = Game_CharacterBase.prototype.distancePerFrame;
  Game_CharacterBase.prototype.distancePerFrame = function() {
    var spd = Alias_Game_CharacterBase_distancePerFrame.call(this);
    return spd * this._zoomDepth;
  };

  //-----------------------------------------------------------------------------
  // Sprite_Character

  var Alias_Sprite_Character_update = Sprite_Character.prototype.update;
  Sprite_Character.prototype.update = function() {
    Alias_Sprite_Character_update.call(this);
    if ($gameMap.hasZoomDepth()) {
      this.updateZoomDepth();
    }
  };

  Sprite_Character.prototype.updateZoomDepth = function() {
    if (this._zoomDepth !== this._character._zoomDepth) {
      this.scale.x = this._character._zoomDepth;
      this.scale.y = this._character._zoomDepth;
      this._zoomDepth = this._character._zoomDepth;
    };
  };
})()
