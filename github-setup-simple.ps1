#!/usr/bin/env pwsh
# GitHub Setup - Simple Version

$ghPath = "C:\Program Files\GitHub CLI\gh.exe"

Write-Host "╔════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║   GitHub Authentication Setup              ║" -ForegroundColor Cyan
Write-Host "║   User: Muddasir110                        ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════╝" -ForegroundColor Cyan

# Setup alias
Write-Host "`n1. Setting up GitHub CLI alias..." -ForegroundColor Yellow
Set-Alias -Name gh -Value $ghPath -Scope Global -Force
Write-Host "✅ Alias ready: gh command is now available" -ForegroundColor Green

# Check authentication
Write-Host "`n2. Checking GitHub authentication..." -ForegroundColor Yellow
$status = & $ghPath auth status 2>&1
Write-Host "✅ GitHub CLI ready" -ForegroundColor Green

# Create repo
Write-Host "`n3. Creating ContractShield repository..." -ForegroundColor Yellow
Write-Host "   This may take a moment..." -ForegroundColor Gray

$result = & $ghPath repo create ContractShield `
    --description "AI-powered contract risk analysis platform" `
    --public `
    --source=. `
    --remote=origin `
    --push

Write-Host "`n4. Getting repository URL..." -ForegroundColor Yellow
$url = & $ghPath repo view --json url --jq '.url' 2>&1
Write-Host "✅ Repository: $url" -ForegroundColor Green

Write-Host @"

╔════════════════════════════════════════════╗
║    Setup Complete! ✅                      ║
╚════════════════════════════════════════════╝

Your GitHub repository is ready!

🔗 View at: https://github.com/Muddasir110/ContractShield

💡 Quick Commands:
   gh repo view              
   gh repo view --web
   gh issue create
   gh pr create

Git Commands:
   git push origin main
   git pull origin main
   git status

"@ -ForegroundColor Cyan
