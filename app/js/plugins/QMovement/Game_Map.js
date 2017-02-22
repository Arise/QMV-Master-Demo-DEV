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
    this._tileCounter = 0;
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
    newBox.id = this._tileCounter++;
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
    return this.adjustX(x / QMovement.tileSize) * QMovement.tileSize;
  };

  Game_Map.prototype.adjustPY = function(y) {
    return this.adjustY(y / QMovement.tileSize) * QMovement.tileSize;
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
