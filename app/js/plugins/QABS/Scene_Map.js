//-----------------------------------------------------------------------------
// Scene_Map

(function() {
  var Alias_Scene_Map_initialize = Scene_Map.prototype.initialize;
  Scene_Map.prototype.initialize = function() {
    Alias_Scene_Map_initialize.call(this);
    $gameSystem.preloadSkills();
  };

  var Alias_Scene_Map_isMenuCalled = Scene_Map.prototype.isMenuCalled;
  Scene_Map.prototype.isMenuCalled = function() {
    if ($gameSystem.anyAbsMouse2()) return Input.isTriggered('menu');
    return Alias_Scene_Map_isMenuCalled(this);
  };
})();
