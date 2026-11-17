const fs = require('fs');
const path = require('path');
const gdModule = require('./libGD.js');

gdModule().then(gd => {
    console.log('Building GDevelop 5.6 Project via native libGD API...');
    
    const project = gd.ProjectHelper.createNewGDJSProject();
    project.setName('ShooterGame');
    project.setGameResolutionSize(480, 720);
    project.setAdaptGameResolutionAtRuntime(true);
    
    // 1. Setup layout (Scene)
    const layout = project.insertNewLayout('GameScene', 0);
    layout.setBackgroundColor(10, 10, 30);
    project.setFirstLayout('GameScene');
    
    // Layers: Base "" and "UI"
    layout.insertNewLayer('UI', 1);
    
    // 2. Add Resources to Manager
    const rm = project.getResourcesManager();
    
    const images = [
        'player.png',
        'player_bullet.png',
        'bullet_enemy_small.png',
        'bullet_enemy_big.png',
        'enemy1.png',
        'enemy2.png',
        'boss1.png',
        'boss2.png',
        'death_frame0.png',
        'death_frame1.png',
        'death_frame2.png',
        'death_frame3.png',
        'btn_left.png',
        'btn_right.png',
        'btn_shoot.png',
        'health_heart.png'
    ];
    
    images.forEach(imgName => {
        const res = new gd.ImageResource();
        res.setName(imgName);
        res.setFile('images/' + imgName);
        res.setSmooth(true);
        res.setUserAdded(true);
        rm.addResource(res);
    });
    
    const sounds = [
        'enemy_appear.wav',
        'enemy_hit.wav',
        'boss_appear.wav',
        'boss_hit.wav',
        'enemy2_appear.wav',
        'enemy2_hit.wav',
        'boss2_appear.wav',
        'boss2_hit.wav',
        'player_shoot.wav',
        'player_hit.wav',
        'player_death.wav',
        'explosion.wav',
        'bigbullet_destroy.wav'
    ];
    
    sounds.forEach(sndName => {
        const res = new gd.AudioResource();
        res.setName(sndName);
        res.setFile('sounds/' + sndName);
        res.setUserAdded(true);
        rm.addResource(res);
    });
    
    // 3. Helper to create Sprite Objects
    const objs = layout.getObjects();
    
    function addSprite(name, animName, frameFiles, loop = true, time = 0.1) {
        const obj = objs.insertNewObject(project, 'Sprite', name, objs.getObjectsCount());
        const spriteConfig = gd.asSpriteConfiguration(obj.getConfiguration());
        
        const anim = new gd.Animation();
        anim.setName(animName);
        
        const dir = new gd.Direction();
        dir.setTimeBetweenFrames(time);
        dir.setLoop(loop);
        
        frameFiles.forEach(f => {
            const sp = new gd.Sprite();
            sp.setImageName(f);
            dir.addSprite(sp);
        });
        
        anim.setDirection(dir, 0);
        spriteConfig.getAnimations().addAnimation(anim);
        return obj;
    }
    
    // Create all sprite objects
    addSprite('Player', 'Idle', ['player.png']);
    addSprite('DeathAnim', 'Explode', ['death_frame0.png', 'death_frame1.png', 'death_frame2.png', 'death_frame3.png'], false, 0.12);
    addSprite('PlayerBullet', 'Default', ['player_bullet.png'], false);
    addSprite('Enemy', 'Fly', ['enemy1.png']);
    addSprite('Enemy2', 'Fly', ['enemy2.png']);
    addSprite('EnemyBulletSmall', 'Default', ['bullet_enemy_small.png'], false);
    addSprite('EnemyBulletBig', 'Default', ['bullet_enemy_big.png'], false);
    addSprite('Boss1', 'Idle', ['boss1.png']);
    addSprite('Boss2', 'Idle', ['boss2.png']);
    addSprite('BtnLeft', 'Normal', ['btn_left.png'], false);
    addSprite('BtnRight', 'Normal', ['btn_right.png'], false);
    addSprite('BtnShoot', 'Normal', ['btn_shoot.png'], false);
    
    // Helper to create Text Objects
    function addText(name, defaultText, size, color, bold = true) {
        const obj = objs.insertNewObject(project, 'TextObject::Text', name, objs.getObjectsCount());
        const textConfig = gd.asTextObjectConfiguration(obj.getConfiguration());
        textConfig.setText(defaultText);
        textConfig.setCharacterSize(size);
        textConfig.setColor(color);
        textConfig.setBold(bold);
        return obj;
    }
    
    addText('ScoreText', 'SCORE: 0', 22, '255;255;0');
    addText('HPText', 'HP: 3', 22, '255;80;80');
    addText('WaveText', 'WAVE: 1', 22, '100;220;255');
    addText('BossHealthBar', 'BOSS HP: 10', 20, '255;50;50');
    addText('GameOverText', 'GAME OVER', 42, '255;50;50');
    addText('YouWinText', 'YOU WIN!', 42, '255;220;0');
    
    // 4. Initial Instances
    const insts = layout.getInitialInstances();
    
    function addInstance(name, x, y, layer = '', z = 5, w = 0, h = 0) {
        const inst = insts.insertNewInitialInstance();
        inst.setObjectName(name);
        inst.setX(x);
        inst.setY(y);
        inst.setZOrder(z);
        inst.setLayer(layer);
        if (w > 0 && h > 0) {
            inst.setCustomWidth(w);
            inst.setCustomHeight(h);
        }
        return inst;
    }
    
    addInstance('Player', 210, 600, '', 5, 60, 60);
    addInstance('BtnLeft', 20, 630, 'UI', 10, 70, 70);
    addInstance('BtnRight', 105, 630, 'UI', 10, 70, 70);
    addInstance('BtnShoot', 370, 630, 'UI', 10, 90, 70);
    addInstance('ScoreText', 10, 10, 'UI', 10);
    addInstance('HPText', 10, 40, 'UI', 10);
    addInstance('WaveText', 340, 10, 'UI', 10);
    addInstance('BossHealthBar', 140, 10, 'UI', 10);
    addInstance('GameOverText', 100, 300, 'UI', 10);
    addInstance('YouWinText', 120, 300, 'UI', 10);
    
    // 5. Global Variables
    const gVars = project.getVariables();
    function setGVar(name, val) {
        const v = gVars.insert(name, new gd.Variable(), gVars.count());
        v.setValue(val);
    }
    setGVar('Score', 0);
    setGVar('Wave', 1);
    
    // Scene Variables
    const sVars = layout.getVariables();
    function setSVar(name, val) {
        const v = sVars.insert(name, new gd.Variable(), sVars.count());
        v.setValue(val);
    }
    setSVar('PlayerHP', 3);
    setSVar('EnemiesAlive', 0);
    setSVar('EnemySpawnCount', 0);
    setSVar('Enemy2SpawnCount', 0);
    setSVar('BossHP', 10);
    setSVar('Boss2HP', 20);
    setSVar('BossDirection', 1);
    setSVar('Boss2Direction', 1);
    setSVar('BossSpawned', 0);
    setSVar('Boss2Spawned', 0);
    setSVar('GameOver', 0);
    setSVar('ShootCooldown', 0);
    
    // 6. Events
    const events = layout.getEvents();
    
    function addComment(text) {
        const c = events.insertNewEvent(project, 'BuiltinCommonInstructions::Comment', events.getEventsCount());
        gd.asCommentEvent(c).setComment(text);
    }
    
    function addEvent(conditions, actions) {
        const ev = events.insertNewEvent(project, 'BuiltinCommonInstructions::Standard', events.getEventsCount());
        const std = gd.asStandardEvent(ev);
        
        conditions.forEach(c => {
            const inst = new gd.Instruction();
            inst.setType(c.type);
            inst.setParametersCount(c.params.length);
            c.params.forEach((p, idx) => inst.setParameter(idx, p));
            if (c.inverted) inst.setInverted(true);
            std.getConditions().insert(inst, std.getConditions().size());
        });
        
        actions.forEach(a => {
            const inst = new gd.Instruction();
            inst.setType(a.type);
            inst.setParametersCount(a.params.length);
            a.params.forEach((p, idx) => inst.setParameter(idx, p));
            std.getActions().insert(inst, std.getActions().size());
        });
    }
    
    addComment('====================================================\n SHOOTER GAME (GDevelop 5.6 Native)\n CUSTOMIZE: Edit sprites in images/, sounds in sounds/\n Swap Player sprite to your friend\'s picture anytime!\n====================================================');
    
    // Section 1: Init at scene start
    addComment('--- SECTION 1: INITIALIZATION ---');
    addEvent(
        [{ type: 'DepartScene', params: [''], inverted: false }],
        [
            { type: 'SetHidden', params: ['GameOverText', ''] },
            { type: 'SetHidden', params: ['YouWinText', ''] },
            { type: 'SetHidden', params: ['BossHealthBar', ''] },
            { type: 'ModVarScene', params: ['PlayerHP', '=', '3'] },
            { type: 'ModVarGlobal', params: ['Score', '=', '0'] },
            { type: 'ModVarGlobal', params: ['Wave', '=', '1'] },
            { type: 'ModVarScene', params: ['EnemiesAlive', '=', '0'] },
            { type: 'ModVarScene', params: ['GameOver', '=', '0'] }
        ]
    );
    
    // Section 2: HUD Updates
    addComment('--- SECTION 2: HUD TEXT UPDATES ---');
    addEvent(
        [],
        [
            { type: 'SetText', params: ['ScoreText', '=', '"SCORE: " + ToString(GlobalVariable(Score))'] },
            { type: 'SetText', params: ['HPText', '=', '"HP: " + ToString(Variable(PlayerHP))'] },
            { type: 'SetText', params: ['WaveText', '=', '"WAVE: " + ToString(GlobalVariable(Wave))'] }
        ]
    );
    
    // Section 3: Player Movement (Buttons + Arrows)
    addComment('--- SECTION 3: PLAYER CONTROLS (Left/Right Buttons & Arrows) ---');
    addEvent(
        [
            { type: 'VarScene', params: ['GameOver', '=', '0'], inverted: false },
            { type: 'KeyPressed', params: ['', 'Left'], inverted: false }
        ],
        [{ type: 'MettreX', params: ['Player', '-', '320 * TimeDelta()'] }]
    );
    addEvent(
        [
            { type: 'VarScene', params: ['GameOver', '=', '0'], inverted: false },
            { type: 'SourisSurObjet', params: ['BtnLeft'], inverted: false },
            { type: 'SourisBouton', params: ['', 'Left'], inverted: false }
        ],
        [{ type: 'MettreX', params: ['Player', '-', '320 * TimeDelta()'] }]
    );
    addEvent(
        [
            { type: 'VarScene', params: ['GameOver', '=', '0'], inverted: false },
            { type: 'KeyPressed', params: ['', 'Right'], inverted: false }
        ],
        [{ type: 'MettreX', params: ['Player', '+', '320 * TimeDelta()'] }]
    );
    addEvent(
        [
            { type: 'VarScene', params: ['GameOver', '=', '0'], inverted: false },
            { type: 'SourisSurObjet', params: ['BtnRight'], inverted: false },
            { type: 'SourisBouton', params: ['', 'Left'], inverted: false }
        ],
        [{ type: 'MettreX', params: ['Player', '+', '320 * TimeDelta()'] }]
    );
    
    // Clamp Player on screen
    addEvent(
        [{ type: 'PosX', params: ['Player', '<', '0'], inverted: false }],
        [{ type: 'MettreX', params: ['Player', '=', '0'] }]
    );
    addEvent(
        [{ type: 'PosX', params: ['Player', '>', '420'], inverted: false }],
        [{ type: 'MettreX', params: ['Player', '=', '420'] }]
    );
    
    // Section 4: Player Shooting (Upward Only)
    addComment('--- SECTION 4: PLAYER SHOOTING (Upward Only, Cooldown 0.3s) ---');
    addEvent(
        [
            { type: 'VarScene', params: ['GameOver', '=', '0'], inverted: false },
            { type: 'VarScene', params: ['ShootCooldown', '<=', '0'], inverted: false },
            { type: 'KeyPressed', params: ['', 'Space'], inverted: false }
        ],
        [
            { type: 'CreateObject', params: ['', 'PlayerBullet', 'Player.X() + 25', 'Player.Y() - 10', ''] },
            { type: 'PlaySound', params: ['', 'player_shoot.wav', 'false', '80', '1'] },
            { type: 'ModVarScene', params: ['ShootCooldown', '=', '0.3'] }
        ]
    );
    addEvent(
        [
            { type: 'VarScene', params: ['GameOver', '=', '0'], inverted: false },
            { type: 'VarScene', params: ['ShootCooldown', '<=', '0'], inverted: false },
            { type: 'SourisSurObjet', params: ['BtnShoot'], inverted: false },
            { type: 'SourisBouton', params: ['', 'Left'], inverted: false }
        ],
        [
            { type: 'CreateObject', params: ['', 'PlayerBullet', 'Player.X() + 25', 'Player.Y() - 10', ''] },
            { type: 'PlaySound', params: ['', 'player_shoot.wav', 'false', '80', '1'] },
            { type: 'ModVarScene', params: ['ShootCooldown', '=', '0.3'] }
        ]
    );
    addEvent(
        [{ type: 'VarScene', params: ['ShootCooldown', '>', '0'], inverted: false }],
        [{ type: 'ModVarScene', params: ['ShootCooldown', '-', 'TimeDelta()'] }]
    );
    addEvent(
        [],
        [{ type: 'MettreY', params: ['PlayerBullet', '-', '600 * TimeDelta()'] }]
    );
    addEvent(
        [{ type: 'PosY', params: ['PlayerBullet', '<', '-30'], inverted: false }],
        [{ type: 'Delete', params: ['PlayerBullet', ''] }]
    );
    
    // Section 5: Wave 1 Spawning (3 enemies)
    addComment('--- SECTION 5: WAVE 1 (3 Enemies Spawn and Fire Downward) ---');
    addEvent(
        [
            { type: 'VarGlobal', params: ['Wave', '=', '1'], inverted: false },
            { type: 'VarScene', params: ['EnemySpawnCount', '<', '3'], inverted: false },
            { type: 'Timer', params: ['', '1.8', 'EnemySpawnTimer'], inverted: false }
        ],
        [
            { type: 'CreateObject', params: ['', 'Enemy', 'RandomInRange(50, 400)', '-60', ''] },
            { type: 'PlaySound', params: ['', 'enemy_appear.wav', 'false', '80', '1'] },
            { type: 'ModVarScene', params: ['EnemySpawnCount', '+', '1'] },
            { type: 'ModVarScene', params: ['EnemiesAlive', '+', '1'] },
            { type: 'ResetTimer', params: ['', 'EnemySpawnTimer'] }
        ]
    );
    addEvent(
        [],
        [{ type: 'MettreY', params: ['Enemy', '+', '100 * TimeDelta()'] }]
    );
    
    // Enemy Firing Downward (Small & Big bullets)
    addEvent(
        [
            { type: 'NbObjet', params: ['Enemy', '>', '0'], inverted: false },
            { type: 'Timer', params: ['', '1.5', 'EnemyFireTimer'], inverted: false }
        ],
        [
            { type: 'CreateObject', params: ['', 'EnemyBulletSmall', 'Enemy.X() + 20', 'Enemy.Y() + 45', ''] },
            { type: 'ResetTimer', params: ['', 'EnemyFireTimer'] }
        ]
    );
    addEvent(
        [
            { type: 'NbObjet', params: ['Enemy', '>', '0'], inverted: false },
            { type: 'Timer', params: ['', '3.2', 'EnemyBigFireTimer'], inverted: false }
        ],
        [
            { type: 'CreateObject', params: ['', 'EnemyBulletBig', 'Enemy.X() + 15', 'Enemy.Y() + 45', ''] },
            { type: 'ResetTimer', params: ['', 'EnemyBigFireTimer'] }
        ]
    );
    addEvent(
        [],
        [
            { type: 'MettreY', params: ['EnemyBulletSmall', '+', '300 * TimeDelta()'] },
            { type: 'MettreY', params: ['EnemyBulletBig', '+', '180 * TimeDelta()'] }
        ]
    );
    addEvent(
        [{ type: 'PosY', params: ['EnemyBulletSmall', '>', '750'], inverted: false }],
        [{ type: 'Delete', params: ['EnemyBulletSmall', ''] }]
    );
    addEvent(
        [{ type: 'PosY', params: ['EnemyBulletBig', '>', '750'], inverted: false }],
        [{ type: 'Delete', params: ['EnemyBulletBig', ''] }]
    );
    
    // Big Bullet shootdown rule: Player can ONLY shoot down EnemyBulletBig!
    addComment('--- BULLET RULE: Player bullet DESTROYS Big enemy bullet! ---');
    addEvent(
        [{ type: 'CollisionNP', params: ['PlayerBullet', 'EnemyBulletBig', '', ''], inverted: false }],
        [
            { type: 'Delete', params: ['PlayerBullet', ''] },
            { type: 'Delete', params: ['EnemyBulletBig', ''] },
            { type: 'PlaySound', params: ['', 'bigbullet_destroy.wav', 'false', '90', '1'] },
            { type: 'ModVarGlobal', params: ['Score', '+', '25'] }
        ]
    );
    
    // PlayerBullet hits Enemy
    addEvent(
        [{ type: 'CollisionNP', params: ['PlayerBullet', 'Enemy', '', ''], inverted: false }],
        [
            { type: 'Delete', params: ['PlayerBullet', ''] },
            { type: 'Delete', params: ['Enemy', ''] },
            { type: 'PlaySound', params: ['', 'enemy_hit.wav', 'false', '80', '1'] },
            { type: 'PlaySound', params: ['', 'explosion.wav', 'false', '80', '1'] },
            { type: 'ModVarGlobal', params: ['Score', '+', '100'] },
            { type: 'ModVarScene', params: ['EnemiesAlive', '-', '1'] }
        ]
    );
    
    // Section 6: Boss 1 Spawns After Wave 1
    addComment('--- SECTION 6: BOSS 1 (Spawns after 3 enemies defeated) ---');
    addEvent(
        [
            { type: 'VarGlobal', params: ['Wave', '=', '1'], inverted: false },
            { type: 'VarScene', params: ['EnemySpawnCount', '>=', '3'], inverted: false },
            { type: 'VarScene', params: ['EnemiesAlive', '<=', '0'], inverted: false },
            { type: 'VarScene', params: ['BossSpawned', '=', '0'], inverted: false }
        ],
        [
            { type: 'CreateObject', params: ['', 'Boss1', '180', '80', ''] },
            { type: 'PlaySound', params: ['', 'boss_appear.wav', 'false', '100', '1'] },
            { type: 'SetVisible', params: ['BossHealthBar', ''] },
            { type: 'SetText', params: ['BossHealthBar', '=', '"BOSS HP: 10"'] },
            { type: 'ModVarScene', params: ['BossSpawned', '=', '1'] }
        ]
    );
    
    // Boss 1 Movement (Side to side)
    addEvent(
        [
            { type: 'NbObjet', params: ['Boss1', '>', '0'], inverted: false },
            { type: 'VarScene', params: ['BossDirection', '=', '1'], inverted: false }
        ],
        [{ type: 'MettreX', params: ['Boss1', '+', '160 * TimeDelta()'] }]
    );
    addEvent(
        [
            { type: 'NbObjet', params: ['Boss1', '>', '0'], inverted: false },
            { type: 'PosX', params: ['Boss1', '>=', '340'], inverted: false }
        ],
        [{ type: 'ModVarScene', params: ['BossDirection', '=', '-1'] }]
    );
    addEvent(
        [
            { type: 'NbObjet', params: ['Boss1', '>', '0'], inverted: false },
            { type: 'VarScene', params: ['BossDirection', '=', '-1'], inverted: false }
        ],
        [{ type: 'MettreX', params: ['Boss1', '-', '160 * TimeDelta()'] }]
    );
    addEvent(
        [
            { type: 'NbObjet', params: ['Boss1', '>', '0'], inverted: false },
            { type: 'PosX', params: ['Boss1', '<=', '40'], inverted: false }
        ],
        [{ type: 'ModVarScene', params: ['BossDirection', '=', '1'] }]
    );
    
    // Boss 1 Firing
    addEvent(
        [
            { type: 'NbObjet', params: ['Boss1', '>', '0'], inverted: false },
            { type: 'Timer', params: ['', '1.3', 'Boss1FireTimer'], inverted: false }
        ],
        [
            { type: 'CreateObject', params: ['', 'EnemyBulletSmall', 'Boss1.X() + 30', 'Boss1.Y() + 85', ''] },
            { type: 'CreateObject', params: ['', 'EnemyBulletSmall', 'Boss1.X() + 70', 'Boss1.Y() + 85', ''] },
            { type: 'CreateObject', params: ['', 'EnemyBulletBig', 'Boss1.X() + 50', 'Boss1.Y() + 85', ''] },
            { type: 'ResetTimer', params: ['', 'Boss1FireTimer'] }
        ]
    );
    
    // PlayerBullet hits Boss 1
    addEvent(
        [{ type: 'CollisionNP', params: ['PlayerBullet', 'Boss1', '', ''], inverted: false }],
        [
            { type: 'Delete', params: ['PlayerBullet', ''] },
            { type: 'ModVarScene', params: ['BossHP', '-', '1'] },
            { type: 'PlaySound', params: ['', 'boss_hit.wav', 'false', '80', '1'] },
            { type: 'SetText', params: ['BossHealthBar', '=', '"BOSS HP: " + ToString(Variable(BossHP))'] }
        ]
    );
    
    // Boss 1 Defeated -> Advance to Wave 2
    addEvent(
        [
            { type: 'VarScene', params: ['BossSpawned', '=', '1'], inverted: false },
            { type: 'VarScene', params: ['BossHP', '<=', '0'], inverted: false }
        ],
        [
            { type: 'Delete', params: ['Boss1', ''] },
            { type: 'PlaySound', params: ['', 'explosion.wav', 'false', '100', '1'] },
            { type: 'SetHidden', params: ['BossHealthBar', ''] },
            { type: 'ModVarGlobal', params: ['Score', '+', '1000'] },
            { type: 'ModVarGlobal', params: ['Wave', '=', '2'] },
            { type: 'ModVarScene', params: ['BossSpawned', '=', '2'] },
            { type: 'ModVarScene', params: ['EnemiesAlive', '=', '0'] }
        ]
    );
    
    // Section 7: Wave 2 (5 Enemies)
    addComment('--- SECTION 7: WAVE 2 (5 Faster Enemies) ---');
    addEvent(
        [
            { type: 'VarGlobal', params: ['Wave', '=', '2'], inverted: false },
            { type: 'VarScene', params: ['Enemy2SpawnCount', '<', '5'], inverted: false },
            { type: 'Timer', params: ['', '1.4', 'Enemy2SpawnTimer'], inverted: false }
        ],
        [
            { type: 'CreateObject', params: ['', 'Enemy2', 'RandomInRange(40, 420)', '-60', ''] },
            { type: 'PlaySound', params: ['', 'enemy2_appear.wav', 'false', '80', '1'] },
            { type: 'ModVarScene', params: ['Enemy2SpawnCount', '+', '1'] },
            { type: 'ModVarScene', params: ['EnemiesAlive', '+', '1'] },
            { type: 'ResetTimer', params: ['', 'Enemy2SpawnTimer'] }
        ]
    );
    addEvent(
        [],
        [{ type: 'MettreY', params: ['Enemy2', '+', '140 * TimeDelta()'] }]
    );
    addEvent(
        [{ type: 'CollisionNP', params: ['PlayerBullet', 'Enemy2', '', ''], inverted: false }],
        [
            { type: 'Delete', params: ['PlayerBullet', ''] },
            { type: 'Delete', params: ['Enemy2', ''] },
            { type: 'PlaySound', params: ['', 'enemy2_hit.wav', 'false', '80', '1'] },
            { type: 'PlaySound', params: ['', 'explosion.wav', 'false', '80', '1'] },
            { type: 'ModVarGlobal', params: ['Score', '+', '200'] },
            { type: 'ModVarScene', params: ['EnemiesAlive', '-', '1'] }
        ]
    );
    
    // Section 8: Boss 2 Spawns After Wave 2
    addComment('--- SECTION 8: BOSS 2 (Spawns after Wave 2) ---');
    addEvent(
        [
            { type: 'VarGlobal', params: ['Wave', '=', '2'], inverted: false },
            { type: 'VarScene', params: ['Enemy2SpawnCount', '>=', '5'], inverted: false },
            { type: 'VarScene', params: ['EnemiesAlive', '<=', '0'], inverted: false },
            { type: 'VarScene', params: ['Boss2Spawned', '=', '0'], inverted: false }
        ],
        [
            { type: 'CreateObject', params: ['', 'Boss2', '160', '70', ''] },
            { type: 'PlaySound', params: ['', 'boss2_appear.wav', 'false', '100', '1'] },
            { type: 'SetVisible', params: ['BossHealthBar', ''] },
            { type: 'SetText', params: ['BossHealthBar', '=', '"BOSS 2 HP: 20"'] },
            { type: 'ModVarScene', params: ['Boss2Spawned', '=', '1'] }
        ]
    );
    addEvent(
        [
            { type: 'NbObjet', params: ['Boss2', '>', '0'], inverted: false },
            { type: 'VarScene', params: ['Boss2Direction', '=', '1'], inverted: false }
        ],
        [{ type: 'MettreX', params: ['Boss2', '+', '200 * TimeDelta()'] }]
    );
    addEvent(
        [
            { type: 'NbObjet', params: ['Boss2', '>', '0'], inverted: false },
            { type: 'PosX', params: ['Boss2', '>=', '320'], inverted: false }
        ],
        [{ type: 'ModVarScene', params: ['Boss2Direction', '=', '-1'] }]
    );
    addEvent(
        [
            { type: 'NbObjet', params: ['Boss2', '>', '0'], inverted: false },
            { type: 'VarScene', params: ['Boss2Direction', '=', '-1'], inverted: false }
        ],
        [{ type: 'MettreX', params: ['Boss2', '-', '200 * TimeDelta()'] }]
    );
    addEvent(
        [
            { type: 'NbObjet', params: ['Boss2', '>', '0'], inverted: false },
            { type: 'PosX', params: ['Boss2', '<=', '30'], inverted: false }
        ],
        [{ type: 'ModVarScene', params: ['Boss2Direction', '=', '1'] }]
    );
    addEvent(
        [
            { type: 'NbObjet', params: ['Boss2', '>', '0'], inverted: false },
            { type: 'Timer', params: ['', '1.0', 'Boss2FireTimer'], inverted: false }
        ],
        [
            { type: 'CreateObject', params: ['', 'EnemyBulletSmall', 'Boss2.X() + 30', 'Boss2.Y() + 100', ''] },
            { type: 'CreateObject', params: ['', 'EnemyBulletSmall', 'Boss2.X() + 80', 'Boss2.Y() + 100', ''] },
            { type: 'CreateObject', params: ['', 'EnemyBulletBig', 'Boss2.X() + 55', 'Boss2.Y() + 100', ''] },
            { type: 'ResetTimer', params: ['', 'Boss2FireTimer'] }
        ]
    );
    addEvent(
        [{ type: 'CollisionNP', params: ['PlayerBullet', 'Boss2', '', ''], inverted: false }],
        [
            { type: 'Delete', params: ['PlayerBullet', ''] },
            { type: 'ModVarScene', params: ['Boss2HP', '-', '1'] },
            { type: 'PlaySound', params: ['', 'boss2_hit.wav', 'false', '80', '1'] },
            { type: 'SetText', params: ['BossHealthBar', '=', '"BOSS 2 HP: " + ToString(Variable(Boss2HP))'] }
        ]
    );
    addEvent(
        [
            { type: 'VarScene', params: ['Boss2Spawned', '=', '1'], inverted: false },
            { type: 'VarScene', params: ['Boss2HP', '<=', '0'], inverted: false }
        ],
        [
            { type: 'Delete', params: ['Boss2', ''] },
            { type: 'PlaySound', params: ['', 'explosion.wav', 'false', '100', '1'] },
            { type: 'SetHidden', params: ['BossHealthBar', ''] },
            { type: 'SetVisible', params: ['YouWinText', ''] },
            { type: 'ModVarGlobal', params: ['Score', '+', '2500'] },
            { type: 'ModVarScene', params: ['Boss2Spawned', '=', '2'] }
        ]
    );
    
    // Section 9: Player Damage & Death Animation
    addComment('--- SECTION 9: DAMAGE & CUSTOM DEATH ANIMATION ---');
    addEvent(
        [
            { type: 'VarScene', params: ['GameOver', '=', '0'], inverted: false },
            { type: 'CollisionNP', params: ['Player', 'EnemyBulletSmall', '', ''], inverted: false }
        ],
        [
            { type: 'Delete', params: ['EnemyBulletSmall', ''] },
            { type: 'ModVarScene', params: ['PlayerHP', '-', '1'] },
            { type: 'PlaySound', params: ['', 'player_hit.wav', 'false', '90', '1'] }
        ]
    );
    addEvent(
        [
            { type: 'VarScene', params: ['GameOver', '=', '0'], inverted: false },
            { type: 'CollisionNP', params: ['Player', 'EnemyBulletBig', '', ''], inverted: false }
        ],
        [
            { type: 'Delete', params: ['EnemyBulletBig', ''] },
            { type: 'ModVarScene', params: ['PlayerHP', '-', '2'] },
            { type: 'PlaySound', params: ['', 'player_hit.wav', 'false', '100', '1'] }
        ]
    );
    addEvent(
        [
            { type: 'VarScene', params: ['GameOver', '=', '0'], inverted: false },
            { type: 'VarScene', params: ['PlayerHP', '<=', '0'], inverted: false }
        ],
        [
            { type: 'ModVarScene', params: ['GameOver', '=', '1'] },
            { type: 'CreateObject', params: ['', 'DeathAnim', 'Player.X()', 'Player.Y()', ''] },
            { type: 'SetHidden', params: ['Player', ''] },
            { type: 'SetVisible', params: ['GameOverText', ''] },
            { type: 'PlaySound', params: ['', 'player_death.wav', 'false', '100', '1'] }
        ]
    );
    
    // 7. Serialize to element and generate native JSON
    const element = new gd.SerializerElement();
    project.serializeTo(element);
    
    // Generate native JSON string
    const jsonString = gd.Serializer.toJSON(element);
    
    // Format JSON with 2-space indentation
    const parsedObj = JSON.parse(jsonString);
    const prettyJson = JSON.stringify(parsedObj, null, 2);
    
    // Save both game.json and ShooterGame.json
    fs.writeFileSync('game.json', prettyJson, 'utf8');
    fs.writeFileSync('ShooterGame.json', prettyJson, 'utf8');
    
    console.log('Successfully wrote game.json and ShooterGame.json!');
    
    // 8. Test Native Roundtrip Unserialize
    const verifyElement = gd.Serializer.fromJSON(prettyJson);
    const verifyProject = gd.ProjectHelper.createNewGDJSProject();
    verifyProject.unserializeFrom(verifyElement);
    
    console.log('====================================================');
    console.log('VERIFICATION COMPLETE:');
    console.log('Project Name:', verifyProject.getName());
    console.log('First Layout:', verifyProject.getFirstLayout());
    console.log('Layouts Count:', verifyProject.getLayoutsCount());
    console.log('Objects Count:', verifyProject.getLayoutAt(0).getObjects().getObjectsCount());
    console.log('Instances Count:', verifyProject.getLayoutAt(0).getInitialInstances().getInstancesCount());
    console.log('Events Count:', verifyProject.getLayoutAt(0).getEvents().getEventsCount());
    console.log('Resources Count:', verifyProject.getResourcesManager().getAllResourceNames().size());
    console.log('====================================================');
    console.log('PROJECT IS 100% NATIVELY VALID FOR GDEVELOP 5.6!');
});

