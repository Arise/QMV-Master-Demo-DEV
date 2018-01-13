//=============================================================================
// QLoader
//=============================================================================

var Imported = Imported || {};

if (!Imported.QPlus || !QPlus.versionCheck(Imported.QPlus, '1.7.0')) {
  alert('Error: QLoader requires QPlus 1.7.0 or newer to work.');
  throw new Error('Error: QLoader requires QPlus 1.7.0 or newer to work.');
}

Imported.QLoader = '1.0.0';

//=============================================================================
/*:
 * @plugindesc <QLoader>
 * desc
 * @version 1.0.0
 * @author Quxios  | Version 1.0.0
 * @site https://quxios.github.io/
 * @updateurl https://quxios.github.io/data/pluginsMin.json
 * 
 * @requires
 *
 * @video
 *
 * @param
 * @desc
 * @default
 *
 * @param ===========
 * @desc spacer
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
 * Formated Help:
 *
 *  https://quxios.github.io/#/plugins/QLoader
 *
 * RPGMakerWebs:
 *
 *  http://forums.rpgmakerweb.com/index.php?threads/qplugins.73023/
 *
 * Terms of use:
 *
 *  https://github.com/quxios/QMV-Master-Demo/blob/master/readme.md
 *
 * Like my plugins? Support me on Patreon!
 *
 *  https://www.patreon.com/quxios
 *
 * @tags
 */
//=============================================================================

//=============================================================================
// QLoader Static Class

function QLoader() {
  throw new Error('This is a static class');
}

//=============================================================================
// New Classes

function Scene_Loading() {
  this.initialize.apply(this, arguments);
}

//=============================================================================
// QLoader

(function() {
  var _PARAMS = QPlus.getParams('<QLoader>', true);

  //-----------------------------------------------------------------------------
  // SceneManager

  SceneManager.updateScene = function() {
    if (this._scene) {
      if (!this._sceneStarted && this._scene.isReady()) {
        this._scene.start();
        this._sceneStarted = true;
        this.onSceneStart();
      }
      if (this.isCurrentSceneStarted()) {
        this._scene.update();
      }
    }
  };

  SceneManager.renderScene = function() {
    if (this.isCurrentSceneStarted()) {
      Graphics.render(this._scene);
    } else if (this._scene) {
      Graphics.render(this._loadingScene);
    }
  };

  SceneManager.onSceneCreate = function() {
    this._loadingScene.reset();
  };

  SceneManager.onSceneLoading = function() {
    this._loadingScene.update();
  };

  //-----------------------------------------------------------------------------
  // Game_Interpreter

  var Alias_Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
  Game_Interpreter.prototype.pluginCommand = function(command, args) {
    if (command.toLowerCase() === 'qplugin') {
      return this.qPluginCommand(QPlus.makeArgs(args));
    }
    Alias_Game_Interpreter_pluginCommand.call(this, command, args);
  };

  Game_Interpreter.prototype.qPluginCommand = function(args) {
    //var args2 = args.slice(2);
    //QPlus.getCharacter(args[0]);
    //QPlus.getArg(args2, /lock/i)
  };

  //-----------------------------------------------------------------------------
  // Scene_Loading

  Scene_Loading.prototype = Object.create(Stage.prototype);
  Scene_Loading.prototype.constructor = Scene_Loading;

  Scene_Loading.prototype.initialize = function() {
    Stage.prototype.initialize.call(this);
    this.setup();
    this._tick = 0;
  };

  Scene_Loading.prototype.setup = function() {
    this._text = new PIXI.Text('Loading...', {
      fill: 0xffffff
    });
    this.addChild(this._text);
  };

  Scene_Loading.prototype.reset = function() {
    console.log(SceneManager._scene.constructor, SceneManager._nextScene);
    this._tick = 0;
  };

  Scene_Loading.prototype.update = function() {

  };

  var Alias_Scene_Base_initialize = Scene_Base.prototype.initialize;
  Scene_Base.prototype.initialize = function() {
    Alias_Scene_Base_initialize.call(this);
    this._preWait = false;
    QPlus.wait(600, function() {
      this._preWait = true;
    }.bind(this))
  };

  Scene_Base.prototype.isReady = function() {
    return ImageManager.isReady() && this._preWait;
  };

  SceneManager._loadingScene = new Scene_Loading();
})();
