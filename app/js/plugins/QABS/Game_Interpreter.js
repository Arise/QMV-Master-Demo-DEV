//-----------------------------------------------------------------------------
// Game_Interpreter

(function() {
  var Alias_Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
  Game_Interpreter.prototype.pluginCommand = function(command, args) {
    if (command.toLowerCase() === 'qabs') {
      return this.qABSCommand(QPlus.makeArgs(args));
    }
    Alias_Game_Interpreter_pluginCommand.call(this, command, args);
  };

  Game_Interpreter.prototype.qABSCommand = function(args) {
    var cmd = args.shift().toLowerCase();
    if (cmd === 'disable' || cmd === 'enable') {
      if (args.length === 0) {
        $gameSystem._absEnabled = cmd === 'enable';
      } else {
        for (var i = 0; i < args.length; i++) {
          var chara = QPlus.getCharacter(args[i]);
          if (chara.constructor === Game_Event) {
            var id = chara.eventId();
            var mapId = chara._mapId;
            if (cmd === 'enable') {
              $gameSystem.enableEnemy(mapId, id);
            } else {
              $gameSystem.disableEnemy(mapId, id);
            }
          }
        }
      }
      return;
    }
    if (cmd === 'override') {
      var key = Number(args.shift());
      var skillId = Number(args.shift());
      if (skillId === -1) {
        skillId = null;
      }
      $gameSystem.changeABSOverrideSkill(key, skillId);
      return;
    }
  };
})();
