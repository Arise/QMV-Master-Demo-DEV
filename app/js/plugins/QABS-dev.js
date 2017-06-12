/**:merge
  QABS/Header2.js
  QABS/QABSManager.js
  QABS/Skill_Sequencer.js
  QABS/Game_Interpreter.js
  QABS/Game_System.js
  QABS/Game_Map.js
  QABS/Game_Action.js
  QABS/Game_BattlerBase.js
  QABS/Game_Battler.js
  QABS/Game_Actor.js
  QABS/Game_Enemy.js
  QABS/Game_CharacterBase.js
  QABS/Game_Player.js
  QABS/Game_Event.js
  QABS/Game_Loot.js
  QABS/Scene_Map.js
  QABS/Sprite_Character.js
  QABS/Sprite_Icon.js
  QABS/Sprite_SkillCollider.js
  QABS/Spriteset_Map.js
  > QABS.js
*/
//=============================================================================
// QABS
//=============================================================================

var Imported = Imported || {};

if (!Imported.QMovement || !QPlus.versionCheck(Imported.QMovement, '1.3.1')) {
  alert('Error: QABS requires QMovement 1.3.1 or newer to work.');
  throw new Error('Error: QABS requires QMovement 1.3.1 or newer to work.');
}

Imported.QABS = '1.0.0';

//=============================================================================
 /*:
 * @plugindesc <QABS>
 * Action Battle System for QMovement
 * @author Quxios  | Version 1.0.0
 *
 * @development
 *
 * @requires QMovement
 *
 * @video TODO
 *
 * @param Attack Settings
 *
 * @param Quick Target
 * @parent Attack Settings
 * @desc Ground target skills will instantly cast at mouse location
 * @type Boolean
 * @default false
 *
 * @param Lock when Targeting
 * @parent Attack Settings
 * @desc Player can not move when using Ground / Select targeting skills
 * @type Boolean
 * @on Can Move
 * @off Can't Move
 * @default false
 *
 * @param Attack Towards Mouse
 * @parent Attack Settings
 * @desc All actions will be used towards your mouse location
 * Default: false   Set to true or false
 * @default false
 *
 * @param Move Resistance Rate Stat
 * @parent Attack Settings
 * @desc Which stat to use for Move Resistance Rate
 * Default: xparam(1)     //  This is Evasion
 * @default xparam(1)
 *
 * @param Loot Settings
 *
 * @param Loot Decay
 * @parent Loot Settings
 * @desc How long until the loot disappears, in frames.
 * @type Number
 * @min 1
 * @default 600
 *
 * @param AoE Loot
 * @parent Loot Settings
 * @desc Collect nearby loot or pick up one at a time.
 * @type Boolean
 * @default true
 *
 * @param Loot Touch Trigger
 * @parent Loot Settings
 * @desc Pick up loot on player touch
 * @type Boolean
 * @default false
 *
 * @param Gold Icon
 * @parent Loot Settings
 * @desc Icon Index to display for gold loot
 * Default: 314
 * @default 314
 *
 * @param Level Animation
 * @parent Loot Settings
 * @desc The animation ID to play on level up.
 * Default: 52
 * @type Animation
 * @default 52
 *
 * @param Enemy AI
 *
 * @param AI Default Sight Range
 * @parent Enemy AI
 * @desc Default range for enemies to go after player, in pixels
 * Default: 240
 * @type Number
 * @min 1
 * @default 240
 *
 * @param AI Action Wait
 * @parent Enemy AI
 * @desc How many frames to wait before running AI for next skill
 * Default: 30
 * @min 1
 * @default 30
 *
 * @param AI Uses QSight
 * @parent Enemy AI
 * @desc Set to true or false if AI should use QSight
 * May decrease performance
 * @type Boolean
 * @default true
 *
 * @param AI uses QPathfind
 * @parent Enemy AI
 * @desc Set to true or false if AI should use QPathfind
 * May decrease performance
 * @type Boolean
 * @default true
 *
 * @param Default Skills
 * @type Struct<SkillKey>[]
 *
 * @help
 * ============================================================================
 * ## About
 * ============================================================================
 * A collider based action battle system for QMovement.
 * ============================================================================
 * ## How to use
 * ============================================================================
 * TODO
 * ----------------------------------------------------------------------------
 * **Sub section**
 * ----------------------------------------------------------------------------
 *
 * ============================================================================
 * ## Skill Sequences
 * ============================================================================
 * user ---
 * user casting [true|false]
 * user lock
 * user unlock
 * user speed [inc|dec] [amt]
 * user move [forward|backward] [dist] [wait? true|false]
 * user moveHere [wait? true|false]
 * user jump [forward|backward] [dist] [wait? true|false]
 * user jumpHere [wait? true|false]
 * user teleport
 * user setDirection [dir]
 * user directionFix [true|false]
 * user pose [pose] [wait? true|false]
 * user forceSkill [skillId] [angleOffset in degrees]
 * user animation [animationId]
 * store
 * move [forward|backward] [dist] [duration] [wait? true|false]
 * moveToStored [duration] [wait? true|false]
 * wave [forward|backward] [amplitude] [harm] [dist] [duration] [wait? true|false]
 * waveToStored [amplitude] [harm] [duration] [wait? true|false]
 * trigger
 * wait [duration]
 * picture [fileName] [rotatable? true|false] [base direction]
 * trail [fileName] [rotatable? true|false] [base direction]
 * collider
 * animation [animationId]
 * se [name] [volume] [pitch] [pan]
 * qaudio TODO
 * globalLock
 * globalUnlock
 *
 * ============================================================================
 * ## Skill OnDamage
 * ============================================================================
 * target ---
 * target move [towards|away] [dist]
 * target jump [towards|away] [dist]
 * target pose [pose]
 * target cancel
 * user
 * user forceSkill
 * animationTarget
 *
 * ============================================================================
 * ## Enemy Notetags
 * ============================================================================
 * **Event**
 * ----------------------------------------------------------------------------
 * To mark an event as an enemy, add the notetag:
 * ~~~
 *  <enemy:X>
 * ~~~
 * Where X is the Id of the enemy in the database.
 * ----------------------------------------------------------------------------
 * **Enemy Database**
 * ----------------------------------------------------------------------------
 * To disable the enemy AI, add this notetag
 * ~~~
 *  <noAI>
 * ~~~
 *
 * To disable damage popups on this enemy, add this notetag
 * ~~~
 *  <noPopup>
 * ~~~
 *
 * To keep the event around after it dies, add this notetag
 * ~~~
 *  <dontErase>
 * ~~~
 *
 * To run some JS when the enemy dies, add this notetag
 * ~~~
 *  <onDeath>
 *  javascript code
 *  </onDeath>
 * ~~~~
 *
 * To change the team of the enemy, use this notetag
 * ~~~
 *  <team:X>
 * ~~~
 * Set X to the team.
 * - 0: Neutral
 * - 1: Player team
 * - 2: Enemy team
 * - 3+ can also be used
 * *Note teams don't do much because there is no team based AI*
 * ============================================================================
 * ## State Notetags
 * ============================================================================
 * To have a state affect the characters move speed use:
 * ~~~
 *  <moveSpeed:X>
 * ~~~
 * Set X to the value to modify the move speed by. Can be negative.
 *
 * To disable a characters actions, use the following notetag. When disabled
 * the character can't use any skills until the state is removed.
 * ~~~
 *  <stun>
 * ~~~
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
 * @tags QM-Addon, ABS, Battle
 */
 /*~struct~SkillKey:
 * @param Keyboard Input
 * @desc Set to which keyboard input to use for this skill
 * @default
 *
 * @param Gamepad Input
 * @desc Set to which gamepad input to use for this skill
 * @default
 *
 * @param Rebind
 * @desc Can this skill be reassigned?
 * @type Boolean
 * @on Yes
 * @off No
 * @default true
 *
 * @param Skill Id
 * @desc Which skill does this skill use
 * @type skill
 * @default
 */
//=============================================================================
