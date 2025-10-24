function Invoke-CoSyncAuto {
  New-Item -ItemType Directory -Force CoCache,status\log | Out-Null
  function Get-LastRescueInfo {
    $dirs = Get-ChildItem CoCache -Directory -ErrorAction SilentlyContinue | ? { $_.Name -like 'rescue-*' } | Sort-Object Name
    if (-not $dirs) { return $null }
    $latest = $dirs[-1]; $snap = Join-Path $latest.FullName 'snapshot.json'
    $info = @{ path=$latest.FullName; when=$latest.LastWriteTimeUtc; head=$null }
    if (Test-Path $snap) {
      try { $j = Get-Content $snap -Raw | ConvertFrom-Json; $info.head=$j.git.head; $info.when=[DateTime]::Parse($j.capturedAt) } catch {}
    }
    return $info
  }
  $last = Get-LastRescueInfo; $now=Get-Date
  $minH=3; $maxH=10
  $ageH = if ($last) { ($now - $last.when).TotalHours } else { [double]::PositiveInfinity }
  $dirty = (git status --porcelain | Measure-Object -Line).Lines
  $today=(Get-Date).ToString('yyyyMMdd'); $todayLog="status\log\$today.jsonl"
  $logLines = (Test-Path $todayLog) ? ((Get-Content $todayLog | Measure-Object -Line).Lines) : 0
  $since = if ($last -and $last.head) { [int](git rev-list "$($last.head)..HEAD" --count) } else { 9999 }
  $overdue = $ageH -ge $maxH; $okCadence = $ageH -ge $minH
  $should = $overdue -or ($dirty -ge 25) -or ($since -ge 15) -or ($logLines -ge 60) -or (-not $last)
  if ($should -and $okCadence) {
    Write-Host ("🔎 CoSync(auto): rescue (age={0:n1}h, dirty={1}, commits+{2}, statusLines={3})" -f $ageH,$dirty,$since,$logLines)
    pwsh -File "$PSCommandPath" -Mode rescue -WithZip
    New-Item -ItemType Directory -Force status\log | Out-Null
    $f="status\log\$today.jsonl"
    @{ts=(Get-Date).ToString('s')+'Z'; area='plane'; type='status';
      summary='CoSync(auto) ran rescue'; data=@{dirty=$dirty; commits=$since; ageH=[math]::Round($ageH,1)}} |
      ConvertTo-Json -Compress | Add-Content -Encoding UTF8 $f
    git add $f; if ((git status --porcelain) -ne '') { git commit -m "CoSync(auto): rescue pulse"; git push }
  } else {
    Write-Host ("✅ CoSync(auto): no rescue (age={0:n1}h, dirty={1}, commits+{2}, statusLines={3})" -f $ageH,$dirty,$since,$logLines)
  }
}
param(
  [Parameter(Mandatory=$true)][ValidateSet("rescue","handoff","bomb","seed","release","apply-zip")]
  [string]$Mode,
  [string]$ZipPath,
  [switch]$WithZip
)
$ErrorActionPreference='Stop'; Set-Location (git rev-parse --show-toplevel)

function LogStatus($summary,$data=@{}) {
  New-Item -ItemType Directory -Force status\log | Out-Null
  $day=(Get-Date).ToString('yyyyMMdd'); $f="status\log\$day.jsonl"
  @{ts=(Get-Date).ToString('s')+'Z';area='plane';type='status';summary=$summary;data=$data} |
    ConvertTo-Json -Compress | Add-Content -Encoding UTF8 $f
  git add $f
}

switch ($Mode) {
  'auto' { Invoke-CoSyncAuto }
  'rescue' {
    New-Item -ItemType Directory -Force docs,CoCache | Out-Null
    if (-not (Test-Path docs\RESCUE-BPOE.md)) {
@"
# RESCUE-BPOE — Recover from a bloated session
1) Ensure docs/INTENT.json + docs/PRIME-START.md exist.
2) Snapshot to CoCache/rescue-YYYYMMDD-HHmmss (git meta + TODOs).
3) Log status receipt; optional handoff zip; start a new chat.
"@ | Set-Content -Encoding utf8 -NoNewline docs\RESCUE-BPOE.md
    }
    $stamp=Get-Date -Format 'yyyyMMdd-HHmmss'
    $cap="CoCache\rescue-$stamp"; New-Item -ItemType Directory -Force $cap | Out-Null
    $git=@{branch=(git rev-parse --abbrev-ref HEAD).Trim(); head=(git rev-parse HEAD).Trim();
           status=(git status --porcelain); last=(git log -1 --pretty='format:%h %s')}
    $intent=(Test-Path 'docs\INTENT.json')?(Get-Content docs\INTENT.json -Raw):'{"goal":"(add)"}'
    @{capturedAt=(Get-Date).ToString('s')+'Z';git=$git;intentJson=(ConvertFrom-Json $intent)} |
      ConvertTo-Json -Depth 6 | Set-Content -Encoding utf8 -NoNewline "$cap\snapshot.json"
    "RESCUE SUMMARY — $stamp`n$($git.branch) @ $($git.head)`n$($git.last)" |
      Set-Content -Encoding utf8 -NoNewline "$cap\SUMMARY.txt"
    LogStatus "Rescue snapshot saved at $cap; RESCUE-BPOE.md added." @{path=$cap}
    git add docs\RESCUE-BPOE.md $cap
    if ((git status --porcelain) -ne ''){ git commit -m "CoSync: rescue snapshot"; git push }
    if ($WithZip) {
      $paths=@('plane-app','scripts','docs','data','coevolution','README.md','index.html') | ? { Test-Path $_ }
      if ($paths){ $zip=Join-Path $HOME "Downloads\CoPolitic-rescue-$stamp.zip"
        $tmp=Join-Path $env:TEMP ("corescue-"+[guid]::newguid()); New-Item -ItemType Directory -Force $tmp|Out-Null
        $paths | % { Copy-Item -Recurse -Force $_ (Join-Path $tmp (Split-Path $_ -Leaf)) }
        Compress-Archive -Path (Join-Path $tmp '*') -DestinationPath $zip -Force; Remove-Item $tmp -Recurse -Force
        Write-Host "✅ Rescue zip: $zip"
      }
    }
  }
  'handoff' {
    $stamp=Get-Date -Format 'yyyyMMdd-HHmmss'
    $paths=@('plane-app','scripts','docs','data','coevolution','README.md','index.html') | ? { Test-Path $_ }
    if (-not $paths){ throw "Nothing to package." }
    $zip=Join-Path $HOME "Downloads\CoPolitic-prime-handoff-$stamp.zip"
    $tmp=Join-Path $env:TEMP ("coprime-"+[guid]::newguid()); New-Item -ItemType Directory -Force $tmp|Out-Null
    $paths | % { Copy-Item -Recurse -Force $_ (Join-Path $tmp (Split-Path $_ -Leaf)) }
    Compress-Archive -Path (Join-Path $tmp '*') -DestinationPath $zip -Force; Remove-Item $tmp -Recurse -Force
    LogStatus "Prime handoff zip created." @{zip=$zip}; git add .
    if ((git status --porcelain) -ne ''){ git commit -m "CoSync: prime handoff snapshot"; git push }
    Write-Host "✅ Handoff zip: $zip"
  }
  'bomb'      { pwsh -File .\bundle\Run-AdviceBomb.ps1 -RepoRoot . }
  'seed'      { pwsh -File .\scripts\Generate-PlanePoints.ps1 -InputJson .\data\points.json }
  'release'   { $tag="advice-bomb-v1"; if (gh release view $tag 2>$null){ gh release upload $tag .\bundle\CoLaminar-advice-bomb.zip --clobber } else { gh release create $tag .\bundle\CoLaminar-advice-bomb.zip -t "Advice-Bomb v1" -n "Portable CoEvolution + installers" } }
  'apply-zip' {
    if (-not $ZipPath){ throw "Pass -ZipPath <file.zip>" }
    $tmp=Join-Path $env:TEMP ("apply-"+[guid]::newguid()); New-Item -ItemType Directory -Force $tmp|Out-Null
    Expand-Archive -Path $ZipPath -DestinationPath $tmp -Force
    Copy-Item -Recurse -Force (Join-Path $tmp '*') .
    git add .; git commit -m "CoSync: apply bundle $(Split-Path $ZipPath -Leaf)"; git push
    Remove-Item $tmp -Recurse -Force
  }
}