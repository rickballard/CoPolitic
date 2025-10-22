$ErrorActionPreference="Stop"
$root = (git rev-parse --show-toplevel).Trim()
$staged = & git diff --cached --name-only --diff-filter=ACMR
$touchesPlane = $staged | Where-Object { $_ -like "plane-*" -or $_ -like "index.html" -or $_ -like "assets/*" }
if($touchesPlane){
  & "$root\scripts\CoSync.ps1" -RepoRoot $root `
    -Area "plane-app" -Type "change" -Summary "plane-app staged changes" `
    -Data @{ files = $touchesPlane }
}
exit 0
