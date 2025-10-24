param([string]$Points="data/points.json",[string]$Notes="data/country-notes.json")
$ErrorActionPreference='Stop'
function Read-Json($p){ if(!(Test-Path $p)){ return $null }; Get-Content $p -Raw | ConvertFrom-Json }
$pts = Read-Json $Points
$nts = Read-Json $Notes
$bad=@(); $warn=@()

if(-not $pts){ throw "Missing or invalid $Points" }
if($pts -isnot [System.Collections.IEnumerable]){ throw "$Points must be a JSON array" }

# core checks
$seen=@{}; $ids=@()
foreach($p in $pts){
  if($null -eq $p.id -or $null -eq $p.name -or $null -eq $p.x -or $null -eq $p.y){ $bad+="Missing id/name/x/y for: $($p|ConvertTo-Json -Compress)"; continue }
  $ids += [string]$p.id
  if($seen.ContainsKey($p.id)){ $bad+="Duplicate id: $($p.id)" } else { $seen[$p.id]=$true }
  foreach($k in 'x','y'){
    $v = [double]$p.$k
    if($v -lt -1 -or $v -gt 1){ $bad+="Out-of-range $k=$v for id=$($p.id)" }
  }
}

# notes coverage
$ntKeys = @()
if($nts -ne $null){
  if($nts.PSObject.TypeNames -contains 'System.Collections.Hashtable' -or $nts -is [hashtable]){ $ntKeys = $nts.Keys }
  else { try{ $ntKeys = ($nts | Get-Member -MemberType NoteProperty | % Name) }catch{} }
}

$missing = $ids | ? { $_ -ne 'cocivium' -and ($_ -notin $ntKeys) }
$orphans = $ntKeys | ? { $_ -notin $ids }

if($missing){ $warn += "Missing notes for: " + ($missing -join ', ') }
if($orphans){ $warn += "Notes without points: " + ($orphans -join ', ') }

# pretty output
Write-Host "=== Validate Plane Data ==="
Write-Host ("Points: {0}  Notes: {1}" -f $ids.Count, ($ntKeys.Count))
if($bad){ Write-Host "`nERRORS:" -ForegroundColor Red; $bad | % { Write-Host " - $_" -ForegroundColor Red } }
if($warn){ Write-Host "`nWARN:" -ForegroundColor Yellow; $warn | % { Write-Host " - $_" -ForegroundColor Yellow } }
if(-not $bad -and -not $warn){ Write-Host "`nOK: all checks passed." -ForegroundColor Green }

# exit code: fail on errors
if($bad){ exit 1 } else { exit 0 }