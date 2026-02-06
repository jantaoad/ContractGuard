#!/usr/bin/env pwsh
# GitHub Authentication Setup - ContractShield
# This script will guide you through GitHub authentication

Write-Host @"
╔════════════════════════════════════════════════════════════════╗
║           GitHub Authentication Setup for ContractShield       ║
║                    GitHub CLI v2.86.0 Installed                ║
╚════════════════════════════════════════════════════════════════╝
"@ -ForegroundColor Cyan

Write-Host "`n📝 Starting GitHub Authentication..." -ForegroundColor Yellow
Write-Host "`nNext: A browser window will open asking you to authorize GitHub CLI`n"
Write-Host "Steps:`n  1. Click [Authorize github-cli] when the page opens`n  2. If prompted, enter your GitHub password`n  3. Copy the device code and paste it back here if needed`n" -ForegroundColor Magenta

Write-Host "`n⏳ Launching GitHub authentication... Press Enter to continue" -ForegroundColor Yellow
Read-Host

Write-Host "`nAuthenticating with GitHub..." -ForegroundColor Cyan

# Run GitHub CLI authentication
$result = & gh auth login -p https -w 2>&1

# Check if authentication was successful
Write-Host "`n" -ForegroundColor Cyan

try {
    $authStatus = & gh auth status 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ GitHub authentication successful!" -ForegroundColor Green
        Write-Host "`n📊 Authentication Status:" -ForegroundColor Cyan
        Write-Host $authStatus -ForegroundColor Green
    } else {
        Write-Host "⚠️  Authentication verification pending" -ForegroundColor Yellow
    }
} catch {
    Write-Host "⚠️  Please verify authentication manually:" -ForegroundColor Yellow
    Write-Host "   Run: gh auth status" -ForegroundColor Magenta
}

Write-Host "`n" -ForegroundColor Cyan

# Next steps
Write-Host @"
╔════════════════════════════════════════════════════════════════╗
║                         Next Steps                             ║
╚════════════════════════════════════════════════════════════════╝

1️⃣  Create GitHub Repository:
    powershell -ExecutionPolicy Bypass -File setup-github-repo.ps1

2️⃣  Or manually create at: https://github.com/new

3️⃣  Then run final setup:
    powershell -ExecutionPolicy Bypass -File create-and-push-repo.ps1

"@ -ForegroundColor Magenta
