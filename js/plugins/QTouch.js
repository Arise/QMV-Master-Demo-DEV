//=============================================================================
// QTouch
//=============================================================================

var Imported = Imported || {};
Imported.QTouch = '1.0.0';

//=============================================================================
 /*:
 * @plugindesc <QTouch>
 * Selects window choice on hover.
 * @author Quxios  | Version 1.0.0
 *
 * @video https://youtu.be/nfhSBlwcz8k
 *
 * @help
 * ============================================================================
 * ## About
 * ============================================================================
 * This plugin makes selectable windows feel more natural. Window choices will
 * get selected / highlighted when the mouse is over them. And clicking on
 * them once will run that choice.
 * ============================================================================
 * ## How to use
 * ============================================================================
 * Just install this plugin. No configuration needed.
 * ============================================================================
 * ## Links
 * ============================================================================
 * RPGMakerWebs:
 *
 *   http://forums.rpgmakerweb.com/index.php?/topic/73023-qplugins/
 *
 * Terms of use:
 *
 *   https://github.com/quxios/QMV-Master-Demo/blob/master/readme.md
 *
 * @tags touch
 */
//=============================================================================

//-----------------------------------------------------------------------------
// New Classes

function Sprite_QButton() {
  this.initialize.apply(this, arguments);
}

//-----------------------------------------------------------------------------
// QTouch

(function() {
  var Alias_Scene_Boot_start = Scene_Boot.prototype.start;
  Scene_Boot.prototype.start = function() {
    document.getElementById('modeText').style.cursor = 'default';
    Alias_Scene_Boot_start.call(this);
  };


  //-----------------------------------------------------------------------------
  // TouchInput

  TouchInput._onMouseMove = function(event) {
    var x = Graphics.pageToCanvasX(event.pageX);
    var y = Graphics.pageToCanvasY(event.pageY);
    this._onMove(x, y);
  };

  //-----------------------------------------------------------------------------
  // Scene_Base

  var Alias_Scene_Base_update = Scene_Base.prototype.update;
  Scene_Base.prototype.update = function() {
    Alias_Scene_Base_update.call(this);
    if (this.mouseMoved()) {
      this.updateMouseCursor();
    }
  };

  Scene_Base.prototype.updateMouseCursor = function() {
    var isPointer = false;
    if (this._windowLayer) {
      var windows = this._windowLayer.children;
      for (var i = 0; i < windows.length; i++) {
        if (typeof windows[i].isPointer === 'function' && windows[i].isPointer()) {
          isPointer = true;
          break;
        }
      }
    }
    for (var i = 0; i < this.children.length; i++) {
      if (typeof this.children[i].isPointer === 'function' && this.children[i].isPointer()) {
        isPointer = true;
        break;
      }
    }
    if (isPointer) {
      document.body.style.cursor = 'pointer';
    } else {
      document.body.style.cursor = 'default';
    }
  };

  Scene_Base.prototype.mouseMoved = function() {
    if (this._oldTouchX !== TouchInput.x || this._oldTouchY !== TouchInput.y) {
      this._oldTouchX = TouchInput.x;
      this._oldTouchY = TouchInput.y;
      return true;
    }
    return false;
  };

  //-----------------------------------------------------------------------------
  // Window_Selectable

  var Alias_Window_Selectable_initialize = Window_Selectable.prototype.initialize;
  Window_Selectable.prototype.initialize = function(x, y, width, height) {
    Alias_Window_Selectable_initialize.call(this, x, y, width, height);
    this._oldTouchX = TouchInput.x;
    this._oldTouchY = TouchInput.y;
    this._isPointer = true;
  };

  Window_Selectable.prototype.isPointer = function() {
    return this.active && this.isTouchedInsideFrame() && this._isPointer;
  };

  Window_Selectable.prototype.processTouch = function() {
    if (this.isOpenAndActive()) {
      if (this.isTouchedInsideFrame()) {
        var x = this.canvasToLocalX(TouchInput.x);
        var y = this.canvasToLocalY(TouchInput.y);
        var hitIndex = this.hitTest(x, y);
        if (hitIndex >= 0 && this.isCursorMovable() && this.mouseMoved()) {
          this._isPointer = true;
          this.select(hitIndex);
        } else if (hitIndex < 0) {
          this._isPointer = false;
        }
        if (TouchInput.isTriggered()) {
          if (hitIndex >= 0) {
            if (hitIndex === this.index() && this.isTouchOkEnabled()) {
              this.processOk();
            }
          }
        }
      }
      if (TouchInput.isCancelled()) {
        if (this.isCancelEnabled()) {
          this.processCancel();
        }
      }
    }
  };

  Window_Selectable.prototype.mouseMoved = function() {
    if (this._oldTouchX !== TouchInput.x || this._oldTouchY !== TouchInput.y) {
      this._oldTouchX = TouchInput.x;
      this._oldTouchY = TouchInput.y;
      return true;
    }
    return false;
  };

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

  Sprite_QButton.prototype.isPointer = function() {
    return this.isActive() && this.isButtonTouched();
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
}());
