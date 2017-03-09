//=============================================================================
// QM RegionColliders
//=============================================================================

var Imported = Imported || {};
Imported.QMRegionColliders = '1.0.0';

if (!Imported.QMovement) {
  var msg = 'Error: QM+RegionColliders requires QMovement to work.';
  alert(msg);
  throw new Error(msg);
} else if (!QPlus.versionCheck(Imported.QMovement, '1.1.0')) {
  var msg = 'Error: QM+RegionColliders requires QPlus 1.1.0 or newer to work.';
  alert(msg);
  throw new Error(msg);
}

//=============================================================================
 /*:
 * @plugindesc <QMRegionColliders>
 * QMovement Addon: Allows you to add colliders on regions
 * @author Quxios  | Version 1.0.0
 *
 * @requires QMovement
 *
 * @video
 *
 * @param
 * @desc
 * @default
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
 * @tags QM-Addon, collision
 */
//=============================================================================

//=============================================================================
// QM RegionColliders

(function() {
  var _params = QPlus.getParams('<QMRegionColliders>');
  var _src = 'data/RegionColliders.json'

  function onSuccess(json) {
    QMovement.regionColliders = json;
  };

  function onError(err) {
    alert("Failed to load 'data/RegionColliders.json'");
  };

  QPlus.request(_src, onSuccess, onError);
})()
