//=============================================================================
// QSight DEV
//=============================================================================

var Imported = Imported || {};
Imported.QSight = '1.0.0';

if (!Imported.QPlus) {
  alert('Error: QSight requires QPlus to work.');
  throw new Error('Error: QSight requires QPlus to work.');
} if (Imported.QMovement && !QPlus.versionCheck(Imported.QMovement, '1.1.1')) {
  alert('Error: QSight requires QMovement 1.1.1+ to work.');
  throw new Error('Error: QSight requires QMovement 1.1.1+ to work.');
}

//=============================================================================
 /*:
 * @plugindesc <QSight>
 * Real time line of sight
 * @author Quxios  | Version 1.0.0
 *
 * @development
 *
 * @requires QPlus
 *
 * @video
 *
 * @param Show
 * @desc Set this to true to show sight and shadows
 * When true, it will only appear during playtest
 * @default false
 *
 * @help
 * ============================================================================
 * ## About
 * ============================================================================
 * This plugin lets you add real time line of sight to characters. A line of
 * sight is similar to a sensor plugin, except characters can't see behind
 * objects that block their view.
 *
 * This plugin has built in compatibilty for QMovement. When using QMovement
 * the line of sight will be more accurate since it'll use a shadow casting
 * algorithm. When not using QMovement it'll use a simple ray casting.
 * ============================================================================
 * ## How to use
 * ============================================================================
 * **Sight Notetag / Comment**
 * ----------------------------------------------------------------------------
 * To give an event sight, add a note or comment in the following format:
 * ~~~
 *  <sight:SHAPE,RANGE,SWITCH,TARGET>
 * ~~~
 * - SHAPE  - box, circle or poly
 * - RANGE  - How far the character can see, in grid spaces
 * - SWITCH - Which switch to toggle. Set to a number or A, B, C, D for self switch
 * - TARGET(Optional) - Set to the CHARAID of who to look for. Default: 0
 *
 * CHARAID - The character identifier.
 *  - For player: 0, p, or player
 *  - For events: EVENTID, eEVENTID, or eventEVENTID (replace EVENTID with a number)
 *
 * * Note: Notes are applied to all the pages in the event, comments are page based.
 * ----------------------------------------------------------------------------
 * **Sight examples**
 * ----------------------------------------------------------------------------
 * Here's an example of a poly sight with a range of 6 and toggles self switch A
 * ~~~
 *  <sight:poly,6,A>
 * ~~~
 *
 * Here's an example of a circle sight with a range of 4 and toggles switch 1
 * ~~~
 *  <sight:circle,4,1>
 * ~~~
 *
 * * Note: I left out TARGET because it defaults to player
 * ----------------------------------------------------------------------------
 * **See through events/tiles**
 * ----------------------------------------------------------------------------
 * To make an event see through add the following note or comment:
 * ~~~
 *  <invisible>
 * ~~~
 * * Note: Notes are applied to all the pages in the event, comments are page based.
 *
 * For events;
 * Set the tile's terrain id to the no shadow terrain id set in the plugin
 * parameters.
 * When using QMovement and QM+RegionColliders, create a RegionCollider and
 * add the following in the note:
 * ~~~
 *  <noShadow>
 * ~~~
 * ============================================================================
 * ## Plugin Commands
 * ============================================================================
 * **Check sight**
 * ----------------------------------------------------------------------------
 * TODO
 * ~~~
 *  qSight CHARAID check SHAPE RANGE SWITCH TARGETID
 * ~~~
 * ----------------------------------------------------------------------------
 * **Toggle charcter invisible**
 * ----------------------------------------------------------------------------
 * TODO
 * ~~~
 *  qSight CHARAID visible BOOL
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
  var _params = QPlus.getParams('<QSight>');
  var _show = _params['Show'] === 'true';

  QSight._requestingUpdate = [];

  QSight.requestUpdate = function(charaId) {
    if (this._requestingUpdate.indexOf(charaId) === -1) {
      this._requestingUpdate.push(charaId);
    }
  };

  QSight.clearRequest = function() {
    this._requestingUpdate = [];
  };

  QSight.requestingUpdate = function() {
    return this._requestingUpdate.length > 0
  };

  if (Imported.QMovement) {
    QSight.shadowCast = function(collider, from, length) {
      var radians = [];
      var points = [];
      var vertices = collider._vertices;
      var i, j;
      for (i = 0, j = vertices.length; i < j; i++) {
        var x1 = vertices[i].x;
        var y1 = vertices[i].y;
        var point = new Point(x1, y1);
        var radian = Math.atan2(y1 - from.cy(), x1 - from.cx());
        radian += radian < 0 ? 2 * Math.PI : 0;
        radians.push(radian);
        points.push(point);
      }
      var min = radians[0];
      var max = radians[0];
      var minI = 0;
      var maxI = 0;
      for (i = 1, j = radians.length; i < j; i++) {
        if (min > radians[i]) {
          min = radians[i];
          minI = i;
        }
        if (max < radians[i]) {
          max = radians[i];
          maxI = i;
        }
      }
      // TODO figure out a better way tol calc the radians
      // so I don't need to "fix" the min/max values
      if (Math.abs(max - min) > Math.PI) {
        min = 0;
        max = 0;
        minI = 0;
        maxI = 0;
        for (i = 0, j = radians.length; i < j; i++) {
          if (radians[i] > Math.PI) {
            radians[i] -= 2 * Math.PI;
          }
          if (min > radians[i]) {
            min = radians[i];
            minI = i;
          }
          if (max < radians[i]) {
            max = radians[i];
            maxI = i;
          }
        }
      }
      var l = length * 1.5;
      var x1 = points[maxI].x - points[minI].x;
      var y1 = points[maxI].y - points[minI].y;
      var x2 = x1 + l * Math.cos(max);
      var y2 = y1 + l * Math.sin(max);
      var x3 = l * Math.cos(min);
      var y3 = l * Math.sin(min);
      var polyPoints = [];
      polyPoints.push(new Point(0, 0));
      polyPoints.push(new Point(x1, y1));
      polyPoints.push(new Point(x2, y2));
      polyPoints.push(new Point(x3, y3));
      return {
        points: polyPoints,
        origin: new Point(points[minI].x, points[minI].y)
      }
      /*
      // New Method that outlines object, casting the shadow
      // behind the object instead.
      // Not enabled for now because it's most likely more
      // performant and not needed. Though if you are to create
      // a lighting system with shadows and want to use this shadow
      // casting function, then you should use the bottom method
      // instead.
      var minIndex = points.indexOf(radianWithPoint[min]);
      var firstHalf = points.splice(0, minIndex);
      points = points.concat(firstHalf);
      finalPoints = [];
      midPoints = [];
      points.reverse();
      var first = points.pop();
      points.unshift(first);
      var x, y, dx, dy, rad;
      var l = settings.length;
      for (i = 0, j = points.length; i < j; i++) {
        x = points[i].x - radianWithPoint[min].x;
        y = points[i].y - radianWithPoint[min].y;
        finalPoints.push(new Point(x, y));
        if (points[i] === radianWithPoint[max]) {
          break;
        } else if (points[i] !== radianWithPoint[min]) {
          rad =  pointWithRadian[JSON.stringify(points[i])]
          dx = points[i].x - radianWithPoint[min].x;
          dy = points[i].y - radianWithPoint[min].y;
          x = dx + l * Math.cos(rad);
          y = dy + l * -Math.sin(rad);
          midPoints.push(new Point(x, y));
        }
      }
      var x1 = radianWithPoint[max].x - radianWithPoint[min].x;
      var y1 = radianWithPoint[max].y - radianWithPoint[min].y;
      var x2 = x1 + l * Math.cos(max);
      var y2 = y1 + l * -Math.sin(max);
      var x3 = l * Math.cos(min);
      var y3 = l * -Math.sin(min);
      finalPoints.push(new Point(x2, y2));
      finalPoints = finalPoints.concat(midPoints.reverse());
      finalPoints.push(new Point(x3, y3));
      return [finalPoints, radianWithPoint[min].x, radianWithPoint[min].y];
      */
    };
  }

  //-----------------------------------------------------------------------------
  // Game_Interpreter
  //
  // The interpreter for running event commands.

  var Alias_Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
  Game_Interpreter.prototype.pluginCommand = function(command, args) {
    if (command.toLowerCase() === 'qsight') {
      return this.qSightCommand(args);
    }
    Alias_Game_Interpreter_pluginCommand.call(this, command, args);
  };

  Game_Interpreter.prototype.qSightCommand = function(args) {
    var chara;
    if (args[0].toLowerCase() === 'this') {
      chara = this.character(0);
    } else {
      chara = QPlus.getCharacter(args[0]);
    }
    var args2 = args.slice(1);
    if (!chara) return;
    //QPlus.getArg(args2, /lock/i)
    if (args2[0].toLowerCase() === 'invisible') {
      chara._invisible = args2[1].toLowerCase() === 'true';
      return;
    }
    if (args2[0].toLowerCase() === 'check') {
      var shape = args2[1];
      var range = Number(args[2]);
      var handler = args[3];
      var target = args[4] || 0;
      if (target === 'this') {
        target = this.character(0).charaId();
      }
      var canSee = chara.checkSight({
        shape: shape,
        range: range,
        targetId: target
      })
      if (/^[0-9]+$/.test(handler)) {
        $gameSwitches.setValue(Number(handler), canSee);
      } else if (chara.constructor === Game_Event) {
        var key = [chara._mapId, chara._eventId, handler];
        $gameSelfSwitches.setValue(key, canSee);
      }
      return canSee;
    }
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
    this._invisible = false;
  };

  var Alias_Game_CharacterBase_update = Game_CharacterBase.prototype.update;
  Game_CharacterBase.prototype.update = function() {
    var prevX = this._realX;
    var prevY = this._realY;
    Alias_Game_CharacterBase_update.call(this);
    if (this._realX !== prevX || this._realY !== prevY) {
      QSight.requestUpdate(this.charaId());
    }
    if (this.sightNeedsUpdate()) {
      this.updateSight();
    }
  };

  Game_CharacterBase.prototype.sightNeedsUpdate = function() {
    if (!this._sight) return false;
    var cache = this._sight.cache;
    var target = QPlus.getCharacter(this._sight.targetId);
    var dx = this._realX - target._realX;
    var dy = this._realY - target._realY;
    if (Math.abs(dx) > this._sight.range + 1 ||  Math.abs(dy) > this._sight.range + 1) {
      // Target too far away
      return false;
    }
    if (cache.dir !== this._direction) {
      // Direction changed, so sight changes
      return true;
    }
    // Check if anything requested an update
    if (QSight.requestingUpdate()) {
      // something moved, so reshape shadows
      // TODO only reshape if w.e. moved was close
      var needsUpdate = false;
      var requests = QSight._requestingUpdate;
      for (var i = 0; i < requests.length; i++) {
        if (requests[i] === this.charaId()) {
          // reshape all
          this._sight.reshape = true;
          return true;
        }
        var chara = QPlus.getCharacter(requests[i]);
        if (!chara) continue;
        dx = this._realX - chara._realX;
        dy = this._realY - chara._realY;
        if (Math.abs(dx) <= this._sight.range + 1 &&  Math.abs(dy) <= this._sight.range + 1) {
          needsUpdate = true;
          if (this._sight.cache.events[requests[i]]) {
            this._sight.cache.events[requests[i]].reshape = true;
          }
        }
      }
      return needsUpdate;
    }
    return false;
  };

  Game_CharacterBase.prototype.updateSight = function() {
    this.updateSightCache();
    var canSee = this.checkSight(this._sight);
    var handler = this._sight.handler;
    if (handler) {
      if (/^[0-9]+$/.test(handler)) {
        $gameSwitches.setValue(Number(handler), canSee);
      } else if (this.constructor === Game_Event) {
        var key = [this._mapId, this._eventId, handler];
        $gameSelfSwitches.setValue(key, canSee);
      }
    }
    this._sight.reshape = false;
  };

  Game_CharacterBase.prototype.updateSightCache = function() {
    this._sight.cache = {
      dir: this._direction,
      tiles: this._sight.cache.tiles,
      events: this._sight.cache.events
    }
  };

  // options is an obj that needs the following props:
  //  shape [String] - box, circle or poly
  //  range [Number] - range of sight in tiles
  //  targetId [String] - charaId of who to look for
  Game_CharacterBase.prototype.checkSight = function(options) {
    var target = QPlus.getCharacter(options.targetId);
    if (!target) return false;
    if (Imported.QMovement) {
      if (!options.cache) {
        options.cache = {
          tiles: {},
          events: {}
        }
      }
      if (!options.base) {
        options.base = this.createSightShape(options.shape, options.range);
      }
      options.base.moveTo(this.cx(), this.cy());
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
      if (options.base.isPolygon()) {
        var rad = this._radian;
        rad -= Math.PI / 2; // Rotate because base shape is facing down
        this._sight.base.setRadian(rad);
      }
      if (options.base.intersects(target.collider('collision'))) {
        if (_show) {
          ColliderManager.draw(options.base, 120);
        }
        return true;
      }
      return false;
    };

    Game_CharacterBase.prototype.isInsideTileShadow = function(target, options) {
      var inside = false;
      var tileIds = [];
      ColliderManager.getCollidersNear(options.base, function(tile) {
        if (!tile.isTile) return false;
        if (tileIds.contains(tile.id)) return false;
        if (tile.width === 0 || tile.height === 0) {
          return false;
        }
        if (tile.isLadder || tile.isBush || tile.isDamage) {
          return false;
        }
        if (/<noshadow>/i.test(tile.note)) {
          return false;
        }
        if (tile.intersects(options.base)) {
          var shadowData;
          var shadow;
          if (!options.cache.tiles[tile.id]) {
            shadowData = QSight.shadowCast(tile, this, options.range * QMovement.tileSize);
            shadow = new Polygon_Collider(shadowData.points);
            shadow.moveTo(shadowData.origin.x, shadowData.origin.y);
            shadow.color = "#000000";
            options.cache.tiles[tile.id] = shadow;
            tileIds.push(tile.id);
          } else {
            shadow = options.cache.tiles[tile.id];
            if (options.reshape) {
              var oldId = shadow.id;
              shadowData = QSight.shadowCast(tile, this, options.range * QMovement.tileSize);
              shadow.initialize(shadowData.points);
              shadow.moveTo(shadowData.origin.x, shadowData.origin.y);
              shadow.id = oldId;
            }
            tileIds.push(tile.id);
          }
          if (shadow.containsPoint(target.cx(), target.cy())) {
            inside = true;
            if (_show) {
              ColliderManager.draw(shadow, 120);
            }
            return 'break';
          } else {
            shadow.kill = true;
          }
          return false;
        }
      }.bind(this));
      // TODO filter out tiles in the cache that are no longer in the sight?
      return inside;
    };

    Game_CharacterBase.prototype.isInsideEventShadow = function(target, options) {
      var inside = false;
      var charaIds = [];
      ColliderManager.getCharactersNear(options.base, function(chara) {
        var charaId = chara.charaId();
        if (charaIds.contains(charaId)) return false;
        if (chara === this || chara === target || chara.constructor !== Game_Event) {
          return false;
        }
        if (!chara.castsShadow()) {
          return false;
        }
        var collider = chara.collider('collision');
        if (collider.intersects(options.base)) {
          var shadowData;
          var shadow;
          if (!options.cache.events[charaId]) {
            shadowData = QSight.shadowCast(collider, this, options.range * QMovement.tileSize);
            shadow = new Polygon_Collider(shadowData.points);
            shadow.moveTo(shadowData.origin.x, shadowData.origin.y);
            shadow.color = "#000000";
            options.cache.events[charaId] = shadow;
            charaIds.push(charaId);
          } else {
            shadow = options.cache.events[charaId];
            if (options.reshape || shadow.reshape) {
              var oldId = shadow.id;
              shadowData = QSight.shadowCast(collider, this, options.range * QMovement.tileSize);
              shadow.initialize(shadowData.points);
              shadow.moveTo(shadowData.origin.x, shadowData.origin.y);
              shadow.id = oldId;
            }
            charaIds.push(charaId);
          }
          if (shadow.containsPoint(target.cx(), target.cy())) {
            inside = true;
            if (_show) {
              ColliderManager.draw(shadow, 120);
            }
            return 'break';
          } else {
            shadow.kill = true;
          }
          return false;
        }
      }.bind(this));
      // TODO filter out characters in the cache that are no longer in the sight?
      return inside;
    };

    Game_CharacterBase.prototype.createSightShape = function(shape, range) {
      range *= QMovement.tileSize;
      var collider;
      if (shape === 'circle') {
        collider = new Circle_Collider(range * 2, range * 2, -range, -range);
      } else if (shape === 'box') {
        collider = new Box_Collider(range * 2, range * 2, -range, -range);
      // TODO add a line shape ?
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
        var rad = this._radian;
        rad -= Math.PI / 2; // Rotate because base shape is facing down
        collider.setRadian(rad);
      }
      collider.moveTo(this.cx(), this.cy());
      return collider;
    };
  }

  Game_CharacterBase.prototype.castsShadow = function() {
    return !this._invisible;
  };

  //-----------------------------------------------------------------------------
  // Game_Event

  var Alias_Game_Event_setupPage = Game_Event.prototype.setupPage;
  Game_Event.prototype.setupPage = function() {
    Alias_Game_Event_setupPage.call(this);
    var sight = /<sight:(.*?)>/i.exec(this.comments(true));
    if (sight) {
      var options = sight[1].split(',');
      this.setupSight({
        shape: options[0].toLowerCase() || 'poly',
        range: Number(options[1]) || 1,
        handler: options[2] || 'ssA',
        targetId: options[3] || '0'
      })
    }
    this._invisible = /<invisible>/i.test(this.comments(true));
  };

  var Alias_Game_Event_clearPageSettings = Game_Event.prototype.clearPageSettings;
  Game_Event.prototype.clearPageSettings = function() {
    Alias_Game_Event_clearPageSettings.call(this);
    this._sight = null;
  };

  Game_Event.prototype.setupSight = function(options) {
    var cache = {
      dir: 0,
      events: {},
      tiles: {}
    }
    if (this._sight) {
      this._sight.base.kill = true;
      // TODO should I kill the cache?
      cache.tiles = this._sight.cache.tiles;
      cache.events = this._sight.cache.events;
    }
    this._sight = {
      shape: options.shape,
      range: options.range,
      handler: options.handler,
      targetId: options.targetId,
      cache: cache
    }
  };
})();
