# 🚀 ShooterGame — GDevelop 5.6 Vertical Shooter

A complete vertical space shooter with 2 enemy waves, 2 bosses, on-screen touch buttons, bullet-destroying mechanics, customizable death animation, and sound effects.

---

## 📂 Project Structure

```
ShooterGame/
├── game.json                 ← Main GDevelop project file (open this!)
├── ShooterGame.json          ← Duplicate copy (can also be opened)
├── README.md                 ← Customization documentation
├── images/                   ← All sprite graphics (replace with your art)
│   ├── player.png            ← Your friend's character sprite
│   ├── player_bullet.png     ← Player's upward bullet
│   ├── enemy1.png            ← Batch 1 enemy sprite
│   ├── enemy2.png            ← Batch 2 enemy sprite
│   ├── boss1.png             ← Boss 1 sprite
│   ├── boss2.png             ← Boss 2 sprite
│   ├── bullet_enemy_small.png← Small enemy bullet (dodge only!)
│   ├── bullet_enemy_big.png  ← Big enemy bullet (shootable!)
│   ├── death_frame0-3.png    ← 4 frames of death animation / GIF
│   ├── btn_left.png          ← Move left button
│   ├── btn_right.png         ← Move right button
│   └── btn_shoot.png         ← Shoot button
└── sounds/                   ← All sound effects (replace with your audio)
    ├── enemy_appear.wav      ← Wave 1 enemy spawn
    ├── enemy_hit.wav         ← Wave 1 enemy hit
    ├── boss_appear.wav       ← Boss 1 enters
    ├── boss_hit.wav          ← Boss 1 hit
    ├── enemy2_appear.wav     ← Wave 2 enemy spawn
    ├── enemy2_hit.wav        ← Wave 2 enemy hit
    ├── boss2_appear.wav      ← Boss 2 enters
    ├── boss2_hit.wav         ← Boss 2 hit
    ├── player_shoot.wav      ← Player fires bullet
    ├── player_hit.wav        ← Player takes damage
    ├── player_death.wav      ← Player dies
    ├── explosion.wav         ← Enemy / boss destroyed
    └── bigbullet_destroy.wav ← Player shoots down big bullet
```

---

## 🎮 How to Open in GDevelop

1. Launch **GDevelop 5**.
2. Click **Open** (or press **Ctrl + O**).
3. Navigate to:
   ```
   C:\Users\toufi\OneDrive\Documents\Github Files\python1\ShooterGame
   ```
4. Select **`game.json`** and click **Open**.
5. The project will open to **`GameScene`**.
6. Click the ▶ **Preview** button at the top to test right away!

---

## 🕹️ Controls

| Action | Touch / Screen | Keyboard |
|---|---|---|
| **Move Left** | Tap `BtnLeft` (bottom-left) | Left Arrow (←) |
| **Move Right** | Tap `BtnRight` (bottom-left) | Right Arrow (→) |
| **Shoot Upward** | Tap `BtnShoot` (bottom-right) | Spacebar |

---

## 🛡️ Bullet Mechanics

- **Small Enemy Bullet** (`bullet_enemy_small.png`): Does **1 damage**. CANNOT be shot down — you must dodge it!
- **Big Enemy Bullet** (`bullet_enemy_big.png`): Does **2 damage**. **CAN BE SHOT DOWN** with your player bullet to gain bonus points!

---

## 🎨 How to Customize Your Friend's Character & Enemies

### 1. Swapping Your Friend's Character
- **Quick method:** Replace `images/player.png` with a picture or sprite of your friend (PNG with transparent background).
- **In GDevelop:** Double-click `Player` in the Objects panel on the right, click on the animation image, and choose your file.

### 2. Custom Death Animation
- Replace `images/death_frame0.png`, `death_frame1.png`, `death_frame2.png`, and `death_frame3.png` with frames of your death animation or GIF.
- In GDevelop, double-click `DeathAnim` in the Objects panel to adjust speed or add more frames.

### 3. Customizing Enemies & Bosses
- **Batch 1 (3 enemies):** Replace `images/enemy1.png`.
- **Boss 1 (after Batch 1):** Replace `images/boss1.png`.
- **Batch 2 (5 faster enemies):** Replace `images/enemy2.png`.
- **Boss 2 (after Batch 2):** Replace `images/boss2.png`.

### 4. Customizing Sounds
- Put your own `.wav` files into the `sounds/` folder using the exact same filenames.
