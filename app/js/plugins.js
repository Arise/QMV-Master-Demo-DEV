// Generated by RPG Maker.
// Do not edit this file directly.
var $plugins =
[
{"name":"QPlus","status":true,"description":"<QPlus> (Should go above all Q Plugins)\r\nSome small changes to MV for easier plugin development.","parameters":{"Quick Test":"true","Default Enabled Switches":"[]","Ignore Mouse when inactive":"false"}},
{"name":"QUpdate","status":true,"description":"<QUpdate>\r\nChecks QPlugins for updates","parameters":{}},
{"name":"QMovement-dev","status":true,"description":"<QMovement>\r\nMore control over character movement","parameters":{"Main Settings":"","Grid":"1","Tile Size":"48","Off Grid":"true","Optional Settings":"","Smart Move":"2","Mid Pass":"false","Move on click":"true","Diagonal":"true","Diagonal Speed":"0","Colliders":"","Player Collider":"{\"Type\":\"box\",\"Width\":\"36\",\"Height\":\"24\",\"Offset X\":\"6\",\"Offset Y\":\"24\"}","Event Collider":"{\"Type\":\"box\",\"Width\":\"36\",\"Height\":\"24\",\"Offset X\":\"6\",\"Offset Y\":\"24\"}","Presets":"[]","Debug Settings":"","Show Colliders":"true"}},
{"name":"QMovement","status":false,"description":"<QMovement>\r\nMore control over character movement","parameters":{"Main Settings":"","Grid":"1","Tile Size":"48","Off Grid":"true","Optional Settings":"","Smart Move":"2","Mid Pass":"false","Move on click":"true","Diagonal":"true","Diagonal Speed":"0","Colliders":"","Player Collider":"box, 36, 24, 6, 24","Event Collider":"box, 36, 24, 6, 24","Presets":"","Debug Settings":"","Show Colliders":"true"}},
{"name":"========================","status":false,"description":"","parameters":{}},
{"name":"QABS-dev","status":true,"description":"<QABS>\r\nAction Battle System for QMovement","parameters":{"Attack Settings":"","Quick Target":"false","Lock when Targeting":"true","Aim with Mouse":"true","Aim with Analog":"true","Move Resistance Rate Stat":"xparam(1)","Loot Settings":"","Loot Decay":"180","AoE Loot":"true","Loot Touch Trigger":"true","Gold Icon":"314","Level Animation":"52","Enemy AI":"","AI Default Sight Range":"240","AI Action Wait":"30","AI Uses QSight":"true","AI uses QPathfind":"false","Default Skills":"[\"{\\\"Keyboard Input\\\":\\\"mouse1\\\",\\\"Gamepad Input\\\":\\\"$X\\\",\\\"Rebind\\\":\\\"true\\\",\\\"Skill Id\\\":\\\"25\\\"}\",\"{\\\"Keyboard Input\\\":\\\"mouse2\\\",\\\"Gamepad Input\\\":\\\"$L2\\\",\\\"Rebind\\\":\\\"true\\\",\\\"Skill Id\\\":\\\"2\\\"}\",\"{\\\"Keyboard Input\\\":\\\"#shift\\\",\\\"Gamepad Input\\\":\\\"$R3\\\",\\\"Rebind\\\":\\\"true\\\",\\\"Skill Id\\\":\\\"3\\\"}\",\"{\\\"Keyboard Input\\\":\\\"#1\\\",\\\"Gamepad Input\\\":\\\"$L1\\\",\\\"Rebind\\\":\\\"true\\\",\\\"Skill Id\\\":\\\"10\\\"}\",\"{\\\"Keyboard Input\\\":\\\"#2\\\",\\\"Gamepad Input\\\":\\\"\\\",\\\"Rebind\\\":\\\"true\\\",\\\"Skill Id\\\":\\\"0\\\"}\",\"{\\\"Keyboard Input\\\":\\\"#3\\\",\\\"Gamepad Input\\\":\\\"$R1\\\",\\\"Rebind\\\":\\\"true\\\",\\\"Skill Id\\\":\\\"\\\"}\",\"{\\\"Keyboard Input\\\":\\\"#4\\\",\\\"Gamepad Input\\\":\\\"\\\",\\\"Rebind\\\":\\\"true\\\",\\\"Skill Id\\\":\\\"\\\"}\"]"}},
{"name":"========================","status":false,"description":"","parameters":{}},
{"name":"QM+CollisionMap","status":true,"description":"<QMCollisionMap>\r\nQMovement Addon: Adds image collision map feature","parameters":{"Scan Size":"4","Folder":"img/parallaxes/"}},
{"name":"QM+ColliderMap","status":true,"description":"<QMColliderMap>\r\nQMovement Addon: Allows you to load colliders to a map from json","parameters":{}},
{"name":"QM+RegionColliders","status":true,"description":"<QMRegionColliders>\r\nQMovement Addon: Allows you to add colliders on regions","parameters":{"json":"true","regionColliders":"[\"{\\\"id\\\":\\\"1\\\",\\\"type\\\":\\\"box\\\",\\\"width\\\":\\\"0\\\",\\\"height\\\":\\\"0\\\",\\\"ox\\\":\\\"0\\\",\\\"oy\\\":\\\"0\\\"}\"]"}},
{"name":"========================","status":false,"description":"","parameters":{}},
{"name":"QABS+Skillbar","status":true,"description":"<QABSSkillbar>\r\nQABS Addon: Adds a skillbar","parameters":{"Show Unassigned Keys":"true","Default visibility":"true"}},
{"name":"QABS+Gauges","status":false,"description":"<QABSGauges>\r\nQABS Addon: Adds hp gauges to enemies","parameters":{"Gauge Configs":"","Gauge Width":"48","Gauge Height":"4","Boss Gauge Width":"480","Boss Gauge Height":"16","Gauge Default OX":"0","Gauge Default OY":"-48","Boss Gauge Default OX":"0","Boss Gauge Default OY":"24","Gauge Colors":"","Gauge Background Color":"#202040","Gauge Inbetween Color":"#ffffff","Gauge HP Color 1":"#e08040","Gauge HP Color 2":"#f0c040","Gauge Text":"","Text Font":"GameFont","Font Size":"14","Font Color":"#ffffff","Boss Text Font":"GameFont","Boss Font Size":"18","Boss Font Color":"#ffffff"}},
{"name":"========================","status":false,"description":"","parameters":{}},
{"name":"QTouch","status":true,"description":"<QTouch>\nBetter mouse handling for MV","parameters":{"Mouse Decay":"60","Default Cursor":"icon/cursor-default.png","Pointer Cursor":"icon/cursor-pointer.png"}},
{"name":"========================","status":false,"description":"","parameters":{}},
{"name":"QInput","status":true,"description":"<QInput>\r\nAdds additional keys to Input class, and allows remapping keys.","parameters":{"Threshold":"0.20","Input Remap":"","Ok":"[\"#enter\",\"#space\",\"#z\",\"$A\"]","Escape / Cancel":"[\"#esc\", \"#insert\", \"#x\", \"#num0\", \"$B\"]","Menu":"[\"#esc\", \"$Y\"]","Shift":"[\"#shift\", \"#cancel\", \"$X\"]","Control":"[\"#ctrl\", \"#alt\"]","Tab":"[\"#tab\"]","Pageup":"[\"#pageup\", \"#q\", \"$L1\"]","Pagedown":"[\"#pagedown\", \"#w\", \"$R1\"]","Left":"[\"#a\",\"#left\",\"$LEFT\"]","Right":"[\"#d\",\"#right\",\"$RIGHT\"]","Up":"[\"#w\",\"#up\",\"$UP\"]","Down":"[\"#s\",\"#down\",\"$DOWN\"]","Debug":"[\"#f9\"]","ControlKeys Remap":"","FPS":"f2","Streched":"f3","FullScreen":"f4","Restart":"f5","Console":"f8"}},
{"name":"QInput+Remap","status":true,"description":"<QInputRemap>\r\nQInput Addon: Adds Key remapping to Options menu","parameters":{"Hide Keys":"[]","Disable Keys":"[\"ok\", \"escape\"]","Vocab":"","Vocab: Ok":"Action","Vocab: Escape":"Cancel","Vocab: Shift":"Run","Vocab: Control":"Control","Vocab: Tab":"Tab","Vocab: Pageup":"Next","Vocab: Pagedown":"Prev","Vocab: Up":"Up","Vocab: Down":"Down","Vocab: Left":"Left","Vocab: Right":"Right"}},
{"name":"QNameInput","status":true,"description":"<QNameInput>\r\nQuasi Input addon: Adds Keyboard Input to Name Input Scene","parameters":{"Show Window with Keys":"true","Window Width":"480"}},
{"name":"========================","status":false,"description":"","parameters":{}},
{"name":"QSprite","status":true,"description":"<QSprite>\r\nLets you configure Spritesheets","parameters":{"File Name Identifier":"%{config}-","Random Idle Interval":"{\"Min\":\"60\",\"Max\":\"300\"}","Use New Adjust":"true"}},
{"name":"QAudio","status":true,"description":"<QAudio>\r\nFew new audio features","parameters":{"Default Radius":"5","Default Max Volume":"100"}},
{"name":"QSpeed","status":true,"description":"<QSpeed>\r\nAllows for custom Move speeds and an acceleration effect","parameters":{"Acceleration":"true","Duration":"30","Dash Inc":"0.5"}},
{"name":"QCamera","status":true,"description":"<QCamera>\r\nBetter Camera control","parameters":{"Offset":"0.5","Shift Y":"0","Shift X":"0"}},
{"name":"QYScale","status":true,"description":"<QYScale>\r\nChange characters scale based off their Y value","parameters":{}},
{"name":"QMap","status":true,"description":"<QMap>\r\nCreates maps made with QMap Editor","parameters":{}},
{"name":"========================","status":false,"description":"","parameters":{}},
{"name":"QImport","status":true,"description":"<QImport>\r\nLets you import text from other game objects or txt files","parameters":{}},
{"name":"QPathfind","status":true,"description":"<QPathfind>\r\nA* Pathfinding algorithm","parameters":{"Diagonals":"true","Any Angle":"true","Intervals":"100","Smart Wait":"60","Dash on Mouse":"true"}},
{"name":"QSight","status":true,"description":"<QSight>\r\nReal time line of sight","parameters":{"See Through Terrain":"[]","Show":"true"}},
{"name":"Q_IsoCam","status":false,"description":"<Q_IsoCam>\r\ndesc","parameters":{}},
{"name":"Q_Culling","status":true,"description":"<QCulling>","parameters":{}},
{"name":"QPopup","status":true,"description":"<QPopup>\r\nLets you create popups in the map or on screen","parameters":{"Presets":"[\"{\\\"ID\\\":\\\"test\\\",\\\"Style\\\":\\\"\\\",\\\"Font Face\\\":\\\"GameFont\\\",\\\"Font Size\\\":\\\"14\\\",\\\"Font Color\\\":\\\"#ffffff\\\",\\\"Padding\\\":\\\"8\\\",\\\"Windowed\\\":\\\"true\\\",\\\"Transitions\\\":\\\"[]\\\"}\"]"}},
{"name":"QEventSave","status":true,"description":"<QEventSave>\r\nSave Events position on Map change","parameters":{}},
{"name":"========================","status":false,"description":"","parameters":{}},
{"name":"QM+Followers","status":true,"description":"<QMFollowers>\r\nQMovement Addon: Adds follower support","parameters":{}},
{"name":"QM+SetAngles","status":true,"description":"<QMSetAngles>\r\nQMovement Addon: Lets you set the angles to move for diagonals","parameters":{"Angle 1":"135","Angle 3":"45","Angle 7":"225","Angle 9":"315"}},
{"name":"QM+FaceMouse","status":false,"description":"<QMFaceMouse>\r\nQMovement Addon: Player will always face towards mouse position","parameters":{}},
{"name":"========================","status":false,"description":"","parameters":{}},
{"name":"QYanfly-patches","status":true,"description":"<QYanfly-patches>\r\nPatches for Yanfly plugins and QPlugins","parameters":{}},
{"name":"QDebug","status":true,"description":"<QDebug>\r\nA better debug for MV","parameters":{}},
{"name":"QPicture","status":true,"description":"<QPicture>\r\ndesc","parameters":{"":"","===========":""}},
{"name":"QEvent","status":true,"description":"<QEvent>\r\nExtends Common Event functionality","parameters":{}},
{"name":"QParams","status":true,"description":"<QParams>\r\nCustom parameters and improvements","parameters":{"Use JSON":"true","Custom Params":"[\"{\\\"abr\\\":\\\"qpp\\\",\\\"name\\\":\\\"Test\\\",\\\"default\\\":\\\"5\\\",\\\"min\\\":\\\"\\\",\\\"max\\\":\\\"10\\\"}\"]"}},
{"name":"QLoader","status":false,"description":"<QLoader>\r\ndesc","parameters":{"":"","===========":""}},
{"name":"YEP_PartySystem","status":true,"description":"v1.13 Replaces the default 'Formation' command with a new\nmenu for players to easily change party formations.","parameters":{"---General---":"","Max Battle Members":"4","Show Battle Command":"true","Enable Battle Command":"true","Battle Cooldown":"1","Maximum Followers":"4","EXP Distribution":"false","---Menu---":"","Help Window":"false","Text Alignment":"center","Change Command":"Change","Remove Command":"Remove","Revert Command":"Revert","Finish Command":"Finish","---Selection---":"","Empty Text":"- Empty -","Actor Face":"true","Actor Sprite":"true","---List---":"","Remove Icon":"16","Show Sprite":"true","Sprite Y Buffer":"16","In Party Text Color":"6","---Locking---":"","Lock First Actor":"false","Locked Icon":"195","Required Icon":"205","---Detail Window---":"","Enable Detail Window":"true","List Width":"300","Actor Parameters":"Parameters","Actor Equipment":"Equipment"}}
];
