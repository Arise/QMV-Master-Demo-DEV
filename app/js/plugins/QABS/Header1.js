//=============================================================================
// QABS
//=============================================================================

var Imported = Imported || {};
Imported.QABS = '0.0.0';

if (!Imported.QPlus || !QPlus.versionCheck(Imported.QPlus, '1.3.0')) {
  alert('Error: QABS requires QPlus 1.3.0 or newer to work.');
  throw new Error('Error: QABS requires QPlus 1.3.0 or newer to work.');
} else if (!Imported.QMovement || !QPlus.versionCheck(Imported.QMovement, '1.3.1')) {
  alert('Error: QABS requires QMovement 1.3.1 or newer to work.');
  throw new Error('Error: QABS requires QMovement 1.3.1 or newer to work.');
}

//=============================================================================
 /*:
 * @plugindesc <QABS>
 * Action Battle System for QMovement
 * @author Quxios  | Version 0.0.0
 *
 * @requires QMovement
 *
 * @video TODO
 *
 * @param Quick Target
 * @desc Ground target skills will instantly cast at mouse location
 * Default: false   Set to true or false
 * @default false
 *
 * @param Lock when Targeting
 * @desc Player can not move when using Ground / Select targeting skills
 * Default: false   Set to true or false
 * @default false
 *
 * @param Attack Towards Mouse
 * @desc All actions will be used towards your mouse location
 * Default: false   Set to true or false
 * @default false
 *
 * @param =====================
 * @desc Spacer
 * @default
 *
 * @param Loot Decay
 * @desc How long until the loot disappears, in frames.
 * Default: 600
 * @default 600
 *
 * @param AoE Loot
 * @desc Collect nearby loot or pick up one at a time.
 * Default: true   Set to true or false
 * @default true
 *
 * @param Loot Touch Trigger
 * @desc Pick up loot on player touch
 * Default: false  Set to true or false
 * @default false
 *
 * @param Gold Icon
 * @desc Icon Index to display for gold loot
 * Default: 314
 * @default 314
 *
 * @param Level Animation
 * @desc The animation ID to play on level up.
 * Default: 52   Set to 0 for no animation.
 * @default 52
 *
 * @param =====================
 * @desc Spacer
 * @default
 *
 * @param Move Resistance Rate Stat
 * @desc Which stat to use for Move Resistance Rate
 * Default: xparam(1)     //  This is Evasion
 * @default xparam(1)
 *
 * @param =====================
 * @desc Spacer
 * @default
 *
 * @param AI Default Sight Range
 * @desc Default range for enemies to go after player, in pixels
 * Default: 240
 * @default 240
 *
 * @param AI Action Wait
 * @desc How many frames to wait before running AI for next skill
 * Default: 30
 * @default 30
 *
 * @param AI Uses QSight
 * @desc Set to true or false if AI should use QSight
 * May decrease performance
 * @default true
 *
 * @param AI uses QPathfind
 * @desc Set to true or false if AI should use QPathfind
 * May decrease performance
 * @default true
 *
 * @param =====================
 * @desc Spacer
 * @default
 *
 * @param Skill Key 1
 * @desc Select which input key for Skill Key 1
 * Leave empty to disable
 * @default
 *
 * @param Skill Key 1 Rebind
 * @desc Set to true or false if the skill in this key
 * can be reassisgned
 * @default true
 *
 * @param Skill Key 1 Skill
 * @desc Select which skill is used by default for Skill Key 1
 * Leave empty to set ingame
 * @default
 *
 * @param Skill Key 2
 * @desc Select which input key for Skill Key 2
 * Leave empty to disable
 * @default
 *
 * @param Skill Key 2 Rebind
 * @desc Set to true or false if the skill in this key
 * can be reassisgned
 * @default true
 *
 * @param Skill Key 2 Skill
 * @desc Select which skill is used by default for Skill Key 2
 * Leave empty to set set ingame
 * @default
 *
 * @param Skill Key 3
 * @desc Select which input key for Skill Key 3
 * Leave empty to disable
 * @default
 *
 * @param Skill Key 3 Rebind
 * @desc Set to true or false if the skill in this key
 * can be reassisgned
 * @default true
 *
 * @param Skill Key 3 Skill
 * @desc Select which skill is used by default for Skill Key 3
 * Leave empty to set ingame
 * @default
 *
 * @param Skill Key 4
 * @desc Select which input key for Skill Key 4
 * Leave empty to disable
 * @default
 *
 * @param Skill Key 4 Rebind
 * @desc Set to true or false if the skill in this key
 * can be reassisgned
 * @default true
 *
 * @param Skill Key 4 Skill
 * @desc Select which skill is used by default for Skill Key 4
 * Leave empty to set ingame
 * @default
 *
 * @param Skill Key 5
 * @desc Select which input key for Skill Key 5
 * Leave empty to disable
 * @default
 *
 * @param Skill Key 5 Rebind
 * @desc Set to true or false if the skill in this key
 * can be reassisgned
 * @default true
 *
 * @param Skill Key 5 Skill
 * @desc Select which skill is used by default for Skill Key 5
 * Leave empty to set ingame
 * @default
 *
 * @param Skill Key 6
 * @desc Select which input key for Skill Key 6
 * Leave empty to disable
 * @default
 *
 * @param Skill Key 6 Rebind
 * @desc Set to true or false if the skill in this key
 * can be reassisgned
 * @default true
 *
 * @param Skill Key 6 Skill
 * @desc Select which skill is used by default for Skill Key 6
 * Leave empty to set ingame
 * @default
 *
 * @param Skill Key 7
 * @desc Select which input key for Skill Key 7
 * Leave empty to disable
 * @default
 *
 * @param Skill Key 7 Rebind
 * @desc Set to true or false if the skill in this key
 * can be reassisgned
 * @default true
 *
 * @param Skill Key 7 Skill
 * @desc Select which skill is used by default for Skill Key 7
 * Leave empty to set ingame
 * @default
 *
 * @param Skill Key 8
 * @desc Select which input key for Skill Key 8
 * Leave empty to disable
 * @default
 *
 * @param Skill Key 8 Rebind
 * @desc Set to true or false if the skill in this key
 * can be reassisgned
 * @default true
 *
 * @param Skill Key 8 Skill
 * @desc Select which skill is used by default for Skill Key 8
 * Leave empty to set ingame
 * @default
 *
 * @param Skill Key 9
 * @desc Select which input key for Skill Key 9
 * Leave empty to disable
 * @default
 *
 * @param Skill Key 9 Rebind
 * @desc Set to true or false if the skill in this key
 * can be reassisgned
 * @default true
 *
 * @param Skill Key 9 Skill
 * @desc Select which skill is used by default for Skill Key 9
 * Leave empty to set ingame
 * @default
 *
 * @param Skill Key 10
 * @desc Select which input key for Skill Key 10
 * Leave empty to disable
 * @default
 *
 * @param Skill Key 10 Rebind
 * @desc Set to true or false if the skill in this key
 * can be reassisgned
 * @default true
 *
 * @param Skill Key 10 Skill
 * @desc Select which skill is used by default for Skill Key 10
 * Leave empty to set ingame
 * @default
 *
 * @param Skill Key 11
 * @desc Select which input key for Skill Key 11
 * Leave empty to disable
 * @default
 *
 * @param Skill Key 11 Rebind
 * @desc Set to true or false if the skill in this key
 * can be reassisgned
 * @default true
 *
 * @param Skill Key 11 Skill
 * @desc Select which skill is used by default for Skill Key 11
 * Leave empty to set ingame
 * @default
 *
 * @param Skill Key 12
 * @desc Select which input key for Skill Key 12
 * Leave empty to disable this skill key
 * @default
 *
 * @param Skill Key 12 Rebind
 * @desc Set to true or false if the skill in this key
 * can be reassisgned
 * @default true
 *
 * @param Skill Key 12 Skill
 * @desc Select which skill is used by default for Skill Key 12
 * Leave empty to set ingame
 * @default
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
 * @tags QM-Addon, ABS, Battle
 */
//=============================================================================
