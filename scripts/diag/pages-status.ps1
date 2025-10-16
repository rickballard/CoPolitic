param()
$ErrorActionPreference='Stop'; Set-StrictMode -Version Latest
$ts=[int](Get-Date -UFormat %s)
$served=(Invoke-WebRequest "https://copolitic.org/.well-known/served-commit.txt?bust=$ts" -UseBasicParsing).Content.Trim()
$local =(git rev-parse --short=7 HEAD).Trim()
$html  =(Invoke-WebRequest "https://copolitic.org/?bust=$ts" -UseBasicParsing).Content
Write-Host "Served: $served | Local: $local"
if($served -ne $local){ throw "Live not on latest artifact." }
if($html -match 'id="tosai-(explainer|checklist)"' -or $html -match 'Request a TOS-AI'){ throw "Deprecated block still present." }
Write-Host "✅ Live good."
