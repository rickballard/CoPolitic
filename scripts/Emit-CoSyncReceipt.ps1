param(
  [Parameter(Mandatory)][string]$Area,
  [Parameter(Mandatory)][ValidateSet("status","decision","intent","metric","error")][string]$Type,
  [Parameter(Mandatory)][string]$Summary,
  [hashtable]$Data
)

$day = (Get-Date).ToString("yyyyMMdd")
$ts  = (Get-Date).ToString("yyyy-MM-ddTHH:mm:ssK")
$log = Join-Path "status\log" "$day.jsonl"

$payload = [ordered]@{
  ts      = $ts
  area    = $Area
  type    = $Type
  summary = $Summary
  data    = $Data
}

# Append a single-line JSON record
$line = ($payload | ConvertTo-Json -Depth 12 -Compress)
Add-Content -Path $log -Encoding utf8 -Value $line

# Optional: keep a rolling 'latest.json' pointer for dashboards
$latest = Join-Path "status" "latest.json"
$payload | ConvertTo-Json -Depth 12 | Set-Content -Path $latest -Encoding utf8