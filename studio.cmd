@echo off
setlocal
set "PYTHON=%~dp0venv\Scripts\python.exe"

if /I "%~1"=="worker" goto :worker
if /I "%~1"=="test" goto :test

"%PYTHON%" -m studio %*
exit /b %ERRORLEVEL%

:worker
shift
"%PYTHON%" "%~dp0main.py" --listen 127.0.0.1 --port 8188 %1 %2 %3 %4 %5 %6 %7 %8 %9
exit /b %ERRORLEVEL%

:test
shift
"%PYTHON%" -m unittest studio.test_app -v %1 %2 %3 %4 %5 %6 %7 %8 %9
exit /b %ERRORLEVEL%
