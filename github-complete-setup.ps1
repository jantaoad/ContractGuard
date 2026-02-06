#!/usr/bin/env pwsh
<#
.SYNOPSIS
Complete GitHub Authentication Setup for ContractShield
.DESCRIPTION
This script handles the complete GitHub authentication and repository setup
#>

$ghPath = "C:\Program Files\GitHub CLI\gh.exe"

function Write-Header {
    param([string]$Text, [string]$Color = "Cyan")
    Write-Host "`n╔════════════════════════════════════════════════════════════════╗" -ForegroundColor $Color
    Write-Host "║ $($Text.PadRight(62)) ║" -ForegroundColor $Color
    Write-Host "╚════════════════════════════════════════════════════════════════╝" -ForegroundColor $Color
}

Write-Header "GitHub Setup Mode: (Muddasir110)" "Blue"

# Step 1: Setup alias
Write-Host "`n1️⃣  Installing GitHub CLI alias..." -ForegroundColor Yellow
Set-Alias -Name gh -Value $ghPath -Scope Global -Force
Write-Host "✅ Alias set: now you can use 'gh' command" -ForegroundColor Green

# Step 2: Check authentication
Write-Host "`n2️⃣  Checking GitHub authentication..." -ForegroundColor Yellow

try {
    $authStatus = & $ghPath auth status 2>&1
    if ($?) {
        Write-Host "✅ Already authenticated!" -ForegroundColor Green
        $isAuthenticated = $true
    } else {
        Write-Host "⚠️  Need to authenticate..." -ForegroundColor Yellow
        $isAuthenticated = $false
    }
} catch {
    Write-Host "⚠️  Need to authenticate..." -ForegroundColor Yellow
    $isAuthenticated = $false
}

# Step 3: If not authenticated, start login
if (!$isAuthenticated) {
    Write-Host "`n3️⃣  Starting GitHub authentication..." -ForegroundColor Yellow
    Write-Host "   This will open a browser window." -ForegroundColor Gray
    
    # Run auth login with HTTPS protocol
    & $ghPath auth login -p https -w 2>&1 | ForEach-Object {
        Write-Host $_
        if ($_ -match "device.*code.*(\w+-\w+)") {
            $code = $Matches[1]
            Write-Host "`n📋 Device Code: $code" -ForegroundColor Magenta -BackgroundColor Black
        }
    }
    
    Write-Host "`n   ✅ Waiting for authentication..." -ForegroundColor Green
}

# Step 4: Verify final authentication
Write-Host "`n4️⃣  Verifying authentication..." -ForegroundColor Yellow
$finalAuth = & $ghPath auth status 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Successfully authenticated!" -ForegroundColor Green
    Write-Host "   Account: Muddasir110" -ForegroundColor Green
} else {
    Write-Host "⚠️  Authentication check still pending" -ForegroundColor Yellow
}

# Step 5: Create repository
Write-Host "`n5️⃣  Creating ContractShield repository on GitHub..." -ForegroundColor Yellow

$repoExists = & $ghPath repo view --json nameWithOwner 2>&1 | Select-Object -First 1
if ($repoExists -match "ContractShield") {
    Write-Host "✅ Repository already exists" -ForegroundColor Green
} else {
    Write-Host "   Creating new repository..." -ForegroundColor Gray
    $createResult = & $ghPath repo create ContractShield `
        --description "AI-powered contract risk analysis platform" `
        --public `
        --source=. `
        --remote=origin `
        --push 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Repository created and code pushed!" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Repository response:" -ForegroundColor Yellow
        Write-Host $createResult -ForegroundColor Gray
    }
}

# Step 6: Final status
Write-Host "`n6️⃣  Final Repository Status:" -ForegroundColor Yellow

$repoInfo = & $ghPath repo view --json url,nameWithOwner,description --jq '.' 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Repository Details:" -ForegroundColor Green
    Write-Host $repoInfo -ForegroundColor Green
}

# Success message
Write-Header "Setup Complete! ✅" "Green"

Write-Host @"
🎉 Your GitHub account is now connected!

📊 Repository Information:
   Name: ContractShield
   Owner: Muddasir110
   Visibility: Public
   Status: Ready for collaboration

🚀 Next Commands:
   gh repo view              # View repository
   gh issue create           # Create a new issue
   gh pr create              # Create a pull request
   gh repo view --web        # Open on GitHub

📝 Git Commands:
   git status               # Check status
   git log --oneline        # View commits
   git push origin main     # Push changes
   git pull origin main     # Pull changes

🔗 View your repository:
   https://github.com/Muddasir110/ContractShield

"@ -ForegroundColor Cyan
