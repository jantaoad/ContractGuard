#!/usr/bin/env pwsh
# GitHub Connection Test Script for ContractShield

Write-Host "=== GitHub Connection Test ===" -ForegroundColor Cyan

# Test 1: Check Git installation
Write-Host "`n1. Checking Git installation..." -ForegroundColor Yellow
try {
    $gitVersion = git --version
    Write-Host "✅ Git installed: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Git not found" -ForegroundColor Red
    exit 1
}

# Test 2: Check Git user configuration
Write-Host "`n2. Checking Git configuration..." -ForegroundColor Yellow
$userName = git config --global user.name
$userEmail = git config --global user.email
if ($userName -and $userEmail) {
    Write-Host "✅ User configured: $userName <$userEmail>" -ForegroundColor Green
} else {
    Write-Host "⚠️  User not fully configured" -ForegroundColor Yellow
}

# Test 3: Check current repository
Write-Host "`n3. Checking repository status..." -ForegroundColor Yellow
try {
    $branch = git rev-parse --abbrev-ref HEAD
    $status = git status --porcelain
    Write-Host "✅ Repository initialized on branch: $branch" -ForegroundColor Green
    if ($status) {
        Write-Host "⚠️  Uncommitted changes detected" -ForegroundColor Yellow
    } else {
        Write-Host "✅ Working directory clean" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ Not a git repository" -ForegroundColor Red
}

# Test 4: Check remotes
Write-Host "`n4. Checking GitHub remotes..." -ForegroundColor Yellow
$remotes = git remote -v
if ($remotes) {
    Write-Host "✅ Remotes configured:" -ForegroundColor Green
    Write-Host $remotes
} else {
    Write-Host "⚠️  No GitHub remote configured - use command below:" -ForegroundColor Yellow
}

# Test 5: Last commit
Write-Host "`n5. Checking last commit..." -ForegroundColor Yellow
$lastCommit = git log --oneline -n 1
Write-Host "✅ Last commit: $lastCommit" -ForegroundColor Green

# Instructions
Write-Host "`n=== Next Steps ===" -ForegroundColor Cyan
Write-Host @"
1. Create a new repository on GitHub:
   https://github.com/new

2. Add the GitHub remote (replace YOUR_USERNAME):
   git remote add origin https://github.com/YOUR_USERNAME/ContractShield.git

3. Push to GitHub:
   git push -u origin main

4. Run this test again to verify connection!
"@ -ForegroundColor Magenta
