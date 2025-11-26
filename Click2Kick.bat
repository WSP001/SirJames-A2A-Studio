@echo off
:: Sir James Adventures - Click2Kick Launcher
:: Double-click this file to start the dev menu
:: 
:: For Parents, Testers & Developers
:: Book002 Image/Audio Edition

title Sir James Adventures - Click2Kick

:: Change to script directory
cd /d "%~dp0"

:: Launch PowerShell with the Click2Kick menu
pwsh -NoProfile -ExecutionPolicy Bypass -File "scripts\Click2Kick.ps1"

:: If pwsh not available, try Windows PowerShell
if errorlevel 1 (
    powershell -NoProfile -ExecutionPolicy Bypass -File "scripts\Click2Kick.ps1"
)

pause
