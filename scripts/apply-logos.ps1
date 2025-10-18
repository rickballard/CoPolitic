Param(
  [string]$Staged = ("{0}\logos\staged" -f $env:WRAP_ROOT),
  [string]$OutDir = ("{0}\assets\img\exemplars" -f $env:REPO_ROOT),
  [switch]$CommitAndPush = $true
)
Set-StrictMode -Version Latest; $ErrorActionPreference='Stop'
function Have($n){ $null -ne (Get-Command $n -ErrorAction SilentlyContinue) }
$magick = Have 'magick'
if (-not (Test-Path $OutDir)) { New-Item -ItemType Directory -Force -Path $OutDir | Out-Null }

Write-Host "apply-logos: staged=$Staged out=$OutDir magick=$magick"
$exts = @('.svg','.png','.jpg','.jpeg','.webp','.pdf')
$files = Get-ChildItem -Path $Staged -Recurse -File -ErrorAction SilentlyContinue |
         Where-Object { $exts -contains $_.Extension.ToLower() }
Write-Host ("apply-logos: found {0} staged files" -f $files.Count)

$processed=0; $skipped=0; $warns=@(); $made=@()
foreach($f in $files){
  $slug = ($f.BaseName -replace '[^a-zA-Z0-9]+','-').ToLower().Trim('-')
  if (-not $slug) { $skipped++; continue }
  $out  = Join-Path $OutDir ($slug + '.png')

  if ($magick) {
    $args = @()
    if ($f.Extension -match 'pdf') { $args += @('-density','256') }
    $args += @(
      $f.FullName,
      '-alpha','on',
      '-fuzz','2%','-trim','+repage',
      '-resize','148x148',
      '-gravity','center','-background','none','-extent','160x160',
      '-strip',
      'PNG32:' + $out
    )
    $p = Start-Process -FilePath 'magick' -ArgumentList $args -PassThru -Wait -NoNewWindow
    if ($p.ExitCode -ne 0) { $warns += "magick failed: $($f.Name)"; $skipped++; continue }
  } else {
    if ($f.Extension -match 'svg|pdf') { $warns += "no magick → skip vector: $($f.Name)"; $skipped++; continue }
    try{
      Add-Type -AssemblyName System.Drawing -ErrorAction SilentlyContinue
      $src=[System.Drawing.Image]::FromFile($f.FullName)
      $canvas = New-Object System.Drawing.Bitmap 160,160
      $g=[System.Drawing.Graphics]::FromImage($canvas)
      $g.Clear([System.Drawing.Color]::Transparent)
      $g.InterpolationMode=[System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
      $g.SmoothingMode=[System.Drawing.Drawing2D.SmoothingMode]::HighQuality
      $g.PixelOffsetMode=[System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
      $g.CompositingQuality=[System.Drawing.Drawing2D.CompositingQuality]::HighQuality
      $scale = [Math]::Min(148.0/$src.Width,148.0/$src.Height)
      $nw=[int]([Math]::Round($src.Width*$scale)); $nh=[int]([Math]::Round($src.Height*$scale))
      $x=[int]((160-$nw)/2); $y=[int]((160-$nh)/2)
      $g.DrawImage($src,$x,$y,$nw,$nh); $src.Dispose(); $g.Dispose()
      $canvas.Save($out,[System.Drawing.Imaging.ImageFormat]::Png); $canvas.Dispose()
    } catch { $warns += "raster fallback failed: $($f.Name) :: $($_.Exception.Message)"; $skipped++; continue }
  }
  $made += (Split-Path $out -Leaf)
  $processed++
}

$manifestPath = Join-Path $OutDir '_manifest.json'
@{ generated=(Get-Date).ToString('o'); files=$made } | ConvertTo-Json | Set-Content -Path $manifestPath -Encoding UTF8

Write-Host "apply-logos: processed=$processed skipped=$skipped"
if ($warns.Count){ Write-Warning ($warns -join '; ') }

if($CommitAndPush){
  Push-Location $env:REPO_ROOT
  try{
    git add --all assets/img/exemplars
    if((git status --porcelain).Trim().Length -gt 0){
      git commit -m "assets: trim + normalize logos (160x160 with consistent padding)"
      git push origin HEAD:main
    } else { Write-Host "apply-logos: no changes to commit." }
  } finally { Pop-Location }
}
