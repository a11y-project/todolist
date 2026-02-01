@echo off
REM ===========================================
REM Script de deploiement COMPLET - TodoList
REM Frontend + Backend
REM ===========================================

cd /d "%~dp0"

echo ============================================
echo    DEPLOIEMENT COMPLET - TodoList
echo    https://todolist.accessiproject.fr
echo ============================================
echo.

set CPANEL_USER=buke1358
set CPANEL_PASS=f7fT-PVeH-x4t(
set CPANEL_HOST=trefle.o2switch.net
set REMOTE_DIR=/home/buke1358/todolist.accessiproject.fr

REM =====================
REM FRONTEND
REM =====================
echo [FRONTEND] Build React...
cd client
call npm run build
if %ERRORLEVEL% neq 0 (
    echo Erreur lors du build frontend
    pause
    exit /b 1
)
cd ..
echo [FRONTEND] Build termine!
echo.

echo [FRONTEND] Upload des fichiers...
curl -s -k -u "%CPANEL_USER%:%CPANEL_PASS%" -F "file=@client/dist/index.html" "https://%CPANEL_HOST%:2083/execute/Fileman/upload_files?dir=%REMOTE_DIR%&overwrite=1" > nul
echo - index.html

for %%f in (client\dist\assets\*.css) do (
    curl -s -k -u "%CPANEL_USER%:%CPANEL_PASS%" -F "file=@%%f" "https://%CPANEL_HOST%:2083/execute/Fileman/upload_files?dir=%REMOTE_DIR%/assets&overwrite=1" > nul
    echo - %%~nxf
)

for %%f in (client\dist\assets\*.js) do (
    curl -s -k -u "%CPANEL_USER%:%CPANEL_PASS%" -F "file=@%%f" "https://%CPANEL_HOST%:2083/execute/Fileman/upload_files?dir=%REMOTE_DIR%/assets&overwrite=1" > nul
    echo - %%~nxf
)
echo [FRONTEND] Termine!
echo.

REM =====================
REM BACKEND
REM =====================
echo [BACKEND] Upload des fichiers...

curl -s -k -u "%CPANEL_USER%:%CPANEL_PASS%" -F "file=@server/server.js" "https://%CPANEL_HOST%:2083/execute/Fileman/upload_files?dir=%REMOTE_DIR%/api&overwrite=1" > nul
echo - server.js

curl -s -k -u "%CPANEL_USER%:%CPANEL_PASS%" -F "file=@server/package.json" "https://%CPANEL_HOST%:2083/execute/Fileman/upload_files?dir=%REMOTE_DIR%/api&overwrite=1" > nul
echo - package.json

curl -s -k -u "%CPANEL_USER%:%CPANEL_PASS%" -F "file=@server/config/db.js" "https://%CPANEL_HOST%:2083/execute/Fileman/upload_files?dir=%REMOTE_DIR%/api/config&overwrite=1" > nul
echo - config/db.js

curl -s -k -u "%CPANEL_USER%:%CPANEL_PASS%" -F "file=@server/models/User.js" "https://%CPANEL_HOST%:2083/execute/Fileman/upload_files?dir=%REMOTE_DIR%/api/models&overwrite=1" > nul
echo - models/User.js

curl -s -k -u "%CPANEL_USER%:%CPANEL_PASS%" -F "file=@server/models/Task.js" "https://%CPANEL_HOST%:2083/execute/Fileman/upload_files?dir=%REMOTE_DIR%/api/models&overwrite=1" > nul
echo - models/Task.js

curl -s -k -u "%CPANEL_USER%:%CPANEL_PASS%" -F "file=@server/controllers/authController.js" "https://%CPANEL_HOST%:2083/execute/Fileman/upload_files?dir=%REMOTE_DIR%/api/controllers&overwrite=1" > nul
echo - controllers/authController.js

curl -s -k -u "%CPANEL_USER%:%CPANEL_PASS%" -F "file=@server/controllers/taskController.js" "https://%CPANEL_HOST%:2083/execute/Fileman/upload_files?dir=%REMOTE_DIR%/api/controllers&overwrite=1" > nul
echo - controllers/taskController.js

curl -s -k -u "%CPANEL_USER%:%CPANEL_PASS%" -F "file=@server/routes/auth.js" "https://%CPANEL_HOST%:2083/execute/Fileman/upload_files?dir=%REMOTE_DIR%/api/routes&overwrite=1" > nul
echo - routes/auth.js

curl -s -k -u "%CPANEL_USER%:%CPANEL_PASS%" -F "file=@server/routes/tasks.js" "https://%CPANEL_HOST%:2083/execute/Fileman/upload_files?dir=%REMOTE_DIR%/api/routes&overwrite=1" > nul
echo - routes/tasks.js

curl -s -k -u "%CPANEL_USER%:%CPANEL_PASS%" -F "file=@server/middleware/auth.js" "https://%CPANEL_HOST%:2083/execute/Fileman/upload_files?dir=%REMOTE_DIR%/api/middleware&overwrite=1" > nul
echo - middleware/auth.js

echo [BACKEND] Termine!
echo.

REM Redemarrage
echo [RESTART] Redemarrage de l'application Node.js...
echo restart > "%TEMP%\restart.txt"
curl -s -k -u "%CPANEL_USER%:%CPANEL_PASS%" -F "file=@%TEMP%\restart.txt" "https://%CPANEL_HOST%:2083/execute/Fileman/upload_files?dir=%REMOTE_DIR%/api/tmp&overwrite=1" > nul
del "%TEMP%\restart.txt"
echo [RESTART] OK!

echo.
echo ============================================
echo    DEPLOIEMENT TERMINE AVEC SUCCES !
echo ============================================
echo.
echo Frontend: https://todolist.accessiproject.fr
echo API:      https://todolist.accessiproject.fr/api
echo.
pause
