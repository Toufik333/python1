# 🎮 KAPLAY Space Shooter

A fast, mobile-friendly vertical shooter built with **KAPLAY** (the modern successor to Kaboom.js), fully matching your sketch and requirements!

---

## 🚀 How to Run the Game

### Method 1 (Easiest — 1 Click):
Double-click **`start.bat`** in this folder! It automatically launches the game in your default browser at `http://localhost:8000`.

### Method 2 (Terminal):
Open your terminal in this folder and run:
```bash
python -m http.server 8000
```
Then visit: `http://localhost:8000`

---

## 🕹️ Controls (Matching Your Drawing!)

| Action | On-Screen Button | Keyboard |
|---|---|---|
| **Move Left** | Tap / Hold **`←`** (bottom-left red button) | Left Arrow (`←`) or `A` |
| **Move Right** | Tap / Hold **`→`** (bottom-left red button) | Right Arrow (`→`) or `D` |
| **Shoot (Up Only)** | Tap / Hold **`✱`** (bottom-right green circle button) | Spacebar or Up Arrow (`↑`) |

---

## 🎯 Gameplay Features

1. **On-Screen Touch Controls**:
   - Red **`←`** and **`→`** buttons on the bottom-left.
   - Green circular shoot button with **`✱`** on the bottom-right.
   - Smooth continuous hold-to-move and hold-to-fire on mobile or desktop.
2. **Batch 1 (3 Enemies)**:
   - Spawns 3 enemies across the top (matching your drawing).
   - Enemies fire downward.
3. **Bullet Shooting Rule**:
   - **Small Bullet** (red dot): Undodgeable with bullets — you **must dodge** it! Deals 1 damage.
   - **Big Bullet** (large pulsing orb): Deals 2 damage, but **YOU CAN SHOOT IT DOWN** with your upward bullets to get `+25` bonus points!
4. **Boss Progression**:
   - Defeating Batch 1 (3 enemies) → **Boss 1** appears with sweeping movement and health bar!
   - Defeating Boss 1 → **Batch 2** (5 faster enemies) spawns!
   - Defeating Batch 2 → **Boss 2 (Dreadnought)** appears with zigzag movement and triple spread firing!
   - Defeating Boss 2 → **🏆 YOU WIN!** screen.
5. **Death Animation**:
   - When HP drops to 0, an animated explosion sequence plays at the player's position, followed by a **Game Over** screen with score and restart button.

---

## 🛠️ How to Customize

All game settings are right at the top of **`main.js`** inside the `CONFIG` object:

### 1. 🧑‍🤝‍🧑 Swapping Your Friend's Character
- **Replace file:** Put a photo or sprite of your friend as `assets/images/player.png`.
- **Or change in `main.js`:**
  ```javascript
  player: {
      sprite: "assets/images/my_friend.png", // 👈 your friend's picture!
      speed: 340,
      hp: 3,
  }
  ```

### 2. 👾 Customizing Enemies & Bosses
In `main.js`:
- `CONFIG.wave1.sprite`: Path to your Batch 1 enemy graphic (`assets/images/enemy1.png`).
- `CONFIG.wave1.hp`: Number of hits needed to destroy.
- `CONFIG.boss1.hp`: Boss 1 health points (default: 10).
- `CONFIG.boss1.speedX`: Movement speed.
- `CONFIG.wave2.count`: Number of Batch 2 enemies (default: 5).
- `CONFIG.boss2.hp`: Boss 2 health points (default: 20).

### 3. 🔊 Customizing Sounds
Place your `.wav` or `.mp3` files in `assets/sounds/` or edit the paths in `main.js`:
- `enemy_appear.wav`: Sound played when Batch 1 enemies appear.
- `enemy_hit.wav`: Sound played when enemy takes damage.
- `boss_appear.wav`: Sound played when Boss 1 appears.
- `boss_hit.wav`: Sound played when Boss 1 is hit.
- `enemy2_appear.wav` & `enemy2_hit.wav`: Batch 2 sounds.
- `boss2_appear.wav` & `boss2_hit.wav`: Boss 2 sounds.
- `player_shoot.wav`: Laser sound when player shoots.
- `player_death.wav`: Sound when player dies.
- *(Built-in Web Audio synthesizer automatically plays sound effects as fallback even if audio files are missing!)*

### 4. 💀 Customizing Death Animation
- Replace `assets/images/death_frame0.png` through `death_frame3.png` with your own explosion frames or animated GIF frames.
- Add more frames in `CONFIG.death.frames` inside `main.js`.

