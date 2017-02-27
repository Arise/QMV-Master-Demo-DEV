//=============================================================================
// QMovement
//=============================================================================

var Imported = Imported || {};
Imported.QMovement = '1.0.2';

if (!Imported.QPlus) {
  var msg = 'Error: QMovement requires QPlus to work.';
  alert(msg);
  throw new Error(msg);
} else if (!QPlus.versionCheck(Imported.QPlus, '1.1.3')) {
  var msg = 'Error: QName requires QPlus 1.1.3 or newer to work.';
  alert(msg);
  throw new Error(msg);
}

//=============================================================================
 /*:
 * @plugindesc <QMovement>
 * More control over character movement
 * @author Quxios  | Version 1.0.2
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
 * @param Move on click
 * @desc Set if player moves with mouse click
 * * Requires QPathfind to work
 * @default true
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
 * This plugin completely rewrites the collision system to use colliders. Using
 * colliders enabled more accurate collision checking with dealing with pixel
 * movement. This plugin also lets you change how many pixels the characters
 * move per step, letting you set up a 24x24 movement or a 1x1 (pixel movement)
 *
 * Note there are a few mv features disabled/broken; mouse movement, followers,
 * and vehicles.
 * ============================================================================
 * ## How to use
 * ============================================================================
 * TODO
 * ============================================================================
 * ## Colliders
 * ============================================================================
 * There are 3 types of colliders; Polygon, Box and Circle. Though you can only
 * create box and circle colliders, unless you modify the code to accept
 * polygons. This is intentional since polygon would be "harder" to setup.
 *
 * ![Colliders Image](https://quxios.github.io/imgs/qmovement/colliders.png)
 *
 * - Boxes takes in width, height, offset x and offset y
 * - Circles similar to boxes, takes in width, height, offset x and offset y
 * ----------------------------------------------------------------------------
 * **Setting up colliders**
 * ----------------------------------------------------------------------------
 * Colliders are setup inside the Players notebox or as a comment inside an
 * Events page. Events colliders depends it's page, so you may need to make the
 * collider on all pages.
 *
 * There are two ways to setup colliders. using `<collider:-,-,-,->` and using
 * `<colliders>-</colliders>`. The first method sets the 'Default' collider for
 * that character. The second one you create the colliders for every collider
 * type.
 * ----------------------------------------------------------------------------
 * **Collider Types**
 * ----------------------------------------------------------------------------
 * There are 3 collider types. Default, Collision and Interaction.
 * - Default: This is the collider to use if collider type that was called was
 * not found
 * - Collision: This collider is used for collision checking
 * - Interaction: This collider is used for checking interaction.
 * ============================================================================
 * ## Collider Terms
 * ============================================================================
 * ![Colliders Terms Image](https://quxios.github.io/imgs/qmovement/colliderInfo.png)
 * ----------------------------------------------------------------------------
 * **Collider Notetag**
 * ----------------------------------------------------------------------------
 * ~~~
 * <collider: shape, width, height, ox, oy>
 * ~~~
 * This notetag sets all collider types to these values.
 * - Shape: Set to box or circle
 * - Width: The width of the collider
 * - Height: The height of the collider
 * - OX: The x offset value of the collider
 * - OY: The y offset value of the collider
 * ----------------------------------------------------------------------------
 * **Colliders Notetag**
 * ----------------------------------------------------------------------------
 * ~~~
 * <colliders>
 * type: shape, width, height, ox, oy
 * </colliders>
 * ~~~
 * This notetag sets all collider types to these values.
 * - Type: The type of collider, set to default, collision or interaction
 * - Shape: Set to box or circle
 * - Width: The width of the collider
 * - Height: The height of the collider
 * - OX: The x offset value of the collider
 * - OY: The y offset value of the collider
 *
 * To add another type, just add `type: shape, width, height, ox, oy` on
 * another line.
 *
 * Example:
 * ~~~
 * <colliders>
 * default: box, 48, 48
 * collision: circle, 24, 24, 12, 12
 * interaction: box: 32, 32, 8, 8
 * </colliders>
 * ~~~
 * ============================================================================
 * ## Move Routes
 * ============================================================================
 * By default, event move commands (moveup, movedown, ect) will convert to a
 * qmove that moves the character based off your tilesize. So if your tilesize
 * is 48 and your gridsize is 1. Then a moveup command will move the character
 * up 48 pixels not 1. But if you want to move the character by a fixed amount
 * of pixels, then you will use the QMove commands.
 * ----------------------------------------------------------------------------
 * **QMove**
 * ----------------------------------------------------------------------------
 * ![QMove Script Call](https://quxios.github.io/imgs/qmovement/arc.png)
 * To do a QMove, add a script in the move route in the format:
 * ~~~
 *  qmove(DIR, AMOUNT, MULTIPLER)
 * ~~~
 * - DIR: Set to a number representing the direction to move,
 *  2: left, 4: right, 8: up 2: down,
 *  1: lower left, 3: lower right, 7: upper left, 9: upper right,
 *  5: current direction, 0: reverse direction
 * - AMOUNT: The amount to move in that direction, in pixels
 * - MULTIPLIER: multiplies against amount to make larger values easier [OPTIONAL]
 *
 * Example:
 * ~~~
 *  qmove(4, 24)
 * ~~~
 * Will move that character 24 pixels to the left.
 * ----------------------------------------------------------------------------
 * **Arc**
 * ----------------------------------------------------------------------------
 * Arcing is used to make a character orbit around a position. Note that collisions
 * are ignored when arcing, but interactions still work. To add a arc add a script
 * in the move route in the format:
 * ~~~
 *  arc(PIVOTX, PIVOTY, RADIAN, CCWISE?, FRAMES)
 * ~~~
 * - PIVOTX: The x position to orbit around, in pixels
 * - PIVOTY: The y position to orbit around, in pixels
 * - RADIAN: The degrees to move, in radians
 * - CCWISE?: set to true or false; if true it will arc countclock wise
 * - FRAMES: The amount of frames to complete the arc
 *
 * Example:
 * ~~~
 *  arc(480,480,Math.PI*2,false,60)
 * ~~~
 * ============================================================================
 * ## Links
 * ============================================================================
 * RPGMakerWebs:
 *  http://forums.rpgmakerweb.com/index.php?threads/qplugins.73023/
 *
 * Terms of use:
 *  https://github.com/quxios/QMV-Master-Demo/blob/master/readme.md
 *
 * Like my plugins? Support me on Patreon!
 *  https://www.patreon.com/quxios
 *
 * @tags movement, pixel, character
 */
//=============================================================================
