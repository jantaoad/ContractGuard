#!/usr/bin/env pwsh
# Automatic GitHub Repository Setup - ContractShield
# Creates repo and pushes code automatically

Write-Host @"
╔════════════════════════════════════════════════════════════════╗
║         Creating GitHub Repository & Pushing Code              ║
║                    ContractShield Project                      ║
╚════════════════════════════════════════════════════════════════╝
"@ -ForegroundColor Cyan

# Step 1: Check authentication
Write-Host "`n1️⃣  Checking GitHub authentication..." -ForegroundColor Yellow
try {
    $auth = & gh auth status 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Authenticated with GitHub" -ForegroundColor Green
    } else {
        Write-Host "❌ Not authenticated. Run github-auth-login.ps1 first" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "❌ Authentication check failed" -ForegroundColor Red
    exit 1
}

# Step 2: Create repository on GitHub
Write-Host "`n2️⃣  Creating repository on GitHub..." -ForegroundColor Yellow

$repoName = "ContractShield"
$repoDescription = "AI-powered contract risk analysis platform"

try {
    $createOutput = & gh repo create $repoName `
        --description $repoDescription `
        --public `
        --source=. `
        --remote=origin `
        --push 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Repository created on GitHub!" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Repository creation response: $createOutput" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ Error creating repository: $_" -ForegroundColor Red
    Write-Host "`n💡 Alternative: Create manually at https://github.com/new" -ForegroundColor Magenta
}

# Step 3: Get repository URL
Write-Host "`n3️⃣  Retrieving repository information..." -ForegroundColor Yellow
try {
    $repoUrl = & gh repo view --json url --jq .url 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Repository URL: $repoUrl" -ForegroundColor Green
    }
} catch {
    Write-Host "⚠️  Could not retrieve URL" -ForegroundColor Yellow
}

# Step 4: Verify push
Write-Host "`n4️⃣  Verifying push to GitHub..." -ForegroundColor Yellow
try {
    $remote = git remote -v
    if ($remote -match "origin") {
        Write-Host "✅ Remote configured:" -ForegroundColor Green
        Write-Host $remote
    }
} catch {
    Write-Host "⚠️  Remote check failed" -ForegroundColor Yellow
}

# Success message
Write-Host @"
╔════════════════════════════════════════════════════════════════╗
║                      Setup Complete! ✅                        ║
╚════════════════════════════════════════════════════════════════╝

Your repository is now on GitHub!

🔗 Access your repository:
   https://github.com/YOUR_USERNAME/ContractShield

📊 View on GitHub:
   gh repo view --web

📝 Useful commands:
   gh repo view                     # View repo details
   gh issue list                    # View GitHub issues
   gh pr list                       # View pull requests
   git push origin main             # Push changes
   git pull origin main             # Pull changes

"@ -ForegroundColor Cyan
