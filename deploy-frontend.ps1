# ===========================================
# Script de déploiement Frontend - TodoList
# Hébergement: o2switch (todolist.accessiproject.fr)
# ===========================================

# Configuration
$CPANEL_USER = "buke1358"
$CPANEL_PASS = "f7fT-PVeH-x4t("
$CPANEL_HOST = "trefle.o2switch.net"
$REMOTE_DIR = "/home/buke1358/todolist.accessiproject.fr"
$PROJECT_DIR = Split-Path -Parent $MyInvocation.MyCommand.Path
$CLIENT_DIR = Join-Path $PROJECT_DIR "client"

# Ignorer les erreurs de certificat SSL
[System.Net.ServicePointManager]::ServerCertificateValidationCallback = { $true }

Write-Host "=== Deploiement Frontend TodoList ===" -ForegroundColor Yellow
Write-Host ""

# Étape 1: Build du frontend
Write-Host "[1/4] Build du frontend React..." -ForegroundColor Yellow
Set-Location $CLIENT_DIR
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "Erreur lors du build" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Build termine" -ForegroundColor Green
Write-Host ""

# Fonction d'upload
function Upload-File {
    param (
        [string]$LocalPath,
        [string]$RemoteDir
    )

    $fileName = Split-Path -Leaf $LocalPath
    $auth = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes("${CPANEL_USER}:${CPANEL_PASS}"))

    $boundary = [System.Guid]::NewGuid().ToString()
    $fileBytes = [System.IO.File]::ReadAllBytes($LocalPath)
    $fileEnc = [System.Text.Encoding]::GetEncoding("iso-8859-1").GetString($fileBytes)

    $bodyLines = @(
        "--$boundary",
        "Content-Disposition: form-data; name=`"file`"; filename=`"$fileName`"",
        "Content-Type: application/octet-stream",
        "",
        $fileEnc,
        "--$boundary--"
    ) -join "`r`n"

    try {
        $response = Invoke-RestMethod -Uri "https://${CPANEL_HOST}:2083/execute/Fileman/upload_files?dir=$RemoteDir&overwrite=1" `
            -Method Post `
            -Headers @{ Authorization = "Basic $auth" } `
            -ContentType "multipart/form-data; boundary=$boundary" `
            -Body $bodyLines `
            -SkipCertificateCheck

        return $response.status -eq 1
    }
    catch {
        Write-Host "Erreur: $_" -ForegroundColor Red
        return $false
    }
}

# Étape 2: Upload index.html
Write-Host "[2/4] Upload index.html..." -ForegroundColor Yellow
$indexPath = Join-Path $CLIENT_DIR "dist\index.html"
if (Upload-File -LocalPath $indexPath -RemoteDir $REMOTE_DIR) {
    Write-Host "✓ index.html uploade" -ForegroundColor Green
} else {
    Write-Host "Erreur upload index.html" -ForegroundColor Red
    exit 1
}

# Étape 3: Upload des fichiers CSS
Write-Host "[3/4] Upload des fichiers CSS..." -ForegroundColor Yellow
$cssFiles = Get-ChildItem -Path (Join-Path $CLIENT_DIR "dist\assets\*.css")
foreach ($file in $cssFiles) {
    if (Upload-File -LocalPath $file.FullName -RemoteDir "$REMOTE_DIR/assets") {
        Write-Host "✓ $($file.Name) uploade" -ForegroundColor Green
    } else {
        Write-Host "Erreur upload $($file.Name)" -ForegroundColor Red
        exit 1
    }
}

# Étape 4: Upload des fichiers JS
Write-Host "[4/4] Upload des fichiers JS..." -ForegroundColor Yellow
$jsFiles = Get-ChildItem -Path (Join-Path $CLIENT_DIR "dist\assets\*.js")
foreach ($file in $jsFiles) {
    if (Upload-File -LocalPath $file.FullName -RemoteDir "$REMOTE_DIR/assets") {
        Write-Host "✓ $($file.Name) uploade" -ForegroundColor Green
    } else {
        Write-Host "Erreur upload $($file.Name)" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "=== Deploiement termine avec succes ! ===" -ForegroundColor Green
Write-Host "URL: https://todolist.accessiproject.fr" -ForegroundColor Yellow

# Retour au dossier d'origine
Set-Location $PROJECT_DIR
