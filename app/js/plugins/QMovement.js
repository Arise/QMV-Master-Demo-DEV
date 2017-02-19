//=============================================================================
// QMovement
//=============================================================================

var Imported = Imported || {};
Imported.QMovement = '0.1.0';

if (!Imported.QPlus) {
  var msg = 'Error: QMovement requires QPlus to work.';
  alert(msg);
  throw new Error(msg);
}

//=============================================================================
 /*:
 * @plugindesc <QMovement>
 * Development
 * @author Quxios  | Version 0.1.0
 *
 * @requires QPlus
 *
 * @param Grid
 * @desc The amount of pixels you want to move per Movement.
 * Plugin Default: 1   MV Default: 48
 * @default 1
 *
 * @param Tile Size
 * @desc Size of tiles in pixels
 * Default: 48
 * @default 48
 *
 * @param Off Grid
 * @desc Allow characters to move off grid?
 * Set to true to enable, false to disable
 * @default true
 *
 * @param =================
 * @desc spacer
 * @default
 *
 * @param Smart Move
 * @desc If the move didn't succeed, try again at lower speeds.
 * 0: Disabled  1: Speed  2: Dir  3: Speed & Dir
 * @default 2
 *
 * @param Mid Pass
 * @desc An extra collision check for the midpoint of the Movement.
 * Set to true to enable, false to disable
 * @default false
 *
 * @param Diagonal
 * @desc Allow for diagonal movement?
 * Set to true or false
 * @default true
 *
 * @param Diagonal Speed
 * @desc Adjust the speed when moving diagonal.
 * Default: 0 TODO not functional
 * @default 0
 *
 * @param =================
 * @desc spacer
 * @default
 *
 * @param Player Collider
 * @desc Default player collider.
 * type width, height, ox, oy
 * @default box, 36, 24, 6, 24
 *
 * @param Event Collider
 * @desc Default event collider.
 * type width, height, ox, oy
 * @default box, 36, 24, 6, 24
 *
 * @param =================
 * @desc spacer
 * @default
 *
 * @param Show Colliders
 * @desc Show the Box Colliders by default during testing.
 * Set to true or false      -Toggle on/off with F10 during play test
 * @default true
 *
 * @video
 *
 * @help
 * ============================================================================
 * ## About
 * ============================================================================
 * This plugin completely rewrites the collision system to use colliders. Using
 * colliders enabled more accurate collision checking with dealing with pixel
 * movement. This plugin also lets you change how many pixels the characters
 * move per step, letting you set up a 24x24 movement or a 1x1 (pixel movement)
 *
 * --DEVELOPMENT VERSION
 * ============================================================================
 * ## How to use
 * ============================================================================
 * TODO
 * ============================================================================
 * ## Colliders
 * ============================================================================
 * There are 3 types of colliders; Polygon, Box and Circle. Though you can only
 * create box and circle colliders, unless you modify the code to accept
 * polygons. This is intentional since polygon would be "harder" to setup.
 *
 * ![Colliders Image](https://quxios.github.io/imgs/qmovement/colliders.png)
 *
 * - Boxes takes in width, height, offset x and offset y
 * - Circles similar to boxes, takes in width, height, offset x and offset y
 * ----------------------------------------------------------------------------
 * **Setting up colliders**
 * ----------------------------------------------------------------------------
 * Colliders are setup inside the Players notebox or as a comment inside an
 * Events page. Events colliders depends it's page, so you may need to make the
 * collider on all pages.
 *
 * There are two ways to setup colliders. using `<collider:-,-,-,->` and using
 * `<colliders>-</colliders>`. The first method sets the 'Default' collider for
 * that character. The second one you create the colliders for every collider
 * type.
 * ----------------------------------------------------------------------------
 * **Collider Types**
 * ----------------------------------------------------------------------------
 * There are 3 collider types. Default, Collision and Interaction.
 * - Default: This is the collider to use if collider type that was called was
 * not found
 * - Collision: This collider is used for collision checking
 * - Interaction: This collider is used for checking interaction.
 * ============================================================================
 * ## Collider Terms
 * ============================================================================
 * ![Colliders Terms Image](https://quxios.github.io/imgs/qmovement/colliderInfo.png)
 * ----------------------------------------------------------------------------
 * **Collider Notetag**
 * ----------------------------------------------------------------------------
 * ~~~
 * <collider: shape, width, height, ox, oy>
 * ~~~
 * This notetag sets all collider types to these values.
 * - Shape: Set to box or circle
 * - Width: The width of the collider
 * - Height: The height of the collider
 * - OX: The x offset value of the collider
 * - OY: The y offset value of the collider
 * ----------------------------------------------------------------------------
 * **Colliders Notetag**
 * ----------------------------------------------------------------------------
 * ~~~
 * <colliders>
 * type: shape, width, height, ox, oy
 * </colliders>
 * ~~~
 * This notetag sets all collider types to these values.
 * - Type: The type of collider, set to default, collision or interaction
 * - Shape: Set to box or circle
 * - Width: The width of the collider
 * - Height: The height of the collider
 * - OX: The x offset value of the collider
 * - OY: The y offset value of the collider
 *
 * To add another type, just add `type: shape, width, height, ox, oy` on
 * another line.
 *
 * Example:
 * ~~~
 * <colliders>
 * default: box, 48, 48
 * collision: circle, 24, 24, 12, 12
 * interaction: box: 32, 32, 8, 8
 * </colliders>
 * ~~~
 * ============================================================================
 * ## Move Routes
 * ============================================================================
 * TODO
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
// QMovement Static Class

function QMovement() {
  throw new Error('This is a static class');
}

(function() {
  var _params = QPlus.getParams('<QMovement>');

  QMovement.grid = Number(_params['Grid']) || 1;
  QMovement.tileSize = Number(_params['Tile Size'])
  QMovement.offGrid = _params['Off Grid'] === 'true';
  QMovement.smartMove = Number(_params['Smart Move']);
  QMovement.midPass = _params['Mid Pass'] === 'true';
  QMovement.diagonal = _params['Diagonal'] === 'true';
  QMovement.collision = '#FF0000';
  QMovement.water1 = '#00FF00';
  QMovement.water2 = '#0000FF';
  QMovement.playerCollider = _params['Player Collider'];
  QMovement.eventCollider = _params['Player Collider'];
  QMovement.showColliders = _params['Show Colliders'] === 'true';
  QMovement.tileBoxes = {
    1537: [48, 6, 0, 42],
    1538: [6, 48],
    1539: [[48, 6, 0, 42], [6, 48]],
    1540: [6, 48, 42],
    1541: [[48, 6, 0, 42], [6, 48, 42]],
    1542: [[6, 48], [6, 48, 42]],
    1543: [[48, 6, 0, 42], [6, 48], [6, 48, 42]],
    1544: [48, 6],
    1545: [[48, 6], [48, 6, 0, 42]],
    1546: [[48, 6], [6, 48]],
    1547: [[48, 6], [48, 6, 0, 42], [6, 48]],
    1548: [[48, 6], [6, 48, 42]],
    1549: [[48, 6], [48, 6, 0, 42], [6, 48, 42]],
    1550: [[48, 6], [6, 48], [6, 48, 42]],
    1551: [48, 48], // Impassable A5, B
    2063: [48, 48], // Impassable A1
    2575: [48, 48],
    3586: [6, 48],
    3588: [6, 48, 42],
    3590: [[6, 48], [6, 48, 42]],
    3592: [48, 6],
    3594: [[48, 6], [6, 48]],
    3596: [[48, 6], [6, 48, 42]],
    3598: [[48, 6], [6, 48], [6, 48, 42]],
    3599: [48, 48],  // Impassable A2, A3, A4
    3727: [48, 48]
  };
  QMovement.regionBoxes = {};
})();

//=============================================================================
// Colliders

//-----------------------------------------------------------------------------
// Polygon_Collider

function Polygon_Collider() {
  this.initialize.apply(this, arguments);
}

(function() {
  Polygon_Collider._counter = 0;

  Polygon_Collider.prototype.initialize = function(points) {
    this._position = new Point(0, 0);
    this._scale = new Point(1, 1);
    this._offset = new Point(0, 0);
    this._pivot = new Point(0, 0);
    this._radian = 0;
    this.id = Polygon_Collider._counter++;
    this.makeVertices(points);
  };

  Object.defineProperty(Polygon_Collider.prototype, 'x', {
    get() {
      return this._position.x;
    },
    set(x) {
      this._position.x = x;
    }
  });

  Object.defineProperty(Polygon_Collider.prototype, 'y', {
    get() {
      return this._position.y;
    },
    set(y) {
      this._position.y = y;
    }
  });

  Object.defineProperty(Polygon_Collider.prototype, 'ox', {
    get() {
      return this._offset.x + this._pivot.x;1
    }
  });

  Object.defineProperty(Polygon_Collider.prototype, 'oy', {
    get() {
      return this._offset.y + this._pivot.y;
    }
  });

  Polygon_Collider.prototype.isPolygon = function() {
    return true;
  };

  Polygon_Collider.prototype.isBox = function() {
    return true;
  };

  Polygon_Collider.prototype.isCircle = function() {
    return false;
  };

  Polygon_Collider.prototype.makeVertices = function(points) {
    this._vertices = [];
    this._baseVertices = [];
    for (var i = 0; i < points.length; i++) {
      var x = points[i].x;
      var y = points[i].y;
      this._vertices.push(new Point(x, y));
      this._baseVertices.push(new Point(x, y));
    }
    this.makeVectors();
    this.refreshVertices();
  };

  Polygon_Collider.prototype.makeVectors = function() {
    this._vectors = this._baseVertices.map((function (vertex) {
      var dx = vertex.x - this._pivot.x;
      var dy = vertex.y - this._pivot.y;
      var radian = Math.atan2(dy, dx);
      radian += radian < 0 ? Math.PI * 2 : 0;
      var dist = Math.sqrt(dx * dx + dy * dy);
      return { radian, dist };
    }).bind(this));
  };

  Polygon_Collider.prototype.setBounds = function() {
    this._xMin = null;
    this._xMax = null;
    this._yMin = null;
    this._yMax = null;
    for (var i = 0; i < this._baseVertices.length; i++) {
      var x = this._baseVertices[i].x;
      var y = this._baseVertices[i].y;
      if (this._xMin === null || this._xMin > x) {
        this._xMin = x;
      }
      if (this._xMax === null || this._xMax < x) {
        this._xMax = x;
      }
      if (this._yMin === null || this._yMin > y) {
        this._yMin = y;
      }
      if (this._yMax === null || this._yMax < y) {
        this._yMax = y;
      }
    }
    this.width = Math.abs(this._xMax - this._xMin);
    this.height = Math.abs(this._yMax - this._yMin);
    var x1 = this._xMin + this.x + this.ox;
    var y1 = this._yMin + this.y + this.oy;
    this.center = new Point(x1 + this.width / 2, y1 + this.height / 2);
  };

  Polygon_Collider.prototype.refreshVertices = function() {
    var i, j;
    for (i = 0, j = this._vertices.length; i < j; i++) {
      var vertex = this._vertices[i];
      vertex.x = this.x + this._baseVertices[i].x + this.ox;
      vertex.y = this.y + this._baseVertices[i].y + this.oy;
    }
    this.setBounds();
  };

  Polygon_Collider.prototype.sectorEdge = function() {
    var x1 = this._xMin + this.x + this.ox;
    var x2 = this._xMax + this.x + this.ox - 1;
    var y1 = this._yMin + this.y + this.oy;
    var y2 = this._yMax + this.y + this.oy - 1;
    x1 = Math.floor(x1 / ColliderManager._sectorSize);
    x2 = Math.floor(x2 / ColliderManager._sectorSize);
    y1 = Math.floor(y1 / ColliderManager._sectorSize);
    y2 = Math.floor(y2 / ColliderManager._sectorSize);
    return {
      x1: x1, x2: x2,
      y1: y1, y2: y2
    }
  };

  Polygon_Collider.prototype.gridEdge = function() {
    var x1 = this._xMin + this.x + this.ox;
    var x2 = this._xMax + this.x + this.ox;
    var y1 = this._yMin + this.y + this.oy;
    var y2 = this._yMax + this.y + this.oy;
    x1 = Math.floor(x1 / QMovement.tileSize);
    x2 = Math.floor(x2 / QMovement.tileSize);
    y1 = Math.floor(y1 / QMovement.tileSize);
    y2 = Math.floor(y2 / QMovement.tileSize);
    return {
      x1: x1, x2: x2,
      y1: y1, y2: y2
    }
  };

  Polygon_Collider.prototype.edge = function() {
    var x1 = this._xMin + this.x + this.ox;
    var x2 = this._xMax + this.x + this.ox;
    var y1 = this._yMin + this.y + this.oy;
    var y2 = this._yMax + this.y + this.oy;
    return {
      x1: x1, x2: x2,
      y1: y1, y2: y2
    }
  };

  Polygon_Collider.prototype.setPivot = function(x, y) {
    this._pivot.x = x;
    this._pivot.y = y;
    this.makeVectors();
    this.refreshVertices();
  };

  Polygon_Collider.prototype.centerPivot = function() {
    this._pivot.x = this.width / 2;
    this._pivot.y = this.height / 2;
    this.makeVectors();
    this.rotate(0); // Resets base vertices
    this.refreshVertices();
  };

  Polygon_Collider.prototype.setRadian = function(radian) {
    radian = radian !== undefined ? radian : 0;
    this.rotate(radian - this.radian);
  };

  Polygon_Collider.prototype.rotate = function(radian) {
    this._radian += radian;
    for (var i = 0; i < this._vectors.length; i++) {
      var vector = this._vectors[i];
      vector.radian += radian;
      var x = vector.dist * Math.cos(vector.radian);
      var y = vector.dist * Math.sin(vector.radian);
      this._baseVertices[i].x = Math.round(x);
      this._baseVertices[i].y = Math.round(y);
    }
    this.refreshVertices();
  };

  Polygon_Collider.prototype.setScale = function(zX, zY) {
    zX = zX !== undefined ? zX : 1;
    zY = zY !== undefined ? zY : 1;
    this.scale(zX / this._scale.x, zY / this._scale.y);
  };

  Polygon_Collider.prototype.scale = function(zX, zY) {
    this._scale.x *= zX;
    this._scale.y *= zY;
    for (var i = 0; i < this._vectors.length; i++) {
      var vector = this._vectors[i];
      var x = vector.dist * Math.cos(vector.radian);
      var y = vector.dist * Math.sin(vector.radian);
      x *= zX;
      y *= zY;
      vector.radian = Math.atan2(y, x);
      vector.radian += vector.radian < 0 ? Math.PI * 2 : 0;
      vector.dist = Math.sqrt(x * x + y * y);
      this._baseVertices[i].x = Math.round(x);
      this._baseVertices[i].y = Math.round(y);
    }
    this.refreshVertices();
  };

  Polygon_Collider.prototype.moveTo = function(x, y) {
    if (x !== this.x || y !== this.y) {
      this.x = x;
      this.y = y;
      this.refreshVertices();
    }
  };

  Polygon_Collider.prototype.intersects = function(other) {
    if (this.height === 0 || this.width === 0) return false;
    if (other.height === 0 || other.width === 0) return false;
    if (this.containsPoint(other.center.x, other.center.y)) return true;
    if (other.containsPoint(this.center.x, this.center.y)) return true;
    var i, j, x, y;
    for (i = 0, j = other._vertices.length; i < j; i++) {
      x = other._vertices[i].x;
      y = other._vertices[i].y;
      if (this.containsPoint(x, y)) return true;
    }
    for (i = 0, j = this._vertices.length; i < j; i++) {
      x = this._vertices[i].x;
      y = this._vertices[i].y;
      if (other.containsPoint(x, y)) return true;
    }
    return false;
  };

  Polygon_Collider.prototype.inside = function(other) {
    if (this.height === 0 || this.width === 0) return false;
    if (other.height === 0 || other.width === 0) return false;
    var i, j, x, y;
    for (i = 0, j = other._vertices.length; i < j; i++) {
      x = other._vertices[i].x;
      y = other._vertices[i].y;
      if (!this.containsPoint(x, y)) {
        return false;
      }
    }
    return true;
  };

  Polygon_Collider.prototype.containsPoint = function(x, y) {
    var i;
    var j = this._vertices.length - 1;
    var odd = false;
    var poly = this._vertices;
    for (i = 0; i < this._vertices.length; i++) {
      if (poly[i].y < y && poly[j].y >= y || poly[j].y < y && poly[i].y >= y) {
        if (poly[i].x + (y - poly[i].y) / (poly[j].y - poly[i].y) * (poly[j].x - poly[i].x) < x) {
          odd = !odd;
        }
      }
      j = i;
    }
    return odd;
  };
})();

//-----------------------------------------------------------------------------
// Box_Collider

function Box_Collider() {
  this.initialize.apply(this, arguments);
}

(function() {
  Box_Collider.prototype = Object.create(Polygon_Collider.prototype);
  Box_Collider.prototype.constructor = Box_Collider;

  Box_Collider.prototype.initialize = function(width, height, ox, oy) {
    ox = ox !== undefined ? ox : 0;
    oy = oy !== undefined ? oy : 0;
    var points = [
      new Point(0, 0),
      new Point(width, 0),
      new Point(width, height),
      new Point(0, height)
    ];
    this._position = new Point(0, 0);
    this._scale = new Point(1, 1);
    this._offset = new Point(ox, oy);
    this._pivot = new Point(width / 2, height / 2);
    this._radian = 0;
    this.id = Polygon_Collider._counter++;
    this.makeVertices(points);
    this.rotate(0);
  };

  Box_Collider.prototype.isPolygon = function() {
    return false;
  };

  Box_Collider.prototype.isBox = function() {
    return true;
  };

  Box_Collider.prototype.containsPoint = function(x, y) {
    if (this._radian === 0) {
      var xMin = this._xMin + this.x + this.ox;
      var xMax = this._xMax + this.x + this.ox;
      var yMin = this._yMin + this.y + this.oy;
      var yMax = this._yMax + this.y + this.oy;
      var insideX = x >= xMin && x <= xMax;
      var insideY = y >= yMin && y <= yMax;
      return insideX && insideY;
    } else {
      return Polygon_Collider.prototype.containsPoint.call(this, x, y);
    }
  };
})();

//-----------------------------------------------------------------------------
// Circle_Collider

function Circle_Collider() {
  this.initialize.apply(this, arguments);
}

(function() {
  Circle_Collider.prototype = Object.create(Polygon_Collider.prototype);
  Circle_Collider.prototype.constructor = Circle_Collider;

  Circle_Collider.prototype.init = function(width, height, ox, oy) {
    ox = ox !== undefined ? ox : 0;
    oy = oy !== undefined ? oy : 0;
    this._radius = new Point((width - 1) / 2, (height - 1) / 2);
    var points = [];
    for (var i = 7; i >= 0; i--) {
      var rad = Math.PI / 4 * i + Math.PI;
      var x = this.radius.x + this.radius.x * Math.cos(rad);
      var y = this.radius.y + this.radius.y * -Math.sin(rad);
      points.push(new Point(x, y));
    }
    this._position = new Point(0, 0);
    this._scale  = new Point(1, 1);
    this._offset = new Point(ox, oy);
    this._pivot  = new Point(width / 2, height / 2);
    this._radian = 0;
    this.id = Polygon_Collider._counter++;
    this.makeVertices(points);
  };

  Object.defineProperty(Circle_Collider.prototype, 'radiusX', {
    get() {
      return this._radius.x;
    }
  });

  Object.defineProperty(Circle_Collider.prototype, 'radiusY', {
    get() {
      return this._radius.y;
    }
  });

  Circle_Collider.prototype.isPolygon = function() {
    return false;
  };

  Circle_Collider.prototype.isCircle = function() {
    return true;
  };

  Circle_Collider.prototype.scale = function(zX, zY) {
    Polygon_Collider.prototype.scale.call(this, zX, zY);
    this._radius.x *= zX;
    this._radius.y *= zY;
  };

  Circle_Collider.prototype.circlePosition = function(radian) {
    var x = this.radiusX * Math.cos(radian);
    var y = this.radiusY * -Math.sin(radian);
    var dist = Math.sqrt(x * x + y * y);
    radian -= this._radian;
    x = dist * Math.cos(radian);
    y = dist * -Math.sin(radian);
    return new Point(this.center.x + x, this.center.y + y);
  };

  Circle_Collider.prototype.intersects = function(other) {
    if (this.height === 0 || this.width === 0) return false;
    if (other.height === 0 || other.width === 0) return false;
    if (this.containsPoint(other.center.x, other.center.y)) return true;
    if (other.containsPoint(this.center.x, this.center.y)) return true;
    var x1 = this.center.x;
    var x2 = other.center.x;
    var y1 = this.center.y;
    var y2 = other.center.y;
    var rad = Math.atan2(y1 - y2, x2 - x1);
    rad += rad < 0 ? 2 * Math.PI : 0;
    var pos = this.circlePosition(rad);
    if (other.containsPoint(pos.x, pos.y)) return true;
    if (other.isCircle()) {
      rad = Math.atan2(y2 - y1, x1 - x2);
      rad += rad < 0 ? 2 * Math.PI : 0;
      pos = other.circlePosition(rad);
      if (this.containsPoint(pos.x, pos.y)) return true;
    }
    var i, j;
    for (i = 0, j = other._vertices.length; i < j; i++) {
      x1 = other._vertices[i].x;
      y1 = other._vertices[i].y;
      if (this.containsPoint(x1, y1)) return true;
    }
    for (i = 0, j = this._vertices.length; i < j; i++) {
      x1 = this._vertices[i].x;
      y1 = this._vertices[i].y;
      if (other.containsPoint(x1, y1)) return true;
    }
    return false;
  };
})();

//-----------------------------------------------------------------------------
// ColliderManager

function ColliderManager() {
  throw new Error('This is a static class');
}

(function() {
  ColliderManager._colliders = [];
  ColliderManager._colliderGrid = [];
  ColliderManager._characterGrid = [];
  ColliderManager._sectorSize = 48;
  ColliderManager._needsRefresh = false;
  ColliderManager.container = new Sprite();
  ColliderManager.container.alpha = 0.3;
  ColliderManager.visible = QMovement.showColliders;

  ColliderManager.clear = function() {
    this._colliders = [];
    this._colliderGrid = new Array($gameMap.width());
    for (var x = 0; x < this._colliderGrid.length; x++) {
      this._colliderGrid[x] = [];
      for (var y = 0; y < $gameMap.height(); y++) {
        this._colliderGrid[x].push([]);
      }
    }
    this._characterGrid = new Array($gameMap.width());
    for (var x = 0; x < this._characterGrid.length; x++) {
      this._characterGrid[x] = [];
      for (var y = 0; y < $gameMap.height(); y++) {
        this._characterGrid[x].push([]);
      }
    }
    this.container.removeChildren();
    ColliderManager._needsRefresh = true;
  };

  ColliderManager.refresh = function() {
    // refresh is done inside Game_Map
    this._needsRefresh = true;
  };

  ColliderManager.addCollider = function(collider, duration, ignoreGrid) {
    if (!$dataMap) return;
    var i = this._colliders.indexOf(collider);
    if (i === -1) {
      this._colliders.push(collider);
      if (duration > 0 || duration === -1) {
        this.draw(collider, duration);
      }
    }
    if (!ignoreGrid) {
      this.updateGrid(collider);
    }
  };

  ColliderManager.addCharacter = function(character, duration) {
    if (!$dataMap) return;
    var i = this._colliders.indexOf(character);
    if (i === -1) {
      this._colliders.push(character);
      if (duration > 0 || duration === -1) {
        this.draw(character.collider('bounds'), duration);
      }
    }
    this.updateGrid(character);
  };

  ColliderManager.remove = function(collider) {
    var i = this._colliders.indexOf(collider);
    if (i < 0) return;
    this.removeFromGrid(collider);
    collider.kill = true;
    this._colliders.splice(i, 1);
  };

  ColliderManager.removeSprite = function(sprite) {
    if (sprite) {
      this.container.removeChild(sprite);
    }
  };

  ColliderManager.updateGrid = function(collider, prevGrid) {
    var maxWidth  = this.sectorCols();
    var maxHeight = this.sectorRows();
    var currGrid;
    var grid;
    if (collider._colliders) {
      grid = this._characterGrid;
      currGrid = collider.collider('bounds').sectorEdge();
    } else {
      grid = this._colliderGrid;
      currGrid = collider.sectorEdge();
    }
    var x, y;
    if (prevGrid) {
      if (currGrid.x1 == prevGrid.x1 && currGrid.y1 === prevGrid.y1 &&
          currGrid.x2 == prevGrid.x2 && currGrid.y2 === prevGrid.y2) {
        return;
      }
      for (x = prevGrid.x1; x <= prevGrid.x2; x++) {
        for (y = prevGrid.y1; y <= prevGrid.y2; y++) {
          if ((x < 0 || x >= maxWidth) || (y < 0 || y >= maxHeight) ) {
            continue;
          }
          var i = grid[x][y].indexOf(collider);
          if (i !== -1) {
            grid[x][y].splice(i, 1);
          }
        }
      }
    }
    for (x = currGrid.x1; x <= currGrid.x2; x++) {
      for (y = currGrid.y1; y <= currGrid.y2; y++) {
        if (x < 0 || x >= this.maxWidth) {
          continue;
        } else if (y < 0 || y >= this.maxHeight) {
          continue;
        }
        grid[x][y].push(collider);
      }
    }
  };

  ColliderManager.removeFromGrid = function(collider) {
    var edge;
    var grid;
    if (collider._colliders) {
      grid = this._characterGrid;
      currGrid = collider.collider('bounds').sectorEdge();
    } else {
      grid = this._colliderGrid;
      currGrid = collider.sectorEdge();
    }
    for (x = grid.x1; x <= grid.x2; x++) {
      for (y = grid.y1; y <= grid.y2; y++) {
        var i = grid[x][y].indexOf(collider);
        if (i !== -1) {
          grid[x][y].splice(i, 1);
        }
      }
    }
  };

  ColliderManager.getCharactersNear = function(collider, only) {
    var grid = collider.sectorEdge();
    var arr = [];
    var isBreaking = false;
    var x, y, i;
    for (x = grid.x1; x <= grid.x2; x++) {
      for (y = grid.y1; y <= grid.y2; y++) {
        if (x < 0 || x > this.sectorCols()) continue;
        if (y < 0 || y > this.sectorRows()) continue;
        var charas = this._characterGrid[x][y];
        for (i = 0; i < charas.length; i++) {
          if (only) {
            if (only(charas[i]) === 'break') {
              isBreaking = true;
              break;
            }
            if (!only(charas[i])) continue;
          }
          if (!arr.contains(charas[i])) {
            arr.push(charas[i]);
          }
        }
        if (isBreaking) break;
      }
      if (isBreaking) break;
    }
    only = null;
    return arr;
  };

  ColliderManager.getCollidersNear = function(collider, only) {
    only = only || function() { return true; };
    var grid = collider.sectorEdge();
    var arr = [];
    var isBreaking = false;
    var x, y, i;
    for (x = grid.x1; x <= grid.x2; x++) {
      for (y = grid.y1; y <= grid.y2; y++) {
        if (x < 0 || x > this.sectorCols()) continue;
        if (y < 0 || y > this.sectorRows()) continue;
        var colliders = this._colliderGrid[x][y];
        for (i = 0; i < colliders.length; i++) {
          if (only) {
            if (only(colliders[i]) === 'break') {
              isBreaking = true;
              break;
            }
            if (!only(colliders[i])) continue;
          }
          if (!arr.contains(colliders[i])) {
            arr.push(colliders[i]);
          }
        }
        if (isBreaking) break;
      }
      if (isBreaking) break;
    }
    only = null;
    return arr;
  };

  ColliderManager.sectorCols = function() {
    return Math.floor($gameMap.width() * QMovement.tileSize / this._sectorSize);
  };

  ColliderManager.sectorRows = function() {
    return Math.floor($gameMap.height() * QMovement.tileSize / this._sectorSize);
  };

  ColliderManager.draw = function(collider, duration) {
    if ($gameTemp.isPlaytest()) {
      var sprite = new Sprite_Collider(collider, duration || -1);
      this.container.addChild(sprite);
    }
  };

  ColliderManager.update = function() {
    if (this.visible) {
      this.show();
    } else {
      this.hide();
    }
  };

  ColliderManager.toggle = function() {
    this.visible = !this.visible;
  };

  ColliderManager.show = function() {
    this.container.alpha = 0.3;
  };

  ColliderManager.hide = function() {
    this.container.alpha = 0;
  };

  ColliderManager.convertToCollider = function(arr) {
    var type = arr[0];
    var w = arr[1] || 0;
    var h = arr[2] || 0;
    var ox = arr[3] || 0;
    var oy = arr[4] || 0;
    if (type === 'box') {
      var collider = new Box_Collider(w, h, ox, oy);
    } else if (type === 'circle') {
      var collider = new Circle_Collider(w, h, ox, oy);
    }
    return collider;
  };
})();


//-----------------------------------------------------------------------------
// Game_Map

(function() {
  var Alias_Game_Map_setup = Game_Map.prototype.setup;
  Game_Map.prototype.setup = function(mapId) {
    if ($dataMap) {
      ColliderManager.clear();
    }
    Alias_Game_Map_setup.call(this, mapId);
  };

  Game_Map.prototype.tileWidth = function() {
    return QMovement.tileSize;
  };

  Game_Map.prototype.tileHeight = function() {
    return QMovement.tileSize;
  };

  Game_Map.prototype.flagAt = function(x, y) {
    var x = x || $gamePlayer.x;
    var y = y || $gamePlayer.y;
    var flags = this.tilesetFlags();
    var tiles = this.allTiles(x, y);
    for (var i = 0; i < tiles.length; i++) {
      var flag = flags[tiles[i]];
      console.log("layer", i, ":", flag);
      if (flag & 0x20)  console.log("layer", i, "is ladder");
      if (flag & 0x40)  console.log("layer", i, "is bush");
      if (flag & 0x80)  console.log("layer", i, "is counter");
      if (flag & 0x100) console.log("layer", i, "is damage");
    }
  };

  var Alias_Game_Map_refreshIfNeeded = Game_Map.prototype.refreshIfNeeded;
  Game_Map.prototype.refreshIfNeeded = function() {
    Alias_Game_Map_refreshIfNeeded.call(this);
    if (ColliderManager._needsRefresh) {
      this.reloadAllColliders();
      ColliderManager._needsRefresh = false;
    }
  };

  Game_Map.prototype.reloadAllColliders = function() {
    ColliderManager.clear();
    this.reloadTileMap();
    var events = this.events();
    var i, j;
    for (i = 0, j = events.length; i < j; i++) {
      events[i].reloadColliders();
    }
    var vehicles = this._vehicles;
    for (i = 0, j = vehicles.length; i < j; i++) {
      vehicles[i].reloadColliders();
    }
    $gamePlayer.reloadColliders();
    var followers = $gamePlayer.followers()._data;
    for (i = 0, j = followers.length; i < j; i++) {
      followers[i].reloadColliders();
    }
  };

  Game_Map.prototype.reloadTileMap = function() {
    this.setupMapColliders();
    // load collision maps here
  };

  Game_Map.prototype.setupMapColliders = function() {
    for (var x = 0; x < this.width(); x++) {
      for (var y = 0; y < this.height(); y++) {
        var flags = this.tilesetFlags();
        var tiles = this.allTiles(x, y);
        var id = x + y * this.width();
        for (var i = tiles.length - 1; i >= 0; i--) {
          var flag = flags[tiles[i]];
          if (flag === 16) continue;
          var colliders = this.getMapCollider(x, y, flag);
        }
      }
    }
  };

  Game_Map.prototype.getMapCollider = function(x, y, flag) {
    var realFlag = flag;
    if (flag >> 12 > 0) {
      flag = flag.toString(2);
      flag = flag.slice(flag.length - 12, flag.length);
      flag = parseInt(flag, 2);
    }
    if (QMovement.regionBoxes[this.regionId(x, y)]) {
      var regionData = QMovement.regionBoxes[this.regionId(x, y)];
      var boxData = [];
      for (var i = 0; i < regionData.length; i++) {
        var data = [
          regionData[i].width || 0,
          regionData[i].height || 0,
          regionData[i].ox || 0,
          regionData[i].oy || 0,
          regionData[i].tag || ""
        ];
        boxData[i] = data;
      }
      flag = 0;
    } else {
      var boxData = QMovement.tileBoxes[flag];
    }
    if (!boxData) {
      if (flag & 0x20 || flag & 0x40 || flag & 0x80 || flag & 0x100) {
        boxData = [this.tileWidth(), this.tileHeight(), 0, 0];
      } else {
        return [];
      }
    }
    var tilebox = [];
    if (boxData[0].constructor === Array) {
      var i = 0;
      for (var i = 0; i < boxData.length; i++) {
        var newBox = this.makeTileCollider(x, y, realFlag, boxData[i], i);
        tilebox.push(newBox);
      }
    } else {
      var newBox = this.makeTileCollider(x, y, realFlag, boxData);
      tilebox.push(newBox);
    }
    return tilebox;
  };

  Game_Map.prototype.makeTileCollider = function(x, y, flag, boxData, index) {
    var x1 = x * this.tileWidth();
    var y1 = y * this.tileHeight();
    var ox = boxData[2] || 0;
    var oy = boxData[3] || 0;
    var w  = boxData[0];
    var h  = boxData[1];
    var newBox = new Box_Collider(w, h, ox, oy);
    newBox.isTile = true;
    newBox.moveTo(x1, y1);
    newBox.note      = boxData[4] || "";
    newBox.flag      = flag;
    newBox.terrain   = flag >> 12;
    newBox.isWater1  = flag >> 12 === QMovement.water1Tag || /<water1>/i.test(newBox.note);
    newBox.isWater2  = flag >> 12 === QMovement.water2Tag || /<water2>/i.test(newBox.note);
    newBox.isLadder  = (flag & 0x20)  || /<ladder>/i.test(newBox.note);
    newBox.isBush    = (flag & 0x40)  || /<bush>/i.test(newBox.note);
    newBox.isCounter = (flag & 0x80)  || /<counter>/i.test(newBox.note);
    newBox.isDamage  = (flag & 0x100) || /<damage>/i.test(newBox.note);
    //var vx = x * this.height() * this.width();
    //var vy = y * this.height();
    //var vz = index || (QMovement._mapColliders[x][y] ? QMovement._mapColliders[x][y].length : 0);
    //newBox.location  = vx + vy + vz;
    if (newBox.isWater2) {
      newBox.color = QMovement.water2.toLowerCase();
    } else if (newBox.isWater1) {
      newBox.color = QMovement.water1.toLowerCase();
    } else if (newBox.isLadder || newBox.isBush || newBox.isDamage) {
      newBox.color = '#ffffff';
    } else {
      newBox.color = QMovement.collision.toLowerCase();
    }
    ColliderManager.addCollider(newBox, -1);
    return newBox;
  };

  Game_Map.prototype.adjustPX = function(x) {
    return this.adjustX(x / QuasiMovement.tileSize) * QMovement.tileSize;
  };

  Game_Map.prototype.adjustPY = function(y) {
    return this.adjustY(y / QuasiMovement.tileSize) * QMovement.tileSize;
  };

  Game_Map.prototype.roundPX = function(x) {
    return this.isLoopHorizontal() ? x.mod(this.width() * QMovement.tileSize) : x;
  };

  Game_Map.prototype.roundPY = function(y) {
    return this.isLoopVertical() ? y.mod(this.height() * QMovement.tileSize) : y;
  };

  Game_Map.prototype.pxWithDirection = function(x, d, dist) {
    return x + (d === 6 ? dist : d === 4 ? -dist : 0);
  };

  Game_Map.prototype.pyWithDirection = function(y, d, dist) {
    return y + (d === 2 ? dist : d === 8 ? -dist : 0);
  };

  Game_Map.prototype.roundPXWithDirection = function(x, d, dist) {
    return this.roundPX(x + (d === 6 ? dist : d === 4 ? -dist : 0));
  };

  Game_Map.prototype.roundPYWithDirection = function(y, d, dist) {
    return this.roundPY(y + (d === 2 ? dist : d === 8 ? -dist : 0));
  };

  Game_Map.prototype.deltaPX = function(x1, x2) {
    var result = x1 - x2;
    if (this.isLoopHorizontal() && Math.abs(result) > (this.width() * QMovement.tileSize) / 2) {
      if (result < 0) {
        result += this.width() * QMovement.tileSize;
      } else {
        result -= this.width() * QMovement.tileSize;
      }
    }
    return result;
  };

  Game_Map.prototype.deltaPY = function(y1, y2) {
    var result = y1 - y2;
    if (this.isLoopVertical() && Math.abs(result) > (this.height() * QMovement.tileSize) / 2) {
      if (result < 0) {
        result += this.height() * QMovement.tileSize;
      } else {
        result -= this.height() * QMovement.tileSize;
      }
    }
    return result;
  };

  Game_Map.prototype.canvasToMapPX = function(x) {
    var tileWidth = this.tileWidth();
    var originX = this._displayX * tileWidth;
    return this.roundPX(originX + x);
  };

  Game_Map.prototype.canvasToMapPY = function(y) {
    var tileHeight = this.tileHeight();
    var originY = this._displayY * tileHeight;
    return this.roundPY(originY + y);
  };
})();

//-----------------------------------------------------------------------------
// Game_CharacterBase

(function() {
  Object.defineProperties(Game_CharacterBase.prototype, {
      px: { get: function() { return this._px; }, configurable: true },
      py: { get: function() { return this._py; }, configurable: true }
  });

  var Alias_Game_CharacterBase_initMembers = Game_CharacterBase.prototype.initMembers;
  Game_CharacterBase.prototype.initMembers = function() {
    Alias_Game_CharacterBase_initMembers.call(this);
    this._px = 0;
    this._py = 0;
    this._realPX = 0;
    this._realPY = 0;
    this._radian = 0;
    this._adjustFrameSpeed = false;
    this._moveCount = 0;
    this._freqCount = 0;
    this._diagonal = false;
    this._currentRad = 0;
    this._targetRad = 0;
    this._pivotX = 0;
    this._pivotY = 0;
    this._radiusL = 0;
    this._radisuH = 0;
    this._angularSpeed;
    this._passabilityLevel = 0; // todo
  };

  Game_CharacterBase.prototype.direction8 = function(horz, vert) {
    if (horz === 4 && vert === 8) return 7;
    if (horz === 4 && vert === 2) return 1;
    if (horz === 6 && vert === 8) return 9;
    if (horz === 6 && vert === 2) return 3;
    return 5;
  };

  Game_CharacterBase.prototype.isMoving = function() {
    return this._moveCount > 0;
  };

  Game_CharacterBase.prototype.startedMoving = function() {
    return this._realPX !== this._px || this._realPY !== this._py;
  };

  Game_CharacterBase.prototype.isDiagonal = function() {
    return this._diagonal;
  };

  Game_CharacterBase.prototype.isArcing = function() {
    return this._currentRad !== this._targetRad;
  };

  var Alias_Game_CharacterBase_setPosition = Game_CharacterBase.prototype.setPosition;
  Game_CharacterBase.prototype.setPosition = function(x, y) {
    Alias_Game_CharacterBase_setPosition.call(this, x, y);
    this._px = this._realPX = x * QMovement.tileSize;
    this._py = this._realPY = y * QMovement.tileSize;
    if (!this._colliders) this.collider();
    this.moveColliders();
  };

  var Alias_Game_CharacterBase_copyPosition = Game_CharacterBase.prototype.copyPosition;
  Game_CharacterBase.prototype.copyPosition = function(character) {
    Alias_Game_CharacterBase_copyPosition.call(this, character);
    this._px = character._px;
    this._py = character._py;
    this._realPX = character._realPX;
    this._realPY = character._realPY;
    if (!this._colliders) this.collider();
    this.moveColliders();
  };

  var Alias_Game_CharacterBase_setDirection = Game_CharacterBase.prototype.setDirection;
  Game_CharacterBase.prototype.setDirection = function(d) {
    if (!this.isDirectionFixed() && d) {
      this._radian = this.directionToRadian(d);
      if ([1, 3, 7, 9].contains(d)) {
        this._diagonal = d;
        this.resetStopCount();
        return;
      } else {
        this._diagonal = false;
      }
    }
    Alias_Game_CharacterBase_setDirection.call(this, d);
  };

  Game_CharacterBase.prototype.moveTiles = function() {
    if (QMovement.grid < this.frameSpeed()) {
      return QMovement.offGrid ? this.frameSpeed() : QMovement.grid
    }
    return QMovement.grid;
  };

  Game_CharacterBase.prototype.frameSpeed = function(multi) {
    var multi = multi === undefined ? 1 : Math.abs(multi);
    return this.distancePerFrame() * QMovement.tileSize * multi;
  };

  Game_CharacterBase.prototype.angularSpeed = function() {
    return this._angularSpeed || this.frameSpeed() / this._radiusL;
  };

  Game_CharacterBase.prototype.canMove = function() {
    return !this._locked;
  };

  Game_CharacterBase.prototype.canPass = function(x, y, dir) {
    return this.canPixelPass(x * QMovement.tileSize, y * QMovement.tileSize, dir);
  };

  Game_CharacterBase.prototype.canPixelPass = function(x, y, dir, dist) {
    var dist = dist || this.moveTiles();
    var x1 = $gameMap.roundPXWithDirection(x, dir, dist);
    var y1 = $gameMap.roundPYWithDirection(y, dir, dist);
    if (!this.collisionCheck(x1, y1, dir, dist)) {
      this.collider('collision').moveTo(this._px, this._py);
      return false;
    }
    this.moveColliders(x1, y1);
    return true;
  };

  Game_CharacterBase.prototype.canPassDiagonally = function(x, y, horz, vert) {
    return this.canPixelPassDiagonally(x * QMovement.tileSize, y * QMovement.tileSize, horz, vert);
  };

  Game_CharacterBase.prototype.canPixelPassDiagonally = function(x, y, horz, vert, dist) {
    var dist = dist || this.moveTiles();
    var x1 = $gameMap.roundPXWithDirection(x, horz, dist);
    var y1 = $gameMap.roundPYWithDirection(y, vert, dist);
    if (this._smartMoveDir) {
      return (this.canPixelPass(x, y, vert, dist) && this.canPixelPass(x, y1, horz, dist)) ||
             (this.canPixelPass(x, y, horz, dist) && this.canPixelPass(x1, y, vert, dist));
    } else {
      return (this.canPixelPass(x, y, vert, dist) && this.canPixelPass(x, y1, horz, dist)) &&
             (this.canPixelPass(x, y, horz, dist) && this.canPixelPass(x1, y, vert, dist));
    }
  };

  Game_CharacterBase.prototype.collisionCheck = function(x, y, dir, dist) {
    this.collider('collision').moveTo(x, y);
    if (!this.valid()) return false;
    if (this.isThrough() || this.isDebugThrough()) return true;
    if (this.collideWithTile()) return false;
    if (this.collideWithCharacter()) return false;
    return true;
  };

  Game_CharacterBase.prototype.collideWithTile = function() {
    var collider = this.collider('collision');
    var collided = false;
    ColliderManager.getCollidersNear(collider, (function(tile) {
      if (!tile.isTile) return false;
      if (this.passableColors().contains(tile.color)) {
        return false;
      }
      collided = tile.intersects(collider);
      if (collided) return 'break';
    }).bind(this));
    return collided;
  };

  Game_CharacterBase.prototype.collideWithCharacter = function() {
    var collider = this.collider('collision');
    var collided = false;
    ColliderManager.getCharactersNear(collider, (function(chara) {
      if (chara.isThrough() || chara === this || !chara.isNormalPriority()) {
        return false;
      }
      collided = chara.collider('collision').intersects(collider);
      if (collided) return 'break';
    }).bind(this));
    return collided;
  };

  Game_CharacterBase.prototype.valid = function() {
    var edge = this.collider('collision').gridEdge();
    var maxW = $gameMap.width();
    var maxH = $gameMap.height();
    if (!$gameMap.isLoopHorizontal()) {
      if (edge.x1 < 0 || edge.x2 >= maxW) return false;
    }
    if (!$gameMap.isLoopVertical()) {
      if (edge.y1 < 0 || edge.y2 >= maxH) return false;
    }
    return true;
  };

  Game_CharacterBase.prototype.passableColors = function() {
    var colors = ["#ffffff", "#000000"];
    switch (this._passabilityLevel) {
      case 1:
      case 3:
        colors.push(QMovement.water1);
        break;
      case 2:
      case 4:
        colors.push(QMovement.water1);
        colors.push(QMovement.water2);
        break;
    }
    return colors;
  };

  Game_CharacterBase.prototype.checkEventTriggerTouchFront = function(d) {
    var x2 = $gameMap.roundPXWithDirection(this.px, d, this.moveTiles());
    var y2 = $gameMap.roundPYWithDirection(this.py, d, this.moveTiles());
    this.checkEventTriggerTouch(x2, y2);
  };

  Game_CharacterBase.prototype.isOnLadder = function() {
    if (!this.collider()) return false;
    var collider = this.collider('collision');
    var collided = false;
    var colliders = ColliderManager.getCollidersNear(collider, function(tile) {
      if (!tile.isTile) return false;
      if (tile.isLadder && tile.intersects(collider)) {
        collided = true;
        return 'break';
      }
      return false;
    });
    return collided;
  };

  Game_CharacterBase.prototype.isOnBush = function() {
    if (!this.collider()) return false;
    var collider = this.collider('collision');
    var collided = false;
    var colliders = ColliderManager.getCollidersNear(collider, function(tile) {
      if (!tile.isTile) return false;
      if (tile.isBush && tile.intersects(collider)) {
        collided = true;
        return 'break';
      }
      return false;
    });
    return collided;
  };

  Game_CharacterBase.prototype.freqThreshold = function() {
    return QMovement.tileSize;
  };

  var Alias_Game_CharacterBase_update = Game_CharacterBase.prototype.update;
  Game_CharacterBase.prototype.update = function() {
    var prevX = this._realPX;
    var prevY = this._realPY;
    if (this.isStopping()) {
      this.updateStop();
    }
    if (this.isArcing()) {
      this.updateArc();
    } else if (this.isJumping()) {
      this.updateJump();
    } else if (this.startedMoving()) {
      this.updateMove();
    }
    this.updateAnimation();
    this.updateColliders();
    if ((prevX !== this._realPX || prevY !== this._realPY) || this.startedMoving()) {
      this.onPositionChange();
    } else {
      this._moveCount = 0;
    }
  };

  Game_CharacterBase.prototype.updateMove = function() {
    if (this.isArcing()) return;
    var xSpeed = 1;
    var ySpeed = 1;
    if (this._adjustFrameSpeed) {
      xSpeed = Math.round(Math.cos(this._radian) * 10000) / 10000;
      ySpeed = Math.round(Math.sin(this._radian) * 10000) / 10000;
    }
    if (this._px < this._realPX) {
      this._realPX = Math.max(this._realPX - this.frameSpeed(xSpeed), this._px);
    }
    if (this._px > this._realPX) {
      this._realPX = Math.min(this._realPX + this.frameSpeed(xSpeed), this._px);
    }
    if (this._py < this._realPY) {
      this._realPY = Math.max(this._realPY - this.frameSpeed(ySpeed), this._py);
    }
    if (this._py > this._realPY) {
      this._realPY = Math.min(this._realPY + this.frameSpeed(ySpeed), this._py);
    }
    this._x = this._px / QMovement.tileSize;
    this._y = this._py / QMovement.tileSize;
    this._realX = this._realPX / QMovement.tileSize;
    this._realY = this._realPY / QMovement.tileSize;
    this._freqCount += this.frameSpeed();
  };

  Game_CharacterBase.prototype.updateArc = function() {
    if (this._currentRad < this._targetRad) {
      var newRad = Math.min(this._currentRad + this.angularSpeed(), this._targetRad);
    }
    if (this._currentRad > this._targetRad) {
      var newRad = Math.max(this._currentRad - this.angularSpeed(), this._targetRad);
    }
    var x1 = this._pivotX + this._radiusL * Math.cos(newRad);
    var y1 = this._pivotY + this._radiusH * -Math.sin(newRad);
    this._currentRad = newRad;
    this._px = this._realPX = x1;
    this._py = this._realPY = y1;
    this._x = this._realX = this._px / QMovement.tileSize;
    this._y = this._realY = this._py / QMovement.tileSize;
    this.moveColliders(x1, y1);
    this.checkEventTriggerTouchFront(this._direction);
  };

  var Alias_Game_CharacterBase_updateJump = Game_CharacterBase.prototype.updateJump;
  Game_CharacterBase.prototype.updateJump = function() {
    Alias_Game_CharacterBase_updateJump.call(this);
    this._px = this._realPX = this._x * QMovement.tileSize;
    this._py = this._realPY = this._y * QMovement.tileSize;
    this.moveAllBoxes(this._px, this._py);
  };

  Game_CharacterBase.prototype.updateColliders = function() {
    var colliders = this._colliders;
    if (!colliders) return;
    var hidden = false;
    hidden = this.isTransparent() || this._erased;
    if (!hidden && this.isVisible) {
      hidden = !this.isVisible();
    }
    for (var type in colliders) {
      if (colliders.hasOwnProperty(type)) {
        colliders[type]._isHidden = !!hidden;
      }
    }
  };

  Game_CharacterBase.prototype.onPositionChange = function() {

    this.refreshBushDepth();
  };

  Game_CharacterBase.prototype._refreshBushDepth = function() {
    if (this.isNormalPriority() && !this.isObjectCharacter() &&
        this.isOnBush() && !this.isJumping()) {
      if (!this.startedMoving()) this._bushDepth = 12;
    } else {
      this._bushDepth = 0;
    }
  };

  Game_CharacterBase.prototype.pixelJump = function(xPlus, yPlus) {
    return this.jump(xPlus / QMovement.tileSize, yPlus / QMovement.tileSize);
  };

  Game_CharacterBase.prototype.pixelJumpForward = function(dist, dir) {
    dir = dir || this._direction;
    dist = dist / QMovement.tileSize;
    var x = dir === 6 ? dist : dir === 4 ? -dist : 0;
    var y = dir === 2 ? dist : dir === 8 ? -dist : 0;
    this.jump(x, y);
  };

  Game_CharacterBase.prototype.pixelJumpBackward = function(dist) {
    this.pixelJumpFixed(this.reverseDir(this.direction()), dist);
  };

  Game_CharacterBase.prototype.pixelJumpFixed = function(dir, dist) {
    var lastDirectionFix = this.isDirectionFixed();
    this.setDirectionFix(true);
    this.pixelJumpForward(dist, dir);
    this.setDirectionFix(lastDirectionFix);
  };

  Game_CharacterBase.prototype.moveStraight = function(d) {
    this.setMovementSuccess(this.canPixelPass(this.px, this.py, d));
    var originalSpeed = this._moveSpeed;
    if (this.smartMove() > 0) this.smartMoveSpeed(d);
    if (this.isMovementSucceeded()) {
      this._diagonal = false;
      this._adjustFrameSpeed = false;
      this.setDirection(d);
      this._px = $gameMap.roundPXWithDirection(this._px, d, this.moveTiles());
      this._py = $gameMap.roundPYWithDirection(this._py, d, this.moveTiles());
      this._realPX = $gameMap.pxWithDirection(this._px, this.reverseDir(d), this.moveTiles());
      this._realPY = $gameMap.pyWithDirection(this._py, this.reverseDir(d), this.moveTiles());
      this._moveCount++;
      this.increaseSteps();
    } else {
      this.setDirection(d);
      this.checkEventTriggerTouchFront(d);
    }
    this._moveSpeed = originalSpeed;
    if (!this.isMovementSucceeded() && this.smartMove() > 1) {
      this.smartMoveDir8(d);
    }
  };

  Game_CharacterBase.prototype.moveDiagonally = function(horz, vert) {
    this.setMovementSuccess(this.canPixelPassDiagonally(this.px, this.py, horz, vert));
    var originalSpeed = this._moveSpeed;
    if (this.smartMove() > 0) this.smartMoveSpeed([horz, vert], true);
    if (this.isMovementSucceeded()) {
      this._diagonal = this.direction8(horz, vert);
      this._adjustFrameSpeed = false;
      this._px = $gameMap.roundPXWithDirection(this._px, horz, this.moveTiles());
      this._py = $gameMap.roundPYWithDirection(this._py, vert, this.moveTiles());
      this._realPX = $gameMap.pxWithDirection(this._px, this.reverseDir(horz), this.moveTiles());
      this._realPY = $gameMap.pyWithDirection(this._py, this.reverseDir(vert), this.moveTiles());
      this._moveCount++;
      this.increaseSteps();
    } else {
      this._diagonal = false;
    }
    if (this._direction === this.reverseDir(horz)) {
      this.setDirection(horz);
    }
    if (this._direction === this.reverseDir(vert)) {
      this.setDirection(vert);
    }
    this._moveSpeed = originalSpeed;
    if (!this.isMovementSucceeded() && this.smartMove() > 1) {
      if (this.canPixelPass(this.px, this.py, horz)) {
        this.moveStraight(horz);
      } else if (this.canPixelPass(this.px, this.py, vert)) {
        this.moveStraight(vert);
      }
    }
  };

  Game_CharacterBase.prototype.fixedMove = function(dir, dist) {
    dir = dir === 5 ? this.direction() : dir;
    if ([1, 3, 7, 9].contains(dir)) {
      var diag = {
        1: [4, 2],
        3: [6, 2],
        7: [4, 8],
        9: [6, 8]
      }
      return this.fixedDiagMove(diag[dir][0], diag[dir][1], dist);
    }
    this.setMovementSuccess(this.canPixelPass(this.px, this.py, dir, dist));
    if (this.isMovementSucceeded()) {
      this._diagonal = false;
      this._adjustFrameSpeed = false;
      this.setDirection(dir);
      this._px = $gameMap.roundPXWithDirection(this._px, dir, dist);
      this._py = $gameMap.roundPYWithDirection(this._py, dir, dist);
      this._realPX = $gameMap.pxWithDirection(this._px, this.reverseDir(dir), dist);
      this._realPY = $gameMap.pyWithDirection(this._py, this.reverseDir(dir), dist);
      this._moveCount++;
      this.increaseSteps();
    } else {
      this.setDirection(dir);
      this.checkEventTriggerTouchFront(dir);
    }
  };

  Game_CharacterBase.prototype.fixedDiagMove = function(horz, vert, dist) {
    this.setMovementSuccess(this.canPixelPassDiagonally(this.px, this.py, horz, vert));
    if (this.isMovementSucceeded()) {
      this._diagonal = this.direction8(horz, vert);
      this._adjustFrameSpeed = false;
      this._px = $gameMap.roundPXWithDirection(this._px, horz, dist);
      this._py = $gameMap.roundPYWithDirection(this._py, vert, dist);
      this._realPX = $gameMap.pxWithDirection(this._px, this.reverseDir(horz), dist);
      this._realPY = $gameMap.pyWithDirection(this._py, this.reverseDir(vert), dist);
      this._moveCount++;
      this.increaseSteps();
    } else {
      this._diagonal = false;
    }
    if (this._direction === this.reverseDir(horz)) {
      this.setDirection(horz);
    }
    if (this._direction === this.reverseDir(vert)) {
      this.setDirection(vert);
    }
  };

  Game_CharacterBase.prototype.fixedMoveBackward = function(dist) {
    var lastDirectionFix = this.isDirectionFixed();
    this.setDirectionFix(true);
    this.fixedMove(this.reverseDir(this.direction()), dist);
    this.setDirectionFix(lastDirectionFix);
  };

  Game_CharacterBase.prototype.slideTo = function(x, y) {
    this._radian = Math.atan2(this._py - y, this._px - x);
    this._radian = this._radian < 0 ? rad + 2 * Math.PI : this._radian;
    this._adjustFrameSpeed = true;
    this._px = x;
    this._py = y;
    this._moveCount++;
    this.increaseSteps();
  };

  Game_CharacterBase.prototype.arc = function(pivotX, pivotY, radians, cc, frames) {
    var cc = cc ? 1 : -1;
    var dx = this._px - pivotX;
    var dy = this._py - pivotY;
    var rad = Math.atan2(-dy, dx);
    frames = frames || 1;
    rad += rad < 0 ? 2 * Math.PI : 0;
    this._currentRad = rad;
    this._targetRad  = rad + radians * cc;
    this._pivotX = pivotX;
    this._pivotY = pivotY;
    this._radiusL = this._radiusH = Math.sqrt(dy * dy + dx * dx);
    this._angularSpeed = radians / frames;
  };

  Game_CharacterBase.prototype.smartMove = function() {
    return 0;
  };

  Game_CharacterBase.prototype.smartMoveDir8 = function(dir) {
    var x1 = this._px;
    var y1 = this._py;
    var dist = this.moveTiles();
    var horz = [4, 6].contains(dir) ? true : false;
    var collider = this.collider('collision');
    var steps = horz ? collider.height : collider.width;
    steps /= 2;
    for (var i = 0; i < 2; i++) {
      var sign = i === 0 ? 1 : -1;
      var j = 0;
      var x2 = x1;
      var y2 = y1;
      while (j < steps) {
        j += dist;
        if (horz) {
          x2 = $gameMap.roundPXWithDirection(x1, dir, dist);
          y2 = y1 + j * sign;
        } else {
          y2 = $gameMap.roundPYWithDirection(y1, dir, dist);
          x2 = x1 + j * sign;
        }
        var pass = this.canPixelPass(x2, y2, 5);
        if (pass) break;
      }
      if (pass) break;
    }
    if (pass) {
      var x3 = $gameMap.roundPXWithDirection(x1, dir, dist);
      var y3 = $gameMap.roundPYWithDirection(y1, dir, dist);
      collider.moveTo(x3, y3);
      var collided = false;
      ColliderManager.getCharactersNear(collider, function(chara) {
        if (chara.notes && /<nosmartdir>/i.test(chara.notes())) {
          collided = true;
          return 'break';
        }
        return false;
      });
      if (collided) {
        collider.moveTo(x1, y1);
        return;
      }
      collider.moveTo(x2, y2);
      this._realPX = x1;
      this._realPY = y1;
      this._px = x2;
      this._py = y2;
      this._radian = Math.atan2(y1 - y2, x2 - x1);
      this._radian += this._radian < 0 ? 2 * Math.PI : 0;
      this._adjustFrameSpeed = false;
      this._moveCount++;
      this.increaseSteps();
    }
  };

  Game_CharacterBase.prototype.smartMoveSpeed = function(dir, diag) {
    while (!this.isMovementSucceeded()) {
      this._moveSpeed--;
      if (diag) {
        this.setMovementSuccess(this.canPixelPassDiagonally(this.px, this.py, dir[0], dir[1]));
      } else {
        this.setMovementSuccess(this.canPixelPass(this.px, this.py, dir));
      }
      if (this._moveSpeed < 1) break;
    }
  };

  Game_CharacterBase.prototype.reloadColliders = function() {
    for (var collider in this._colliders) {
      if (!this._colliders.hasOwnProperty(collider)) continue;
      ColliderManager.remove(this._colliders[collider]);
      this._colliders[collider] = null;
    }
    this.setupColliders();
  };

  Game_CharacterBase.prototype.collider = function(type) {
    if (!$dataMap) return;
    if (!this._colliders) this.setupColliders();
    return this._colliders[type] || this._colliders['default'];
  };

  Game_CharacterBase.prototype.setupColliders = function() {
    this._colliders = {};
    var defaultCollider = 'box, 36, 24, 6, 24';
    var notes = this.notes(true);
    var configs = {};
    var multi = /<colliders>([\s\S]*)<\/colliders>/i.exec(notes);
    var single = /<collider[=|:]([0-9a-z,-\s]*?)>/i.exec(notes);
    if (multi) {
      configs = QPlus.stringToObj(multi[1]);
    }
    if (single) {
      configs.default = QPlus.stringToAry(single[1]);
    }
    if (!configs.default) {
      configs.default = QPlus.stringToAry(defaultCollider);
    }
    for (var collider in configs) {
      if (!configs.hasOwnProperty(collider)) continue;
      configs[collider][4] = configs[collider][4] || 0;
      configs[collider][4] -= this.shiftY();
      this._colliders[collider] = ColliderManager.convertToCollider(configs[collider]);
      this._colliders[collider]._charaId = String(this.charaId());
      ColliderManager.addCollider(this._colliders[collider], -1, true);
    }
    this.makeBounds();
    this.moveColliders();
  };

  Game_CharacterBase.prototype.makeBounds = function() {
    var minX;
    var maxX;
    var minY;
    var maxY;
    for (var type in this._colliders) {
      if (!this._colliders.hasOwnProperty(type)) continue;
      var edge = this._colliders[type].edge();
      if (!minX || minX > edge.x1 - this._px) {
        minX = edge.x1;
      }
      if (!maxX || maxX < edge.x2 - this._px) {
        maxX = edge.x2;
      }
      if (!minY || minY > edge.y1 - this._py) {
        minY = edge.y1;
      }
      if (!maxY || maxY < edge.y2 - this._py) {
        maxY = edge.y2;
      }
    }
    var w = maxX - minX;
    var h = maxY - minY;
    this._colliders['bounds'] = new Box_Collider(w, h, minX, minY);
    this._colliders['bounds'].isTile = false;
    this._colliders['bounds']._charaId = String(this.charaId());
    ColliderManager.addCharacter(this, 0);
  };

  Game_CharacterBase.prototype.moveColliders = function(x, y) {
    if (!$dataMap) return;
    x = typeof x === 'number' ? x : this.px;
    y = typeof y === 'number' ? y : this.py;
    var prev = this._colliders['bounds'].sectorEdge();
    for (var collider in this._colliders) {
      if (this._colliders.hasOwnProperty(collider)) {
        this._colliders[collider].moveTo(x, y);
      }
    }
    ColliderManager.updateGrid(this, prev);
  };

  Game_CharacterBase.prototype.cx = function() {
    return this.collider('collision').center.x;
  };

  Game_CharacterBase.prototype.cy = function() {
    return this.collider('collision').center.y;
  };
})();

//-----------------------------------------------------------------------------
// Game_Character

(function() {
  var Alias_Game_Character_processMoveCommand = Game_Character.prototype.processMoveCommand;
  Game_Character.prototype.processMoveCommand = function(command) {
    this.subMVMoveCommands(command);
    if (this.subQMoveCommand(command)) {
      command = this._moveRoute.list[this._moveRouteIndex];
    }
    this.processQMoveCommands(command);
    Alias_Game_Character_processMoveCommand.call(this, command);
  };

  Game_Character.prototype.subMVMoveCommands = function(command) {
    var gc = Game_Character;
    var params = command.parameters;
    switch (command.code) {
      case gc.ROUTE_MOVE_DOWN: {
        this.subQMove("2, 1," + QMovement.tileSize);
        //this._moveRouteIndex++;
        break;
      }
      case gc.ROUTE_MOVE_LEFT: {
        this.subQMove("4, 1," + QMovement.tileSize);
        //this._moveRouteIndex++;
        break;
      }
      case gc.ROUTE_MOVE_RIGHT: {
        this.subQMove("6, 1," + QMovement.tileSize);
        //this._moveRouteIndex++;
        break;
      }
      case gc.ROUTE_MOVE_UP: {
        this.subQMove("8, 1," + QMovement.tileSize);
        //this._moveRouteIndex++;
        break;
      }
      case gc.ROUTE_MOVE_LOWER_L: {
        this.subQMove("1, 1," + QMovement.diagDist);
        //this._moveRouteIndex++;
        break;
      }
      case gc.ROUTE_MOVE_LOWER_R: {
        this.subQMove("3, 1," + QMovement.diagDist);
        //this._moveRouteIndex++;
        break;
      }
      case gc.ROUTE_MOVE_UPPER_L: {
        this.subQMove("7, 1," + QMovement.diagDist);
        //this._moveRouteIndex++;
        break;
      }
      case gc.ROUTE_MOVE_UPPER_R: {
        this.subQMove("9, 1," + QMovement.diagDist);
        //this._moveRouteIndex++;
        break;
      }
      case gc.ROUTE_MOVE_FORWARD: {
        this.subQMove("5, 1," + QMovement.tileSize);
        //this._moveRouteIndex++;
        break;
      }
      case gc.ROUTE_MOVE_BACKWARD: {
        this.subQMove("0, 1," + QMovement.tileSize);
        //this._moveRouteIndex++;
        break;
      }
      case gc.ROUTE_TURN_DOWN:
      case gc.ROUTE_TURN_LEFT:
      case gc.ROUTE_TURN_RIGHT:
      case gc.ROUTE_TURN_UP:
      case gc.ROUTE_TURN_90D_R:
      case gc.ROUTE_TURN_90D_L:
      case gc.ROUTE_TURN_180D:
      case gc.ROUTE_TURN_90D_R_L:
      case gc.ROUTE_TURN_RANDOM:
      case gc.ROUTE_TURN_TOWARD:
      case gc.ROUTE_TURN_AWAY: {
        this._freqCount = this.freqThreshold();
        break;
      }
    }
  };

  Game_Character.prototype.subQMoveCommand = function(command) {
    var gc = Game_Character;
    var code = command.code;
    var params = command.parameters;
    if (command.code === gc.ROUTE_SCRIPT) {
      var qmove = /^qmove\((.*)\)/i.exec(params[0]);
      var arc   = /^arc\((.*)\)/i.exec(params[0]);
      if (qmove) this.subQMove(qmove[1]);
      if (arc)   this.subArc(arc[1]);
      if (qmove || arc) return true;
    }
    return false;
  };

  Game_Character.prototype.processQMoveCommands = function(command) {
    var params = command.parameters;
    switch (command.code) {
      case 'arc': {
        this.arc(params[0], params[1], params[2], params[3]);
        break;
      }
      case 'fixedMove': {
        this.fixedMove(params[0], params[1]);
        break;
      }
      case 'fixedMoveBackward': {
        this.fixedMoveBackward(params[0]);
        break;
      }
      case 'fixedMoveForward': {
        this.fixedMove(this.direction(), params[0]);
        break;
      }
    }
  };

  Game_Character.prototype.subArc = function(settings) {
    var cmd = {};
    cmd.code = 'arc';
    cmd.parameters = QPlus.stringToAry(settings);
    this._moveRoute.list[this._moveRouteIndex] = cmd;
  };

  Game_Character.prototype.subQMove = function(settings) {
    settings  = QPlus.stringToAry(settings);
    var dir   = settings[0];
    if (dir === 5) dir = this._direction;
    var amt   = settings[1];
    var multi = settings[2] || 1;
    var tot   = amt * multi;
    var steps = Math.floor(tot / this.moveTiles());
    var moved = 0;
    for (var i = 0; i < steps; i++) {
      moved += this.moveTiles();
      var cmd = {};
      cmd.code = 'fixedMove';
      cmd.parameters = [dir, this.moveTiles()];
      if (dir ===0) {
        cmd.code = 'fixedMoveBackward';
        cmd.parameters = [this.moveTiles()];
      }
      this._moveRoute.list.splice(this._moveRouteIndex + 1, 0, cmd);
    }
    if (moved < tot) {
      var cmd = {};
      cmd.code = 'fixedMove';
      cmd.parameters = [dir, tot - moved];
      if (dir === 0) {
        cmd.code = 'fixedMoveBackward';
        cmd.parameters = [tot - moved];
      }
      this._moveRoute.list.splice(this._moveRouteIndex + 1 + i, 0, cmd);
    }
    this._moveRoute.list.splice(this._moveRouteIndex, 1);
  };

  Game_Character.prototype.deltaPXFrom = function(x) {
    return $gameMap.deltaPX(this.cx(), x);
  };

  Game_Character.prototype.deltaPYFrom = function(y) {
    return $gameMap.deltaPY(this.cy(), y);
  };

  Game_Character.prototype.pixelDistanceFrom = function(x, y) {
    return $gameMap.distance(this.cx(), this.cy(), x, y);
  };
})();

//-----------------------------------------------------------------------------
// Game_Player

(function() {
  Game_Player.prototype.smartMove = function() {
    return QMovement.smartMove;
  };

  Game_Player.prototype.moveByInput = function() {
    if (!this.startedMoving() && this.canMove()) {
      if (this.triggerAction()) return;
      var direction = QMovement.diagonal ? Input.dir8 : Input.dir4;
      if (direction > 0) {
        $gameTemp.clearDestination();
        this._pathFind = null;
      } else if ($gameTemp.isDestinationValid()) {
        if (!QMovement.moveOnClick) {
          $gameTemp.clearDestination();
          return;
        }
        var x = $gameTemp.destinationPX();
        var y = $gameTemp.destinationPY();
        //if (!this._pathFind) direction = this.startPathFind(x, y);
      }
      if ([4, 6].contains(direction)) {
        this.moveInputHorizontal(direction);
      } else if ([2, 8].contains(direction)) {
        this.moveInputVertical(direction);
      } else if ([1, 3, 7, 9].contains(direction) && QMovement.diagonal) {
        this.moveInputDiagonal(direction);
      }
    }
  };

  Game_Player.prototype.moveInputHorizontal = function(dir) {
    this.moveStraight(dir);
  };

  Game_Player.prototype.moveInputVertical = function(dir) {
    this.moveStraight(dir);
  };

  Game_Player.prototype.moveInputDiagonal = function(dir) {
    var diag = {
      1: [4, 2],   3: [6, 2],
      7: [4, 8],   9: [6, 8]
    };
    this.moveDiagonally(diag[dir][0], diag[dir][1]);
  };

  Game_Player.prototype.update = function(sceneActive) {
    var lastScrolledX = this.scrolledX();
    var lastScrolledY = this.scrolledY();
    var wasMoving = this.isMoving();
    this.updateDashing();
    if (sceneActive) {
      this.moveByInput();
    }
    Game_Character.prototype.update.call(this);
    this.updateScroll(lastScrolledX, lastScrolledY);
    this.updateVehicle();
    if (!this.startedMoving()) this.updateNonmoving(wasMoving);
    this._followers.update();
  };

  Game_Player.prototype.updateNonmoving = function(wasMoving) {
    if (!$gameMap.isEventRunning()) {
      if (wasMoving) {
        if (this._freqCount >= this.freqThreshold()) {
          $gameParty.onPlayerWalk();
        }
        this.checkEventTriggerHere([1,2]);
        if ($gameMap.setupStartingEvent()) return;
      }
      if (this.triggerAction()) return;
      if (wasMoving) {
        if (this._freqCount >= this.freqThreshold()) {
          this.updateEncounterCount();
          this._freqCount = 0;
        }
      } else if (!this.isMoving()) {
        $gameTemp.clearDestination();
      }
    }
  };

  Game_Player.prototype.startMapEvent = function(x, y, triggers, normal) {
    if (!$gameMap.isEventRunning()) {
      var collider = this.collider('interaction');
      var x1 = this._px;
      var y1 = this._py;
      collider.moveTo(x, y);
      var events = ColliderManager.getCharactersNear(collider, (function(chara) {
        if (chara.constructor === Game_Event && !chara._erased) {
          return chara.collider('interaction').intersects(collider);
        }
        return false;
      }).bind(this));
      collider.moveTo(x1, y1);
      if (events.length === 0) {
        events = null;
        return;
      }
      var cx = this.cx();
      var cy = this.cy();
      events.sort(function(a, b) {
        return a.pixelDistanceFrom(cx, cy) - b.pixelDistanceFrom(cx, cy);
      });
      var event = events.shift();
      if (event.isTriggerIn(triggers) && event.isNormalPriority() === normal) {
        while (true) {
          event.start();
          if (events.length === 0 || $gameMap.isAnyEventStarting()) {
            break;
          }
          event = events.shift();
        }
      }
      events = null;
    }
  };

  Game_Player.prototype.checkEventTriggerHere = function(triggers) {
    if (this.canStartLocalEvents()) {
      this.startMapEvent(this.collider('interaction').x, this.collider('interaction').y, triggers, false);
    }
  };

  Game_Player.prototype.checkEventTriggerThere = function(triggers, x2, y2) {
    if (this.canStartLocalEvents()) {
      var direction = this.direction();
      var x1 = this.collider('interaction').x;
      var y1 = this.collider('interaction').y;
      x2 = x2 || $gameMap.roundPXWithDirection(x1, direction, this.moveTiles());
      y2 = y2 || $gameMap.roundPYWithDirection(y1, direction, this.moveTiles());
      this.startMapEvent(x2, y2, triggers, true);
      if (!$gameMap.isAnyEventStarting()) {
        return this.checkCounter(triggers);
      }
    }
  };

  Game_Player.prototype.checkCounter = function(triggers, x2, y2) {
    var direction = this.direction();
    var x1 = this._px;
    var y1 = this._py;
    x2 = x2 || $gameMap.roundPXWithDirection(x1, direction, this.moveTiles());
    y2 = y2 || $gameMap.roundPYWithDirection(y1, direction, this.moveTiles());
    var collider = this.collider('interaction');
    collider.moveTo(x2, y2);
    var counter;
    ColliderManager.getCollidersNear(collider, function(tile) {
      if (!tile.isTile) return false;
      if (tile.isCounter && tile.intersects(collider)) {
        counter = tile;
        return 'break';
      }
      return false;
    });
    collider.moveTo(x1, y1);
    if (counter) {
      if ([4, 6].contains(direction)) {
        var dist = Math.abs(counter.center.x - collider.center.x);
        dist += collider.width;
      }  else if ([8, 2].contains(direction)) {
        var dist = Math.abs(counter.center.y - collider.center.y);
        dist += collider.height;
      }
      var x3 = $gameMap.roundPXWithDirection(x1, direction, dist);
      var y3 = $gameMap.roundPYWithDirection(y1, direction, dist);
      return this.startMapEvent(x3, y3, triggers, true);
    }
    return false;
  };
})();

//-----------------------------------------------------------------------------
// Game_Event

(function() {
  var Alias_Game_Event_setupPageSettings = Game_Event.prototype.setupPageSettings;
  Game_Event.prototype.setupPageSettings = function() {
    Alias_Game_Event_setupPageSettings.call(this);
    this.reloadColliders();
  };

  Game_Event.prototype.updateStop = function() {
    if (this._locked) {
      this._freqCount = this.freqThreshold();
      this.resetStopCount();
    }
    Game_Character.prototype.updateStop.call(this);
    if (!this.isMoveRouteForcing()) {
      this.updateSelfMovement();
    }
  };

  Game_Event.prototype.updateSelfMovement = function() {
    if (this.isNearTheScreen() && this.canMove()) {
      if (this._freqCount < this.freqThreshold()) {
        switch (this._moveType) {
        case 1:
          this.moveTypeRandom();
          break;
        case 2:
          this.moveTypeTowardPlayer();
          break;
        case 3:
          this.moveTypeCustom();
          break;
        }
      } else {
        if (this.checkStop(this.stopCountThreshold())) {
          this._stopCount = this._freqCount = 0;
        }
      }
    }
  };
})();


//-----------------------------------------------------------------------------
// Scene_Map

(function() {
  Input.keyMapper[121] = 'f10';

  var Alias_Scene_Map_updateMain = Scene_Map.prototype.updateMain;
  Scene_Map.prototype.updateMain = function() {
    Alias_Scene_Map_updateMain.call(this);
    var key = Imported.QInput ? '#f10' : 'f10';
    if ($gameTemp.isPlaytest() && Input.isTriggered(key)) {
      ColliderManager.toggle();
    }
    ColliderManager.update();
  };
})();

//-----------------------------------------------------------------------------
// Sprite_Collider

function Sprite_Collider() {
  this.initialize.apply(this, arguments);
}

(function() {
  Sprite_Collider.prototype = Object.create(Sprite.prototype);
  Sprite_Collider.prototype.constructor = Sprite_Collider;

  Sprite_Collider.prototype.initialize = function(collider, options) {
    Sprite.prototype.initialize.call(this);
    this.z = 7;
    this._duration = options.duration || -1;
    this._color = options.color || '#ff0000';
    this.setupCollider(collider);
  };

  Sprite_Collider.prototype._setupCollider = function(collider) {
    this._collider = collider;
    this.bitmap = new Bitmap(collider.width, collider.height);
    this.drawCollider();
  };


  Sprite_Collider.prototype.setupCollider = function(collider) {
    this._collider = collider;
    var isNew = false;
    if (!this._colliderSprite) {
      this._colliderSprite = new PIXI.Graphics();
      isNew = true;
    }
    this.drawCollider();
    if (isNew) {
      this.addChild(this._colliderSprite);
    }
  };

  Sprite_Collider.prototype._drawCollider = function() {
    var collider = this._collider;
    this.bitmap.clear();
    var color = this._color.replace('#', '');
    color = parseInt(color, 16);
    if (collider.isCircle()) {
      var radiusX = collider._radiusX;
      var radiusY = collider._radiusY;
      this.bitmap.drawEllipse(0, 0, radiusX, radiusY, color);
      this.bitmap.rotation = collider.radian;
    } else {
      this.bitmap.drawPolygon(collider._baseVertices, color);
    }
  };

  Sprite_Collider.prototype.drawCollider = function() {
    var collider = this._collider;
    this._colliderSprite.clear();
    var color = this._color.replace('#', '');
    color = parseInt(color, 16);
    this._colliderSprite.beginFill(color);
    if (collider.isCircle()) {
      var radiusX = collider._radiusX;
      var radiusY = collider._radiusY;
      this._colliderSprite.drawEllipse(0, 0, radiusX, radiusY);
      this._colliderSprite.rotation = collider.radian;
    } else {
      this._colliderSprite.drawPolygon(collider._baseVertices);
    }
    this._colliderSprite.endFill();
  };

  Sprite_Collider.prototype.update = function() {
    Sprite.prototype.update.call(this);
    this.checkChanges();
    if (this._duration > 0 || this._collider.kill) {
      this.updateDecay();
    }
  };

  Sprite_Collider.prototype.checkChanges = function() {
    this.alpha = this._collider._isHidden ? 0 : 1;
    this.x = this._collider.x + this._collider.ox;
    this.x -= $gameMap.displayX() * QMovement.tileSize;
    this.y = this._collider.y + this._collider.oy;
    this.y -= $gameMap.displayY() * QMovement.tileSize;
    if (this._cachedw !== this._collider.width ||
        this._cachedh !== this._collider.height) {
      this._cachedw = this._collider.width;
      this._cachedh = this._collider.height;
      this.drawCollider();
    }
    this._colliderSprite.z = this.z;
    this._colliderSprite.alpha = this.alpha;
  };

  Sprite_Collider.prototype.updateDecay = function() {
    this._duration--;
    if (this._duration <= 0) {
      ColliderManager.removeSprite(this);
      this._collider = null;
    }
  };
})();


//-----------------------------------------------------------------------------
// Spriteset_Map

(function() {
  var Alias_Spriteset_Map_createLowerLayer = Spriteset_Map.prototype.createLowerLayer;
  Spriteset_Map.prototype.createLowerLayer = function() {
    Alias_Spriteset_Map_createLowerLayer.call(this);
    if ($gameTemp.isPlaytest()) {
      this.createColliders();
    }
  };

  Spriteset_Map.prototype.createColliders = function() {
    this.addChild(ColliderManager.container);
    // also get collision map here
  };
})();

