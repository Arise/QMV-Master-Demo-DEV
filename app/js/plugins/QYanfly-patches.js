//=============================================================================
// QYanfly-patches
//=============================================================================

var Imported = Imported || {};
Imported.QYanflyPatches = '1.0.0';

//=============================================================================
 /*:
 * @plugindesc <QYanfly-patches>
 * Patches for Yanfly plugins and QPlugins
 * @author Quxios  | Version 1.0.0
 *
 * @help
 * Patches for QMovement:
 * - YEP_RegionRestrictions
 * - YEP_SlipperyTiles
 */
//=============================================================================

//=============================================================================
// QYanfly-patches for QMovement

(function() {
  //---------------------------------------------------------------------------
  // Yanfly patches for QMovement

  if (Import.QMovement) {
    //-------------------------------------------------------------------------
    // YEP_RegionRestrictions Patches

    if (Imported.YEP_RegionRestrictions) {
      var Alias_Game_CharacterBase_collidesWithAnyTile = Game_CharacterBase.prototype.collidesWithAnyTile;
      Game_CharacterBase.prototype.collidesWithAnyTile = function(type) {
        var collider = this.collider(type);
        var x = Math.floor(collider.center.x  / QMovement.tileSize);
        var y = Math.floor(collider.center.y  / QMovement.tileSize);
        if (this.isEventRegionForbid(x, y)) return true;
        if (this.isPlayerRegionForbid(x, y)) return true;
        if (!this.isEventRegionAllow(x, y)) return true;
        if (!this.isPlayerRegionAllow(x, y)) return true;
        return Alias_Game_CharacterBase_collidesWithAnyTile.call(this);
      };

      Game_CharacterBase.prototype.getRegionId = function(x, y, d) {
        return $gameMap.regionId(x, y);
      };
    }

    //-------------------------------------------------------------------------
    // YEP_SlipperyTiles Patches

    if (Imported.YEP_SlipperyTiles) {
      Game_CharacterBase.prototype.onSlipperyFloor = function() {
        return $gameMap.isSlippery(this.x, this.y);
      };
    }
  }

})()
