#!/usr/bin/env pwsh
# Complete GitHub Authentication & Repo Setup

$ghPath = "C:\Program Files\GitHub CLI\gh.exe"

Write-Host @"
╔════════════════════════════════════════════════════════════════╗
║         GitHub Authentication & Repository Setup               ║
║                   For: Muddasir110                             ║
╚════════════════════════════════════════════════════════════════╝
"@ -ForegroundColor Cyan

# Verify authentication
Write-Host "`n1️⃣  Checking GitHub authentication..." -ForegroundColor Yellow
$authCheck = & $ghPath auth status 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Successfully authenticated with GitHub!" -ForegroundColor Green
    Write-Host $authCheck -ForegroundColor Green
} else {
    Write-Host "⚠️ Authentication still in progress..." -ForegroundColor Yellow
    Write-Host "   Visit: https://github.com/login/device" -ForegroundColor Magenta
    Write-Host "   Code: 75FF-6F20" -ForegroundColor Magenta
    Write-Host "`nPress any key once you've authorized..." -ForegroundColor Yellow
    Read-Host
}

# Create repository
Write-Host "`n2️⃣  Creating GitHub repository..." -ForegroundColor Yellow

$repoCreate = & $ghPath repo create ContractShield `
    --description "AI-powered contract risk analysis platform" `
    --public `
    --source=. `
    --remote=origin `
    --push 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Repository created and code pushed!" -ForegroundColor Green
} else {
    Write-Host "📝 Repository creation output:" -ForegroundColor Yellow
    Write-Host $repoCreate
}

# Get repository URL
Write-Host "`n3️⃣  Repository Details:" -ForegroundColor Yellow
$repoUrl = & $ghPath repo view --json url --jq .url 2>&1
Write-Host "🔗 Repository: $repoUrl" -ForegroundColor Cyan

# View on GitHub
Write-Host "`n4️⃣  Opening repository on GitHub..." -ForegroundColor Yellow
& $ghPath repo view --web 2>&1 | Out-Null

Write-Host @"

╔════════════════════════════════════════════════════════════════╗
║                    Setup Complete! ✅                          ║
║   Your code is now on GitHub at:                              ║
║   $repoUrl
╚════════════════════════════════════════════════════════════════╝

📊 Useful GitHub CLI Commands:
   & "C:\Program Files\GitHub CLI\gh.exe" repo view          # View repo info
   & "C:\Program Files\GitHub CLI\gh.exe" issue list         # List issues
   & "C:\Program Files\GitHub CLI\gh.exe" pr list            # List PRs
   & "C:\Program Files\GitHub CLI\gh.exe" repo view --web    # Open on GitHub

📝 To make the gh command easier to use:
   Add this to your PowerShell profile:
   Set-Alias -Name gh -Value "C:\Program Files\GitHub CLI\gh.exe"

🚀 Next steps:
   git status              # Check git status
   git log --oneline       # View commits
   git push origin main    # Push changes
   git pull origin main    # Pull changes

"@ -ForegroundColor Cyan
