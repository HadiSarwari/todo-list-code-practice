@echo off
setlocal EnableExtensions

REM ========= Config =========
set REPO_URL=https://github.com/HadiSarwari/todo-list-code-practice.git
set WORKDIR=%USERPROFILE%\Desktop\todo-list-code-practice
set API_DIR=%WORKDIR%\api\TodoListApi
set UI_DIR=%WORKDIR%\frontend\todo-list
set API_HTTPS_URL=https://localhost:7181
set UI_URL=http://localhost:4200

REM ========= Elevate if not admin =========
>nul 2>&1 "%SYSTEMROOT%\system32\cacls.exe" "%SYSTEMROOT%\system32\config\system"
if errorlevel 1 (
  echo Requesting administrator privileges...
  powershell -NoProfile -ExecutionPolicy Bypass -Command "Start-Process -Verb RunAs -FilePath '%~f0'"
  exit /b
)

title Bootstrap To-Do (API + Angular) - HTTPS

echo.
echo [1/9] Ensuring Chocolatey is available...
if not exist "%ProgramData%\chocolatey\bin\choco.exe" (
  powershell -NoProfile -ExecutionPolicy Bypass ^
    "Set-ExecutionPolicy Bypass -Scope Process -Force; [Net.ServicePointManager]::SecurityProtocol='Tls12'; iex ((New-Object Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))"
)

echo.
echo [2/9] Installing prerequisites (.NET 8 SDK, Node LTS, Git) ...
"%ProgramData%\chocolatey\bin\choco.exe" install -y dotnet-8.0-sdk nodejs-lts git || goto :fail

REM Resolve absolute paths (avoid PATH timing issues)
set "DOTNETEXE=%ProgramFiles%\dotnet\dotnet.exe"
if not exist "%DOTNETEXE%" set "DOTNETEXE=%ProgramFiles(x86)%\dotnet\dotnet.exe"
set "GITEXE=%ProgramFiles%\Git\cmd\git.exe"
if not exist "%GITEXE%" set "GITEXE=%ProgramFiles(x86)%\Git\cmd\git.exe"
if not exist "%DOTNETEXE%" echo Could not find dotnet.exe & goto :fail
if not exist "%GITEXE%" echo Could not find git.exe & goto :fail
			
 

echo.
echo [3/9] Cloning repository if needed...
if not exist "%WORKDIR%\.git" (
  cd /d "%USERPROFILE%\Desktop"
  "%GITEXE%" clone "%REPO_URL%" || goto :fail
) else (
  echo Repo already exists, pulling latest...
  cd /d "%WORKDIR%"
  "%GITEXE%" pull
)

echo.
echo [4/9] Trusting local HTTPS developer certificate (you may see a prompt)...
"%DOTNETEXE%" dev-certs https --trust

echo.
echo [5/9] Starting API (HTTPS profile) ...
start "API" cmd /k "cd /d %API_DIR% && "%DOTNETEXE%" restore && "%DOTNETEXE%" run --launch-profile https"

												   
												
																				
																										


echo Waiting 6s for API to start...
timeout /t 6 >nul

echo.
echo [6/9] Pointing Angular to %API_HTTPS_URL% ...
powershell -NoProfile -ExecutionPolicy Bypass ^
  "$p='%UI_DIR%\src\environments\environment.ts';" ^
  "$c=Test-Path $p ? (Get-Content $p -Raw) : '';" ^
  "if([string]::IsNullOrWhiteSpace($c) -or $c -notmatch 'apiBaseUrl'){ $c = \"export const environment = {`n  production: false,`n  apiBaseUrl: '%API_HTTPS_URL%'`n};`n\" }" ^
  "else { $c = $c -replace \"apiBaseUrl:\s*'[^']*'\",\"apiBaseUrl: '%API_HTTPS_URL%'\" }" ^
  "Set-Content -Path $p -Value $c -Encoding UTF8;"

echo.
echo [7/9] Installing UI dependencies (this may take a minute) ...
set "PATH=C:\Program Files\nodejs;%PATH%"
cd /d "%UI_DIR%"
cmd /c npm install || goto :fail

echo.
echo [8/9] Starting Angular dev server ...
start "Angular" cmd /k "cd /d %UI_DIR% && npx ng serve"

echo.
echo [9/9] Opening the app in your browser: %UI_URL%
start "" "%UI_URL%"

echo.
echo Done. Two terminals opened:
echo   - API (HTTPS): %API_HTTPS_URL%  (accept the trust prompt if shown)
echo   - Angular    : %UI_URL%
echo Close those windows to stop. Enjoy!
exit /b 0

:fail
echo.
echo Something failed. Scroll up for the error above.
pause
exit /b 1
