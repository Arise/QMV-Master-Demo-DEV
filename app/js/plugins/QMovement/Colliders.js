//=============================================================================
// Colliders

//-----------------------------------------------------------------------------
// Polygon_Collider

function Polygon_Collider() {
  this.initialize.apply(this, arguments);
}

(function() {
  Polygon_Collider._counter = 0;

  Polygon_Collider.prototype.initialize = function(points, x, y) {
    this._position = new Point(x || 0, y || 0);
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
      return this._offset.x + this._pivot.x;
    },
    set(value) {
      this._offset.x = value;
      this.refreshVertices();
    }
  });

  Object.defineProperty(Polygon_Collider.prototype, 'oy', {
    get() {
      return this._offset.y + this._pivot.y;
    },
    set(value) {
      this._offset.y = value - this._pivot.y;
      this.refreshVertices();
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
    this._vectors = [];
    this._xMin = null;
    this._xMax = null;
    this._yMin = null;
    this._yMax = null;
    for (var i = 0; i < points.length; i++) {
      var x = points[i].x;
      var y = points[i].y;
      var x2 = x + this.x + this.ox;
      var y2 = y + this.y + this.oy;
      this._vertices.push(new Point(x2, y2));
      this._baseVertices.push(new Point(x, y));
      var dx = x - this._pivot.x;
      var dy = y - this._pivot.y;
      var radian = Math.atan2(dy, dx);
      radian += radian < 0 ? Math.PI * 2 : 0;
      var dist = Math.sqrt(dx * dx + dy * dy);
      this._vectors.push({ radian, dist });
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
    var x2 = this._xMax + this.x + this.ox - 1;
    var y1 = this._yMin + this.y + this.oy;
    var y2 = this._yMax + this.y + this.oy - 1;
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
    var x2 = this._xMax + this.x + this.ox - 1;
    var y1 = this._yMin + this.y + this.oy;
    var y2 = this._yMax + this.y + this.oy - 1;
    return {
      x1: x1, x2: x2,
      y1: y1, y2: y2
    }
  };

  Polygon_Collider.prototype.setPivot = function(x, y) {
    this._pivot.x = x;
    this._pivot.y = y;
    this.makeVectors();
    this.rotate(0); // Resets base vertices
  };

  Polygon_Collider.prototype.centerPivot = function() {
    this._pivot.x = this.width / 2;
    this._pivot.y = this.height / 2;
    this.makeVectors();
    this.rotate(0); // Resets base vertices
  };

  Polygon_Collider.prototype.setRadian = function(radian) {
    radian = radian !== undefined ? radian : 0;
    this.rotate(radian - this._radian);
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

  // TODO Optimize this
  // Compaire other methods, example atan2 - atan2 or a dot product
  Polygon_Collider.prototype.bestPairFrom = function(point) {
    var vertices = this._vertices;
    var radians = [];
    var points = [];
    for (var i = 0; i < vertices.length; i++) {
      var radian = Math.atan2(vertices[i].y - point.y, vertices[i].x - point.x);
      radian += radian < 0 ? 2 * Math.PI : 0;
      radians.push(radian);
      points.push(new Point(vertices[i].x, vertices[i].y));
    }
    var bestPair = [];
    var currI = 0;
    var max = -Math.PI * 2;
    while (points.length > 0) {
      var curr = points.shift();
      for (var i = 0; i < points.length; i++) {
        var dr = radians[currI] - radians[currI + i + 1];
        if (Math.abs(dr) > max) {
          max = Math.abs(dr);
          bestPair = [currI, currI + i + 1];
        }
      }
      currI++;
    }
    return bestPair;
  };

  // returns a new polygon
  Polygon_Collider.prototype.stretchedPoly = function(radian, dist) {
    var dist2 = dist + Math.max(this.width, this.height);
    var xComponent = Math.cos(radian) * dist;
    var yComponent = Math.sin(radian) * dist;
    var x1 = this.center.x + Math.cos(radian) * dist2;
    var y1 = this.center.y + Math.sin(radian) * dist2;
    var bestPair = this.bestPairFrom(new Point(x1, y1));
    var vertices = this._vertices;
    var pointsA = [];
    var pointsB = [];
    var i;
    for (i = 0; i < vertices.length; i++) {
      var x2 = vertices[i].x - this.x;
      var y2 = vertices[i].y - this.y;
      pointsA.push(new Point(x2, y2));
      pointsB.push(new Point(x2 + xComponent, y2 + yComponent));
    }
    // TODO add the other vertices from collider
    var points = [];
    points.push(pointsA[bestPair[0]]);
    points.push(pointsB[bestPair[0]]);
    points.push(pointsB[bestPair[1]]);
    points.push(pointsA[bestPair[1]]);
    var polygon = new Polygon_Collider(points, this.x, this.y);
    return polygon;
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
    this.rotate(0); // readjusts the pivot
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

  Circle_Collider.prototype.initialize = function(width, height, ox, oy) {
    ox = ox !== undefined ? ox : 0;
    oy = oy !== undefined ? oy : 0;
    this._radius = new Point(width / 2, height / 2);
    var points = [];
    for (var i = 7; i >= 0; i--) {
      var rad = Math.PI / 4 * i + Math.PI;
      var x = this._radius.x + this._radius.x * Math.cos(rad);
      var y = this._radius.y + this._radius.y * -Math.sin(rad);
      points.push(new Point(x, y));
    }
    this._position = new Point(0, 0);
    this._scale  = new Point(1, 1);
    this._offset = new Point(ox, oy);
    this._pivot  = new Point(width / 2, height / 2);
    this._radian = 0;
    this.id = Polygon_Collider._counter++;
    this.makeVertices(points);
    this.rotate(0); // readjusts the pivot
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
