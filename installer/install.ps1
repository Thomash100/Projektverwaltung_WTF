$ErrorActionPreference = "Stop"

$packageRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$archivePath = Join-Path $packageRoot "payload.zip"
$installRoot = Join-Path $env:LOCALAPPDATA "Projektverwaltung_WTF"
$appDir = Join-Path $installRoot "app"
$runtimeDir = Join-Path $installRoot "runtime"
$binDir = Join-Path $installRoot "bin"
$startVbs = Join-Path $binDir "start-hidden.vbs"
$desktopExe = Join-Path $binDir "Projektverwaltung_WTF.exe"

if (-not (Test-Path -LiteralPath $archivePath)) {
  throw "Installationspaket nicht gefunden: $archivePath"
}

New-Item -ItemType Directory -Force -Path $installRoot | Out-Null

foreach ($path in @($appDir, $runtimeDir, $binDir)) {
  if (Test-Path -LiteralPath $path) {
    Remove-Item -LiteralPath $path -Recurse -Force
  }
}

Expand-Archive -LiteralPath $archivePath -DestinationPath $installRoot -Force

$shell = New-Object -ComObject WScript.Shell
$desktop = [Environment]::GetFolderPath("Desktop")
$programs = [Environment]::GetFolderPath("Programs")
$startMenuFolder = Join-Path $programs "Projektverwaltung_WTF"
New-Item -ItemType Directory -Force -Path $startMenuFolder | Out-Null

function New-AppShortcut {
  param(
    [Parameter(Mandatory = $true)][string]$Path,
    [Parameter(Mandatory = $true)][string]$Target,
    [string]$Arguments = "",
    [string]$Description = "Projektverwaltung_WTF starten"
  )

  $shortcut = $shell.CreateShortcut($Path)
  $shortcut.TargetPath = $Target
  $shortcut.Arguments = $Arguments
  $shortcut.WorkingDirectory = $installRoot
  $shortcut.Description = $Description
  $shortcut.IconLocation = "$env:WINDIR\System32\shell32.dll,21"
  $shortcut.Save()
}

New-AppShortcut `
  -Path (Join-Path $desktop "Projektverwaltung_WTF.lnk") `
  -Target $desktopExe

New-AppShortcut `
  -Path (Join-Path $startMenuFolder "Projektverwaltung_WTF.lnk") `
  -Target $desktopExe

New-AppShortcut `
  -Path (Join-Path $startMenuFolder "Projektverwaltung_WTF deinstallieren.lnk") `
  -Target "powershell.exe" `
  -Arguments "-NoProfile -ExecutionPolicy Bypass -File `"$binDir\uninstall.ps1`"" `
  -Description "Projektverwaltung_WTF deinstallieren"

Start-Process -FilePath $desktopExe -WorkingDirectory $installRoot

$message = "Projektverwaltung_WTF wurde lokal installiert.`n`nDesktop- und Startmenue-Verknuepfungen wurden erstellt."
$null = $shell.Popup($message, 8, "Projektverwaltung_WTF Setup", 64)
