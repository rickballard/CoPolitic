Param([string[]]$Roots)
Set-StrictMode -Version Latest; $ErrorActionPreference='Stop'
Add-Type -AssemblyName System.IO.Compression.FileSystem

$WR = $env:WRAP_ROOT
$OutAudit  = Join-Path $WR 'logos\audit.csv'
$OutStaged = Join-Path $WR 'logos\staged'
if (-not (Test-Path $OutStaged)) { New-Item -ItemType Directory -Force -Path $OutStaged | Out-Null }

# Roots
$dl1 = Join-Path $env:USERPROFILE 'Downloads'
$dl2 = if ($env:OneDrive) { Join-Path $env:OneDrive 'Downloads' } else { $null }
$roots = @($dl1,$dl2,(Join-Path $env:USERPROFILE 'Desktop'),(Join-Path $env:USERPROFILE 'Pictures'))
if ($Roots) { $roots += $Roots }
$roots = $roots | Where-Object { $_ -and (Test-Path $_) } | Select-Object -Unique

# Filters & budgets
$imgExt      = @('.svg','.png','.jpg','.jpeg','.webp','.pdf')
$badPattern  = '(backup|archive|snapshot|full|cocivium_backup|_bak|old)'
$goodPattern = '(logo|brand|icon|mark|exemplar|image|badge)'
$maxZipMB    = 300
$maxEntryMB  = 12
$deadline    = (Get-Date).AddMinutes(3)

# 1) Plain images (<=12MB)
$files = @()
foreach($r in $roots){
  try{
    $c = Get-ChildItem -Path $r -Recurse -File -ErrorAction SilentlyContinue
    foreach($f in $c){
      if ($imgExt -contains $f.Extension.ToLower() -and $f.Length -le ($maxEntryMB*1MB)) { $files += $f }
    }
  }catch{}
}

# 2) Candidate zips (<=300MB, not "backup" style)
$zips = @()
foreach($r in $roots){
  try{
    $c = Get-ChildItem -Path $r -Recurse -File -Filter '*.zip' -ErrorAction SilentlyContinue
    foreach($z in $c){
      if ($z.Length -le ($maxZipMB*1MB) -and ($z.BaseName -notmatch $badPattern)) { $zips += $z }
    }
  }catch{}
}
# Prefer “good” names
$zips = $zips | Sort-Object @{Expression={ if ($_.BaseName -match $goodPattern) {0} else {1} }}, Length

$rows=@(); $stagedCount=0; $zipCount=0; $zipEntryHit=0

# Stage plain images
foreach($f in $files){
  if ((Get-Date) -gt $deadline) { break }
  $slug = ($f.BaseName -replace '[^a-zA-Z0-9]+','-').ToLower().Trim('-')
  if ($slug -in @('logo','image','icon','mark','untitled','new-project')) {
    $parent = Split-Path $f.DirectoryName -Leaf
    if ($parent) { $slug = ($parent -replace '[^a-zA-Z0-9]+','-').ToLower().Trim('-') }
  }
  if (-not $slug) { continue }
  $dest = Join-Path $OutStaged ($slug + $f.Extension.ToLower())
  try { Copy-Item -LiteralPath $f.FullName -Destination $dest -Force; $stagedCount++ } catch {}
  $rows += [PSCustomObject]@{ Source=$f.FullName; Staged=$dest; Slug=$slug; Ext=$f.Extension.Trim('.').ToLower(); From='file' }
}

# Stream-extract plausible image entries from zips (no full unzip)
foreach($z in $zips){
  if ((Get-Date) -gt $deadline) { break }
  $zipCount++
  try{
    $za = [System.IO.Compression.ZipFile]::OpenRead($z.FullName)
    foreach($entry in $za.Entries){
      if ((Get-Date) -gt $deadline) { break }
      $ext = ([System.IO.Path]::GetExtension($entry.FullName)).ToLower()
      if ($imgExt -notcontains $ext) { continue }
      if ($entry.Length -gt ($maxEntryMB*1MB)) { continue }

      $name = [System.IO.Path]::GetFileNameWithoutExtension($entry.FullName)
      $slug = ($name -replace '[^a-zA-Z0-9]+','-').ToLower().Trim('-')
      if ($slug -in @('logo','image','icon','mark','untitled','new-project','file','img','picture')) {
        $parent = Split-Path $entry.FullName -Parent
        if ($parent) { $parent = Split-Path $parent -Leaf; $slug = ($parent -replace '[^a-zA-Z0-9]+','-').ToLower().Trim('-') }
      }
      if (-not $slug) { continue }
      $dest = Join-Path $OutStaged ($slug + $ext)

      try{
        $dir = Split-Path $dest -Parent; if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Force -Path $dir | Out-Null }
        $in = $entry.Open()
        $fs = [System.IO.File]::Open($dest, [System.IO.FileMode]::Create, [System.IO.FileAccess]::Write)
        $in.CopyTo($fs); $fs.Dispose(); $in.Dispose()
        $rows += [PSCustomObject]@{ Source=("{0}::{1}" -f $z.FullName,$entry.FullName); Staged=$dest; Slug=$slug; Ext=$ext.Trim('.'); From='zip' }
        $stagedCount++; $zipEntryHit++
      }catch{}
    }
    $za.Dispose()
  }catch{}
}

$rows | Sort-Object Slug,Ext,From -Unique | Export-Csv -Path $OutAudit -NoTypeInformation -Encoding UTF8
Write-Host ("logo-audit-fast: roots={0} zips_scanned={1} zip_entries={2} staged_total={3} -> {4}" -f ($roots -join '; '), $zipCount, $zipEntryHit, $stagedCount, $OutStaged)
