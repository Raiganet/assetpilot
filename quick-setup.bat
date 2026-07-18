@echo off
echo Quick Setup AssetPilot...
echo.
echo [1/4] Creating project files...
node setup.js
echo.
echo [2/4] Installing dependencies...
call npm install
echo.
echo [3/4] Setup complete!
echo.
echo [4/4] Next steps:
echo   - Setup Supabase (see README.md)
echo   - Run SQL migrations
echo   - npm run dev
echo.
pause
