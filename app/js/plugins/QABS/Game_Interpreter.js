//-----------------------------------------------------------------------------
// Game_Interpreter

(function() {
  var Alias_Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
  Game_Interpreter.prototype.pluginCommand = function(command, args) {
    if (command.toLowerCase() === 'qabs') {
      return this.qABSCommand(args);
    }
    Alias_Game_Interpreter_pluginCommand.call(this, command, args);
  };

  Game_Interpreter.prototype.qABSCommand = function(args) {
    // TODO
  };
})();
