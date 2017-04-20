//=============================================================================
// QM ColliderMap
//=============================================================================

var Imported = Imported || {};
Imported.QMColliderMap = '1.0.0';

if (!Imported.QPlus || !QPlus.versionCheck(Imported.QPlus, '1.1.5')) {
  alert('Error: QM+ColliderMap requires QPlus 1.1.5 or newer to work.');
  throw new Error('Error: QM+ColliderMap requires QPlus 1.1.5 or newer to work.');
} else if (!Imported.QMovement || !QPlus.versionCheck(Imported.QMovement, '1.2.0')) {
  alert('Error: QM+ColliderMap requires QMovement 1.2.0 or newer to work.');
  throw new Error('Error: QM+ColliderMap requires QMovement 1.2.0 or newer to work.');
}

//=============================================================================
 /*:
 * @plugindesc <QMColliderMap>
 * QMovement Addon: Allows you to load colliders to a map from json
 * @author Quxios  | Version 1.0.0
 *
 * @requires QMovement
 *
 * @help
 * ============================================================================
 * ## About
 * ============================================================================
 * This is an addon to QMovement plugin. This addon adds a feature that lets
 * you create a json file that contains a list of colliders for each map.
 * This is not to be confused with CollisionMap addon. CollisionMap lets you
 * use a picture for collisions, while ColliderMap lets you create colliders
 * that are placed on the map.
 * ============================================================================
 * ## How to use
 * ============================================================================
 * Create a json file called `ColliderMap.json` inside the data folder.
 * Once that file is made you'll need to set up the file
 * ----------------------------------------------------------------------------
 * **Setting up**
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
// QM ColliderMap

(function() {
  var _PROPS = [
    'note',
    'isTile', 'terrain', 'color',
    'isWater1', 'isWater2',
    'isLadder', 'isBush', 'isCounter', 'isDamage'
  ]

  QPlus.request('data/ColliderMap.json')
    .onSuccess(function(json) {
      QMovement.colliderMap = json;
    })
    .onError(function() {
      QMovement.colliderMap = {};
      alert('Failed to load ' + this.url);
    })

  //-----------------------------------------------------------------------------
  // Game_Map

  var Alias_Game_Map_reloadTileMap = Game_Map.prototype.reloadTileMap;
  Game_Map.prototype.reloadTileMap = function() {
    Alias_Game_Map_reloadTileMap.call(this);
    this.setupColliderMap();
  };

  Game_Map.prototype.setupColliderMap = function() {
    var colliders = QMovement.colliderMap[this._mapId];
    if (!colliders) return;
    for (var i = 0; i < colliders.length; i++) {
      var data = colliders[i];
      if (!data) continue;
      var collider;
      var w = data.width;
      var h = data.height;
      var points = data.points;
      var ox = data.ox || 0;
      var oy = data.oy || 0;
      var x = data.x || 0;
      var y = data.y || 0;
      var type = data.type;
      if (type === 'circle' || type === 'box') {
        if (w === undefined || h === undefined) continue;
        if (w === 0 || h === 0) continue;
        if (type === 'circle') {
          collider = new Circle_Collider(w, h, ox, oy);
        } else {
          collider = new Box_Collider(w, h, ox, oy);
        }
        collider.moveTo(x, y);
      } else if (type === 'poly') {
        if (points === undefined) continue;
        collider = new Polygon_Collider(points, x, y);
      } else {
        continue;
      }
      for (var j = 0; j < _PROPS.length; j++) {
        var prop = data[_PROPS[j]];
        if (prop !== undefined) {
          collider[_PROPS[j]] = prop;
        }
      }
      ColliderManager.addCollider(collider, -1);
    }
  };
})()
