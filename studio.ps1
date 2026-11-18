$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $MyInvocation.MyCommand.Definition
$Python = Join-Path $Root "venv\Scripts\python.exe"
if (-not (Test-Path $Python)) {
    $Python = "python"
}

if ($args.Count -gt 0 -and $args[0] -ieq "worker") {
    $RestArgs = if ($args.Count -gt 1) { $args[1..($args.Count - 1)] } else { @() }
    & $Python (Join-Path $Root "main.py") --listen 127.0.0.1 --port 8188 --disable-auto-launch @RestArgs
    exit $LASTEXITCODE
}

if ($args.Count -gt 0 -and $args[0] -ieq "test") {
    $RestArgs = if ($args.Count -gt 1) { $args[1..($args.Count - 1)] } else { @() }
    & $Python -m unittest studio.test_app -v @RestArgs
    exit $LASTEXITCODE
}

& $Python -m studio @args
exit $LASTEXITCODE
