//=============================================================================
// QDebug
//=============================================================================

var Imported = Imported || {};

if (!Imported.QPlus || !QPlus.versionCheck(Imported.QPlus, '1.4.4')) {
  alert('Error: QDebug requires QPlus 1.4.4 or newer to work.');
  throw new Error('Error: QDebug requires QPlus 1.4.4 or newer to work.');
}

Imported.QDebug = '1.0.0';

//=============================================================================
 /*/*:
 * @plugindesc <QDebug>
 * something
 * @author Quxios  | Version 1.0.0
 *
 * @requires QPlus
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
// QDebug Static Class

function QDebug() {
  throw new Error('This is a static class');
}

//=============================================================================
// QDebug

(function() {
  var _PARAMS = QPlus.getParams('<QDebug>', true);

  var _GUI = require('nw.gui');

  QDebug.open = function() {
    if (this._win) return;
    this._win = _GUI.Window.open('', {
      title: 'Debug',
      toolbar: false,
    });
    this.setupWin();
  };

  QDebug.setupWin = function() {
    var mainWin = _GUI.Window.get();
    mainWin.on('close', this.onMainClose);
    window.addEventListener('beforeunload', this.onMainUnload);
    this._win.on('closed', this.onClosed);
    this._win.on('loaded', this.onLoaded);
  };

  QDebug.setupHTML = function() {
    var body = this._win.window.document.body;
    body.innerHTML = 'Hello World.';
  };

  QDebug.onLoaded = function() {
    this.setupHTML();
  }.bind(QDebug);

  QDebug.onClosed = function() {
    var mainWin = _GUI.Window.get();
    mainWin.removeListener('close', this.onMainClose);
    window.removeEventListener('beforeunload', this.onMainUnload);
    this._win = null;
  }.bind(QDebug);

  QDebug.onMainClose = function() {
    var mainWin = _GUI.Window.get();
    mainWin.hide();
    if (this._win) {
      this._win.close(true);
    }
    mainWin.close(true);
  }.bind(QDebug);

  QDebug.onMainUnload = function() {
    if (!this._win) return;
    this._win.close(true);
  }.bind(QDebug);

})();
