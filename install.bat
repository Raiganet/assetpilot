@echo off
echo Installing AssetPilot dependencies...
echo.
call npm install
echo.
echo Installation complete!
echo.
echo Next steps:
echo 1. Copy .env.example to .env.local and fill with your Supabase credentials
echo 2. Run SQL migrations in Supabase SQL Editor
echo 3. Run npm run dev to start development server
echo.
pause
