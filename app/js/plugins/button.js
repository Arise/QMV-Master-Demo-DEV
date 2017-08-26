//-----------------------------------------------------------------------------
// Sprite_QButton

Sprite_QButton.prototype = Object.create(Sprite_Button.prototype);
Sprite_QButton.prototype.constructor = Sprite_QButton;

Sprite_QButton.prototype.initialize = function() {
  Sprite_Button.prototype.initialize.call(this);
  this._overTick = 0;
  this._doubleClickTimer = 0;
  this._doubleClickHandler = null;
  this._rightClickHandler = null;
  this._mouseEnterHandler = null;
  this._mouseExitHandler = null;
};

Sprite_QButton.prototype.setDoubleClick = function(method) {
  this._doubleClickHandler = method;
};

Sprite_QButton.prototype.setRightClick = function(method) {
  this._rightClickHandler = method;
};

Sprite_QButton.prototype.setMouseEnter = function(method) {
  this._mouseEnterHandler = method;
};

Sprite_QButton.prototype.setMouseExit = function(method) {
  this._mouseExitHandler = method;
};

Sprite_QButton.prototype.setMouseOver = function(method) {
  this._mouseOverHandler = method;
};

Sprite_QButton.prototype.setMouseOut = function(method) {
  this._mouseOutHandler = method;
};

Sprite_QButton.prototype.callDoubleClickHandler = function() {
  if (this._doubleClickHandler) {
    this._doubleClickHandler();
  }
};

Sprite_QButton.prototype.callRightClickHandler = function() {
  if (this._rightClickHandler) {
    this._rightClickHandler();
  }
};

Sprite_QButton.prototype.callMouseEnterHandler = function() {
  if (this._mouseEnterHandler) {
    this._mouseEnterHandler();
  }
};

Sprite_QButton.prototype.callMouseExitHandler = function() {
  if (this._mouseExitHandler) {
    this._mouseExitHandler();
  }
};

Sprite_QButton.prototype.callMouseOverHandler = function() {
  if (this._mouseOverHandler) {
    this._mouseOverHandler();
  }
};

Sprite_QButton.prototype.callMouseOutHandler = function() {
  if (this._mouseOutHandler) {
    this._mouseOutHandler();
  }
};

Sprite_QButton.prototype.update = function() {
  if (this._doubleClickTimer > 0) {
    this._doubleClickTimer--;
  }
  Sprite_Button.prototype.update.call(this);
};

Sprite_QButton.prototype.processTouch = function() {
  if (this.isActive()) {
    if (this.isButtonTouched()) {
      if (this._overTick === 0) {
        this.callMouseEnterHandler();
      } else {
        this.callMouseOverHandler();
      }
      this._overTick++;
    } else {
      if (this._overTick !== 0) {
        this.callMouseExitHandler();
      } else {
        this.callMouseOutHandler();
      }
      this._overTick = 0;
    }
    if (TouchInput.isTriggered() && this.isButtonTouched()) {
      this._touching = true;
    }
    if (TouchInput.isTriggered()) {
      if (this._doubleClickTimer > 0) {
        this._doubleClickTimer = 0;
        this.callDoubleClickHandler();
      } else {
        this._doubleClickTimer = 30;
        this.callClickHandler();
      }
    }
    if (TouchInput.isCancelled() && this.isButtonTouched()) {
      this.callRightClickHandler();
    }
  } else {
    this._touching = false;
  }
};
