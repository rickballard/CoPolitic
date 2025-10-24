$ErrorActionPreference="Stop"
if (Get-ScheduledTask -TaskName "CoSyncAuto" -ErrorAction SilentlyContinue) {
  Unregister-ScheduledTask -TaskName "CoSyncAuto" -Confirm:$false
  Write-Host "🗑️ Removed task CoSyncAuto"
} else {
  Write-Host "ℹ️ Task CoSyncAuto not found"
}