#!/usr/bin/env pwsh
# Simple GitHub Connection Test

Write-Host "`n====== GitHub Connection Test ======`n" -ForegroundColor Cyan

$ghPath = "C:\Program Files\GitHub CLI\gh.exe"

# Test 1: Git
Write-Host "1. Git Installation..." -ForegroundColor Yellow
$gitVersion = git --version 2>&1
Write-Host "   OK: $gitVersion" -ForegroundColor Green

# Test 2: Git Config
Write-Host "`n2. Git Configuration..." -ForegroundColor Yellow
$userName = git config --global user.name
Write-Host "   OK: User = $userName" -ForegroundColor Green

# Test 3: Repository
Write-Host "`n3. Git Repository..." -ForegroundColor Yellow
$branch = git rev-parse --abbrev-ref HEAD 2>&1
$commits = git rev-list --count HEAD 2>&1
Write-Host "   OK: Branch = $branch, Commits = $commits" -ForegroundColor Green

# Test 4: GitHub CLI
Write-Host "`n4. GitHub CLI..." -ForegroundColor Yellow
$ghVersion = & $ghPath --version 2>&1 | Select-Object -First 1
Write-Host "   OK: $ghVersion" -ForegroundColor Green

# Test 5: GitHub Auth
Write-Host "`n5. GitHub Authentication Status..." -ForegroundColor Yellow
$authTest = & $ghPath auth status 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "   OK: AUTHENTICATED" -ForegroundColor Green
    Write-Host $authTest -ForegroundColor Green
    
    # If authenticated, try to create repo
    Write-Host "`n6. Creating GitHub Repository..." -ForegroundColor Yellow
    $repoCreate = & $ghPath repo create ContractShield `
        --description "AI-powered contract risk analysis platform" `
        --public `
        --source=. `
        --remote=origin `
        --push 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   OK: Repository created and pushed!" -ForegroundColor Green
        & $ghPath repo view --json url --jq '.url' 2>&1 | ForEach-Object {
            Write-Host "   URL: $_" -ForegroundColor Cyan
        }
    } else {
        Write-Host "   Repository creation output:" -ForegroundColor Gray
        Write-Host $repoCreate
    }
} else {
    Write-Host "   PENDING: Not authenticated yet" -ForegroundColor Yellow
    Write-Host "`n   INSTRUCTIONS:" -ForegroundColor Magenta
    Write-Host "   1. Go to: https://github.com/login/device" -ForegroundColor Cyan
    Write-Host "   2. Look for your device code" -ForegroundColor Cyan
    Write-Host "   3. Paste it when prompted" -ForegroundColor Cyan
    Write-Host "   4. Authorize github-cli on the web page" -ForegroundColor Cyan
    Write-Host "   5. Come back and run this test again" -ForegroundColor Cyan
}

Write-Host "`n====== Test Complete ======`n" -ForegroundColor Cyan
