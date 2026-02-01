@echo off
REM ===========================================
REM Script de deploiement Backend - TodoList
REM ===========================================

cd /d "%~dp0"

echo === Deploiement Backend TodoList ===
echo.

set CPANEL_USER=buke1358
set CPANEL_PASS=f7fT-PVeH-x4t(
set CPANEL_HOST=trefle.o2switch.net
set REMOTE_DIR=/home/buke1358/todolist.accessiproject.fr/api

echo [1/7] Upload server.js...
curl -s -k -u "%CPANEL_USER%:%CPANEL_PASS%" -F "file=@server/server.js" "https://%CPANEL_HOST%:2083/execute/Fileman/upload_files?dir=%REMOTE_DIR%&overwrite=1" > nul
echo - server.js uploade

echo [2/7] Upload package.json...
curl -s -k -u "%CPANEL_USER%:%CPANEL_PASS%" -F "file=@server/package.json" "https://%CPANEL_HOST%:2083/execute/Fileman/upload_files?dir=%REMOTE_DIR%&overwrite=1" > nul
echo - package.json uploade

echo [3/7] Upload config/db.js...
curl -s -k -u "%CPANEL_USER%:%CPANEL_PASS%" -F "file=@server/config/db.js" "https://%CPANEL_HOST%:2083/execute/Fileman/upload_files?dir=%REMOTE_DIR%/config&overwrite=1" > nul
echo - config/db.js uploade

echo [4/7] Upload models...
curl -s -k -u "%CPANEL_USER%:%CPANEL_PASS%" -F "file=@server/models/User.js" "https://%CPANEL_HOST%:2083/execute/Fileman/upload_files?dir=%REMOTE_DIR%/models&overwrite=1" > nul
echo - models/User.js uploade
curl -s -k -u "%CPANEL_USER%:%CPANEL_PASS%" -F "file=@server/models/Task.js" "https://%CPANEL_HOST%:2083/execute/Fileman/upload_files?dir=%REMOTE_DIR%/models&overwrite=1" > nul
echo - models/Task.js uploade

echo [5/7] Upload controllers...
curl -s -k -u "%CPANEL_USER%:%CPANEL_PASS%" -F "file=@server/controllers/authController.js" "https://%CPANEL_HOST%:2083/execute/Fileman/upload_files?dir=%REMOTE_DIR%/controllers&overwrite=1" > nul
echo - controllers/authController.js uploade
curl -s -k -u "%CPANEL_USER%:%CPANEL_PASS%" -F "file=@server/controllers/taskController.js" "https://%CPANEL_HOST%:2083/execute/Fileman/upload_files?dir=%REMOTE_DIR%/controllers&overwrite=1" > nul
echo - controllers/taskController.js uploade

echo [6/7] Upload routes et middleware...
curl -s -k -u "%CPANEL_USER%:%CPANEL_PASS%" -F "file=@server/routes/auth.js" "https://%CPANEL_HOST%:2083/execute/Fileman/upload_files?dir=%REMOTE_DIR%/routes&overwrite=1" > nul
echo - routes/auth.js uploade
curl -s -k -u "%CPANEL_USER%:%CPANEL_PASS%" -F "file=@server/routes/tasks.js" "https://%CPANEL_HOST%:2083/execute/Fileman/upload_files?dir=%REMOTE_DIR%/routes&overwrite=1" > nul
echo - routes/tasks.js uploade
curl -s -k -u "%CPANEL_USER%:%CPANEL_PASS%" -F "file=@server/middleware/auth.js" "https://%CPANEL_HOST%:2083/execute/Fileman/upload_files?dir=%REMOTE_DIR%/middleware&overwrite=1" > nul
echo - middleware/auth.js uploade

echo [7/7] Redemarrage de l'application Node.js...
echo restart > "%TEMP%\restart.txt"
curl -s -k -u "%CPANEL_USER%:%CPANEL_PASS%" -F "file=@%TEMP%\restart.txt" "https://%CPANEL_HOST%:2083/execute/Fileman/upload_files?dir=%REMOTE_DIR%/tmp&overwrite=1" > nul
del "%TEMP%\restart.txt"
echo - Application redemarree

echo.
echo === Deploiement Backend termine ! ===
echo API: https://todolist.accessiproject.fr/api
echo.
pause
