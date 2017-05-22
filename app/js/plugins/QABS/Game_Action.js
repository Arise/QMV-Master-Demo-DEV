//-----------------------------------------------------------------------------
// Game_Action

(function() {
  var Alias_Game_Action_setSubject = Game_Action.prototype.setSubject;
  Game_Action.prototype.setSubject = function(subject) {
    Alias_Game_Action_setSubject.call(this, subject);
    this._realSubject = subject;
  };

  var Alias_Game_Action_subject = Game_Action.prototype.subject;
  Game_Action.prototype.subject = function() {
    if (this._isAbs) return this._realSubject;
    return Alias_Game_Action_subject.call(this);
  };

  Game_Action.prototype.absApply = function(target) {
    this._isAbs = true;
    var result = target.result();
    this._realSubject.clearResult();
    result.clear();
    result.physical = this.isPhysical();
    result.drain = this.isDrain();
    if (this.item().damage.type > 0) {
      result.critical = (Math.random() < this.itemCri(target));
      var value = this.makeDamageValue(target, result.critical);
      this.executeDamage(target, value);
      target.startDamagePopup();
    }
    this.item().effects.forEach(function(effect) {
      this.applyItemEffect(target, effect);
    }, this);
    this.applyItemUserEffect(target);
    this.applyGlobal();
    this._isAbs = false;
  };

  var Alias_Game_ActionResult_clear = Game_ActionResult.prototype.clear;
  Game_ActionResult.prototype.clear = function() {
    Alias_Game_ActionResult_clear.call(this);
    this.damageIcon = null;
  };
})();
