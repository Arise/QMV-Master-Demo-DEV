//-----------------------------------------------------------------------------
// Game_Map

(function() {
  var Alias_Game_Map_setup = Game_Map.prototype.setup;
  Game_Map.prototype.setup = function(mapId) {
    Alias_Game_Map_setup.call(this, mapId);
    if (mapId !== QABSManager._mapId) {
      QABSManager.clear();
    }
  };

  var Alias_Game_Map_update = Game_Map.prototype.update;
  Game_Map.prototype.update = function(sceneActive) {
    Alias_Game_Map_update.call(this, sceneActive);
    if (QABS._needsUncompress) {
      this.uncompressBattlers();
      QABS._needsUncompress = false;
    }
  };

  Game_Map.prototype.compressBattlers = function() {
    for (var i = 0; i < this.events().length; i++) {
      if (this.events()[i]._battler) {
        var oldRespawn = this.events()[i]._respawn;
        this.events()[i].clearABS();
        this.events()[i]._battler = null;
        this.events()[i]._respawn = oldRespawn;
      }
      if (this.events()[i].constructor === Game_Loot) {
        QABSManager.removePicture(this.events()[i]._itemIcon);
        QABSManager.removeEvent(this.events()[i]);
      }
    }
    $gamePlayer.clearABS();
    QABSManager.clear();
  };

  Game_Map.prototype.uncompressBattlers = function() {
    for (var i = 0; i < this.events().length; i++) {
      if (this.events()[i]._respawn >= 0) {
        var wasDead = true;
        var oldRespawn = this.events()[i]._respawn;
      }
      this.events()[i].setupBattler();
      if (wasDead) {
        this.events()[i].clearABS();
        this.events()[i]._battler = null;
        this.events()[i]._respawn = oldRespawn;
      }
    }
    // TODO setup player?
  };


})();
