@echo off
cd /d "%~dp0"
echo =========================================================
echo Starting Wanderlust Explorer Pro (Backend and Frontend)
echo =========================================================
echo.
echo If you see a firewall prompt, please choose Allow.
echo.
cmd /c npm run dev
pause
