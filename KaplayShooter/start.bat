@echo off
title KAPLAY Space Shooter
echo ====================================================
echo Starting KAPLAY Space Shooter local server...
echo URL: http://localhost:8000
echo ====================================================
start "" "http://localhost:8000"
python -m http.server 8000
pause

