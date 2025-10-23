param(
  [Parameter(Mandatory=$true)][string]$InputJson,   # path to your real points JSON (array of {id,name,x,y})
  [string]$OutDir = "plane-app"
)
$ErrorActionPreference="Stop"
if (!(Test-Path $InputJson)) { throw "Input not found: $InputJson" }

$data = Get-Content $InputJson -Raw | ConvertFrom-Json
if (-not ($data -is [System.Collections.IEnumerable])) { throw "Input must be a JSON array." }

# Validate minimal fields
$bad = @()
foreach($p in $data){
  if ($null -eq $p.id -or $null -eq $p.name -or $null -eq $p.x -or $null -eq $p.y){ $bad += $p }
}
if ($bad.Count -gt 0){ throw "Some items are missing id/name/x/y fields." }

# 4a) Save as the demo file (so existing code can pick it up)
$demoPath = Join-Path $OutDir "demo-countries.json"
$data | ConvertTo-Json -Depth 4 | Set-Content -Encoding utf8 -NoNewline $demoPath

# 4b) Emit an inline script so the page prefers window.__planePoints without fetching
$jsPath = Join-Path $OutDir "points-inline.js"
$payload = ($data | ConvertTo-Json -Depth 4)
@"
;(() => { try { window.__planePoints = $payload; } catch(_){} })();
"@ | Set-Content -Encoding utf8 -NoNewline $jsPath

# 4c) Ensure both plane pages load points-inline.js early (idempotent)
$pages = @("plane-app\index.html","plane-app\preview\index.html") | ? { Test-Path $_ }
foreach($f in $pages){
  $html = Get-Content $f -Raw
  if ($html -match '(?is)</head>' -and $html -notmatch 'points-inline\.js'){
    $html = $html -replace '(?is)(</head>)','<script src="/plane-app/points-inline.js"></script>`r`n$1'
    Set-Content -Encoding utf8 -NoNewline $f -Value $html
  }
}

Write-Host "✅ Generated: $demoPath and $jsPath (inline). Commit & push to go live."