@echo off
echo Stopping MON Player...
echo =======================

REM Tìm và dừng process monplayer.exe
taskkill /f /im monplayer.exe >nul 2>&1

REM Tìm và dừng process node.exe (nếu có)
taskkill /f /im node.exe >nul 2>&1

echo MON Player has been stopped.
echo =======================
pause