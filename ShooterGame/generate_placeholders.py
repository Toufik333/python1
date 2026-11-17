"""
generate_placeholders.py
Run this once to create placeholder PNG images so you can test the game
immediately in GDevelop before adding your real assets.

Usage:
  python generate_placeholders.py

Requires: Pillow  (pip install Pillow)
"""

try:
    from PIL import Image, ImageDraw, ImageFont
except ImportError:
    print("Installing Pillow...")
    import subprocess, sys
    subprocess.check_call([sys.executable, "-m", "pip", "install", "Pillow"])
    from PIL import Image, ImageDraw

import os

# ── helpers ──────────────────────────────────────────────────────────────────

def solid(path, w, h, color, label="", text_color=(255,255,255)):
    img = Image.new("RGBA", (w, h), color)
    if label:
        draw = ImageDraw.Draw(img)
        draw.text((4, h//2 - 7), label, fill=text_color)
    img.save(path)
    print(f"  Created {path}")

def circle(path, w, h, bg, fg, label=""):
    img = Image.new("RGBA", (w, h), (0,0,0,0))
    draw = ImageDraw.Draw(img)
    draw.ellipse([2, 2, w-2, h-2], fill=fg, outline=bg, width=3)
    if label:
        draw.text((w//2-8, h//2-8), label, fill=bg)
    img.save(path)
    print(f"  Created {path}")

def arrow_btn(path, w, h, direction):
    img = Image.new("RGBA", (w, h), (50, 50, 80, 220))
    draw = ImageDraw.Draw(img)
    draw.rounded_rectangle([2,2,w-2,h-2], radius=12, fill=(80,80,140,220), outline=(150,150,255,255), width=2)
    cx, cy = w//2, h//2
    if direction == "left":
        pts = [(cx+15, cy-15), (cx-15, cy), (cx+15, cy+15)]
    elif direction == "right":
        pts = [(cx-15, cy-15), (cx+15, cy), (cx-15, cy+15)]
    else:  # shoot
        pts = [(cx-20, cy+15), (cx, cy-20), (cx+20, cy+15)]
    draw.polygon(pts, fill=(255,220,50,255))
    img.save(path)
    print(f"  Created {path}")

# ── directories ───────────────────────────────────────────────────────────────

os.makedirs("images", exist_ok=True)
os.makedirs("sounds", exist_ok=True)

print("\n🎨 Generating placeholder images...\n")

# Player — cyan humanoid silhouette
solid("images/player.png",         60, 60,  (0,200,220,255),    "PLR")

# Bullets
solid("images/player_bullet.png",  10, 20,  (0,255,180,255))
solid("images/bullet_enemy_small.png", 12, 12, (255,80,80,255))
solid("images/bullet_enemy_big.png",   24, 24, (255,30,30,255),  "!")

# Enemies
solid("images/enemy1.png",         50, 50,  (220,50,50,255),    "E1")
solid("images/enemy2.png",         50, 50,  (220,100,0,255),    "E2")

# Bosses
solid("images/boss1.png",         120, 100, (160,0,200,255),    "BOSS1")
solid("images/boss2.png",         150, 120, (200,0,0,255),      "BOSS2")

# Death animation frames (yellow flash → fading)
colors = [(255,255,0,255),(255,180,0,220),(255,100,0,160),(200,50,0,80)]
for i, c in enumerate(colors):
    solid(f"images/death_frame{i}.png", 80, 80, c, f"X{i}")

# UI buttons
arrow_btn("images/btn_left.png",   80, 80, "left")
arrow_btn("images/btn_right.png",  80, 80, "right")
arrow_btn("images/btn_shoot.png", 100, 80, "shoot")

# Health heart
circle("images/health_heart.png",  30, 30, (200,0,0,255), (255,80,80,255), "♥")

# White/red placeholders (used as fallback)
solid("images/placeholder_white.png", 32, 32, (255,255,255,255))
solid("images/placeholder_red.png",   32, 32, (255,0,0,255))

print("\n✅ All placeholder images created in images/")
print("\n🔊 For sounds: add your .wav/.mp3 files to the sounds/ folder.")
print("   Required names:")
sounds = [
    "enemy_appear", "enemy_hit", "enemy2_appear", "enemy2_hit",
    "boss_appear",  "boss_hit",  "boss2_appear",  "boss2_hit",
    "player_shoot", "player_hit","player_death",  "explosion",
    "bigbullet_destroy"
]
for s in sounds:
    print(f"   sounds/{s}.wav")

print("\n🎮 Open ShooterGame.json in GDevelop 5 and hit Preview!")

