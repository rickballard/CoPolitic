param([string]$ExportPath)
$ErrorActionPreference="Stop"
if (!(Test-Path $ExportPath)) { throw "Export not found: $ExportPath" }
$stamp = Get-Date -Format "yyyyMMdd-HHmmss"
$dstDir = Join-Path (Join-Path $PSScriptRoot "..\CoCache") ("coevo-" + $stamp)
New-Item -ItemType Directory -Force $dstDir | Out-Null
Copy-Item -Force $ExportPath (Join-Path $dstDir "coevolution-export.json")
Write-Host "✅ Stashed export -> $dstDir"