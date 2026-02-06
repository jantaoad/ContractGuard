#!/usr/bin/env pwsh
# Add GitHub CLI to PowerShell Profile

Write-Host @"
╔════════════════════════════════════════════════════════════════╗
║       Adding GitHub CLI to PowerShell Profile                  ║
╚════════════════════════════════════════════════════════════════╝
"@ -ForegroundColor Cyan

$profilePath = $PROFILE

Write-Host "`n1️⃣  Creating PowerShell Profile..." -ForegroundColor Yellow
Write-Host "   Path: $profilePath" -ForegroundColor Gray

# Create profile if it doesn't exist
if (!(Test-Path $profilePath)) {
    New-Item -ItemType File -Path $profilePath -Force | Out-Null
    Write-Host "✅ Profile created" -ForegroundColor Green
} else {
    Write-Host "✅ Profile exists" -ForegroundColor Green
}

# Add GitHub CLI alias to profile
Write-Host "`n2️⃣  Adding GitHub CLI alias..." -ForegroundColor Yellow

$alias = 'Set-Alias -Name gh -Value "C:\Program Files\GitHub CLI\gh.exe"'

# Check if alias already exists
if (Select-String -Path $profilePath -Pattern "gh.exe" -ErrorAction SilentlyContinue) {
    Write-Host "✅ GitHub CLI alias already in profile" -ForegroundColor Green
} else {
    Add-Content -Path $profilePath -Value "`n# GitHub CLI Alias`n$alias`n"
    Write-Host "✅ Alias added to profile" -ForegroundColor Green
}

# Load the profile for current session
& $profilePath
Set-Alias -Name gh -Value "C:\Program Files\GitHub CLI\gh.exe"

Write-Host @"

✅ Setup complete!

Now you can use:
   gh --version
   gh auth status
   gh repo view
   gh repo create MyRepo

Note: Close and reopen PowerShell for the alias to persist globally.

"@ -ForegroundColor Cyan
