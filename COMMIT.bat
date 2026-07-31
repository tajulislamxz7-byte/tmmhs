@echo off
echo ====================================
echo Git Commit and Push Helper
echo ====================================
echo.

REM Check if commit message was provided
if "%~1"=="" (
    set /p message="Enter commit message: "
) else (
    set message=%*
)

echo.
echo Adding all changes...
git add .

echo Committing with message: "%message%"
git commit -m "%message%"

echo Pushing to GitHub...
git push origin main

echo.
echo ====================================
echo Done! Check GitHub for updates
echo ====================================
pause
