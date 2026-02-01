@echo off
REM ===========================================
REM Script de deploiement Frontend - TodoList
REM ===========================================

cd /d "%~dp0"

echo === Deploiement Frontend TodoList ===
echo.

REM Build du frontend
echo [1/2] Build du frontend React...
cd client
call npm run build
if %ERRORLEVEL% neq 0 (
    echo Erreur lors du build
    pause
    exit /b 1
)
echo Build termine!
cd ..

REM Upload via curl
echo.
echo [2/2] Upload des fichiers sur o2switch...

set CPANEL_USER=buke1358
set CPANEL_PASS=f7fT-PVeH-x4t(
set CPANEL_HOST=trefle.o2switch.net
set REMOTE_DIR=/home/buke1358/todolist.accessiproject.fr

REM Upload index.html
curl -s -k -u "%CPANEL_USER%:%CPANEL_PASS%" -F "file=@client/dist/index.html" "https://%CPANEL_HOST%:2083/execute/Fileman/upload_files?dir=%REMOTE_DIR%&overwrite=1" > nul
echo - index.html uploade

REM Upload CSS
for %%f in (client\dist\assets\*.css) do (
    curl -s -k -u "%CPANEL_USER%:%CPANEL_PASS%" -F "file=@%%f" "https://%CPANEL_HOST%:2083/execute/Fileman/upload_files?dir=%REMOTE_DIR%/assets&overwrite=1" > nul
    echo - %%~nxf uploade
)

REM Upload JS
for %%f in (client\dist\assets\*.js) do (
    curl -s -k -u "%CPANEL_USER%:%CPANEL_PASS%" -F "file=@%%f" "https://%CPANEL_HOST%:2083/execute/Fileman/upload_files?dir=%REMOTE_DIR%/assets&overwrite=1" > nul
    echo - %%~nxf uploade
)

echo.
echo === Deploiement termine avec succes ! ===
echo URL: https://todolist.accessiproject.fr
echo.
pause
