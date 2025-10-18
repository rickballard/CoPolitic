Param(
  [string]$SiteRoot = "https://copolitic.org",
  [int]$MaxAgeSeconds = 5,
  [string]$ManifestPath = ("{0}\assets\img\exemplars\_manifest.json" -f $env:REPO_ROOT)
)
Set-StrictMode -Version Latest; $ErrorActionPreference='Stop'
Add-Type -AssemblyName System.Net.Http
$client = [System.Net.Http.HttpClient]::new()

function Head($u){
  try{
    $req = [System.Net.Http.HttpRequestMessage]::new([System.Net.Http.HttpMethod]::Head, $u)
    $resp = $client.Send($req)
    $age = $resp.Headers.Age; $etag=$resp.Headers.ETag; $status=[int]$resp.StatusCode
    Write-Host ("{0} — Status:{1} Age:{2} ETag:{3}" -f $u,$status,$age,($etag -join ','))
    if($status -ge 200 -and $status -lt 400 -and $age -and $age.TotalSeconds -gt $MaxAgeSeconds){
      Write-Warning ("Stale cache (Age={0}s): {1}" -f [int]$age.TotalSeconds, $u)
    }
  } catch { Write-Warning ("HEAD failed for {0}: {1}" -f $u, $_.Exception.Message) }
}

# Always probe root + /roles/
Head("$SiteRoot/")
Head("$SiteRoot/roles/")

# Probe each exemplar file if manifest exists
if (Test-Path $ManifestPath){
  try{
    $m = Get-Content -Path $ManifestPath -Raw | ConvertFrom-Json
    foreach($f in $m.files){ Head("$SiteRoot/assets/img/exemplars/$f") }
  } catch { Write-Warning "Unable to parse manifest: $ManifestPath :: $($_.Exception.Message)" }
}

$client.Dispose()
