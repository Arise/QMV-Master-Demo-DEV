/**:merge
  QMovement/Header.js
  QMovement/Colliders.js
  QMovement/Collider_Manager.js
  QMovement/Game_Interpreter.js
  QMovement/Game_Map.js
  QMovement/Game_CharacterBase.js
  QMovement/Game_Character.js
  QMovement/Game_Player.js
  QMovement/Game_Event.js
  QMovement/Game_Follower.js
  QMovement/Scene_Map.js
  QMovement/Sprite_Collider.js
  QMovement/Sprite_Character.js
  QMovement/Spriteset_Map.js
  QMovement/Bitmap.js
  > QMovement.js
*/
//=============================================================================
// QMovement
//=============================================================================

var Imported = Imported || {};
Imported.QMovement = '0.1.0';

if (!Imported.QPlus) {
  var msg = 'Error: QMovement requires QPlus to work.';
  alert(msg);
  throw new Error(msg);
}

//=============================================================================
 /*:
 * @plugindesc <QMovement>
 * Development
 * @author Quxios  | Version 0.1.0
 *
 * @requires QPlus
 *
 * @param Grid
 * @desc The amount of pixels you want to move per Movement.
 * Plugin Default: 1   MV Default: 48
 * @default 1
 *
 * @param Tile Size
 * @desc Size of tiles in pixels
 * Default: 48
 * @default 48
 *
 * @param Off Grid
 * @desc Allow characters to move off grid?
 * Set to true to enable, false to disable
 * @default true
 *
 * @param =================
 * @desc spacer
 * @default
 *
 * @param Smart Move
 * @desc If the move didn't succeed, try again at lower speeds.
 * 0: Disabled  1: Speed  2: Dir  3: Speed & Dir
 * @default 2
 *
 * @param Mid Pass
 * @desc An extra collision check for the midpoint of the Movement.
 * Set to true to enable, false to disable
 * @default false
 *
 * @param Diagonal
 * @desc Allow for diagonal movement?
 * Set to true or false
 * @default true
 *
 * @param Diagonal Speed
 * @desc Adjust the speed when moving diagonal.
 * Default: 0 TODO not functional
 * @default 0
 *
 * @param =================
 * @desc spacer
 * @default
 *
 * @param Player Collider
 * @desc Default player collider.
 * type width, height, ox, oy
 * @default box, 36, 24, 6, 24
 *
 * @param Event Collider
 * @desc Default event collider.
 * type width, height, ox, oy
 * @default box, 36, 24, 6, 24
 *
 * @param =================
 * @desc spacer
 * @default
 *
 * @param Show Colliders
 * @desc Show the Box Colliders by default during testing.
 * Set to true or false      -Toggle on/off with F10 during play test
 * @default true
 *
 * @video
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
 * RPGMakerWebs:
 *
 *   http://forums.rpgmakerweb.com/index.php?threads/qplugins.73023/
 *
 * Terms of use:
 *
 *   https://github.com/quxios/QMV-Master-Demo/blob/master/readme.md
 *
 * @tags
 */
//=============================================================================
