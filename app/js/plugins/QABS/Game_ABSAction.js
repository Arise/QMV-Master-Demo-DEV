//-----------------------------------------------------------------------------
// Game_Action

function Game_ABSAction() {
  this.initialize.apply(this, arguments);
}

(function() {
  Game_ABSAction.prototype = Object.create(Game_Action.prototype);
  Game_ABSAction.prototype.constructor = Game_ABSAction;

  Game_ABSAction.prototype.setSubject = function(subject) {
    Game_Action.prototype.setSubject.call(this, subject);
    this._realSubject = subject;
  };

  Game_ABSAction.prototype.subject = function() {
    return this._realSubject;
  };

  Game_ABSAction.prototype.absApply = function(target) {
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
  };

  var Alias_Game_ActionResult_clear = Game_ActionResult.prototype.clear;
  Game_ActionResult.prototype.clear = function() {
    Alias_Game_ActionResult_clear.call(this);
    this.damageIcon = null;
  };
})();
