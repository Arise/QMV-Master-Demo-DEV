/**:merge
  FOLDER/file1
  FOLDER/file2
  > OUTPUT.js
*/
*
/**:ignore*/
function something() {

}
/**:endignore*/

//=============================================================================
// QName
//=============================================================================

var Imported = Imported || {};

if (!Imported.QPlus) {
  alert('Error: QName requires QPlus to work.');
  throw new Error('Error: QName requires QPlus to work.');
}

Imported.QName = '1.0.0';

//=============================================================================
 /*:
 * @plugindesc <QName>
 * desc
 * @author Quxios  | Version 1.0.0
 *
 * @requires
 *
 * @video
 *
 * @param
 * @desc
 * @default
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
// QName Static Class

function QName() {
  throw new Error('This is a static class');
}

//=============================================================================
// New Classes

function NewClass() {
  this.initialize.apply(this, arguments);
}

//=============================================================================
// QName

(function() {
  //-----------------------------------------------------------------------------
  // Game_Interpreter
  //
  // The interpreter for running event commands.

  var Alias_Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
  Game_Interpreter.prototype.pluginCommand = function(command, args) {
    if (command.toLowerCase() === 'qplugin') {
      this.qPluginCommand(args);
      return;
    }
    Alias_Game_Interpreter_pluginCommand.call(this, command, args);
  };

  Game_Interpreter.prototype.qPluginCommand = function(args) {
    //var args2 = args.slice(2);
    //QPlus.getCharacter(args[0]);
    //QPlus.getArg(args2, /lock/i)
  };
})()
