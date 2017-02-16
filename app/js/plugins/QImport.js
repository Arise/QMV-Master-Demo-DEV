//=============================================================================
// QImport
//=============================================================================

var Imported = Imported || {};
Imported.QImport = '1.0.0';

if (!Imported.QPlus) {
  var msg = 'Error: QImport requires QPlus to work.';
  alert(msg);
  throw new Error(msg);
} else if (!QPlus.versionCheck(Imported.QPlus, '1.1.0')) {
  var msg = 'Error: QImport requires QPlus 1.1.0 or newer to work.';
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
  QImport._cache = {};
  QImport._wait = false;

  QImport.empty = function() {
    return this._queue.length === 0;
  };

  QImport.run = function() {
    var q = this._queue;
    this._wait = false;
    //console.log('Import started');
    for (var i = q.length - 1; i >= 0; i--) {
      var data = q.pop();
      var regex = /<import:(.*)?>/ig;
      var notes = data.note;
      for (;;) {
        var match = regex.exec(notes);
        if (match) {
          this.import(data, match);
          if (QImport._wait) {
            q.push(data);
            break;
          }
        } else {
          break;
        }
      }
      if (QImport._wait) break;
      DataManager.extractMetadata(data);
    }
    if (this.empty()) {
      QImport._cache = {};
    }
  };

  QImport.import = function(data, match) {
    var args = match[1].split(',').map(function(s) {
      return s.trim().toLowerCase();
    })
    var type = args.shift();
    switch (type) {
      case 'note': {
        this.importNote(data, match[0], args);
        break;
      }
      case 'event': {
        this.importEvent(data, match[0], args);
        break;
      }
    }
  };

  QImport.importNote = function(data, match, args) {
    var type = args.shift();
    //console.log('Importing notes from ' + type);
    switch (type) {
      case 'text': {
        if (this._cache[args[0]]) {
          val = this._cache[args[0]];
        } else {
          this._wait = true;
          QPlus.request(args[0], function(response) {
            QImport._cache[args[0]] = response;
            data.note = data.note.replace(match, response);
            QImport.run();
            data = null;
          });
          return;
        }
        break;
      }
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
    data.note = data.note.replace(match, val);
  };

  QImport.importEvent = function(data, match, args) {
    var mapId = Number(args[0]);
    var eventId = Number(args[1])
    console.log('Importing event ' + eventId + ' from map ' + mapId);
    var key = 'map' + mapId ;
    if (this._cache[key]) {
      data = this._cache[key];
    } else {
      this._wait = true;
      var mapPath = 'data/Map%1.json'.format(mapId.padZero(3));
      QPlus.request(mapPath, function(response) {
        QImport._wait = false;
        if (response.events && response.events[eventId]) {
          QImport._cache[key] = response;
          for (var prop in data) {
            if (prop === 'x' || prop === 'y') {
              continue;
            }
            data[prop] = response.events[eventId][prop];
          }
        }
        QImport.run();
        data = null;
      });
      return;
    }
    data.note = data.note.replace(match, '');
  };
})();

(function() {
  //-----------------------------------------------------------------------------
  // Game_Map

  var Alias_Game_Map_setupEvents = Game_Map.prototype.setupEvents;
  Game_Map.prototype.setupEvents = function() {
    Alias_Game_Map_setupEvents.call(this);
  };

  //-----------------------------------------------------------------------------
  // Game_Interpreter

  var Alias_Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
  Game_Interpreter.prototype.pluginCommand = function(command, args) {
    if (command.toLowerCase() === 'qimport') {
      this.qImportCommand(args);
      return;
    }
    Alias_Game_Interpreter_pluginCommand.call(this, command, args);
  };

  Game_Interpreter.prototype.qImportCommand = function(args) {
    //var args2 = args.slice(2);
    //QPlus.getCharacter(args[0]);
    //QPlus.getArg(args2, /lock/i)
  };

  //-----------------------------------------------------------------------------
  // DataManager

  var Alias_DataManager_extractQData = DataManager.extractQData;
  DataManager.extractQData = function(data) {
    Alias_DataManager_extractQData.call(this, data);
    if (data.meta.import) {
      QImport._queue.push(data);
    }
  };

  var Alias_DataManager_isDatabaseLoaded = DataManager.isDatabaseLoaded;
  DataManager.isDatabaseLoaded = function() {
    var loaded = Alias_DataManager_isDatabaseLoaded.call(this);
    if (loaded) {
      QImport.run();
    }
    return loaded && QImport.empty();
  };

  var Alias_DataManager_isMapLoaded = DataManager.isMapLoaded;
  DataManager.isMapLoaded = function() {
    var loaded = Alias_DataManager_isMapLoaded.call(this);
    if (loaded) {
      QImport.run();
    }
    return loaded && QImport.empty();
  };
})();
