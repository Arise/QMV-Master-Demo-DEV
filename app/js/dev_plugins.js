//-----------------------------------------------------------------------------
// PluginManager
//
// The static class that manages the plugins.

(function() {
  var Alias_PluginManager_loadScript = PluginManager.loadScript;
  PluginManager.loadScript = function(name) {
    if (/\-dev\.js$/.test(name)) {
      Alias_PluginManager_loadScript.call(this, name);
      this.loadDevScript(name);
    } else {
      Alias_PluginManager_loadScript.call(this, name);
    }
  };

  // Loads additional plugins listed inside the -dev plugin
  PluginManager.loadDevScript = function(name) {
    var fs = require('fs');
    var path = require('path');
    var base = path.dirname(process.mainModule.filename);
    base = path.join(base, 'js/plugins/');
    var file = fs.readFileSync(base + name, 'utf8');
    var params = /\/\*\*:merge([\s\S]*?)>([\s\S]*?)\*\/[\n|\r|\r\n]*/i.exec(file);
    if (!params) return;
    var files = params[1].replace(/\r/g, '\n').replace(/\n{2,}/g, '\n');
    files = files.split('\n').map(function (s) { return s.trim() });
    files.forEach(function (file) {
      if (file) {
        PluginManager.loadScript(file);
      }
    });
  };
})();
