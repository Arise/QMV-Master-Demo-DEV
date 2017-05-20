//-----------------------------------------------------------------------------
// ColliderManager

function ColliderManager() {
  throw new Error('This is a static class');
}

(function() {
  ColliderManager._colliders = [];
  ColliderManager._colliderGrid = [];
  ColliderManager._characterGrid = [];
  ColliderManager._sectorSize = QMovement.tileSize;
  ColliderManager._needsRefresh = true;
  ColliderManager.container = new Sprite();
  ColliderManager.container.alpha = 0.3;
  ColliderManager.visible = QMovement.showColliders;

  ColliderManager.clear = function() {
    this._colliders = [];
    this._colliderGrid = [];
    this._characterGrid = [];
    this.container.removeChildren();
  };

  ColliderManager.refresh = function() {
    this.clear();
    this._colliderGrid = new Array(this._mapWidth);
    for (var x = 0; x < this._colliderGrid.length; x++) {
      this._colliderGrid[x] = [];
      for (var y = 0; y < this._mapHeight; y++) {
        this._colliderGrid[x].push([]);
      }
    }
    this._characterGrid = new Array(this._mapWidth);
    for (var x = 0; x < this._characterGrid.length; x++) {
      this._characterGrid[x] = [];
      for (var y = 0; y < this._mapHeight; y++) {
        this._characterGrid[x].push([]);
      }
    }
    this._needsRefresh = false;
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
    if (!collider._colliders) collider.kill = true;
    this._colliders.splice(i, 1);
  };

  ColliderManager.removeSprite = function(sprite) {
    this.container.removeChild(sprite);
  };

  ColliderManager.updateGrid = function(collider, prevGrid) {
    if (this._needsRefresh) return;
    var currGrid;
    var grid;
    if (collider._colliders) {
      grid = this._characterGrid;
      currGrid = collider.collider('bounds').sectorEdge();
    } else {
      grid = this._colliderGrid;
      currGrid = collider.sectorEdge();
    }
    // TODO make this into 1 single 2d loop
    var x, y;
    if (prevGrid) {
      if (currGrid.x1 == prevGrid.x1 && currGrid.y1 === prevGrid.y1 &&
          currGrid.x2 == prevGrid.x2 && currGrid.y2 === prevGrid.y2) {
        return;
      }
      for (x = prevGrid.x1; x <= prevGrid.x2; x++) {
        for (y = prevGrid.y1; y <= prevGrid.y2; y++) {
          if (!grid[x] || !grid[x][y]) continue;
          var i = grid[x][y].indexOf(collider);
          if (i !== -1) {
            grid[x][y].splice(i, 1);
          }
        }
      }
    }
    for (x = currGrid.x1; x <= currGrid.x2; x++) {
      for (y = currGrid.y1; y <= currGrid.y2; y++) {
        if (!grid[x] || !grid[x][y]) continue;
        grid[x][y].push(collider);
      }
    }
  };

  ColliderManager.removeFromGrid = function(collider) {
    var grid;
    var edge;
    if (collider._colliders) { // Is a character obj
      grid = this._characterGrid;
      edge = collider.collider('bounds').sectorEdge();
    } else { // is a collider
      grid = this._colliderGrid;
      edge = collider.sectorEdge();
    }
    for (var x = edge.x1; x <= edge.x2; x++) {
      for (var y = edge.y1; y <= edge.y2; y++) {
        if (!grid[x] || !grid[x][y]) continue;
        var i = grid[x][y].indexOf(collider);
        if (i !== -1) {
          grid[x][y].splice(i, 1);
        }
      }
    }
  };

  // TODO create a similar function that gets
  // characters that intersect with the collider passed in
  ColliderManager.getCharactersNear = function(collider, only) {
    var grid = collider.sectorEdge();
    var near = [];
    var checked = [];
    var isBreaking = false;
    var x, y, i;
    for (x = grid.x1; x <= grid.x2; x++) {
      for (y = grid.y1; y <= grid.y2; y++) {
        if (x < 0 || x >= this.sectorCols()) continue;
        if (y < 0 || y >= this.sectorRows()) continue;
        var charas = this._characterGrid[x][y];
        for (i = 0; i < charas.length; i++) {
          if (checked.contains(charas[i])) {
            continue;
          }
          checked.push(charas[i]);
          if (only) {
            var value = only(charas[i])
            if (value === 'break') {
              near.push(charas[i]);
              isBreaking = true;
              break;
            } else if (value === false) {
              continue;
            }
          }
          near.push(charas[i]);
        }
        if (isBreaking) break;
      }
      if (isBreaking) break;
    }
    only = null;
    return near;
  };

  ColliderManager.getCollidersNear = function(collider, only) {
    var grid = collider.sectorEdge();
    var checked = [];
    var near = [];
    var isBreaking = false;
    var x, y, i;
    for (x = grid.x1; x <= grid.x2; x++) {
      for (y = grid.y1; y <= grid.y2; y++) {
        if (x < 0 || x >= this.sectorCols()) continue;
        if (y < 0 || y >= this.sectorRows()) continue;
        var colliders = this._colliderGrid[x][y];
        for (i = 0; i < colliders.length; i++) {
          if (checked.contains(colliders[i])) {
            continue;
          }
          checked.push(colliders[i]);
          if (only) {
            var value = only(colliders[i]);
            if (value === 'break') {
              near.push(colliders[i]);
              isBreaking = true;
              break;
            } else if (value === false) {
              continue;
            }
          }
          near.push(colliders[i]);
        }
        if (isBreaking) break;
      }
      if (isBreaking) break;
    }
    only = null;
    return near;
  };

  ColliderManager.sectorCols = function() {
    return Math.floor(this._mapWidth * QMovement.tileSize / this._sectorSize);
  };

  ColliderManager.sectorRows = function() {
    return Math.floor(this._mapHeight * QMovement.tileSize / this._sectorSize);
  };

  ColliderManager.draw = function(collider, duration) {
    if ($gameTemp.isPlaytest()) {
      var sprites = this.container.children;
      for (var i = 0; i < sprites.length; i++) {
        if (sprites[i]._collider && sprites[i]._collider.id === collider.id) {
          sprites[i]._collider.kill = false;
          sprites[i]._duration = duration;
          return;
        }
      }
      collider.kill = false;
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
    this.container.visible = true;
  };

  ColliderManager.hide = function() {
    this.container.visible = false;
  };

  ColliderManager.convertToCollider = function(arr) {
    var type = arr[0];
    var w = arr[1] || 0;
    var h = arr[2] || 0;
    var ox = arr[3] || 0;
    var oy = arr[4] || 0;
    var collider;
    if (type === 'circle' || type === 'box') {
      if (type === 'circle') {
        collider = new Circle_Collider(w, h, ox, oy);
      } else {
        collider = new Box_Collider(w, h, ox, oy);
      }
    } else if (type === 'poly') {
      collider = new Polygon_Collider(arr.slice(1));
    } else {
      return null;
    }
    return collider;
  };
})();
