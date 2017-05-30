//=============================================================================
// QABS Gauges
//=============================================================================

var Imported = Imported || {};
Imported.QABS_Gauges = '1.0.0';

if (!Imported.QABS || !QPlus.versionCheck(Imported.QABS, '1.0.0')) {
  alert('Error: QABS+Gauges requires QABS 1.0.0 or newer to work.');
  throw new Error('Error: QABS+Gauges requires QABS 1.0.0 or newer to work.');
}

//=============================================================================
 /*:
 * @plugindesc <QABSGauges>
 * QABS Addon: Adds hp gauges to enemies
 * @author Quxios  | Version 1.0.0
 *
 * @requires QABS
 *
 * @param Gauge Width
 * @desc Set the width of the gauge.
 * Default: 48
 * @default 48
 *
 * @param Gauge Height
 * @desc Set the height of the gauge.
 * Default: 4
 * @default 4
 *
 * @param Gauge Offset Y
 * @desc Set the gauges y offset, can be negative
 * Default: -48
 * @default -48
 *
 * @param =====================
 * @desc Spacer
 * @default
 *
 * @param Boss Gauge Width
 * @desc Set the width of the boss gauge.
 * Default: 480
 * @default 480
 *
 * @param Boss Gauge Height
 * @desc Set the height of the boss gauge.
 * Default: 16
 * @default 16
 *
 * @param Boss Gauge Offset Y
 * @desc Set the boss gauges y offset, can be negative
 * Default: 36
 * @default 36
 *
 * @param =====================
 * @desc Spacer
 * @default
 *
 * @param Gauge Background Color
 * @desc  The hex color behind the gauge.
 * Default: #202040
 * @default #202040
 *
 * @param Gauge Inbetween Color
 * @desc  The hex color between background and gradient
 * Default: #ffffff
 * @default #ffffff
 *
 * @param Gauge HP Color 1
 * @desc  The hex color for first color of the gradient
 * Default: #e08040
 * @default #e08040
 *
 * @param Gauge HP Color 2
 * @desc  The hex color for second color of the gradient
 * Default: #f0c040
 * @default #f0c040
 *
 * @param =====================
 * @desc Spacer
 * @default
 *
 * @param Text Font
 * @desc The font to use for the enemy name.
 * Default: GameFont
 * @default GameFont
 *
 * @param Font Size
 * @desc The font size to use for the enemy name.
 * Default: 14
 * @default 14
 *
 * @param Font Color
 * @desc The font color to use for the enemy name.
 * Default: #ffffff
 * @default #ffffff
 *
 * @param Boss Text Font
 * @desc The font to use for the enemy name.
 * Default: GameFont
 * @default GameFont
 *
 * @param Boss Font Size
 * @desc The font size to use for the enemy name.
 * Default: 18
 * @default 18
 *
 * @param Boss Font Color
 * @desc The font color to use for the enemy name.
 * Default: #ffffff
 * @default #ffffff
 *
 * @help
 * ============================================================================
 * ## About
 * ============================================================================
 * This is an addon to QABS plugin. This plugin adds a hp gauges to enemies.
 * These gauges are only visible if that enemy is in combat.
 * ============================================================================
 * ## How to use
 * ============================================================================
 * Install this plugin somewhere below QABS.
 * ============================================================================
 * ## Notetags
 * ============================================================================
 * If you don't want an enemy to have an hp bar, add the notetag:
 * ~~~
 *  <noHPBar>
 * ~~~
 * To use a boss hp bar instead use the notetag:
 * ~~~
 *  <bossHpBar>
 * ~~~
 *
 * *These tags go inside the note field of the enemy in the database.*
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
 * @tags QABS-Addon, gauges
 */
//=============================================================================

function Sprite_Gauge() {
  this.initialize.apply(this, arguments);
}

function Sprite_BossGauge() {
  this.initialize.apply(this, arguments);
}

//=============================================================================
// QABS Gauges

(function() {
  var _PARAMS = QPlus.getParams('<QABSGauges>');
  var _CMFOLDER = _PARAMS['Show Unassigned Keys'] === 'true';
  var _WIDTH = Number(_PARAMS['Gauge Width']) || 0;
  var _HEIGHT = Number(_PARAMS['Gauge Height']) || 0;
  var _OY = Number(_PARAMS['Gauge Offset Y']) || 0;
  var _BOSS_WIDTH = Number(_PARAMS['Boss Gauge Width']) || 0;
  var _BOSS_HEIGHT = Number(_PARAMS['Boss Gauge Height']) || 0;
  var _BOSS_OY = Number(_PARAMS['Boss Gauge Offset Y']) || 0;
  var _BG_COLOR = parseInt(_PARAMS['Gauge Background Color'].replace('#', ''), 16);
  var _INNER_COLOR = parseInt(_PARAMS['Gauge Inbetween Color'].replace('#', ''), 16);
  var _COLOR1 = _PARAMS['Gauge HP Color 1'];
  var _COLOR2 = _PARAMS['Gauge HP Color 2'];
  var _FONT_FACE = _PARAMS['Text Font'];
  var _FONT_SIZE = _PARAMS['Font Size'];
  var _TEXT_COLOR = _PARAMS['Font Color'];
  var _BOSS_FONT_FACE = _PARAMS['Boss Text Font'];
  var _BOSS_FONT_SIZE = _PARAMS['Boss Font Size'];
  var _BOSS_TEXT_COLOR = _PARAMS['Boss Font Color']

  //-----------------------------------------------------------------------------
  // Game_Enemy

  var Alias_Game_Enemy_setup = Game_Enemy.prototype.setup;
  Game_Enemy.prototype.setup = function(enemyId, x, y) {
    Alias_Game_Enemy_setup.call(this, enemyId, x, y);
    var notes = this.enemy().note;
    this._hideHpBar = /<nohpbar>/i.test(notes);
  };

  //-----------------------------------------------------------------------------
  // Game_CharacterBase

  Game_CharacterBase.prototype.showGauge = function() {
    return this.inCombat();
  };

  //-----------------------------------------------------------------------------
  // Game_Event

  Game_Event.prototype.showGauge = function() {
    return this.inCombat() && !this.battler()._hideHpBar;
  };

  //-----------------------------------------------------------------------------
  // Sprite_Character

  var Alias_Sprite_Character_initMembers = Sprite_Character.prototype.initMembers;
  Sprite_Character.prototype.initMembers = function() {
    Alias_Sprite_Character_initMembers.call(this);
    this.createGaugeSprite();
  };

  Sprite_Character.prototype.createGaugeSprite = function() {
    this._gaugeSprite = new Sprite_Gauge();
    this.addChild(this._gaugeSprite);
  };

  var Alias_Sprite_Character_setBattler = Sprite_Character.prototype.setBattler;
  Sprite_Character.prototype.setBattler = function(battler) {
    Alias_Sprite_Character_setBattler.call(this, battler);
    if (!battler || this._character === $gamePlayer) return;
    this._gaugeSprite.setup(this._character, battler);
    var notes = battler.enemy().note;
    if (/<bosshpbar>/i.test(notes)) this.setBossGauge();
  };

  Sprite_Character.prototype.setBossGauge = function() {
    if (!this._bossGauge) {
      this._bossGauge = new Sprite_BossGauge();
      this.parent.addChild(this._bossGauge);
    }
    this._bossGauge.setup(this._character, this._battler);
  };

  //-----------------------------------------------------------------------------
  // Sprite_Gauge

  Sprite_Gauge.prototype = Object.create(Sprite.prototype);
  Sprite_Gauge.prototype.constructor = Sprite_Gauge;

  Sprite_Gauge.prototype.initialize = function() {
    Sprite.prototype.initialize.call(this);
    this._width = _WIDTH;
    this._height = _HEIGHT;
    this.setupGauges();
    this._character = null;
    this._battler = null;
    this.anchor.x = 0.5;
    this.anchor.y = 1;
    this.y = _OY;
    this.z = 8
  };

  Sprite_Gauge.prototype.setupGauges = function() {
    this.bitmap = new Bitmap(this._width, this._height);
    // Background
    this._background = new PIXI.Graphics();
    this._background.beginFill(_BG_COLOR);
    this._background.drawRect(0, 0, this._width, this._height);
    this._background.endFill();
    this._background.x -= this._width / 2;
    this._background.y = -8;
    this._background.z = 4;
    this.addChild(this._background);
    // Between
    this._between = new PIXI.Graphics();
    this._between.beginFill(_INNER_COLOR);
    this._between.drawRect(0, 0, this._width, this._height);
    this._between.endFill();
    this._between.x -= this._width / 2;
    this._between.y = -8;
    this._between.z = 4;
    this._currentW = this._width;
    this.addChild(this._between);
    // Top (Gradient)
    this.top = new Sprite();
    this.top.bitmap = new Bitmap(this._width, this._height);
    this.top.anchor.x = 0.5;
    this.top.z = 4;
    this.top.y = -8;
    this.addChild(this.top);
  };

  Sprite_Gauge.prototype.setup = function(character, battler) {
    this._character = character;
    this._battler = battler;
    this.refresh();
  };

  Sprite_Gauge.prototype.refresh = function() {
    this.clear();
    if (!this._battler || !this.showGauge()) return;
    this.drawGauge();
    this.drawName(1, 0);
    this._targetW = Math.floor(this._width * this._hpRate);
    this._speed = Math.abs(this._currentW - this._targetW) / 30;
  };

  Sprite_Gauge.prototype.drawGauge = function() {
    this._hpRate = this._battler.hpRate();
    var fillW = Math.floor(this._width * this._hpRate);
    this.top.bitmap.gradientFillRect(0, 0, fillW, this._height, _COLOR1, _COLOR2);
  };

  Sprite_Gauge.prototype.drawName = function(x, y) {
    this.fontSettings();
    var name = this._battler.enemy().name;
    this.bitmap.drawText(name, x, y, this._width, 32);
  };

  Sprite_Gauge.prototype.fontSettings = function() {
    this.bitmap.fontFace = _FONT_FACE;
    this.bitmap.fontSize = _FONT_SIZE;
    this.bitmap.textColor = _TEXT_COLOR;
  };

  Sprite_Gauge.prototype.showGauge = function() {
    return this._character.showGauge();
  };

  Sprite_Gauge.prototype.update = function() {
    Sprite.prototype.update.call(this);
    if (!this._battler || !this.showGauge()) {
      return this.hideHud();
    } else {
      this.showHud();
    }
    if (this._hpRate !== this._battler.hpRate()) {
      this.refresh();
    }
    if (this._currentW !== this._targetW) {
      this.updateInbetween();
    }
  };

  Sprite_Gauge.prototype.updateInbetween = function() {
    if (this._currentW < this._targetW) {
      this._currentW  = Math.min(this._currentW + this._speed, this._targetW);
    }
    if (this._currentW > this._targetW) {
      this._currentW  = Math.max(this._currentW - this._speed, this._targetW);
    }
    this._between.width = this._currentW;
  };

  Sprite_Gauge.prototype.showHud = function() {
    if (!this.visible) {
      this.refresh();
      this.visible = true;
    }
  };

  Sprite_Gauge.prototype.hideHud = function() {
    if (this.visible) {
      this.clear();
      this.visible = false;
    }
  };

  Sprite_Gauge.prototype.clear = function() {
    this.bitmap.clear();
    this.top.bitmap.clear();
  };

  //-----------------------------------------------------------------------------
  // Sprite_BossGauge
  //
  // The sprite for displaying a boss gauge

  Sprite_BossGauge.prototype = Object.create(Sprite_Gauge.prototype);
  Sprite_BossGauge.prototype.constructor = Sprite_BossGauge;

  Sprite_BossGauge.prototype.initialize = function() {
    Sprite.prototype.initialize.call(this);
    this._width = _BOSS_WIDTH;
    this._height = _BOSS_HEIGHT;
    this.setupGauges();
    this._character = null;
    this._battler = null;
    this.anchor.x = 0.5;
    this.anchor.y = 1;
    this.y = _BOSS_OY;
    this.x = Graphics.boxWidth / 2;
    this.z = 8;
  };

  Sprite_BossGauge.prototype.showGauge = function() {
    return this._character.inCombat();
  };

  Sprite_BossGauge.prototype.fontSettings = function() {
    this.bitmap.fontFace = _BOSS_FONT_FACE;
    this.bitmap.fontSize = _BOSS_FONT_SIZE;
    this.bitmap.textColor = _BOSS_TEXT_COLOR;
  };
})();
