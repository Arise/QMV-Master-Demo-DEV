//=============================================================================
// QParams
//=============================================================================

var Imported = Imported || {};

if (!Imported.QPlus || !QPlus.versionCheck(Imported.QPlus, '1.6.0')) {
  alert('Error: QParams requires QPlus 1.6.0 or newer to work.');
  throw new Error('Error: QParams requires QPlus 1.6.0 or newer to work.');
}

Imported.QParams = '1.0.0';

//=============================================================================
/*:
 * @plugindesc <QParams>
 * Custom parameters and improvements
 * @version 1.0.0
 * @author Quxios  | Version 1.0.0
 * @site https://quxios.github.io/
 * @updateurl https://quxios.github.io/data/pluginsMin.json
 * 
 * @requires QPlus
 *
 * @param Custom Params
 * @desc User defined parameters
 * @default []
 * @type Struct<Parameter>[]
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
 *  https://quxios.github.io/#/plugins/QParams
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
/*~struct~Parameter:
 * @param abr
 * @text Abbreviation
 * @desc Set to the abbreviation to use for this parameter
 * @default
 * 
 * @param name
 * @text Name
 * @desc Set to the full name of the parameter
 * @default
 * 
 * @param default
 * @text Default
 * @desc Set the default value of this parameter
 * @type Number
 * @default 0
 */
//=============================================================================

//=============================================================================
// QParams Static Class

function QParams() {
  throw new Error('This is a static class');
}

//=============================================================================
// QParams

(function() {
  var _PARAMS = QPlus.getParams('<QParams>', {
    'Custom Params': []
  });

  QParams._states = {};
  QParams._equips = {
    weps: {},
    armor: {}
  }; // [weps, armors]
  QParams._items = {};
  QParams._charas = {
    actor: {},
    class: {},
    enemy: {}
  }; // [actors, classes, enemies]
  QParams._rates = {
    xParam: {
      actor: {},
      class: {},
      enemy: {}
    },
    sParam: {
      actor: {},
      class: {},
      enemy: {}
    }
  }

  QParams.stateParamsPlus = function(id) {
    return this._states[id] || {};
  };

  QParams.equipParamsPlus = function(equip) {
    var data = !equip.atypeId ? this._equips.weps : this._equips.armor;
    var id = equip.baseItemId || equip.id;
    return data[id] || {};
  };

  QParams.itemParamsPlus = function(item) {
    var id = item.baseItemId || item.id;
    return this._items[id] || {};
  };

  QParams.charaParamsPlus = function(id, type) {
    var value = this._charas[type] ? this._charas[type][id] : {};
    return value || {};
  };

  QParams.rateParamsPlus = function(charaId, type, pType) {
    var data = this._rates[pType][type] ? this._rates[pType][type][charaId] : {};
    return data || {};
  };

  //-----------------------------------------------------------------------------
  // DataManager

  var Alias_DataManager_extractQData = DataManager.extractQData;
  DataManager.extractQData = function(data, object) {
    Alias_DataManager_extractQData.call(this, data);
    if (data.qmeta['params']) {
      var value = data.qmeta['params'];
      if (object === $dataStates) {
        QParams._states[data.id] = value;
      } else if (object === $dataWeapons) {
        QParams._equips[0][data.id] = value;
      } else if (object === $dataArmors) {
        QParams._equips[1][data.id] = value;
      } else if (object === $dataItems) {
        QParams._items[data.id] = value;
      } else if (object === $dataActors) {
        QParams._charas[0][data.id] = value;
      } else if (object === $dataClasses) {
        QParams._charas[1][data.id] = value;
      } else if (object === $dataEnemies) {
        QParams._charas[2][data.id] = value;
      }
    }
  };

  //-----------------------------------------------------------------------------
  // Game_BattlerBase

  Object.defineProperties(Game_BattlerBase.prototype, {
    // Hp Regeneration tick
    hrt: { get: function() { return this.qParam(0); }, configurable: true },
    // Mp Regeneration tick
    mrt: { get: function() { return this.qParam(1); }, configurable: true },
    // Tp Regeneration tick
    trt: { get: function() { return this.qParam(2); }, configurable: true },
    // Mp Cost Constant
    mcc: { get: function() { return this.qParam(3); }, configurable: true },
    // Tp Charge Constant
    tcc: { get: function() { return this.qParam(4); }, configurable: true },
    // Physical Damage Constant
    pdc: { get: function() { return this.qParam(5); }, configurable: true },
    // Magical Damage Constant
    mdc: { get: function() { return this.qParam(6); }, configurable: true },
    // Floor Damage Constant
    fdc: { get: function() { return this.qParam(7); }, configurable: true },
    // EXperience Constant
    exc: { get: function() { return this.qParam(8); }, configurable: true }
  });

  _PARAMS['Custom Params'].forEach(function(param, index) {
    if (Game_BattlerBase.prototype[param.abr]) {
      alert('Can not use the abbreviation ' + param.abr + '. It already exists.');
    } else {
      var newProperty = {};
      newProperty[param.abr] = {
        get: function() {
          return this.cParam(index);
        },
        configurable: true
      }
      Object.defineProperties(Game_BattlerBase.prototype, newProperty);
    }
  })

  var Alias_Game_BattlerBase_initMembers = Game_BattlerBase.prototype.initMembers;
  Game_BattlerBase.prototype.initMembers = function() {
    Alias_Game_BattlerBase_initMembers.call(this);
    this._cParamPlus = {};
    _PARAMS['Custom Params'].forEach(function(param, index) {
      this._cParamPlus[index] = Number(param.default) || 0;
    }.bind(this))
  };

  var Alias_Game_BattlerBase_param = Game_BattlerBase.prototype.param;
  Game_BattlerBase.prototype.param = function(paramId) {
    var value = Alias_Game_BattlerBase_param.call(this, paramId);
    var currentValue = value;
    value += this.stateParamPlus(paramId, currentValue);
    value += this.equipParamPlus(paramId, currentValue);
    value += this.getCharaParamPlus(paramId, currentValue);
    var maxValue = this.paramMax(paramId);
    var minValue = this.paramMin(paramId);
    return Math.round(value.clamp(minValue, maxValue));
  };

  var Alias_Game_BattlerBase_xparam = Game_BattlerBase.prototype.xparam;
  Game_BattlerBase.prototype.xparam = function(xparamId) {
    var value = Alias_Game_BattlerBase_xparam.call(this, xparamId);
    value += this.getRateParamPlus(xparamId, 'xParam');
    return value;
  };

  var Alias_Game_BattlerBase_sparam = Game_BattlerBase.prototype.sparam;
  Game_BattlerBase.prototype.sparam = function(sparamId) {
    var value = Alias_Game_BattlerBase_sparam.call(this, sparamId);
    value += this.getRateParamPlus(sparamId, 'sParam');
    return value;
  };

  Game_BattlerBase.prototype.evalParamFormula = function(string, currentValue) {
    var v = $gameVariables._data;
    var a = this;
    var formula = string.replace('current', currentValue || 0);
    return eval(formula);
  };

  Game_BattlerBase.prototype.stateParamPlus = function(paramId, currentValue) {
    var value = 0;
    var states = this.states();
    for (var i = 0; i < states.length; i++) {
      var params = QParams.stateParamsPlus(states[i].id);
      if (params[paramId]) {
        value += this.evalParamFormula(params[paramId], currentValue);
      }
    }
    return Number(value) || 0;
  };

  Game_BattlerBase.prototype.equipParamPlus = function(paramId, currentValue) {
    return 0;
  };

  Game_BattlerBase.prototype.getCharaParamPlus = function(paramId, currentValue) {
    var value = 0;
    if (this.isActor()) {
      value += this.charaParamPlus(paramId, this.actorId(), 'actor', currentValue);
      value += this.charaParamPlus(paramId, this._classId, 'class', currentValue);
    } else if (this.isEnemy()) {
      value += this.charaParamPlus(paramId, this.enemyId(), 'enemy', currentValue);
    }
    return Number(value) || 0;
  };

  Game_BattlerBase.prototype.charaParamPlus = function(paramId, id, type, currentValue) {
    var value = 0;
    var params = QParams.charaParamsPlus(id, type);
    if (params[paramId]) {
      value += this.evalParamFormula(params[paramId], currentValue);
    }
    return Number(value) || 0;
  };

  Game_BattlerBase.prototype.getRateParamPlus = function(paramId, pType) {
    var value = 0;
    if (this.isActor()) {
      value += this.rateParamPlus(paramId, this.actorId(), 'actor', pType);
      value += this.rateParamPlus(paramId, this._classId, 'class', pType);
    } else if (this.isEnemy()) {
      value += this.rateParamPlus(paramId, this.enemyId(), 'enemy', pType);
    }
    return Number(value) || 0;
  };

  Game_BattlerBase.prototype.rateParamPlus = function(paramId, charaId, type, pType) {
    var value = 0;
    var params = QParams.rateParamsPlus(charaId, type, pType);
    if (params[paramId]) {
      var a = this;
      value += eval(params[paramId]);
    }
    return Number(value) || 0;
  };

  Game_BattlerBase.prototype.qParam = function(qParamId) {
    var currentValue = 0;
    if (qParamId > 8) {
      currentValue = this._cParamPlus[qParamId - 9];
    }
    var value = this.stateParamPlus(qParamId + 8, currentValue);
    value += this.equipParamPlus(qParamId + 8, currentValue);
    value += this.getCharaParamPlus(qParamId + 8, currentValue);
    value += currentValue;
    return value || 0;
  };

  Game_BattlerBase.prototype.cParam = function(cParamId) {
    var value = this.qParam(cParamId + 9);
    var min = value;
    var max = value;
    // TODO: add min/max
    return value.clamp(min, max);
  };

  Game_BattlerBase.prototype.addCParam = function(paramId, value) {
    this._cParamPlus[paramId] += value;
    this.refresh();
  };

  Game_BattlerBase.prototype.setCParam = function(paramId, value) {
    this._cParamPlus[paramId] = value;
    this.refresh();
  };

  var Alias_Game_BattlerBase_skillMpCost = Game_BattlerBase.prototype.skillMpCost;
  Game_BattlerBase.prototype.skillMpCost = function(skill) {
    var value = Alias_Game_BattlerBase_skillMpCost.call(this, skill);
    return Math.floor(value + this.mcc);
  };


})()
