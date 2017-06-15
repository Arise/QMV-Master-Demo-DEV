//-----------------------------------------------------------------------------
// Game_Loot

function Game_Loot() {
  this.initialize.apply(this, arguments);
}

(function() {
  Game_Loot.prototype = Object.create(Game_Event.prototype);
  Game_Loot.prototype.constructor = Game_Loot;

  Game_Loot.prototype.initialize = function(x, y) {
    Game_Character.prototype.initialize.call(this);
    this.isLoot = true;
    this._decay = QABS.lootDecay;
    this._eventId = -1;
    this._gold = null;
    this._loot = null;
    this._noSprite = true;
    this.locate(x, y);
    QABSManager.addEvent(this);
    this.refresh();
  };

  Game_Loot.prototype.event = function() {
    return {
      note: ''
    }
  };

  Game_Loot.prototype.shiftY = function() {
    return 0;
  };

  Game_Loot.prototype.setGold = function(value) {
    this._gold = value;
    this.setIcon(QABS.goldIcon);
  };

  Game_Loot.prototype.setItem = function(item) {
    this._loot = item;
    this.setIcon(item.iconIndex);
  };

  Game_Loot.prototype.setIcon = function(iconIndex) {
    this._iconIndex = iconIndex;
    this._itemIcon = new Sprite_Icon(iconIndex);
    this._itemIcon.move(this._px, this._py);
    this._itemIcon.z = 1;
    QABSManager.addPicture(this._itemIcon);
  };

  Game_Loot.prototype.page = function() {
    if (!this._lootPage) {
      this._lootPage = {
        conditions: {
          actorId: 1, actorValid: false,
          itemId: 1,  itemValid: false,
          selfSwitchCh: 'A', selfSwitchValid: false,
          switch1Id: 1,   switch1Valid: false,
          switch2Id: 1,   switch2Valid: false,
          variable1Id: 1, variable1Valid: false, variableValue: 0
        },
        image: {
          characterIndex: 0, characterName: '',
          direction: 2, pattern: 1, tileId: 0
        },
        moveRoute: {
          list: [{code: 0, parameters: []}],
          repeat: false, skippable: false, wait: false
        },
        list: [],
        directionFix: false,
        moveFrequency: 4,
        moveSpeed: 3,
        moveType: 0,
        priorityType: 0,
        stepAnime: false,
        through: true,
        trigger: QABS.lootTrigger,
        walkAnime: true
      };
      this._lootPage.list = [];
      this._lootPage.list.push({
        code: 355,
        indent: 0,
        parameters: ['this.character().collectDrops();']
      });
      this._lootPage.list.push({
        code: 0,
        indent: 0,
        parameters: [0]
      });
    }
    return this._lootPage;
  };

  Game_Loot.prototype.findProperPageIndex = function() {
    return 0;
  };

  Game_Loot.prototype.collectDrops = function() {
    if (QABS.aoeLoot) {
      return this.aoeCollect();
    }
    if (this._loot) $gameParty.gainItem(this._loot, 1);
    if (this._gold) $gameParty.gainGold(this._gold);
    var string = this._gold ? String(this._gold) : this._loot.name;
    if (this._iconIndex) {
      string = '\\I[' + this._iconIndex + ']' + string;
    }
    QABSManager.startPopup('QABS-ITEM', {
      x: this.cx(), y: this.cy(),
      string: string
    });
    this.erase();
    QABSManager.removeEvent(this);
    QABSManager.removePicture(this._itemIcon);
  };

  Game_Loot.prototype.aoeCollect = function() {
    var loot = ColliderManager.getCharactersNear(this.collider(), function(chara) {
      return chara.constructor === Game_Loot
        && chara.collider().intersects(this.collider());
    }.bind(this));
    var x = this.cx();
    var y = this.cy();
    var totalLoot = [];
    var totalGold = 0;
    var i;
    for (i = 0; i < loot.length; i++) {
      if (loot[i]._loot) totalLoot.push(loot[i]._loot);
      if (loot[i]._gold) totalGold += loot[i]._gold;
      QABSManager.removeEvent(loot[i]);
      QABSManager.removePicture(loot[i]._itemIcon);
    }
    var display = {};
    for (i = 0; i < totalLoot.length; i++) {
      var item = totalLoot[i];
      $gameParty.gainItem(item, 1);
      display[item.name] = display[item.name] || {};
      display[item.name].iconIndex = item.iconIndex;
      display[item.name].total = display[item.name].total + 1 || 1;
    }
    for (var name in display) {
      var iconIndex = display[name].iconIndex;
      var string = 'x' + display[name].total + ' ' + name;
      if (iconIndex) {
        string = '\\I[' + iconIndex + ']' + string;
      }
      QABSManager.startPopup('QABS-ITEM', {
        x: x, y: y,
        string: string
      });
      y += 22;
    }
    if (totalGold > 0) {
      $gameParty.gainGold(totalGold);
      var string = String(totalGold);
      if (QABS.goldIcon) {
        string = '\\I[' + QABS.goldIcon + ']' + string;
      }
      QABSManager.startPopup('QABS-ITEM', {
        x: x, y: y,
        string: string
      });
    }
  };

  Game_Loot.prototype.update = function() {
    if (this._decay <= 0) {
      this.erase();
      QABSManager.removeEvent(this);
      QABSManager.removePicture(this._itemIcon);
      return;
    }
    this._decay--;
  };

  Game_Loot.prototype.defaultColliderConfig = function() {
    return 'box,48,48,-8,-8';
  };

  Game_Loot.prototype.castsShadow = function() {
    return false;
  };
})();
