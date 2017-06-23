//=============================================================================
// QABS
//=============================================================================

var Imported = Imported || {};

if (!Imported.QMovement || !QPlus.versionCheck(Imported.QMovement, '1.4.0')) {
  alert('Error: QABS requires QMovement 1.4.0 or newer to work.');
  throw new Error('Error: QABS requires QMovement 1.4.0 or newer to work.');
}

Imported.QABS = '1.2.1';

//=============================================================================
 /*:
 * @plugindesc <QABS>
 * Action Battle System for QMovement
 * @author Quxios  | Version 1.2.1
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
 * @default []
 *
 * @help
 * ============================================================================
 * ## About
 * ============================================================================
 * A collider based action battle system for QMovement. *Note* This is not
 * your simple rpg maker action battle system. Using this plugin you can
 * create more advance like action games.
 *
 * **Note that the help section is still in development and may be missing
 * some info! Sorry!**
 * ============================================================================
 * ## Is this for you?
 * ============================================================================
 * First, this is a very complex action battle system. If you're looking for
 * something that you can spend less than an hour to set up then this plugin
 * is not for you.
 *
 * To make full use of this plugin you need to know how to properly use and
 * setup QMovement. If you don't know what that plugin is or what colliders
 * are then again, this plugin is not for you.
 *
 * There are a lot of actions for skill sequences so you can create some pretty
 * crazy skills. Learning how to use the actions may take awhile since there
 * are a lot of actions, and maybe more to come.
 *
 * Enemies have a very basic AI. If you want to create more AI styles, you
 * will need to know how to JS and create a plugin / extend this plugin.
 * ============================================================================
 * ## Skill Keys
 * ============================================================================
 * **Default Skill keys**
 * ----------------------------------------------------------------------------
 * For the player to be able to use a skill from a hotkey, you will first need
 * to create a skill key in the plugin parameter `Default Skills`.
 *
 * ![Skill Keys](https://quxios.github.io/imgs/qabs/skillKeys.png)
 *
 * When creating a skill key you have 4 parameters:
 *
 * - Keyboard Input: The keyboard input that will trigger this skill, set this
 *  to `mouse1` for left click, and `mouse2` for right click.
 * - Gamepad Input: The gamepad input that will trigger this skill.
 * - Rebind: If this is true, the skill that's assigned to this skill key can
 *  be reassigned.
 * - Skill Id: The skill that this skill key will use when triggered.
 *
 * Note for input values, those are the button values; `ok`, 'cancel', ect. Or
 * if you're using an input plugin, use their value, for example in QInput you can
 * use the `#A` for the a key or `#tab` for tab, ect.
 *
 * Note that rebind doesn't do much as this doesn't have a rebinding feature.
 * But the ground work is there so it can easily be created for an addon.
 *
 * Note that the `Skill Key Number` is the number next to the skill key you created.
 * `Skill Key Number` will referenced later.
 *
 * ![Skill Keys](https://quxios.github.io/imgs/qabs/skillKeysNumber.png)
 *
 * ----------------------------------------------------------------------------
 * **Class Skill keys**
 * ----------------------------------------------------------------------------
 * You can change the players skill keys based on their class by adding the notetag:
 * ~~~
 *  <skillKeys>
 *  [SKILL KEY NUMBER]: [SKILL ID] [REBIND?]
 *  </skillKeys>
 * ~~~
 * - SKILL KEY NUMBER: The skill key that you want to change
 * - SKILL ID: The skill to assign to this skill key number
 * - REBIND?: Set to true or false if this can be reassigned
 *
 * *Important!* make sure the skill key you are trying to set is created in the
 * plugin parameters `Default Skills`. If it's not, the game will have an error.
 *
 * Example:
 * ~~~
 *  <skillKeys>
 *  1: 2
 *  3: 15
 *  4: 16
 *  </skillKeys>
 * ~~~
 * Class Skill keys will replace the default skill keys. So if you set up skill
 * keys 1 through 9 in the parameters and a class changes the skills for skill
 * keys 1, 3, 4. The over all skill keys will be, 1, 3, 4 from the class and
 * the rest are from the default values.
 * ----------------------------------------------------------------------------
 * **Weapon Skill keys**
 * ----------------------------------------------------------------------------
 * Weapons can also change the skill keys. For example you might want to change
 * the main attack to use a range skill if the player has a bow on! To do this
 * you use a similar tag as the class:
 * ~~~
 *  <skillKeys>
 *  [SKILL KEY NUMBER]: [SKILL ID]
 *  </skillKeys>
 * ~~~
 * - SKILL KEY NUMBER: The skill key that you want to change
 * - SKILL ID: The skill to assign to this skill key number
 *
 * *Important!* make sure the skill key you are trying to set is created in the
 * plugin parameters `Default Skills`. If it's not, the game will have an error.
 *
 * Example:
 * ~~~
 *  <skillKeys>
 *  1: 3
 *  </skillKeys>
 * ~~~
 * Weapon skill keys take top priority, so they will replace both class keys
 * and teh default keys! This example will replace skill key 1 with the skill
 * id 3
 * ============================================================================
 * ## Skills
 * ============================================================================
 * **Skill Settings**
 * ----------------------------------------------------------------------------
 * Each skill should have a skill settings tag. This tag can change the settings
 * for the skills cooldown, through, and other effects. The tag is:
 * ~~~
 *  <absSettings>
 *  [SETTINGS]: [VALUE]
 *  </absSettings>
 * ~~~
 * Here's a list of all the settings:
 * ~~~
 *  collider: [SHAPE], [WIDTH], [HEIGHT]
 *  cooldown: [NUMBER]
 *  infront: [TRUE or FALSE]
 *  rotate: [TRUE or FALSE]
 *  through: [0, 1, 2 or 3]
 *  throughTerrain: [LIST OF TERRAINS IT CAN GO THROUGH]
 *  groundtarget: [NUMBER]
 *  selecttarget: [NUMBER]
 * ~~~
 * - collider: Set this to the collider this skill will use. See QMovement help
 * for details on colliders. Default: The users collider
 *   - format is `shape, width, height`
 * - cooldown: Set to the number of frames until you can use this skill again.
 * Default: 0
 * - infront: Set to true or false. When true, the collider will appear in front
 * of the user. When false the collider will be centered on the user. Default: false
 * - rotate: Set to true or false. When true, the collider will rotate based on
 * the users direction. Default: false
 * - through: Set to 0, 1, 2, or 3. Default: 0
 *   - 0: Goes through events and tiles
 *   - 1: Goes through tiles but stops when it hits an event
 *   - 2: Goes through events but stops when it hits a tile
 *   - 3: Stops when it hits an event or tile
 * - throughTerrain: Set to a list of terrains it can go through, separate each
 * terrain with a comma
 * - groundtarget: Set to the max distance for the ground target. If value is
 * 0 ground targeting will not be used. Default: 0
 * - selecttarget: Set to the max distance for the select target. If value is
 * 0 select targeting will not be used. Default: 0
 * ----------------------------------------------------------------------------
 * **Skill Sequence**
 * ----------------------------------------------------------------------------
 * When a skill is used, it's sequence will run. You will need to configure
 * a sequence to tell the skill what it should do or it won't do anything.
 * This is done with the notetag:
 * ~~~
 *  <absSequence>
 *  [ACTION]
 *  </absSequence>
 * ~~~
 * There are a bunch of actions. Each action should be on a different line.
 * Here's a list of all the actions:
 * ~~~
 *  user casting [TRUE or FALSE]
 *  user lock
 *  user unlock
 *  user speed [INC or DEC] [VALUE]
 *  user move [FORWARD or BACKWARD] [DIST] [WAIT? TRUE or FALSE]
 *  user moveHere [WAIT? TRUE or FALSE]
 *  user jump [FORWARD or BACKWARD] [DIST] [WAIT? TRUE or FALSE]
 *  user jumpHere [WAIT? TRUE or FALSE]
 *  user teleport
 *  user setDirection [DIR]
 *  user directionFix [TRUE or FALSE]
 *  user pose [POSE NAME] [WAIT? TRUE or FALSE]
 *  user forceSkill [SKILL ID] [ANGLE OFFSET IN DEGREES]
 *  user animation [ANIMATION ID]
 *  user qaudio [NAME] [QAUDIO OPTIONS]
 *  store
 *  move [FORWARD or BACKWARD] [DIST] [DURATION] [WAIT? TRUE or FALSE]
 *  moveToStored [DURATION] [WAIT? TRUE or FALSE]
 *  wave [FORWARD or BACKWARD] [AMPLITUDE] [HARM] [DIST] [DURATION] [WAIT? TRUE or FALSE]
 *  waveToStored [AMPLITUDE] [HARM] [DURATION] [WAIT? TRUE or FALSE]
 *  trigger
 *  adjustAim
 *  wait [DURATION]
 *  picture [FILE NAME] [ROTATABLE? TRUE or FALSE] [BASE DIRECTION]
 *  trail [FILE NAME] [ROTATABLE? TRUE or FALSE] [BASE DIRECTION]
 *  collider [SHOW or HIDE]
 *  animation [ANIMATION ID]
 *  se [NAME] [VOLUME] [PITCH] [PAN]
 *  qaudio [NAME] [QAUDIO OPTIONS]
 *  forceSkill [SKILL ID] [ANGLE OFFSER IN DEGREES]
 *  globalLock
 *  globalUnlock
 * ~~~
 * more info~ TODO
 * ----------------------------------------------------------------------------
 * **Skill On Damage**
 * ----------------------------------------------------------------------------
 * Whenever a skill hits a target you can run another sequence. This is done
 * by using the notetag:
 * ~~~
 *  <absOnDamage>
 *  [ACTION]
 *  </absOnDamage>
 * ~~~
 * There are a few actions you can add here:
 * ~~~
 *  target move [TOWARDS or AWAY or INTO] [DIST]
 *  target jump [TOWARDS or AWAY or INTO] [DIST]
 *  target pose [POSE]
 *  target cancel
 *  target qaudio [NAME] [QAUDIO OPTIONS]
 *  user forceSkill [SKILL ID] [ANGLE OFFSET IN DEGREES]
 *  animationTarget [0 or 1]
 * ~~~
 * more info~ TODO
 * ============================================================================
 * ## Enemies
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
 * To set the enemies respawn
 * ~~~
 *  <respawn:X>
 * ~~~
 * - X: How long until it respawns, in frames.
 *
 * To set an Enemies AI
 * ~~~
 * <AIType:TYPE>
 * ~~~
 * - TYPE: The AI type, set this to none to disable AI.
 *
 * There's only 1 type of AI, so for now that AI is only to disable AI
 *
 * To set it's AI range
 * ~~~
 *  <range:X>
 * ~~~
 * - X: The range in pixels
 *
 * To disable damage popups on this enemy, add this notetag
 * ~~~
 *  <noPopup>
 * ~~~
 *
 * To add an offset to the popup's y use:
 * ~~~
 *  <popupOY:Y>
 * ~~~
 * - Y: The y offset in pixels, can be negative
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
 * ~~~
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
 * ## States
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
 * ## Popups
 * ============================================================================
 * All of the popups are powered with the QPopup plugin. If you want to change
 * any styles of the popups you can edit their presets in that plugins parameters
 * or using the plugin commands in QPopup plugin.
 *
 * The following a the qPopup presets this ABS uses:
 * - QABS-LEVEL
 * - QABS-EXP
 * - QABS-ITEM
 * - QABS-MISSED
 * - QABS-DMG
 * - QABS-DMG-CRIT
 * - QABS-HEAL
 * - QABS-HEAL-CRIT
 * - QABS-MP
 * - QABS-MP-CRIT
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
