//-----------------------------------------------------------------------------
// Game_Event

(function() {
  var Alias_Game_Event_setupPageSettings = Game_Event.prototype.setupPageSettings;
  Game_Event.prototype.setupPageSettings = function() {
    Alias_Game_Event_setupPageSettings.call(this);
    this.reloadColliders();
  };

  Game_Event.prototype.updateStop = function() {
    if (this._locked) {
      this._freqCount = this.freqThreshold();
      this.resetStopCount();
    }
    Game_Character.prototype.updateStop.call(this);
    if (!this.isMoveRouteForcing()) {
      this.updateSelfMovement();
    }
  };

  Game_Event.prototype.updateSelfMovement = function() {
    if (this.isNearTheScreen() && this.canMove()) {
      if (this._freqCount < this.freqThreshold()) {
        switch (this._moveType) {
        case 1:
          this.moveTypeRandom();
          break;
        case 2:
          this.moveTypeTowardPlayer();
          break;
        case 3:
          this.moveTypeCustom();
          break;
        }
      } else {
        if (this.checkStop(this.stopCountThreshold())) {
          this._stopCount = this._freqCount = 0;
        }
      }
    }
  };

  Game_Event.prototype.checkEventTriggerTouch = function(x, y) {
    if (!$gameMap.isEventRunning()) {
      if (this._trigger === 2 && !this.isJumping() && this.isNormalPriority()) {
        var collider = this.collider('collision');
        var prevX = collider.x;
        var prevY = collider.y;
        collider.moveTo(x, y);
        var collided = false;
        ColliderManager.getCharactersNear(collider, (function(chara) {
          if (chara.constructor !== Game_Player) return false;
          collided = chara.collider('collision').intersects(collider);
          return 'break';
        }).bind(this));
        collider.moveTo(prevX, prevY);
        if (collided) {
          this._stopCount = 0;
          this._freqCount = this.freqThreshold();
          this.start();
        }
      }
    }
  };
})();
