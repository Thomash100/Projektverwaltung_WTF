$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$server = Join-Path $root "server.mjs"
$port = if ($env:PORT) { $env:PORT } else { "4173" }
$url = "http://127.0.0.1:$port"

function Find-Node {
  $candidates = @(
    $env:PROJEKTVERWALTUNG_NODE,
    (Join-Path $env:LOCALAPPDATA "Projektverwaltung_WTF\runtime\node.exe"),
    (Join-Path $env:LOCALAPPDATA "OpenAI\Codex\bin\node.exe"),
    "C:\Users\ThomasHofmann\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"
  ) | Where-Object { $_ }

  $pathNode = Get-Command node -ErrorAction SilentlyContinue
  if ($pathNode) {
    return $pathNode.Source
  }

  foreach ($candidate in $candidates) {
    if (Test-Path -LiteralPath $candidate) {
      return $candidate
    }
  }

  return $null
}

$node = Find-Node
if (-not $node) {
  Write-Host "Node.js wurde nicht gefunden." -ForegroundColor Red
  Write-Host "Bitte nutze die Setup-EXE aus dist oder installiere Node.js und starte danach erneut:"
  Write-Host "  .\start.cmd"
  exit 1
}

if (-not (Test-Path -LiteralPath $server)) {
  Write-Host "server.mjs wurde nicht gefunden: $server" -ForegroundColor Red
  exit 1
}

try {
  $response = Invoke-WebRequest -UseBasicParsing $url -TimeoutSec 1
  if ($response.StatusCode -eq 200) {
    Write-Host "Projektverwaltung_WTF laeuft bereits auf $url"
    Start-Process -FilePath $url
    exit 0
  }
} catch {
  # Noch kein Server erreichbar, also normal starten.
}

Write-Host "Starte Projektverwaltung_WTF auf $url"
Write-Host "Node: $node"
$serverProcess = Start-Process -FilePath $node -ArgumentList "`"$server`"" -WorkingDirectory $root -PassThru

$deadline = (Get-Date).AddSeconds(8)
do {
  try {
    $response = Invoke-WebRequest -UseBasicParsing $url -TimeoutSec 1
    if ($response.StatusCode -eq 200) {
      Start-Process -FilePath $url
      Write-Host "Server gestartet. Prozess-ID: $($serverProcess.Id)"
      exit 0
    }
  } catch {
    Start-Sleep -Milliseconds 300
  }
} while ((Get-Date) -lt $deadline)

Write-Host "Serverstart konnte nicht innerhalb der Wartezeit bestaetigt werden." -ForegroundColor Yellow
exit 1
