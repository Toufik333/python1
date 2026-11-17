// ============================================================================
// 🎮 SPACE SHOOTER — KAPLAY EDITION
// ============================================================================
// Features:
// 1. Left / Right on-screen buttons (bottom-left) + Arrow keys / A & D
// 2. Upward Shoot button (bottom-right green circle) + Spacebar
// 3. Batch 1 (3 enemies) firing downward; Big bullets CAN be shot down, small must be dodged!
// 4. Friend's character customization section
// 5. Fully customizable enemies, boss sequence, sounds, and death animation!
// ============================================================================

// ============================================================================
// 🛠️ CUSTOMIZATION SECTION — EDIT ANYTHING HERE!
// ============================================================================
const CONFIG = {
    // 🧑‍🤝‍🧑 PLAYER / FRIEND'S CHARACTER
    player: {
        sprite: "assets/images/player.png",     // 👈 SWAP THIS with your friend's photo or sprite!
        speed: 340,                             // Move speed
        hp: 3,                                  // Starting health points
        fireCooldown: 0.28,                     // Seconds between shots
        bulletSpeed: 620,                       // Upward bullet speed
    },

    // 👾 BATCH 1: 3 ENEMIES (Matches your drawing!)
    wave1: {
        count: 3,
        sprite: "assets/images/enemy1.png",     // 👈 SWAP with your enemy design
        hp: 2,
        speed: 90,
        fireRateSmall: 1.8,                     // Fire interval for small bullet (dodge only!)
        fireRateBig: 3.2,                       // Fire interval for big bullet (shootable!)
        soundAppear: "assets/sounds/enemy_appear.wav",
        soundHit: "assets/sounds/enemy_hit.wav",
    },

    // 👑 BOSS 1 (Appears after Batch 1 is cleared)
    boss1: {
        sprite: "assets/images/boss1.png",      // 👈 SWAP with your Boss 1 image
        hp: 10,
        speedX: 160,
        fireInterval: 1.2,
        soundAppear: "assets/sounds/boss_appear.wav",
        soundHit: "assets/sounds/boss_hit.wav",
    },

    // 👾 BATCH 2: 5 ENEMIES (Faster and stronger)
    wave2: {
        count: 5,
        sprite: "assets/images/enemy2.png",     // 👈 SWAP with your Batch 2 enemy
        hp: 3,
        speed: 130,
        fireRateSmall: 1.4,
        fireRateBig: 2.8,
        soundAppear: "assets/sounds/enemy2_appear.wav",
        soundHit: "assets/sounds/enemy2_hit.wav",
    },

    // 👑 BOSS 2 (Appears after Batch 2 is cleared)
    boss2: {
        sprite: "assets/images/boss2.png",      // 👈 SWAP with your Boss 2 image
        hp: 20,
        speedX: 200,
        fireInterval: 0.9,
        soundAppear: "assets/sounds/boss2_appear.wav",
        soundHit: "assets/sounds/boss2_hit.wav",
    },

    // 💀 DEATH ANIMATION & SOUNDS
    death: {
        sound: "assets/sounds/player_death.wav",
        // Replace with your animation frames or GIF frames:
        frames: [
            "assets/images/death_frame0.png",
            "assets/images/death_frame1.png",
            "assets/images/death_frame2.png",
            "assets/images/death_frame3.png",
        ]
    },

    // 🔊 AUDIO FILES (Replace with your own .wav / .mp3)
    sounds: {
        shoot: "assets/sounds/player_shoot.wav",
        playerHit: "assets/sounds/player_hit.wav",
        explosion: "assets/sounds/explosion.wav",
        bigBulletDestroy: "assets/sounds/bigbullet_destroy.wav",
    }
};

// ============================================================================
// 🎵 WEB AUDIO SYNTHESIZER FALLBACK
// (Guarantees sounds always play even if local file:// restrictions block audio files)
// ============================================================================
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playSynth(type) {
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    const now = audioCtx.currentTime;

    switch (type) {
        case 'shoot':
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(800, now);
            osc.frequency.exponentialRampToValueAtTime(150, now + 0.12);
            gain.gain.setValueAtTime(0.2, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
            osc.start(now);
            osc.stop(now + 0.12);
            break;
        case 'hit':
            osc.type = 'square';
            osc.frequency.setValueAtTime(300, now);
            osc.frequency.exponentialRampToValueAtTime(80, now + 0.15);
            gain.gain.setValueAtTime(0.3, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
            osc.start(now);
            osc.stop(now + 0.15);
            break;
        case 'appear':
            osc.type = 'sine';
            osc.frequency.setValueAtTime(200, now);
            osc.frequency.linearRampToValueAtTime(450, now + 0.2);
            gain.gain.setValueAtTime(0.25, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
            osc.start(now);
            osc.stop(now + 0.25);
            break;
        case 'boss_appear':
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(120, now);
            osc.frequency.linearRampToValueAtTime(320, now + 0.5);
            gain.gain.setValueAtTime(0.4, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.6);
            osc.start(now);
            osc.stop(now + 0.6);
            break;
        case 'destroy_big':
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(600, now);
            osc.frequency.linearRampToValueAtTime(900, now + 0.1);
            gain.gain.setValueAtTime(0.3, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
            osc.start(now);
            osc.stop(now + 0.15);
            break;
        case 'death':
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(350, now);
            osc.frequency.exponentialRampToValueAtTime(50, now + 0.7);
            gain.gain.setValueAtTime(0.4, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.7);
            osc.start(now);
            osc.stop(now + 0.7);
            break;
        case 'explosion':
            // White noise simulation
            osc.type = 'square';
            osc.frequency.setValueAtTime(140, now);
            osc.frequency.exponentialRampToValueAtTime(30, now + 0.3);
            gain.gain.setValueAtTime(0.35, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
            osc.start(now);
            osc.stop(now + 0.3);
            break;
    }
}

// Safe sound player (tries loaded asset first, falls back to synthesizer)
function playSoundEffect(soundKey, synthType) {
    try {
        play(soundKey);
    } catch (e) {
        playSynth(synthType);
    }
}

// ============================================================================
// 🚀 INITIALIZE KAPLAY
// ============================================================================
kaplay({
    width: 480,
    height: 720,
    letterbox: true,
    background: [12, 16, 26],
    touchToMouse: true,
    canvas: document.querySelector("canvas"),
});

// ============================================================================
// 🖼️ LOAD SPRITES & AUDIO
// ============================================================================
// Load Player (Your friend's character)
loadSprite("player", CONFIG.player.sprite).catch(() => {});

// Load Enemies & Bosses
loadSprite("enemy1", CONFIG.wave1.sprite).catch(() => {});
loadSprite("enemy2", CONFIG.wave2.sprite).catch(() => {});
loadSprite("boss1", CONFIG.boss1.sprite).catch(() => {});
loadSprite("boss2", CONFIG.boss2.sprite).catch(() => {});

// Load Death Animation Frames
CONFIG.death.frames.forEach((frame, idx) => {
    loadSprite(`death_frame${idx}`, frame).catch(() => {});
});

// Load Sounds
loadSound("shoot", CONFIG.sounds.shoot).catch(() => {});
loadSound("player_hit", CONFIG.sounds.playerHit).catch(() => {});
loadSound("enemy_appear", CONFIG.wave1.soundAppear).catch(() => {});
loadSound("enemy_hit", CONFIG.wave1.soundHit).catch(() => {});
loadSound("enemy2_appear", CONFIG.wave2.soundAppear).catch(() => {});
loadSound("enemy2_hit", CONFIG.wave2.soundHit).catch(() => {});
loadSound("boss_appear", CONFIG.boss1.soundAppear).catch(() => {});
loadSound("boss_hit", CONFIG.boss1.soundHit).catch(() => {});
loadSound("boss2_appear", CONFIG.boss2.soundAppear).catch(() => {});
loadSound("boss2_hit", CONFIG.boss2.soundHit).catch(() => {});
loadSound("player_death", CONFIG.death.sound).catch(() => {});
loadSound("explosion", CONFIG.sounds.explosion).catch(() => {});
loadSound("bigbullet_destroy", CONFIG.sounds.bigBulletDestroy).catch(() => {});

// ============================================================================
// 🎮 MAIN GAME SCENE
// ============================================================================
scene("game", () => {
    let score = 0;
    let wave = 1;
    let playerHP = CONFIG.player.hp;
    let gameOver = false;
    let shootCooldownTimer = 0;

    // Movement button states
    let isLeftPressed = false;
    let isRightPressed = false;
    let isShootPressed = false;

    // Starfield Background
    for (let i = 0; i < 60; i++) {
        const star = add([
            pos(rand(0, width()), rand(0, height())),
            rect(rand(1, 3), rand(1, 3)),
            color(rand(180, 255), rand(200, 255), 255),
            opacity(rand(0.3, 0.9)),
            z(-10),
            "star",
            { speed: rand(40, 180) }
        ]);
        star.onUpdate(() => {
            star.pos.y += star.speed * dt();
            if (star.pos.y > height()) {
                star.pos.y = 0;
                star.pos.x = rand(0, width());
            }
        });
    }

    // ------------------------------------------------------------------------
    // 🧑 PLAYER (Your Friend's Character!)
    // ------------------------------------------------------------------------
    const player = add([
        sprite("player"),
        pos(width() / 2, height() - 140),
        anchor("center"),
        area({ shape: new Rect(vec2(0, 0), 48, 64) }),
        z(10),
        "player"
    ]);

    // Clamping on screen
    player.onUpdate(() => {
        if (gameOver) return;

        // Controls: Left / Right via buttons OR keyboard
        if (isLeftPressed || isKeyDown("left") || isKeyDown("a")) {
            player.move(-CONFIG.player.speed, 0);
        }
        if (isRightPressed || isKeyDown("right") || isKeyDown("d")) {
            player.move(CONFIG.player.speed, 0);
        }

        // Keep inside screen boundaries
        if (player.pos.x < 35) player.pos.x = 35;
        if (player.pos.x > width() - 35) player.pos.x = width() - 35;

        // Shooting: Spacebar OR on-screen Shoot button
        shootCooldownTimer -= dt();
        if ((isShootPressed || isKeyDown("space") || isKeyDown("up")) && shootCooldownTimer <= 0) {
            spawnPlayerBullet();
            shootCooldownTimer = CONFIG.player.fireCooldown;
        }
    });

    // ------------------------------------------------------------------------
    // 🔫 PLAYER BULLET (Shoots Upwards Only)
    // ------------------------------------------------------------------------
    function spawnPlayerBullet() {
        if (gameOver) return;
        playSoundEffect("shoot", "shoot");

        add([
            pos(player.pos.x, player.pos.y - 32),
            rect(8, 22, { radius: 4 }),
            color(0, 240, 255),
            outline(2, rgb(255, 255, 255)),
            anchor("center"),
            area(),
            move(vec2(0, -1), CONFIG.player.bulletSpeed),
            offscreen({ destroy: true }),
            z(8),
            "playerBullet"
        ]);
    }

    // ------------------------------------------------------------------------
    // 🕹️ ON-SCREEN TOUCH / MOUSE CONTROLS (Matching User Drawing!)
    // ------------------------------------------------------------------------
    // Left Button (Red arrow ←)
    const btnLeft = add([
        pos(20, height() - 95),
        rect(75, 75, { radius: 18 }),
        color(220, 45, 45),
        outline(3, rgb(255, 120, 120)),
        opacity(0.85),
        area(),
        fixed(),
        z(100),
        "btnLeft"
    ]);
    btnLeft.add([
        text("←", { size: 44 }),
        anchor("center"),
        pos(37, 34),
        color(255, 255, 255)
    ]);

    // Right Button (Red arrow →)
    const btnRight = add([
        pos(108, height() - 95),
        rect(75, 75, { radius: 18 }),
        color(220, 45, 45),
        outline(3, rgb(255, 120, 120)),
        opacity(0.85),
        area(),
        fixed(),
        z(100),
        "btnRight"
    ]);
    btnRight.add([
        text("→", { size: 44 }),
        anchor("center"),
        pos(38, 34),
        color(255, 255, 255)
    ]);

    // Shoot Button (Green Circle with * Star, matching user sketch!)
    const btnShoot = add([
        pos(width() - 65, height() - 58),
        circle(48),
        color(40, 200, 75),
        outline(4, rgb(180, 255, 180)),
        opacity(0.9),
        anchor("center"),
        area(),
        fixed(),
        z(100),
        "btnShoot"
    ]);
    btnShoot.add([
        text("✱", { size: 48 }),
        anchor("center"),
        pos(0, -2),
        color(255, 255, 255)
    ]);

    // ------------------------------------------------------------------------
    // 🕹️ ON-SCREEN TOUCH / MOUSE CONTROLS (Multi-touch support)
    // ------------------------------------------------------------------------
    // Active touches map: touchId -> 'left' | 'right' | 'shoot'
    const activeTouches = new Map();

    function updateButtonStates() {
        isLeftPressed = false;
        isRightPressed = false;
        isShootPressed = false;

        // Check active touch fingers (multi-touch: move + shoot simultaneously!)
        for (const [id, btn] of activeTouches) {
            if (btn === 'left') isLeftPressed = true;
            if (btn === 'right') isRightPressed = true;
            if (btn === 'shoot') isShootPressed = true;
        }

        // Check mouse click / drag on desktop
        if (isMouseDown()) {
            const m = mousePos();
            if (btnLeft.hasPoint(m)) isLeftPressed = true;
            if (btnRight.hasPoint(m)) isRightPressed = true;
            if (btnShoot.hasPoint(m)) isShootPressed = true;
        }
    }

    onUpdate(() => {
        updateButtonStates();
    });

    onTouchStart((pos, t) => {
        const id = t && t.identifier !== undefined ? t.identifier : Math.random();
        if (btnLeft.hasPoint(pos)) activeTouches.set(id, 'left');
        else if (btnRight.hasPoint(pos)) activeTouches.set(id, 'right');
        else if (btnShoot.hasPoint(pos)) activeTouches.set(id, 'shoot');
        updateButtonStates();
    });

    onTouchMove((pos, t) => {
        const id = t && t.identifier !== undefined ? t.identifier : 'touch';
        if (btnLeft.hasPoint(pos)) activeTouches.set(id, 'left');
        else if (btnRight.hasPoint(pos)) activeTouches.set(id, 'right');
        else if (btnShoot.hasPoint(pos)) activeTouches.set(id, 'shoot');
        else activeTouches.delete(id);
        updateButtonStates();
    });

    onTouchEnd((pos, t) => {
        if (t && t.identifier !== undefined) {
            activeTouches.delete(t.identifier);
        } else {
            activeTouches.clear();
        }
        updateButtonStates();
    });

    // ------------------------------------------------------------------------
    // 📊 HUD DISPLAY (Score, Health, Wave)
    // ------------------------------------------------------------------------
    const scoreLabel = add([
        text("SCORE: 0", { size: 22 }),
        pos(16, 16),
        color(255, 220, 50),
        fixed(),
        z(100)
    ]);

    const hpLabel = add([
        text("HP: " + playerHP, { size: 22 }),
        pos(16, 44),
        color(255, 80, 80),
        fixed(),
        z(100)
    ]);

    const waveLabel = add([
        text("WAVE: 1", { size: 22 }),
        pos(width() - 16, 16),
        anchor("topright"),
        color(100, 220, 255),
        fixed(),
        z(100)
    ]);

    const bossHealthLabel = add([
        text("", { size: 20 }),
        pos(width() / 2, 48),
        anchor("center"),
        color(255, 50, 100),
        fixed(),
        z(100)
    ]);

    function updateHUD() {
        scoreLabel.text = "SCORE: " + score;
        hpLabel.text = "HP: " + Math.max(0, playerHP);
        waveLabel.text = "WAVE: " + wave;
    }

    // ------------------------------------------------------------------------
    // 🔴 ENEMY BULLETS
    // ------------------------------------------------------------------------
    // 1. SMALL BULLET (Dodge only! Player bullet CANNOT shoot it down)
    function spawnSmallEnemyBullet(x, y, speed = 280) {
        if (gameOver) return;
        add([
            pos(x, y),
            circle(6),
            color(255, 80, 80),
            outline(2, rgb(255, 220, 220)),
            anchor("center"),
            area(),
            move(vec2(0, 1), speed),
            offscreen({ destroy: true }),
            z(7),
            "enemyBulletSmall"
        ]);
    }

    // 2. BIG BULLET (CAN BE SHOT DOWN BY PLAYER! Deals 2 damage if hits player)
    function spawnBigEnemyBullet(x, y, speed = 180) {
        if (gameOver) return;
        const b = add([
            pos(x, y),
            circle(18),
            color(255, 30, 60),
            outline(3, rgb(255, 255, 100)),
            anchor("center"),
            area(),
            move(vec2(0, 1), speed),
            offscreen({ destroy: true }),
            z(7),
            "enemyBulletBig",
            { scaleDir: 1 }
        ]);

        // Pulsing glow effect so player immediately recognizes it as the special shootable bullet!
        b.onUpdate(() => {
            b.scale += b.scaleDir * dt() * 0.4;
            if (b.scale > 1.15) b.scaleDir = -1;
            if (b.scale < 0.95) b.scaleDir = 1;
        });
    }

    // ------------------------------------------------------------------------
    // 💥 BULLET COLLISION RULE:
    // Player bullet DESTROYS Big enemy bullet!
    // Player bullet DOES NOT destroy small enemy bullet (must dodge)!
    // ------------------------------------------------------------------------
    onCollide("playerBullet", "enemyBulletBig", (bullet, bigBullet) => {
        destroy(bullet);
        destroy(bigBullet);
        playSoundEffect("bigbullet_destroy", "destroy_big");

        // Bonus Score & floating score text
        score += 25;
        updateHUD();
        addScorePopup(bigBullet.pos, "+25");
    });

    function addScorePopup(pos, txt) {
        const popup = add([
            text(txt, { size: 18 }),
            pos(pos),
            anchor("center"),
            color(255, 240, 50),
            z(50)
        ]);
        popup.onUpdate(() => {
            popup.pos.y -= 40 * dt();
            popup.opacity -= 1.2 * dt();
            if (popup.opacity <= 0) destroy(popup);
        });
    }

    // ------------------------------------------------------------------------
    // 👾 BATCH 1: SPAWN 3 ENEMIES (Exactly matching user drawing!)
    // ------------------------------------------------------------------------
    let enemiesAlive = 0;
    let wave1Spawned = false;

    function startWave1() {
        wave = 1;
        updateHUD();
        wave1Spawned = true;
        enemiesAlive = 3;

        // Spawn 3 enemies horizontally aligned like in user's drawing
        const xPositions = [100, width() / 2, width() - 100];

        xPositions.forEach((posX, idx) => {
            wait(0.3 + idx * 0.4, () => {
                if (gameOver) return;
                spawnEnemy(posX, 120, CONFIG.wave1, "enemy1");
                playSoundEffect("enemy_appear", "appear");
            });
        });
    }

    function spawnEnemy(x, targetY, waveConfig, spriteName) {
        const enemy = add([
            sprite(spriteName),
            pos(x, -60),
            anchor("center"),
            area({ shape: new Rect(vec2(0, 0), 55, 55) }),
            z(9),
            "enemy",
            {
                hp: waveConfig.hp,
                targetY: targetY,
                timerSmall: rand(0.5, 1.2),
                timerBig: rand(1.5, 2.5),
                hoverOffset: rand(0, Math.PI * 2),
                config: waveConfig
            }
        ]);

        enemy.onUpdate(() => {
            if (gameOver) return;

            // Move into screen to target Y position
            if (enemy.pos.y < enemy.targetY) {
                enemy.pos.y += waveConfig.speed * dt();
            } else {
                // Gentle floating hover motion
                enemy.hoverOffset += dt() * 3;
                enemy.pos.x += Math.sin(enemy.hoverOffset) * 20 * dt();
            }

            // Small bullet firing (dodge only)
            enemy.timerSmall -= dt();
            if (enemy.timerSmall <= 0) {
                spawnSmallEnemyBullet(enemy.pos.x, enemy.pos.y + 28);
                enemy.timerSmall = waveConfig.fireRateSmall + rand(-0.2, 0.4);
            }

            // Big bullet firing (shootable!)
            enemy.timerBig -= dt();
            if (enemy.timerBig <= 0) {
                spawnBigEnemyBullet(enemy.pos.x, enemy.pos.y + 28);
                enemy.timerBig = waveConfig.fireRateBig + rand(-0.3, 0.5);
            }
        });

        return enemy;
    }

    // Player Bullet hits Normal Enemy
    onCollide("playerBullet", "enemy", (bullet, enemy) => {
        destroy(bullet);
        enemy.hp -= 1;
        playSoundEffect("enemy_hit", "hit");

        // Flash white effect
        enemy.color = rgb(255, 200, 200);
        wait(0.08, () => enemy.color = rgb(255, 255, 255));

        if (enemy.hp <= 0) {
            destroy(enemy);
            playSoundEffect("explosion", "explosion");
            score += 100;
            enemiesAlive--;
            updateHUD();

            // When all 3 enemies are dead -> BOSS 1 APPEARS!
            if (enemiesAlive <= 0) {
                if (wave === 1) {
                    wait(1.5, () => spawnBoss1());
                } else if (wave === 2) {
                    wait(1.5, () => spawnBoss2());
                }
            }
        }
    });

    // ------------------------------------------------------------------------
    // 👑 BOSS 1: (Appears after Batch 1 is cleared)
    // ------------------------------------------------------------------------
    function spawnBoss1() {
        if (gameOver) return;
        playSoundEffect("boss_appear", "boss_appear");

        // Banner announcement
        const banner = add([
            text("⚠️ WARNING: BOSS 1 APPROACHING ⚠️", { size: 20 }),
            pos(width() / 2, height() / 3),
            anchor("center"),
            color(255, 50, 50),
            z(50)
        ]);
        wait(1.8, () => destroy(banner));

        wait(1.0, () => {
            if (gameOver) return;
            const boss = add([
                sprite("boss1"),
                pos(width() / 2, -100),
                anchor("center"),
                area({ shape: new Rect(vec2(0, 0), 110, 85) }),
                z(9),
                "boss1",
                {
                    hp: CONFIG.boss1.hp,
                    maxHp: CONFIG.boss1.hp,
                    dirX: 1,
                    fireTimer: 0.8,
                }
            ]);

            bossHealthLabel.text = "BOSS 1 HP: " + boss.hp;

            boss.onUpdate(() => {
                if (gameOver) return;

                // Move down into screen
                if (boss.pos.y < 130) {
                    boss.pos.y += 80 * dt();
                } else {
                    // Side-to-side sweeping movement
                    boss.pos.x += boss.dirX * CONFIG.boss1.speedX * dt();
                    if (boss.pos.x > width() - 80) boss.dirX = -1;
                    if (boss.pos.x < 80) boss.dirX = 1;
                }

                // Boss 1 attack pattern: small dual barrage + 1 big bullet
                boss.fireTimer -= dt();
                if (boss.fireTimer <= 0) {
                    spawnSmallEnemyBullet(boss.pos.x - 35, boss.pos.y + 40, 310);
                    spawnSmallEnemyBullet(boss.pos.x + 35, boss.pos.y + 40, 310);
                    spawnBigEnemyBullet(boss.pos.x, boss.pos.y + 40, 190);
                    boss.fireTimer = CONFIG.boss1.fireInterval;
                }
            });
        });
    }

    // Player Bullet hits Boss 1
    onCollide("playerBullet", "boss1", (bullet, boss) => {
        destroy(bullet);
        boss.hp -= 1;
        playSoundEffect("boss_hit", "hit");

        bossHealthLabel.text = "BOSS 1 HP: " + Math.max(0, boss.hp);

        // Flash boss
        boss.color = rgb(255, 180, 180);
        wait(0.08, () => boss.color = rgb(255, 255, 255));

        if (boss.hp <= 0) {
            destroy(boss);
            bossHealthLabel.text = "";
            playSoundEffect("explosion", "explosion");
            score += 1000;
            updateHUD();

            // Proceed to Wave 2!
            wait(2.0, () => startWave2());
        }
    });

    // ------------------------------------------------------------------------
    // 👾 BATCH 2: 5 ENEMIES (Faster and stronger)
    // ------------------------------------------------------------------------
    function startWave2() {
        if (gameOver) return;
        wave = 2;
        updateHUD();
        enemiesAlive = CONFIG.wave2.count;

        const banner = add([
            text("WAVE 2: 5 ENEMIES!", { size: 24 }),
            pos(width() / 2, height() / 3),
            anchor("center"),
            color(100, 220, 255),
            z(50)
        ]);
        wait(1.5, () => destroy(banner));

        // Spawn 5 enemies across screen
        const xPositions = [60, 140, width() / 2, width() - 140, width() - 60];
        xPositions.forEach((posX, idx) => {
            wait(1.0 + idx * 0.45, () => {
                if (gameOver) return;
                spawnEnemy(posX, 120 + (idx % 2) * 45, CONFIG.wave2, "enemy2");
                playSoundEffect("enemy2_appear", "appear");
            });
        });
    }

    // ------------------------------------------------------------------------
    // 👑 BOSS 2: (Final Boss after Wave 2)
    // ------------------------------------------------------------------------
    function spawnBoss2() {
        if (gameOver) return;
        playSoundEffect("boss2_appear", "boss_appear");

        const banner = add([
            text("☠️ FINAL BOSS: DREADNOUGHT ☠️", { size: 20 }),
            pos(width() / 2, height() / 3),
            anchor("center"),
            color(255, 40, 40),
            z(50)
        ]);
        wait(1.8, () => destroy(banner));

        wait(1.2, () => {
            if (gameOver) return;
            const boss2 = add([
                sprite("boss2"),
                pos(width() / 2, -120),
                anchor("center"),
                area({ shape: new Rect(vec2(0, 0), 130, 95) }),
                z(9),
                "boss2",
                {
                    hp: CONFIG.boss2.hp,
                    dirX: 1,
                    fireTimer: 0.6,
                }
            ]);

            bossHealthLabel.text = "FINAL BOSS HP: " + boss2.hp;

            boss2.onUpdate(() => {
                if (gameOver) return;

                if (boss2.pos.y < 125) {
                    boss2.pos.y += 90 * dt();
                } else {
                    // Aggressive diagonal / zigzag movement
                    boss2.pos.x += boss2.dirX * CONFIG.boss2.speedX * dt();
                    if (boss2.pos.x > width() - 90) boss2.dirX = -1;
                    if (boss2.pos.x < 90) boss2.dirX = 1;
                }

                // Boss 2 Attack Pattern: Triple spread small + Dual shootable Big bullets!
                boss2.fireTimer -= dt();
                if (boss2.fireTimer <= 0) {
                    spawnSmallEnemyBullet(boss2.pos.x - 45, boss2.pos.y + 45, 330);
                    spawnSmallEnemyBullet(boss2.pos.x, boss2.pos.y + 45, 330);
                    spawnSmallEnemyBullet(boss2.pos.x + 45, boss2.pos.y + 45, 330);
                    spawnBigEnemyBullet(boss2.pos.x - 22, boss2.pos.y + 45, 190);
                    spawnBigEnemyBullet(boss2.pos.x + 22, boss2.pos.y + 45, 190);
                    boss2.fireTimer = CONFIG.boss2.fireInterval;
                }
            });
        });
    }

    // Player Bullet hits Boss 2
    onCollide("playerBullet", "boss2", (bullet, boss2) => {
        destroy(bullet);
        boss2.hp -= 1;
        playSoundEffect("boss2_hit", "hit");

        bossHealthLabel.text = "FINAL BOSS HP: " + Math.max(0, boss2.hp);

        boss2.color = rgb(255, 180, 180);
        wait(0.08, () => boss2.color = rgb(255, 255, 255));

        if (boss2.hp <= 0) {
            destroy(boss2);
            bossHealthLabel.text = "";
            playSoundEffect("explosion", "explosion");
            score += 2500;
            updateHUD();

            // VICTORY!
            wait(1.5, () => go("victory", { score: score }));
        }
    });

    // ------------------------------------------------------------------------
    // 💔 PLAYER TAKES DAMAGE & DEATH ANIMATION
    // ------------------------------------------------------------------------
    function playerTakeDamage(damage) {
        if (gameOver) return;
        playerHP -= damage;
        updateHUD();
        playSoundEffect("player_hit", "hit");

        // Player hurt flash
        player.color = rgb(255, 80, 80);
        wait(0.12, () => player.color = rgb(255, 255, 255));

        if (playerHP <= 0) {
            triggerPlayerDeath();
        }
    }

    onCollide("enemyBulletSmall", "player", (bullet) => {
        destroy(bullet);
        playerTakeDamage(1);
    });

    onCollide("enemyBulletBig", "player", (bullet) => {
        destroy(bullet);
        playerTakeDamage(2); // Big bullets do more damage!
    });

    onCollide("enemy", "player", () => {
        playerTakeDamage(1);
    });

    function triggerPlayerDeath() {
        gameOver = true;
        playSoundEffect("player_death", "death");

        const deathPos = player.pos.clone();
        destroy(player);

        // Custom death animation (plays frames 0 to 3 sequentially)
        let frameIndex = 0;
        const deathAnimObj = add([
            sprite(`death_frame${frameIndex}`),
            pos(deathPos),
            anchor("center"),
            scale(1.2),
            z(20)
        ]);

        const animInterval = loop(0.12, () => {
            frameIndex++;
            if (frameIndex < CONFIG.death.frames.length) {
                deathAnimObj.use(sprite(`death_frame${frameIndex}`));
            } else {
                animInterval.cancel();
                destroy(deathAnimObj);
                wait(0.5, () => go("gameover", { score: score }));
            }
        });
    }

    // Start the game!
    startWave1();
});

// ============================================================================
// 💀 GAME OVER SCENE
// ============================================================================
scene("gameover", ({ score }) => {
    add([
        text("GAME OVER", { size: 44 }),
        pos(width() / 2, height() / 3),
        anchor("center"),
        color(255, 50, 50)
    ]);

    add([
        text("FINAL SCORE: " + score, { size: 26 }),
        pos(width() / 2, height() / 2),
        anchor("center"),
        color(255, 220, 50)
    ]);

    const restartBtn = add([
        pos(width() / 2, height() * 0.68),
        rect(240, 60, { radius: 14 }),
        color(40, 180, 80),
        outline(3, rgb(255, 255, 255)),
        anchor("center"),
        area()
    ]);
    restartBtn.add([
        text("PLAY AGAIN", { size: 24 }),
        anchor("center"),
        color(255, 255, 255)
    ]);

    function restart() {
        go("game");
    }

    restartBtn.onClick(restart);
    onClick(restart);
    onKeyPress("space", restart);
    onKeyPress("enter", restart);
});

// ============================================================================
// 🏆 VICTORY SCENE
// ============================================================================
scene("victory", ({ score }) => {
    add([
        text("🏆 YOU WIN! 🏆", { size: 44 }),
        pos(width() / 2, height() / 3),
        anchor("center"),
        color(255, 220, 50)
    ]);

    add([
        text("ALL WAVES & BOSSES DEFEATED!", { size: 18 }),
        pos(width() / 2, height() / 3 + 50),
        anchor("center"),
        color(100, 240, 255)
    ]);

    add([
        text("FINAL SCORE: " + score, { size: 28 }),
        pos(width() / 2, height() / 2),
        anchor("center"),
        color(255, 255, 255)
    ]);

    const playAgainBtn = add([
        pos(width() / 2, height() * 0.68),
        rect(240, 60, { radius: 14 }),
        color(40, 180, 80),
        outline(3, rgb(255, 255, 255)),
        anchor("center"),
        area()
    ]);
    playAgainBtn.add([
        text("PLAY AGAIN", { size: 24 }),
        anchor("center"),
        color(255, 255, 255)
    ]);

    function restart() {
        go("game");
    }

    playAgainBtn.onClick(restart);
    onClick(restart);
    onKeyPress("space", restart);
    onKeyPress("enter", restart);
});

// Start directly in game
go("game");

