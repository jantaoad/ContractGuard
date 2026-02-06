#!/usr/bin/env pwsh
# Complete GitHub Connection Test

Write-Host @"
╔════════════════════════════════════════════════════════════════╗
║          GitHub Connection Test - ContractShield               ║
╚════════════════════════════════════════════════════════════════╝
"@ -ForegroundColor Cyan

$ghPath = "C:\Program Files\GitHub CLI\gh.exe"

# Test 1: Git Installation
Write-Host "`n✓ Test 1: Git Installation" -ForegroundColor Yellow
try {
    $gitVersion = git --version
    Write-Host "  ✅ Git installed: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "  ❌ Git not found" -ForegroundColor Red
}

# Test 2: Git Configuration
Write-Host "`n✓ Test 2: Git Configuration" -ForegroundColor Yellow
$userName = git config --global user.name
if ($userName) {
    Write-Host "  ✅ User name: $userName" -ForegroundColor Green
} else {
    Write-Host "  ⚠️  User name not configured" -ForegroundColor Yellow
}

# Test 3: Git Repository
Write-Host "`n✓ Test 3: Git Repository Status" -ForegroundColor Yellow
try {
    $branch = git rev-parse --abbrev-ref HEAD 2>&1
    if ($?) {
        Write-Host "  ✅ Repository initialized on branch: $branch" -ForegroundColor Green
    }
    $commitCount = git rev-list --count HEAD 2>&1
    Write-Host "  ✅ Commits: $commitCount" -ForegroundColor Green
} catch {
    Write-Host "  ❌ Repository error" -ForegroundColor Red
}

# Test 4: GitHub CLI Installation
Write-Host "`n✓ Test 4: GitHub CLI Installation" -ForegroundColor Yellow
try {
    $ghVersion = & $ghPath --version 2>&1 | Select-Object -First 1
    Write-Host "  ✅ GitHub CLI: $ghVersion" -ForegroundColor Green
} catch {
    Write-Host "  ❌ GitHub CLI not found" -ForegroundColor Red
}

# Test 5: GitHub Authentication Status
Write-Host "`n✓ Test 5: GitHub Authentication Status" -ForegroundColor Yellow
$authStatus = & $ghPath auth status 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "  ✅ Authenticated with GitHub!" -ForegroundColor Green
    Write-Host "     $authStatus" -ForegroundColor Green
} else {
    Write-Host "  ⚠️  NOT authenticated yet" -ForegroundColor Yellow
    Write-Host "`n  Next Step: Authenticate with GitHub" -ForegroundColor Magenta
    Write-Host "  Run: & '$ghPath' auth login -p https -w" -ForegroundColor Cyan
}

# Test 6: Remote Configuration
Write-Host "`n✓ Test 6: Remote Configuration" -ForegroundColor Yellow
$remotes = git remote -v 2>&1
if ($remotes -match "origin") {
    Write-Host "  ✅ Remote configured:" -ForegroundColor Green
    Write-Host "     $remotes" -ForegroundColor Green
} else {
    Write-Host "  ⚠️  No GitHub remote configured" -ForegroundColor Yellow
    Write-Host "`n  After authentication, run:" -ForegroundColor Cyan
    Write-Host "  & '$ghPath' repo create ContractShield --public --source=. --remote=origin --push" -ForegroundColor Gray
}

# Summary
Write-Host @"

╔════════════════════════════════════════════════════════════════╗
║                     Test Summary                               ║
╚════════════════════════════════════════════════════════════════╝

📋 Status Overview:
"@ -ForegroundColor Cyan

$authCheck = & $ghPath auth status 2>&1
if ($authStatus -match "Logged in") {
    Write-Host "  🟢 GitHub Authentication: READY" -ForegroundColor Green
    Write-Host "  🟢 Repository Setup: Execute repo creation" -ForegroundColor Green
} else {
    Write-Host "  🔴 GitHub Authentication: PENDING" -ForegroundColor Red
    Write-Host "  🟡 Repository Setup: Waiting for auth" -ForegroundColor Yellow
    Write-Host "`n  👉 ACTION REQUIRED:" -ForegroundColor Magenta
    Write-Host "     1. Visit: https://github.com/login/device" -ForegroundColor Cyan
    Write-Host "     2. Paste your device code when prompted" -ForegroundColor Cyan
    Write-Host "     3. Complete the browser authorization" -ForegroundColor Cyan
    Write-Host "     4. Return and run this test again" -ForegroundColor Cyan
}

Write-Host "`n"
