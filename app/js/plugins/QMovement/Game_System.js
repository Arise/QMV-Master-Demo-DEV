//-----------------------------------------------------------------------------
// Game_System

(function() {
  var Alias_Game_System_onAfterLoad = Game_System.prototype.onAfterLoad;
  Game_System.prototype.onAfterLoad = function() {
    Alias_Game_System_onAfterLoad.call(this);
    ColliderManager.refresh();
  };
})();
