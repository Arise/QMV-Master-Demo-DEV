//=============================================================================
// QSight
//=============================================================================

var Imported = Imported || {};
Imported.QSight = '1.0.0';


if (!Imported.QPlus) {
  var msg = 'Error: QName requires QPlus to work.';
  alert(msg);
  throw new Error(msg);
}

//=============================================================================
 /*:
 * @plugindesc <QSight>
 * desc
 * @author Quxios  | Version 1.0.0
 *
 * @requires QPlus
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
 *   http://forums.rpgmakerweb.com/index.php?threads/qplugins.73023/
 *
 * Terms of use:
 *
 *   https://github.com/quxios/QMV-Master-Demo/blob/master/readme.md
 *
 *
 * Like my plugins? Support me on Patreon!
 *
 *  https://www.patreon.com/quxios
 *
 * @tags character, sight, los
 */
//=============================================================================

//=============================================================================
// QSight

function QSight() {
  throw new Error('This is a static class');
}

(function() {
  QSight._requestUpdate = false;

  QSight.requestUpdate = function() {
    this._requestUpdate = true;
  };

  QSight.clearRequest = function() {
    this._requestUpdate = false;
  };

  QSight.requestingUpdate = function() {
    return this._requestUpdate === true;
  };

  //-----------------------------------------------------------------------------
  // Game_Map

  var Alias_Game_Map_update = Game_Map.prototype.update;
  Game_Map.prototype.update = function(sceneActive) {
    Alias_Game_Map_update.call(this, sceneActive);
    QSight.clearRequest();
  };

  //-----------------------------------------------------------------------------
  // Game_CharacterBase

  var Alias_Game_CharacterBase_initMembers = Game_CharacterBase.prototype.initMembers;
  Game_CharacterBase.prototype.initMembers = function() {
    Alias_Game_CharacterBase_initMembers.call(this);
    this._sight = null;
  };

  var Alias_Game_CharacterBase_update = Game_CharacterBase.prototype.update;
  Game_CharacterBase.prototype.update = function() {
    var prevX = this._realX;
    var prevY = this._realY;
    Alias_Game_CharacterBase_update.call(this);
    if (this._realX !== prevX || this._realY !== prevY) {
      QSight.requestUpdate();
    }
    if (this.sightNeedsUpdate()) {
      this.updateSight();
    }
  };

  Game_CharacterBase.prototype.sightNeedsUpdate = function() {
    if (!this._sight) return false;
    if (Imported.QMovement) {
      if (!this._sight.base) {
        this._sight.base = this.createSightShape(this._sight.shape, this._sight.range);
      }
    }
    var cache = this._sight.cache;
    var target = QPlus.getCharacter(this._sight.target);
    var dx = this._realX - target._realX;
    var dy = this._realY - target._realY;
    var dist = Math.abs(dx) + Math.abs(dy);
    if (dist > this._sight.range + 1) {
      // Target too far away
      return false;
    }
    if (cache.dir !== this._direction) {
      // Direction changed, so sight changes
      return true;
    }
    // Check if anything requested an update
    return QSight.requestingUpdate();
  };

  Game_CharacterBase.prototype.updateSight = function() {
    this.updateSightCache();
    console.log('sight needs update', this.checkSight(this._sight));
  };

  Game_CharacterBase.prototype.updateSightCache = function() {
    this._sight.cache = {
      dir: this._direction
    }
  };

  Game_CharacterBase.prototype.checkSight = function(options) {
    // check if inside shape
    // check if blocked by tiles
    // check if blocked by events
    var target = QPlus.getCharacter(options.target);
    if (!target) return false;
    if (Imported.QMovement) {
      if (!this.isInsideSightShape(target, options)) return false;
      if (this.isInsideTileShadow(target, options)) return false;
      if (this.isInsideEventShadow(target, options)) return false;
    } else {
      // TODO run line cast
    }
    return true;
  };

  if (Imported.QMovement) {
    Game_CharacterBase.prototype.isInsideSightShape = function(target, options) {
      options.base.moveTo(this.cx(), this.cy());
      if (options.base.isPolygon()) {
        var rad;
        if (this._direction === 6) rad = 0;
        if (this._direction === 2) rad = Math.PI / 2;
        if (this._direction === 4) rad = Math.PI;
        if (this._direction === 8) rad = 3 * Math.PI / 2;
        rad -= Math.PI / 2; // Rotate because base shape is facing down
        this._sight.base.setRadian(rad);
      }
      ColliderManager.draw(options.base, 120);
      return options.base.intersects(target.collider('collision'));
    };

    Game_CharacterBase.prototype.isInsideTileShadow = function(target, options) {
      return false;
    };

    Game_CharacterBase.prototype.isInsideEventShadow = function(target, options) {
      return false;
    };

    Game_CharacterBase.prototype.createSightShape = function(shape, range) {
      range *= QMovement.tileSize;
      var collider;
      if (shape === 'circle') {
        collider = new Circle_Collider(range * 2, range * 2);
      } else if (shape === 'box') {
        collider = new Box_Collider(range * 2, range * 2);
      } else if (shape === 'poly') {
        var w = this.collider('collision').width;
        var h = this.collider('collision').height;
        var lw = range - w / 2;
        var lh = range - h / 2;
        var points = [];
        points.push(new Point(0, 0));
        points.push(new Point(lw, lh));
        points.push(new Point(-lw, lh));
        collider = new Polygon_Collider(points);
        var rad = 0;
        if (this._direction === 6) rad = 0;
        if (this._direction === 2) rad = Math.PI / 2;
        if (this._direction === 4) rad = Math.PI;
        if (this._direction === 8) rad = 3 * Math.PI / 2;
        rad -= Math.PI / 2; // Rotate because base shape is facing down
        collider.setRadian(rad);
      }
      collider.moveTo(this.cx(), this.cy());
      return collider;
    };
  }

  //-----------------------------------------------------------------------------
  // Game_Event

  var Alias_Game_Event_setupPage = Game_Event.prototype.setupPage;
  Game_Event.prototype.setupPage = function() {
    Alias_Game_Event_setupPage.call(this);
    var sight = /<sight:(.*?)>/i.exec(this.comments(true));
    if (sight) {
      var options = sight[1].split(',');
      this.setupSight({
        range: Number(options[0]) || 1,
        shape: options[1] || 'cone',
        target: options[2] || '0',
        handler: options[3] || 'A'
      })
    }
  };

  var Alias_Game_Event_clearPageSettings = Game_Event.prototype.clearPageSettings;
  Game_Event.prototype.clearPageSettings = function() {
    Alias_Game_Event_clearPageSettings.call(this);
    this._sight = null;
  };

  Game_Event.prototype.setupSight = function(options) {
    this._sight = {
      range: options.range,
      shape: options.shape,
      target: options.target,
      handler: options.handler,
      cache: {
        events: {},
        tiles: {}
      }
    }
  };
})();
