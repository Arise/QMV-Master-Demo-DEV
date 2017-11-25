//=============================================================================
// QDebug
//=============================================================================

var Imported = Imported || {};

if (!Imported.QPlus || !QPlus.versionCheck(Imported.QPlus, '1.4.4')) {
  alert('Error: QDebug requires QPlus 1.4.4 or newer to work.');
  throw new Error('Error: QDebug requires QPlus 1.4.4 or newer to work.');
} else if (!Utils.isNwjs() || !Utils.isOptionValid('test')) {
  alert('Error: QDebug only works on local test play.');
  throw new Error('Error: QDebug only works on local test play.');
} else if (Imported.QElectron) {
  alert('Error: QDebug does not work with QElectron.');
  throw new Error('Error: QDebug does not work with QElectron.');
}

Imported.QDebug = '1.0.0';

//=============================================================================
/*:
 * @plugindesc <QDebug>
 * A better debug for MV
 * @version 1.0.0
 * @author Quxios  | Version 1.0.0
 * @site https://quxios.github.io/
 * @updateurl https://quxios.github.io/data/pluginsMin.json
 * 
 * @private
 *
 * @requires QPlus
 *
 * @help
 * ============================================================================
 * ## About
 * ============================================================================
 * A better debug menu for MV. This debugger opens an external window so
 * you can do changes without leaving the map. This debugger lets you change
 * switches, variables, event self switches, and gain items/weapons/armors/gold.
 * ============================================================================
 * ## How to use
 * ============================================================================
 * Pushing F9 will open the QDebug instead of the Debug Menu.
 * Left clicking on a switch / selfswitch will toggle it's value
 * Change a variables value by changing the value in the input field
 * Left clicking an item will give you 1 of that item. Right click on an item
 * for a prompt to type in how much you want to gain of that item.
 *
 * *Note* Does not work with Electron wrapped projects.
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
 * @tags debug, patreon-only
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

  //-----------------------------------------------------------------------------
  // QDebug

  QDebug.open = function() {
    if (this._win) return;
    this._win = _GUI.Window.open('', {
      title: 'Debug',
      toolbar: false,
    });
    this.setupWin();
  };

  QDebug.close = function() {
    if (!this._win) return;
    this._win.close(true);
  };

  QDebug.style = function() {
    var bgPrimary = '#1E2124';
    var bgSecondary = '#2E3136';
    var textPrimary = '#D9D9D9';
    var textHighlight = '#FFFFFF';
    var textDisabled = '#FF1111';
    var border = '#1E2124';
    var highlight = '#03A9F4';
    return `
      html {
        height: 100%;
      }
      body {
        width: 100%;
        height: 100%;
        margin: 0;
        padding: 0;
        background-color: ${bgPrimary};
        color: ${textPrimary};
      }
      ul {
        list-style-type: none;
        margin: 0;
        padding: 0;
      }
      li {
        padding: 5px 10px;
        cursor: pointer;
        background-color: inherit;
        box-sizing: border-box;
      }
      li:hover {
        background-color: ${highlight};
        color: ${textHighlight};
      }
      li.active {
        background-color: ${highlight};
      }
      #sidebar {
        width: 200px;
        height: 100%;
        max-height: 100%;
        overflow: auto;
        float: left;
      }
      #page {
        width: calc(100% - 200px);
        height: 100%;
        max-height: 100%;
        overflow: auto;
        float: left;
        background-color: ${bgSecondary};
      }
      #page .header {
        cursor: default;
      }
      #page .header:hover {
        background-color: inherit;
      }
      #page .events:hover {
        color: inherit;
      }
      #page .eventSS {
        margin-right: 5px;
        color: inherit;
      }
      #page .eventSS:hover {
        color: ${textHighlight} !important;
      }
      .disabled {
        color: ${textDisabled} !important;
      }
      .flex-row {
        display: flex;
        flex-direction: row;
      }
    `;
  };

  QDebug.setupWin = function() {
    var mainWin = _GUI.Window.get();
    mainWin.on('close', this.onMainClose);
    window.addEventListener('beforeunload', this.onMainUnload);
    this._win.on('closed', this.onClosed);
    this._win.on('loaded', this.onLoaded);
  };

  QDebug.setupHTML = function() {
    var head = this._win.window.document.head;
    head.innerHTML = `
      <style>
        ${this.style()}
      </style>
      <title>QDebug</title>
    `;
    var body = this._win.window.document.body;
    body.innerHTML = '';
    body.appendChild(this.setupSidebar());
    body.appendChild(this.setupPage());
    this.setPage(this.pages()[0]);
  };

  QDebug.setupSidebar = function() {
    var sidebar = document.createElement('ul');
    sidebar.id = 'sidebar';
    this.pages().forEach(function(page) {
      var li = document.createElement('li');
      li.innerHTML = page;
      li.onclick = QDebug.setPage.bind(QDebug, page);
      li.id = `li-${page}`;
      sidebar.appendChild(li);
    }.bind(this));
    return sidebar;
  };

  QDebug.setupPage = function() {
    var page = document.createElement('div');
    page.id = 'page';
    return page;
  };

  QDebug.setPage = function(page) {
    if (!this._win) return;
    if (!this.pages().contains(page)) return;
    var doc = this._win.window.document;
    var old = doc.getElementById(`li-${this._currentPage}`);
    if (old) {
      old.classList.remove('active');
    }
    this._currentPage = page;
    var next = doc.getElementById(`li-${this._currentPage}`);
    if (next) {
      next.classList.add('active');
    }
    this.drawPage(page);
  };

  QDebug.drawPage = function(page) {
    if (!this._win) return;
    page = page || this._currentPage;
    var doc = this._win.window.document;
    var pageDiv = doc.getElementById('page');
    pageDiv.scrollTop = 0;
    pageDiv.innerHTML = '';
    if (page === 'Switches') return this.drawSwitchesPage(pageDiv);
    if (page === 'Variables') return this.drawVariablesPage(pageDiv);
    if (page === 'Items') return this.drawItemsPage(pageDiv, 'item');
    if (page === 'Weapons') return this.drawItemsPage(pageDiv, 'wep');
    if (page === 'Armor') return this.drawItemsPage(pageDiv, 'armor');
    if (page === 'Events') return this.drawEventsPage(pageDiv);
    return pageDiv;
  };

  QDebug.drawSwitchesPage = function(div) {
    var ul = document.createElement('ul');
    var block = function(left, right, classes) {
      var container = document.createElement('li');
      container.innerHTML = `
        <div style="width: 75%">${left}</div>
        <div style="width: 25%">${right}</div>
      `;
      container.className = 'flex-row ' + (classes || '');
      return container;
    }
    ul.appendChild(block('Name', 'Value', 'header'));
    $dataSystem.switches.forEach(function(switchName, i) {
      if (i === 0) return;
      var value = $gameSwitches.value(i) ? 'On' : 'Off';
      var row = block(`${i}. ${switchName || '-UNNAMED-'}`, value, 'switch');
      row.lastElementChild.id = `switch-${i}-value`;
      row.lastElementChild.className = value === 'On' ? '' : 'disabled';
      row.onclick = function(id) {
        $gameSwitches.setValue(id, !$gameSwitches.value(id));
      }.bind(row, i);
      ul.appendChild(row);
    });
    div.appendChild(ul);
  };

  QDebug.drawVariablesPage = function(div) {
    var ul = document.createElement('ul');
    var block = function(left, right, classes) {
      var container = document.createElement('li');
      container.innerHTML = `
        <div style="width: 50%">${left}</div>
        <div style="width: 50%">${right}</div>
      `;
      container.className = 'flex-row ' + (classes || '');
      return container;
    }
    ul.appendChild(block('Name', 'Value', 'header'));
    $dataSystem.variables.forEach(function(varName, i) {
      if (i === 0) return;
      var value = $gameVariables.value(i);
      var row = block(`${i}. ${varName || '-UNNAMED-'}`, '', 'variable');
      var last = row.lastElementChild;
      var input = document.createElement('input');
      input.value = value;
      input.onchange = function(id) {
        var val = this.value;
        if (!isNaN(val)) val = Number(val);
        $gameVariables.setValue(id, val);
      }.bind(input, i);
      row.onclick = function(input) {
        input.focus();
      }.bind(row, input);
      input.id = `variable-${i}-value`;
      last.appendChild(input);
      ul.appendChild(row);
    });
    div.appendChild(ul);
  };

  QDebug.drawItemsPage = function(div, type) {
    var container = null;
    if (type === 'item') container = $dataItems;
    if (type === 'wep') container = $dataWeapons;
    if (type === 'armor') container = $dataArmors;
    if (!container) return;
    var ul = document.createElement('ul');
    var block = function(left, right, classes) {
      var container = document.createElement('li');
      container.innerHTML = `
        <div style="width: 75%">${left}</div>
        <div style="width: 25%">${right}</div>
      `;
      container.className = 'flex-row ' + (classes || '');
      return container;
    }
    ul.appendChild(block('Name', 'Total', 'header'));
    if (type === 'item') {
      var gold = block('Gold', $gameParty.gold(), 'gold');
      gold.lastElementChild.id = 'item-gold';
      gold.onclick = function(win) {
        var amt = win.prompt('Amount', 1);
        $gameParty.gainGold(Number(amt) || 0);
      }.bind(gold, this._win.window);
      ul.appendChild(gold);
    }
    container.forEach(function(item, i) {
      if (i === 0) return;
      var value = $gameParty.numItems(item);
      var row = block(`${i}. ${item.name || '-UNNAMED-'}`, value, type);
      row.lastElementChild.id = `item-${type}-${i}-num`;
      row.onclick = function(item) {
        $gameParty.gainItem(item, 1);
      }.bind(row, item);
      row.oncontextmenu = function(win, item) {
        var amt = win.prompt('Amount', 1);
        $gameParty.gainItem(item, Number(amt) || 0);
      }.bind(row, this._win.window, item);
      ul.appendChild(row);
    }.bind(this));
    div.appendChild(ul);
  };

  QDebug.drawEventsPage = function(div) {
    var events = $gameMap.events();
    if (!events) return;
    var ul = document.createElement('ul');
    var block = function(left, right, classes) {
      var container = document.createElement('li');
      container.innerHTML = `
        <div style="width: 50%">${left}</div>
        <div style="width: 50%">${right}</div>
      `;
      container.className = 'flex-row ' + (classes || '');
      return container;
    }
    ul.appendChild(block('Name', 'SelfSwitch', 'header'));
    events.forEach(function(event) {
      var data = event.event();
      if (!data) return;
      var row = block(`${event._eventId}. ${data.name || '-UNNAMED-'}`, '', 'events');
      var last = row.lastElementChild;
      for (var i = 0; i < 4; i++) {
        var ss = (['A', 'B', 'C', 'D'])[i];
        var key = [event._mapId, event._eventId, ss];
        var span = document.createElement('span');
        span.innerHTML = ss;
        span.onclick = function(key) {
          $gameSelfSwitches.setValue(key, !$gameSelfSwitches.value(key));
        }.bind(span, key);
        var enabled = $gameSelfSwitches.value(key);
        span.className = `eventSS ${enabled ? '' : 'disabled'}`;
        span.id = `events-${event._eventId}-${ss}`;
        last.appendChild(span);
      }
      ul.appendChild(row);
    });
    div.appendChild(ul);
  };

  QDebug.refreshSwitch = function(i) {
    if (!this._win) return;
    if (this._currentPage !== 'Switches') return;
    var doc = this._win.window.document;
    var val = doc.getElementById(`switch-${i}-value`);
    if (!val) return;
    val.innerHTML = $gameSwitches.value(i) ? 'On' : 'Off';
    val.className = $gameSwitches.value(i) ? '' : 'disabled';
  };

  QDebug.refreshVariable = function(i) {
    if (!this._win) return;
    if (this._currentPage !== 'Variables') return;
    var doc = this._win.window.document;
    var val = doc.getElementById(`variable-${i}-value`);
    if (!val) return;
    val.value = $gameVariables.value(i);
  };

  QDebug.refreshSelfSwitches = function(key) {
    if (!this._win) return;
    if (this._currentPage !== 'Events') return;
    var doc = this._win.window.document;
    var span = doc.getElementById(`events-${key[1]}-${key[2]}`);
    if (!span) return;
    var enabled = $gameSelfSwitches.value(key);
    span.className = `eventSS ${enabled ? '' : 'disabled'}`;
  };

  QDebug.refreshItem = function(item) {
    if (!this._win) return;
    if (!['Items', 'Weapons', 'Armor'].contains(this._currentPage)) return;
    var doc = this._win.window.document;
    if (item === 'gold') {
      var gold = doc.getElementById('item-gold');
      if (!gold) return;
      gold.innerHTML = $gameParty.gold();
      return;
    }
    var type;
    if (DataManager.isItem(item)) type = 'item';
    if (DataManager.isWeapon(item)) type = 'wep';
    if (DataManager.isArmor(item)) type = 'armor';
    if (!type) return;
    var id = item.id;
    var val = doc.getElementById(`item-${type}-${id}-num`);
    if (!val) return;
    val.innerHTML = $gameParty.numItems(item);
  };

  QDebug.pages = function() {
    return [
      'Switches', 'Variables',
      'Items', 'Weapons', 'Armor',
      'Events'
    ]
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
    this.close();
  }.bind(QDebug);

  //-----------------------------------------------------------------------------
  // SceneManager

  var Alias_Scene_Title_start = Scene_Title.prototype.start;
  Scene_Title.prototype.start = function() {
    Alias_Scene_Title_start.call(this);
    QDebug.close();
  };

  //-----------------------------------------------------------------------------
  // Scene_Map

  Scene_Map.prototype.updateCallDebug = function() {
    if (this.isDebugCalled()) {
      if (QDebug._win) {
        QDebug.close();
      } else {
        QDebug.open();
      }
    }
  };

  //-----------------------------------------------------------------------------
  // Game_Map

  var Alias_Game_Map_setup = Game_Map.prototype.setup;
  Game_Map.prototype.setup = function(mapId) {
    Alias_Game_Map_setup.call(this, mapId);
    QDebug.drawPage();
  };

  //-----------------------------------------------------------------------------
  // Game_Switches

  var Alias_Game_Switches_setValue = Game_Switches.prototype.setValue;
  Game_Switches.prototype.setValue = function(switchId, value) {
    if (switchId > 0 && switchId < $dataSystem.switches.length) {
      Alias_Game_Switches_setValue.call(this, switchId, value);
      QDebug.refreshSwitch(switchId);
    }
  };

  //-----------------------------------------------------------------------------
  // Game_Variables

  var Alias_Game_Variables_setValue = Game_Variables.prototype.setValue;
  Game_Variables.prototype.setValue = function(variableId, value) {
    if (variableId > 0 && variableId < $dataSystem.variables.length) {
      Alias_Game_Variables_setValue.call(this, variableId, value);
      QDebug.refreshVariable(variableId);
    }
  };

  //-----------------------------------------------------------------------------
  // Game_SelfSwitches

  var Alias_Game_SelfSwitches_setValue = Game_SelfSwitches.prototype.setValue;
  Game_SelfSwitches.prototype.setValue = function(key, value) {
    Alias_Game_SelfSwitches_setValue.call(this, key, value);
    QDebug.refreshSelfSwitches(key);
  };

  //-----------------------------------------------------------------------------
  // Game_Party

  var Alias_Game_Party_gainGold = Game_Party.prototype.gainGold;
  Game_Party.prototype.gainGold = function(amount) {
    Alias_Game_Party_gainGold.call(this, amount);
    QDebug.refreshItem('gold');
  };

  var Alias_Game_Party_gainItem = Game_Party.prototype.gainItem;
  Game_Party.prototype.gainItem = function(item, amount, includeEquip) {
    Alias_Game_Party_gainItem.call(this, item, amount, includeEquip);
    QDebug.refreshItem(item);
  };
})();
