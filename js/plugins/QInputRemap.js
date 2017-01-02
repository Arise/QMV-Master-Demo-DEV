//=============================================================================
// QInputRemap
//=============================================================================

var Imported = Imported || {};
Imported.QInputRemap = '2.0.0';

if (!Imported.QInput) {
  var msg = 'Error: QInputRemap requires QInput to work.';
  alert(msg);
  throw new Error(msg);
}

//=============================================================================
 /*:
 * @plugindesc <QInputRemap>
 * Quasi Input Addon: Adds Key remapping to Options menu
 * @author Quxios  | Version 1.0.0
 *
 * @requires QInput
 *
 * @param Hide Keys
 * @desc Which keys to not show in Input Config
 * Default:
 * @default
 *
 * @param Disable Keys
 * @desc Which keys to not be able to set in Input Config
 * Default: ok, escape
 * @default ok, escape
 *
 * @param ===========
 * @desc spacer
 * @default
 *
 * @param Vocab: Ok
 * @desc Vocab for Ok input
 * Default: Action
 * @default Action
 *
 * @param Vocab: Escape
 * @desc Vocab for Escape input
 * Default: Cancel
 * @default Cancel
 *
 * @param Vocab: Shift
 * @desc Vocab for Shift input
 * Default: Run
 * @default Run
 *
 * @param Vocab: Control
 * @desc Vocab for Control input
 * Default: Control
 * @default Control
 *
 * @param Vocab: Tab
 * @desc Vocab for Tab input
 * Default: Tab
 * @default Tab
 *
 * @param Vocab: Pageup
 * @desc Vocab for Pageup input
 * Default: Next
 * @default Next
 *
 * @param Vocab: Pagedown
 * @desc Vocab for Pagedown input
 * Default: Prev
 * @default Prev
 *
 * @param Vocab: Up
 * @desc Vocab for Up input
 * Default: Up
 * @default Up
 *
 * @param Vocab: Down
 * @desc Vocab for Down input
 * Default: Down
 * @default Down
 *
 * @param Vocab: Left
 * @desc Vocab for Left input
 * Default: Left
 * @default Left
 *
 * @param Vocab: Right
 * @desc Vocab for Right input
 * Default: Right
 * @default Right
 *
 * @help
 * ============================================================================
 * ## About
 * ============================================================================
 * This plugin adds an input remapping window to the Scene_Options. This lets
 * players change their keybinds ingame.
 * ============================================================================
 * ## How to use
 * ============================================================================
 * Place this anywhere below QInput plugin. Input configs are saved into the
 * `saves/config.rpgsave` file
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
 * @tags input, options
 */
//=============================================================================

//-----------------------------------------------------------------------------
// New Classes

function Window_InputRemap() {
    this.initialize.apply(this, arguments);
}

//=============================================================================
// QInputRemap

(function() {
  var _params = $plugins.filter(function(p) {
    return p.description.contains('<QInputRemap>') && p.status;
  })[0].parameters;

  var _hide = QInput.stringToAry(_params['Hide Keys']);
  _hide     = _hide.concat(["fps", "console", "restart", "debug", "streched", "fullscreen"]);
  var _disable = QInput.stringToAry(_params['Disable Keys']);
  var _vocab   = {};
  for (var key in _params) {
    if (!_params.hasOwnProperty(key)) continue;
    var match = /^Vocab: (.*)/.exec(key);
    if (match) {
      _vocab[match[1].toLowerCase()] = _params[key];
    }
  }

  //-----------------------------------------------------------------------------
  // Scene_Options

  var Alias_Scene_Options_createOptionsWindow = Scene_Options.prototype.createOptionsWindow;
  Scene_Options.prototype.createOptionsWindow = function() {
    Alias_Scene_Options_createOptionsWindow.call(this);
    this._optionsWindow.setHandler('input', this.commandInputs.bind(this));
    this._inputWindow = new Window_InputRemap();
    this.addWindow(this._inputWindow);
  };

  Scene_Options.prototype.commandInputs = function() {
    this._optionsWindow.hide();
    this._optionsWindow.deactivate();
    this._inputWindow.select(0);
    this._inputWindow.show();
    this._inputWindow.activate();
    this._inputWindow.setHandler('cancel',  this.hideInputs.bind(this));
    this._inputWindow.setHandler('set',     this.startInputSet.bind(this));
    this._inputWindow.setHandler('default', this.setDefaultInput.bind(this));
  };

  Scene_Options.prototype.setDefaultInput = function() {
    ConfigManager.keys = JSON.parse(JSON.stringify(QuasiInput.remapped));
    ConfigManager.save();
    this._inputWindow.refresh();
    this._inputWindow.activate();
  };

  Scene_Options.prototype.hideInputs = function() {
    this._optionsWindow.show();
    this._optionsWindow.activate();
    this._inputWindow.hide();
    this._inputWindow.deselect();
  };

  Scene_Options.prototype.startInputSet = function() {
    var ext = this._inputWindow.currentExt();
    ConfigManager.keys[ext] = "";
    this._waitForInput = true;
    this._inputWindow.refresh();
  };

  Scene_Options.prototype.setInput = function() {
    var ext   = this._inputWindow.currentExt();
    var input = "#" + Input._lastTriggered;
    var fail;
    for (var key in ConfigManager.keys) {
      if (!ConfigManager.keys.hasOwnProperty(key)) continue;
      if (ConfigManager.keys[key].constructor === Array) {
        var index = ConfigManager.keys[key].indexOf(input);
        if (index > -1) {
          if (_disable.contains(key)) {
            fail = true;
            break;
          }
          ConfigManager.keys[key] = "";
        }
      } else if (ConfigManager.keys[key] === input) {
        if (_disable.contains(key)) {
          fail = true;
          break;
        }
        ConfigManager.keys[key] = "";
      }
    }
    if (fail) {
      SoundManager.playBuzzer();
      return;
    }
    SoundManager.playOk();
    ConfigManager.keys[ext] = input;
    this._waitForInput = false;
    this._inputWindow.activate();
    this._inputWindow.refresh();
    ConfigManager.save();
  };

  var Alias_Scene_Options_update = Scene_Options.prototype.update;
  Scene_Options.prototype.update = function() {
    Alias_Scene_Options_update.call(this);
    if (this._waitForInput) this.updateWaitForInput();
  };

  Scene_Options.prototype.updateWaitForInput = function() {
    if (Input.anyTriggered()) this.setInput();
  };

  //-----------------------------------------------------------------------------
  // Window_Options

  var Alias_Window_Options_makeCommandList = Window_Options.prototype.makeCommandList;
  Window_Options.prototype.makeCommandList = function() {
    Alias_Window_Options_makeCommandList.call(this);
    this.addCommand('Key Input', 'input');
  };

  var Alias_Window_Options_drawItem = Window_Options.prototype.drawItem;
  Window_Options.prototype.drawItem = function(index) {
    if (this.commandName(index) === 'Key Input') {
      var rect = this.itemRectForText(index);
      var statusWidth = this.statusWidth();
      var titleWidth = rect.width - statusWidth;
      this.resetTextColor();
      this.changePaintOpacity(this.isCommandEnabled(index));
      this.drawText(this.commandName(index), rect.x, rect.y, titleWidth);
      return;
    }
    Alias_Window_Options_drawItem.call(this, index);
  };

  var Alias_Window_Options_processOk = Window_Options.prototype.processOk;
  Window_Options.prototype.processOk = function() {
    var symbol = this.commandSymbol(this.index());
    if (symbol === 'input') {
      this.playOkSound();
      this.updateInputData();
      this.deactivate();
      this.callHandler('input');
      return;
    }
    Alias_Window_Options_processOk.call(this);
  };

  //-----------------------------------------------------------------------------
  // Window_InputRemap

  Window_InputRemap.prototype = Object.create(Window_Command.prototype);
  Window_InputRemap.prototype.constructor = Window_InputRemap;

  Window_InputRemap.prototype.initialize = function() {
    Window_Command.prototype.initialize.call(this, 0, 0);
    this.hide();
    this.deactivate();
    this.updatePlacement();
  };

  Window_InputRemap.prototype.windowWidth = function() {
    return 400;
  };

  Window_InputRemap.prototype.windowHeight = function() {
    return this.fittingHeight(Math.min(this.numVisibleRows(), 12));
  };

  Window_InputRemap.prototype.updatePlacement = function() {
    this.x = (Graphics.boxWidth - this.width) / 2;
    this.y = (Graphics.boxHeight - this.height) / 2;
  };

  Window_InputRemap.prototype.makeCommandList = function() {
    // Commands added in seperate methods so you
    // can easily swap their places / add different
    // key sets before, after or between.
    this.addActionKeys();
    this.addMoveKeys();
    this.addCommand('Set Default', 'default');
  };

  Window_InputRemap.prototype.addActionKeys = function() {
    this.addCommand('Action Keys', 'spaceholder', false);
    var actionkeys = ['ok', 'escape', 'shift', 'control', 'tab', 'pageup', 'pagedown'];
    for (var i = 0; i < actionkeys.length; i++) {
      this.addKey(actionkeys[i]);
    }
  };

  Window_InputRemap.prototype.addMoveKeys = function() {
    this.addCommand('Move Keys', 'spaceholder', false);
    var movekeys = ['up', 'down', 'left', 'right'];
    for (var i = 0; i < movekeys.length; i++) {
      this.addKey(movekeys[i]);
    }
  };

  Window_InputRemap.prototype.addKey = function(key) {
    if (!ConfigManager.keys.hasOwnProperty(key)) return;
    if (_hide.contains(key)) return;
    var enabled = !_disable.contains(key);
    var vocab = _vocab[key];
    this.addCommand(vocab, 'set', enabled, key);
  };

  Window_InputRemap.prototype.processOk = function() {
    var sym   = this.commandSymbol(this.index());
    if (sym === 'spaceholder') return;
    Window_Command.prototype.processOk.call(this);
  };

  Window_InputRemap.prototype.drawItem = function(index) {
    var rect = this.itemRectForText(index);
    var statusWidth = this.statusWidth();
    var titleWidth  = rect.width - statusWidth;
    var name  = this.commandName(index);
    var key   = this._list[index].ext;
    var sym   = this.commandSymbol(index);
    this.resetTextColor();
    this.changePaintOpacity(true);
    if (sym === 'set') {
      var value = ConfigManager.keys[key];
      value = value.constructor === Array ? value[0] || '' : value;
      value = value.replace(/^#/, '');
      // Should probably format special characters so they
      // show the character instead of the name for it,
      // Ex ";" instead of "semicolon"
      this.drawText(name, rect.x, rect.y, titleWidth, 'left');
      this.changePaintOpacity(this.isCommandEnabled(index));
      this.drawText(value, titleWidth, rect.y, statusWidth, 'right');
    } else {
      // Title of Key set
      this.drawText(name, rect.x, rect.y, rect.width, 'center');
    }
  };

  Window_InputRemap.prototype.statusWidth = function() {
    return 120;
  };

  //-----------------------------------------------------------------------------
  // ConfigManager

  var Alias_ConfigManager_makeData = ConfigManager.makeData;
  ConfigManager.makeData = function() {
    var config = Alias_ConfigManager_makeData.call(this);
    config.keys = this.keys;
    return config;
  };

  var Alias_ConfigManager_applyData = ConfigManager.applyData;
  ConfigManager.applyData = function(config) {
    Alias_ConfigManager_applyData.call(this, config);
    this.keys = config.keys || this.keys;
  };
})()
