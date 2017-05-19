//-----------------------------------------------------------------------------
// Game_Loot

function Game_Loot() {
  this.initialize.apply(this, arguments);
}

(function() {
  Game_Loot.prototype = Object.create(Game_Event.prototype);
  Game_Loot.prototype.constructor = Game_Event; // still needs to act like an Event

  Game_Loot.prototype.initialize = function(x, y) {
    Game_Character.prototype.initialize.call(this);
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
    console.log(string.length);
    if (this._iconIndex) {
      string = '\\I[' + this._iconIndex + ']' + string;
    }
    QABSManager.startPopup('QABS-ITEM', {
      x: this.cx(), y: this.cy(),
      string: string
    })
    this.erase();
    QABSManager.removeEvent(this);
    QABSManager.removePicture(this._itemIcon);
  };

  Game_Loot.prototype.aoeCollect = function() {
    return; // TODO
    var events = $gameMap.getCharactersAt(this.collider(), function(e) {
      return (e.constructor !== Game_Loot || e._erased);
    });
    var totalLoot = [];
    var totalGold = 0;
    for (var event of events){
      if (event._loot) totalLoot.push(event._loot);
      if (event._gold) totalGold += event._gold;
      var neighborLoot = $gameMap.getCharactersAt(event.collider(), function(e) {
        return (e.constructor !== Game_Loot || e._erased || events.contains(e));
      });
      events.push.apply(events, neighborLoot);
      event.erase();
      QuasiABS.Manager.removeEvent(event);
      QuasiABS.Manager.removePicture(event._itemIcon);
    };
    var display = {};
    for (var item of totalLoot) {
      $gameParty.gainItem(item, 1);
      display[item.name] = display[item.name] || {};
      display[item.name].iconIndex = item.iconIndex;
      display[item.name].total = display[item.name].total + 1 || 1;
    }
    var y = this.cy();
    for (var name in display) {
      if (!display.hasOwnProperty(name)) continue;
      var string = "x" + display[name].total + " " + name;
      var iconIndex = display[name].iconIndex;
      QuasiABS.Manager.startPopup("item", this.cx(), y, string, iconIndex);
      y += 22;
    }
    if (totalGold > 0) {
      $gameParty.gainGold(totalGold);
      var string = String(totalGold);
      QuasiABS.Manager.startPopup("item", this.cx(), y, string, QuasiABS.goldIcon);
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
    return 'box,32,32,0,0';
  };
})();
