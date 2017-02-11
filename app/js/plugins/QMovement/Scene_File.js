//-----------------------------------------------------------------------------
// Scene_File / Scene_Load

(function() {
  if (Imported.YEP_SaveCore) { // yanflys uses scene_file instead of scene_load
    var Alias_Scene_File_onLoadSuccess = Scene_File.prototype.onLoadSuccess;
    Scene_File.prototype.onLoadSuccess = function() {
      Alias_Scene_File_onLoadSuccess.call(this);
      ColliderManager._needsRefresh = true;
    };
  } else {
    var Alias_Scene_Load_onLoadSuccess = Scene_Load.prototype.onLoadSuccess;
    Scene_Load.prototype.onLoadSuccess = function() {
      Alias_Scene_Load_onLoadSuccess.call(this);
      ColliderManager._needsRefresh = true;
    };
  }
})();
