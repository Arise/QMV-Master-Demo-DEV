//-----------------------------------------------------------------------------
// Game_Event

(function() {
  var Alias_Game_Event_setupPageSettings = Game_Event.prototype.setupPageSettings;
  Game_Event.prototype.setupPageSettings = function() {
    Alias_Game_Event_setupPageSettings.call(this);
    this.reloadColliders();
    this._randomDir = null;
  };

  Game_Event.prototype.defaultColliderConfig = function() {
    return QMovement.eventCollider;
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
      if (this.checkStop(this.stopCountThreshold())) {
        this._stopCount = this._freqCount = 0;
      }
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
      }
    }
  };

  // TODO stop random dir from reseting every frame if event can't move
  Game_Event.prototype.moveTypeRandom = function() {
    if (this._freqCount === 0 || !this._randomDir) {
      this._randomDir = 2 * (Math.randomInt(4) + 1);
    }
    if (!this.canPixelPass(this.px, this.py, this._randomDir)) {
      this._randomDir = 2 * (Math.randomInt(4) + 1);
    }
    this.moveStraight(this._randomDir);
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
