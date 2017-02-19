//=============================================================================
// QImport
//=============================================================================

var Imported = Imported || {};
Imported.QImport = '1.0.0';

if (!Imported.QPlus) {
  var msg = 'Error: QImport requires QPlus to work.';
  alert(msg);
  throw new Error(msg);
} else if (!QPlus.versionCheck(Imported.QPlus, '1.1.1')) {
  var msg = 'Error: QImport requires QPlus 1.1.1 or newer to work.';
  alert(msg);
  throw new Error(msg);
}

//=============================================================================
 /*:
 * @plugindesc <QImport>
 * desc
 * @author Quxios  | Version 1.0.0
 *
 * @requires QPlus
 *
 * @param
 * @desc
 * @default
 *
 * @video
 *
 * @help
 * ============================================================================
 * ## About
 * ============================================================================
 *
 * ============================================================================
 * ## How to use
 * ============================================================================
 *
 * ----------------------------------------------------------------------------
 * **Sub section**
 * ----------------------------------------------------------------------------
 *
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
// QImport

function QImport() {
  throw new Error('This is a static class');
}

(function() {
  QImport._queue = [];
  QImport._scanQueue = [];
  QImport._cache = {};
  QImport._wait = false;

  QImport.empty = function() {
    return this._queue.length === 0 && this._scanQueue.length === 0;
  };

  QImport.update = function() {
    this._wait = false;
    this.updateQueue();
    this.updateScan();
    if (this.empty()) {
      QImport._cache = {};
    }
  };

  QImport.updateQueue = function() {
    var q = this._queue;
    for (var i = q.length - 1; i >= 0; i--) {
      if (this._wait) break;
      var data = q.pop();
      var regex = /<import:(.*)?>/ig;
      var notes = data.note;
      for (;;) {
        var match = regex.exec(notes);
        if (match) {
          this.import(data, 'note', match);
          if (this._wait) {
            q.push(data);
            break;
          }
        } else {
          break;
        }
      }
      if (!this._wait) {
        DataManager.extractMetadata(data);
      }
    }
  };

  QImport.updateScan = function() {
    var q = this._scanQueue;
    for (var i = q.length - 1; i >= 0; i--) {
      if (this._wait) break;
      var data = q.pop();
      if (this.isEvent(data)) {
        for (var j = 0; i < data.pages.length; i++) {
          this.scan(data.pages[i]);
          if (this._wait) {
            q.push(data);
            break;
          }
        }
      }
    }
  };

  QImport.scan = function(page) {
    for (var i = 0; i < page.list.length; i++) {
      if (this._wait) break;
      var cmd = page.list[i];
      var regex = /<import:(.*)?>/ig;
      for (;;) {
        var match = regex.exec(cmd.parameters[0]);
        if (match) {
          this.import(cmd.parameters, 0, match);
          if (this._wait) break;
          break;
        } else {
          break;
        }
      }
      console.log(cmd.parameters);
    }
  };

  QImport.import = function(data, prop, match) {
    var args = match[1].split(',').map(function(s) {
      return s.trim().toLowerCase();
    })
    var type = args.shift();
    switch (type) {
      case 'note': {
        this.importNote(data, prop, match[0], args);
        break;
      }
      case 'text':{
        this.importText(data, prop, match[0], args);
        break;
      }
      case 'event': {
        if (this.isEvent(data)) {
          this.importEvent(data, prop, match[0], args);
        } else {
          data[prop] = data[prop].replace(match, '');
        }
        break;
      }
    }
  };

  QImport.importNote = function(data, prop, match, args) {
    var type = args.shift();
    switch (type) {
      case 'actor': {
        obj = $dataActors[Number(args[0])];
        break;
      }
      case 'class': {
        obj = $dataClasses[Number(args[0])];
        break;
      }
      case 'skill': {
        obj = $dataSkills[Number(args[0])];
        break;
      }
      case 'item': {
        obj = $dataItems[Number(args[0])];
        break;
      }
      case 'weapon': {
        obj = $dataWeapons[Number(args[0])];
        break;
      }
      case 'armor': {
        obj = $dataArmors[Number(args[0])];
        break;
      }
      case 'enemy': {
        obj = $dataEnemies[Number(args[0])];
        break;
      }
      case 'state': {
        obj = $dataStates[Number(args[0])];
        break;
      }
    }
    if (obj) {
      val = obj.note || '';
    }
    data[prop] = data[prop].replace(match, val);
  };

  QImport.importText = function(data, prop, match, args) {
    if (this._cache[args[0]]) {
      val = this._cache[args[0]];
    } else {
      this._wait = true;
      QPlus.request(args[0], function(response) {
        QImport._cache[args[0]] = response;
        data[prop] = data[prop].replace(match, response);
        QImport.update();
        data = null;
      });
      return;
    }
  };

  QImport.importEvent = function(data, prop, match, args) {
    var mapId = Number(args[0]);
    var eventId = Number(args[1]);
    var key = 'map' + mapId ;
    if (this._cache[key]) {
      for (var props in data) {
        if (props === 'x' || props === 'y') {
          continue;
        }
        data[props] = this._cache[key].events[eventId][props];
      }
    } else {
      this._wait = true;
      var mapPath = 'data/Map%1.json'.format(mapId.padZero(3));
      QPlus.request(mapPath, function(response) {
        QImport._wait = false;
        if (response.events && response.events[eventId]) {
          QImport._cache[key] = response;
          for (var props in data) {
            if (props === 'x' || props === 'y') {
              continue;
            }
            data[props] = response.events[eventId][props];
          }
        }
        QImport.update();
        data = null;
      });
      return;
    }
    data[prop] = data[prop].replace(match, '');
  };

  QImport.isEvent = function(data) {
    if (!data) return false;
    if (!data.x || !data.y) return false;
    if (data.pages && data.pages.constructor === Array) return true;
    return false;
  };
})();

(function() {
  //-----------------------------------------------------------------------------
  // DataManager

  var Alias_DataManager_extractQData = DataManager.extractQData;
  DataManager.extractQData = function(data) {
    Alias_DataManager_extractQData.call(this, data);
    if (data.meta.import) {
      QImport._queue.push(data);
    } else if (data.meta.importing) {
      QImport._scanQueue.push(data);
    }
  };

  var Alias_DataManager_isDatabaseLoaded = DataManager.isDatabaseLoaded;
  DataManager.isDatabaseLoaded = function() {
    var loaded = Alias_DataManager_isDatabaseLoaded.call(this);
    if (loaded) {
      QImport.update();
    }
    return loaded && QImport.empty();
  };

  var Alias_DataManager_isMapLoaded = DataManager.isMapLoaded;
  DataManager.isMapLoaded = function() {
    var loaded = Alias_DataManager_isMapLoaded.call(this);
    if (loaded) {
      QImport.update();
    }
    return loaded && QImport.empty();
  };
})();
