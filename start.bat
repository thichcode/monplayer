@echo off
echo Starting MON Player...
echo =========================

REM Kiểm tra nếu file exe tồn tại
if not exist "monplayer.exe" (
    echo Error: monplayer.exe not found!
    echo Please run 'npm run build' first to create the executable.
    pause
    exit /b 1
)

REM Khởi động server
start "" "monplayer.exe"

REM Đợi 3 giây để server khởi động
timeout /t 3 /nobreak >nul

REM Mở trình duyệt
start "" "http://localhost:3000"

echo MON Player is running on http://localhost:3000
echo Press Ctrl+C to stop the server
echo =========================
pause