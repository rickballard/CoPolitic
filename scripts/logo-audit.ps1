Param([string[]]$Roots)
Set-StrictMode -Version Latest; $ErrorActionPreference='Stop'
$WR = $env:WRAP_ROOT; $OutAudit = Join-Path $WR 'logos\audit.csv'; $OutStaged = Join-Path $WR 'logos\staged'
$UnzipRoot = Join-Path $WR 'logos\unzipped'
mkdir $OutStaged -Force | Out-Null; mkdir $UnzipRoot -Force | Out-Null

$dl1 = Join-Path $env:USERPROFILE 'Downloads'
$dl2 = if ($env:OneDrive) { Join-Path $env:OneDrive 'Downloads' } else { $null }
$roots = @($dl1,$dl2,(Join-Path $env:USERPROFILE 'Desktop'),(Join-Path $env:USERPROFILE 'Pictures')) + $Roots
$roots = $roots | Where-Object { $_ -and (Test-Path $_) } | Select-Object -Unique

# 1) Expand ZIPs we find to temp folders
$zips = foreach($r in $roots){ Get-ChildItem $r -Recurse -File -Filter '*.zip' -ErrorAction SilentlyContinue }
foreach($z in $zips){
  try {
    $name = ($z.BaseName -replace '[^a-zA-Z0-9]+','-').ToLower().Trim('-')
    $dest = Join-Path $UnzipRoot ("{0}_{1}" -f $name, [guid]::NewGuid().ToString('n').Substring(0,8))
    Expand-Archive -Path $z.FullName -DestinationPath $dest -ErrorAction SilentlyContinue
  } catch {}
}

# 2) Collect images from roots + any unzipped trees
$imgExt = 'svg','png','jpg','jpeg','webp','pdf'
$scanRoots = $roots + @(Get-ChildItem $UnzipRoot -Directory -Recurse -ErrorAction SilentlyContinue | Select-Object -Expand FullName)
$files = foreach($r in $scanRoots){
  foreach($e in $imgExt){ Get-ChildItem -Path $r -Recurse -File -Filter "*.$e" -ErrorAction SilentlyContinue }
}

# 3) Stage and audit (prefer deriving slug from parent folder/zip name if base is generic)
$rows=@(); $count=0
foreach($f in $files){
  $base = $f.BaseName
  $slug = ($base -replace '[^a-zA-Z0-9]+','-').ToLower().Trim('-')
  if ($slug -in @('logo','image','icon','mark','untitled','new-project')) {
    $parent = Split-Path $f.DirectoryName -Leaf
    if ($parent) { $slug = ($parent -replace '[^a-zA-Z0-9]+','-').ToLower().Trim('-') }
  }
  if (-not $slug) { continue }
  $dest = Join-Path $OutStaged ($slug + $f.Extension.ToLower())
  try { Copy-Item -LiteralPath $f.FullName -Destination $dest -Force; $count++ } catch {}
  $rows += [PSCustomObject]@{ Source=$f.FullName; Staged=$dest; Slug=$slug; Ext=$f.Extension.Trim('.').ToLower() }
}
$rows | Sort-Object Slug,Ext -Unique | Export-Csv -Path $OutAudit -NoTypeInformation -Encoding UTF8
Write-Host ("logo-audit: roots={0} unzipped={1} staged={2} -> {3}" -f ($roots -join '; '), (Get-ChildItem $WR\logos\unzipped -Directory -ErrorAction SilentlyContinue).Count, $count, $OutStaged)
