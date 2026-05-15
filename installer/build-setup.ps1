$ErrorActionPreference = "Stop"

$root = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$build = Join-Path $root "build-installer"
$dist = Join-Path $root "dist"
$payload = Join-Path $build "payload"
$setupProject = Join-Path $PSScriptRoot "setup\ProjektverwaltungWtfSetup.csproj"
$setupBuild = Join-Path $dist "setup-build"
$desktopBuild = Join-Path $dist "desktop-build"
$setupExe = Join-Path $dist "Projektverwaltung_WTF_Setup_Einzelplatz.exe"
$dotnetObj = "../../build-installer/dotnet-obj/"
$setupLocalBuild = Join-Path $PSScriptRoot "setup\build-installer"
$desktopProject = Join-Path $root "desktop\ProjektverwaltungWtfDesktop\ProjektverwaltungWtfDesktop.csproj"

function Remove-SafeDirectory {
  param(
    [Parameter(Mandatory = $true)][string]$Path,
    [Parameter(Mandatory = $true)][string]$AllowedRoot
  )

  if (-not (Test-Path -LiteralPath $Path)) {
    return
  }

  $resolved = (Resolve-Path -LiteralPath $Path).Path
  if (-not $resolved.StartsWith($AllowedRoot, [System.StringComparison]::OrdinalIgnoreCase)) {
    throw "Unsicherer Zielpfad: $resolved"
  }

  Remove-Item -LiteralPath $resolved -Recurse -Force
}

Remove-SafeDirectory -Path $build -AllowedRoot $root
Remove-SafeDirectory -Path $setupBuild -AllowedRoot $root
Remove-SafeDirectory -Path $desktopBuild -AllowedRoot $root
dotnet build-server shutdown | Out-Null
Remove-SafeDirectory -Path $setupLocalBuild -AllowedRoot $root

Push-Location $root
try {
  dotnet publish $desktopProject `
    -c Release `
    -r win-x64 `
    --self-contained true `
    -p:PublishSingleFile=true `
    -p:EnableCompressionInSingleFile=true `
    -p:DebugType=none `
    -p:DebugSymbols=false `
    -o $desktopBuild

  if ($LASTEXITCODE -ne 0) {
    throw "dotnet publish für die Desktop-App ist mit Exitcode $LASTEXITCODE fehlgeschlagen."
  }
}
finally {
  Pop-Location
}

New-Item -ItemType Directory -Force -Path $build, $dist | Out-Null
New-Item -ItemType Directory -Force -Path (Join-Path $payload "app"), (Join-Path $payload "runtime"), (Join-Path $payload "bin") | Out-Null

Copy-Item -LiteralPath `
  (Join-Path $root "index.html"), `
  (Join-Path $root "server.mjs"), `
  (Join-Path $root "package.json"), `
  (Join-Path $root "README.md") `
  -Destination (Join-Path $payload "app") `
  -Force

Copy-Item -LiteralPath `
  (Join-Path $root "src"), `
  (Join-Path $root "docs"), `
  (Join-Path $root "database") `
  -Destination (Join-Path $payload "app") `
  -Recurse `
  -Force

Copy-Item -LiteralPath `
  (Join-Path $PSScriptRoot "bin\start.cmd"), `
  (Join-Path $PSScriptRoot "bin\start-hidden.vbs"), `
  (Join-Path $PSScriptRoot "bin\uninstall.ps1") `
  -Destination (Join-Path $payload "bin") `
  -Force

Copy-Item -Path (Join-Path $desktopBuild "*") -Destination (Join-Path $payload "bin") -Recurse -Force

$nodeCommand = Get-Command node -ErrorAction Stop
Copy-Item -LiteralPath $nodeCommand.Source -Destination (Join-Path $payload "runtime\node.exe") -Force

Compress-Archive -Path (Join-Path $payload "*") -DestinationPath (Join-Path $build "payload.zip") -Force

Push-Location $root
try {
  dotnet publish "installer\setup\ProjektverwaltungWtfSetup.csproj" `
    -c Release `
    -r win-x64 `
    --self-contained true `
    -p:PublishSingleFile=true `
    -p:EnableCompressionInSingleFile=true `
    -p:BaseIntermediateOutputPath=$dotnetObj `
    -p:DebugType=none `
    -p:DebugSymbols=false `
    -o "dist\setup-build"

  if ($LASTEXITCODE -ne 0) {
    throw "dotnet publish ist mit Exitcode $LASTEXITCODE fehlgeschlagen."
  }
}
finally {
  Pop-Location
}

Copy-Item -LiteralPath (Join-Path $setupBuild "Projektverwaltung_WTF_Setup_Einzelplatz.exe") -Destination $setupExe -Force

$hash = Get-FileHash -Algorithm SHA256 -LiteralPath $setupExe
Write-Host "Setup erstellt: $setupExe"
Write-Host "SHA256: $($hash.Hash)"
