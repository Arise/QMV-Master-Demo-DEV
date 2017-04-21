//=============================================================================
// QMovement
//=============================================================================

var Imported = Imported || {};
Imported.QMovement = '1.2.1';

if (!Imported.QPlus || !QPlus.versionCheck(Imported.QPlus, '1.1.3')) {
  alert('Error: QMovement requires QPlus 1.1.3 or newer to work.');
  throw new Error('Error: QMovement requires QPlus 1.1.3 or newer to work.');
}

//=============================================================================
 /*:
 * @plugindesc <QMovement>
 * More control over character movement
 * @author Quxios  | Version 1.2.1
 *
 * @repo https://github.com/quxios/QMovement
 *
 * @requires QPlus
 *
 * @video TODO
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
 * To setup a pixel based movement, you'll need to change the plugin parameters
 * to something like:
 *
 * - Grid = 1
 * - Off Grid = true
 * - Mid Pass = false
 *
 * Other parameters can be set to your preference.
 *
 * For a grid based movement, set it something like:
 *
 * - Grid = GRIDSIZE YOU WANT
 * - Off Grid = false
 * - Mid Pass = true
 *
 * When in grid based movement, you want your colliders to fill up most of the
 * grid size but with a padding of 4 pixels on all sides (this is because some
 * tile colliders are 4 tiles wide or tall). So if your grid size was 48, your
 * colliders shouldn't be 48x48, instead they should be 40x40, with an ox and oy
 * of 4. So your collider setting would look like: box, 40, 40, 4, 4
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
 *  <collider: shape, width, height, ox, oy>
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
 *  <colliders>
 *  type: shape, width, height, ox, oy
 *  </colliders>
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
 *  <colliders>
 *  default: box, 48, 48
 *  collision: circle, 24, 24, 12, 12
 *  interaction: box: 32, 32, 8, 8
 *  </colliders>
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
 * ![QMove Script Call](https://quxios.github.io/imgs/qmovement/qmove.png)
 *
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
 * Will make the character do a full 360 arc clockwise around the point 480, 480
 * and it'll take 60 frames.
 * ============================================================================
 * ## Plugin Commands
 * ============================================================================
 * **Transfer**
 * ----------------------------------------------------------------------------
 * MV event transfers are grid based. So this plugin command lets you map transfer
 * to a pixel x / y position.
 * ~~~
 *  qMovement transfer [MAPID] [X] [Y] [OPTIONS]
 * ~~~
 * - MAPID: The id of the map to transfer to
 * - X: The x position to transfer to, in pixels
 * - Y: The y position to transfer to, in pixels
 *
 * Possible options:
 *
 * - dirX: Set X to the dir to face after the transfer.
 *   - Can be 2, 4, 6, 8, or for diagonals 1, 3, 7, 9
 * - fadeBlack: Will fade black when transfering
 * - fadeWhite: Will fade white when transfering
 *
 * Example:
 * ~~~
 *  qMovement transfer 1 100 116 dir2 fadeBlack
 * ~~~
 * Will transfer the player to map 1 at x100, y116. There will be a black fade
 * and player will be facing down
 * ~~~
 *  qMovement transfer 1 100 116
 * ~~~
 * Will transfer the player to map 1 at x100, y116. There will be no fade and
 * players direction won't change
 * ----------------------------------------------------------------------------
 * **Set Pos**
 * ----------------------------------------------------------------------------
 * This command will let you move a character to a x / y pixel position. Note
 * this will not "walk" the character to that position! This will place the
 * character at this position, similar to a transfer.
 * ~~~
 *  qMovement setPos [CHARAID] [X] [Y] [OPTIONS]
 * ~~~
 * - CHARAID - The character identifier.
 *   - For player: 0, p, or player
 *   - For events: EVENTID, eEVENTID, eventEVENTID or this for the event that called this (replace EVENTID with a number)
 * - X - The x position to set to, in pixels
 * - Y - The y position to set to, in pixels
 *
 * Possible options:
 *
 * - dirX: Set X to the dir to face after the transfer.
 *   - Can be 2, 4, 6, 8, or for diagonals 1, 3, 7, 9
 * ============================================================================
 * ## Tips
 * ============================================================================
 * **No closed open spaces!**
 * ----------------------------------------------------------------------------
 * For performance reasons, you should try to avoid having open spaces that are
 * closed off.
 * ![Example](https://quxios.github.io/imgs/qmovement/openSpaces.png)
 * On the left we can see some tiles that have a collider border, but their inside
 * is "open". This issue is should be corrected when using QPathfind because
 * if someone was to click inside that "open" space, it is passable and QPathfind
 * will try to find a way in even though there is no way in and will cause massive
 * lag. The fix can be pretty simple, you could add a CollisionMap (though that
 * may be another issue in its own) or add a RegionCollider to fill up the full
 * tile like I did on the correct side of that image.
 * ----------------------------------------------------------------------------
 * **Collision Maps - Heavy**
 * ----------------------------------------------------------------------------
 * Try to use collision maps only if you absolutely need to. Collision maps
 * can be very large images which will make your game use more memory and can
 * cause some slower pcs to start lagging. The collision checking for collision
 * maps are also take about 2-4x more time to compute and is a lot less accurate
 * since it only checks if the colliders edge collided with the collision map.
 * So using collision maps, might be pretty, but use it with caution as it can
 * slow down your game! A better solution for this would be to use a PolygonMap
 * where you create polygon colliders and add them into the map.
 * ============================================================================
 * ## Addons
 * ============================================================================
 * **Pathfind**
 * ----------------------------------------------------------------------------
 * https://quxios.github.io/#/plugins/QPathfind
 *
 * QPathfind is an A* pathfinding algorithm. This algorithm can be pretty heavy
 * if you are doing pixel based movements. So to help preform better it will
 * still try to calculate the path based on a grid, but this can lead to
 * some paths not being found even though it should since the character started
 * in a middle of a tile. To fix this issue, you'll need to enable Half Opt.
 * It will increase the pathfinding accuracy but will also increase performance
 * since it makes the "grid" smaller, which means paths are now larger.
 *
 * For the interval settings, you want to set this to a value where the path
 * can be found in 1-3 frames. You can think of intervals as the number of
 * moves to try per frame. The default setting 100, is good for grid based
 * since that will take you 100 grid spaces away. But for a pixel based, 100
 * steps isn't as far. If most of your pathfinds will be short (paths less then
 * 10 tiles away), then you should set this to a value between 100-300. For medium
 * paths (10-20 tiles away) try a value between 300-700. For large or complicated
 * paths (20+ tiles away or lots of obsticles) try something between 1000-2000.
 * I would avoid going over 2000. My opinion is to keep it below 1000, and simplify
 * any of your larger paths by either splitting it into multiple pathfinds or
 * just making the path less complex.
 *
 * ----------------------------------------------------------------------------
 * **Collision Map**
 * ----------------------------------------------------------------------------
 * https://quxios.github.io/#/plugins/QM+CollisionMap
 *
 * Collision Map is an addon for this plugin that lets you use images for
 * collisions. Note that collision map checks are a lot heavier then normal
 * collision checks. So this plugin can make your game laggier if used with
 * other heavy plugins.
 *
 * ----------------------------------------------------------------------------
 * **Region Colliders**
 * ----------------------------------------------------------------------------
 * https://quxios.github.io/#/plugins/QM+RegionColliders
 *
 * Region Colliders is an addon for this plugin that lets you add colliders
 * to regions by creating a json file.
 * ============================================================================
 * ## Videos
 * ============================================================================
 * Great example of using the collision map addon:
 * https://www.youtube.com/watch?v=-BN4Pyr5IBo
 *
 * If you have a video you'd like to have listed here, feel free to send me a
 * link in the RPGMakerWebs thread! (link below)
 *
 * ============================================================================
 * ## Links
 * ============================================================================
 * RPGMakerWebs:
 *
 *  http://forums.rpgmakerweb.com/index.php?threads/qplugins.73023/
 *
 * Terms of use:
 *
 *  https://github.com/quxios/QMV-Master-Demo/blob/master/readme.md
 *
 * Like my plugins? Support me on Patreon!
 *
 *  https://www.patreon.com/quxios
 *
 * @tags movement, pixel, character
 */
//=============================================================================
