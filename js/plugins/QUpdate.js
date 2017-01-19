//=============================================================================
/*:
* @plugindesc <QUpdate>
* Checks QPlugins for updates
* @author Quxios  | Version 1.0.0
*
* @help
* ============================================================================
* ## About
* ============================================================================
* A Plugin to check if your QPlugins are up to date. Only works during local
* playtesting. Please remove / delete this plugin before deploying.
* ============================================================================
* ## How to use
* ============================================================================
*
* ============================================================================
* ## Links
* ============================================================================
* RPGMakerWebs:
*
*   http://forums.rpgmakerweb.com/index.php?/topic/73023-qplugins/
*
* Terms of use:
*
*   https://github.com/quxios/QMV-Master-Demo/blob/master/readme.md
*
* @tags updater
*/
//=============================================================================

if (!Utils.isNwjs() && !Utils.isOptionValid('test')) {
  throw new Error('QUpdate only works in desktop playtest.');
}

require('dns').lookup('quxios.github.io', function(error) {
  if (error && error.code == "ENOTFOUND") {
    throw new Error("Couldn't connect to: quxios.github.io");
  }
})

function QUpdate() {
 throw new Error('This is a static class');
}

function Scene_QUpdate() {
  this.initialize.apply(this, arguments);
}

function Window_QUpdate() {
  this.initialize.apply(this, arguments);
}

(function() {
  var fs = require('fs');
  var path = require('path');

  //-----------------------------------------------------------------------------
  // QUpdate

  QUpdate._plugins = {};

  QUpdate.getPlugins = function() {
    this._plugins = {};
    $plugins.filter(function(plugin) {
      return /^<Q.*?>/.test(plugin.description);
    }).forEach(function(plugin) {
      var name = plugin.name;
      var base = path.dirname(process.mainModule.filename);
      var filepath = path.join(base, `js/plugins/${name}.js`);
      var data = fs.readFileSync(filepath, 'utf8');
      var version = /Version (\d+.\d+.\d+)/i.exec(data);
      if (version) {
        this._plugins[name] = {
          current: version[1]
        }
      } else {
        delete this._plugins[name]
      }
    }, this)
  };
  QUpdate.getPlugins();

  QUpdate.getRepoPlugins = function() {
    var xhr = new XMLHttpRequest();
    var url = `https://quxios.github.io/data/plugins.json`;
    xhr.open('GET', url);
    xhr.overrideMimeType('application/json');
    xhr.onload = this.onLoad.bind(this, xhr);
    xhr.send();
  };

  QUpdate.onLoad = function(xhr) {
    if (xhr.status < 400) {
      var data = xhr.responseText;
      this.comparePlugins(JSON.parse(data));
      xhr = null;
    }
  };

  QUpdate.comparePlugins = function(data) {
    for (var plugin in this._plugins) {
      if (!this._plugins.hasOwnProperty(plugin)) continue;
      for (var i = 0; i < data.length; i++) {
        if (data[i].name === plugin) {
          this._plugins[plugin].latest = data[i].version;
          this._plugins[plugin].url = data[i].download;
          break;
        }
      }
    }
    this.hasUpdated = true;
  };

  //-----------------------------------------------------------------------------
  // Scene_QUpdate

  Scene_QUpdate.prototype = Object.create(Scene_Base.prototype);
  Scene_QUpdate.prototype.constructor = Scene_QUpdate;

  Scene_QUpdate.prototype.start = function() {
    Scene_Base.prototype.start.call(this);
    this.createWindow();
    QUpdate.getRepoPlugins();
  };

  Scene_QUpdate.prototype.createWindow = function() {
    this.createWindowLayer();
    this._updateWindow = new Window_QUpdate();
    this._updateWindow.setHandler('ok',     this.onUpdateOk.bind(this));
    this._updateWindow.setHandler('cancel', this.popScene.bind(this));
    this.addWindow(this._updateWindow);
  };

  Scene_QUpdate.prototype.onUpdateOk = function() {
    var plugin = this._updateWindow.currentData().name;
    if (this._plugins[plugin]) {
      var url = this._plugins[plugin].url;
      if (url) {
        var cmd;
        if (process.platform === "darwin") cmd = "open";
        if (process.platform === "win32") cmd = "explorer.exe";
        if (process.platform === "linux") cmd = "xdg-open";
        if (cmd) {
          var spawn = require('child_process').spawn;
          spawn(cmd, [url]);
        }
      }
    }
    this._updateWindow.activate();
  };

  Scene_QUpdate.prototype.update = function() {
    Scene_Base.prototype.update.call(this);
    if (QUpdate.hasUpdated) {
      this._plugins = QUpdate._plugins;
      this._updateWindow.setList(this._plugins);
      QUpdate.hasUpdated = false;
    }
  };


  //-----------------------------------------------------------------------------
  // Window_QUpdate

  Window_QUpdate.prototype = Object.create(Window_Command.prototype);
  Window_QUpdate.prototype.constructor = Window_QUpdate;

  Window_QUpdate.prototype.initialize = function() {
    Window_Command.prototype.initialize.call(this, 0, 0);
    this._plugins = {};
  };

  Window_QUpdate.prototype.windowWidth = function() {
    return Graphics.width;
  };

  Window_QUpdate.prototype.windowHeight = function() {
    return Graphics.height;
  };

  Window_QUpdate.prototype.setList = function(plugins) {
    this._plugins = Object.assign({}, plugins);
    this.refresh();
  };

  Window_QUpdate.prototype.makeCommandList = function() {
    for (var plugin in this._plugins) {
      if (!this._plugins.hasOwnProperty(plugin)) continue;
      this.addCommand(String(plugin), 'update');
    }
  };

  Window_QUpdate.prototype.drawItem = function(index) {
    var rect = this.itemRectForText(index);
    this.resetTextColor();
    this.changePaintOpacity(this.isCommandEnabled(index));
    var w = rect.width / 3;
    var name = this.commandName(index)
    var current = this._plugins[name].current;
    var latest  = this._plugins[name].latest || '0.0.0';
    if (!this.versionCheck(current, latest)) {
      this.changeTextColor('#FF0000');
    }
    this.drawText(name, 0, rect.y, w);
    this.drawText(`Current: ${current}`, w, rect.y, w);
    this.drawText(`Latest: ${latest}`, w * 2, rect.y, w);
  };

  Window_QUpdate.prototype.versionCheck = function(version, targetVersion) {
    version = version.split('.').map(Number);
    targetVersion = targetVersion.split('.').map(Number);
    if (version[0] < targetVersion[0]) return false;
    if (version[1] < targetVersion[1]) return false;
    if (version[2] < targetVersion[2]) return false;
    return true;
  };

  //-----------------------------------------------------------------------------
  // Scene_Title

  var Alias_Scene_Title_update = Scene_Title.prototype.update;
  Scene_Title.prototype.update = function() {
    Alias_Scene_Title_update.call(this);
    if (Input.isTriggered('debug')) {
      SceneManager.push(Scene_QUpdate);
    }
  };
})()
