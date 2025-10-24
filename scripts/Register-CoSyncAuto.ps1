$ErrorActionPreference="Stop"
$script = Join-Path $PWD "scripts\CoSync.ps1"
if (!(Test-Path $script)) { throw "Missing CoSync.ps1 at $script" }

$arg = "-NoProfile -File `"$script`" -Mode auto"
$action  = New-ScheduledTaskAction -Execute "pwsh.exe" -Argument $arg
# finite duration (5 years) to avoid XML error:
$trigger = New-ScheduledTaskTrigger -Once -At (Get-Date).AddMinutes(5) `
  -RepetitionInterval (New-TimeSpan -Hours 3) `
  -RepetitionDuration (New-TimeSpan -Days (365*5))
$settings = New-ScheduledTaskSettingsSet -StartWhenAvailable -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries
$task = New-ScheduledTask -Action $action -Trigger $trigger -Settings $settings -Description "CoSync(auto): bloat-aware rescue pulse"

Register-ScheduledTask -TaskName "CoSyncAuto" -InputObject $task -Force | Out-Null
Write-Host "✅ Scheduled: CoSyncAuto (every ~3h; 5y duration)."