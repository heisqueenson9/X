#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Complete setup and startup script for Paraphrasing X
.DESCRIPTION
    Installs dependencies, clears cache, and starts the development server
#>

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "🚀 PARAPHRASING X - COMPLETE SETUP" -ForegroundColor Green
Write-Host "========================================`n" -ForegroundColor Cyan

# Step 1: Navigate to project
Write-Host "📁 Navigating to project..." -ForegroundColor Yellow
$projectPath = "c:\Users\USER\Downloads\page_content\paraphrasing-x"
Set-Location $projectPath

# Step 2: Remove old artifacts
Write-Host "`n🧹 Clearing build cache..." -ForegroundColor Yellow
$dirsToRemove = @(".next", "node_modules", "out", ".turbo")
foreach ($dir in $dirsToRemove) {
    if (Test-Path $dir) {
        Write-Host "   Removing $dir..."
        Remove-Item -Path $dir -Recurse -Force -ErrorAction SilentlyContinue
    }
}

# Step 3: Install dependencies
Write-Host "`n📦 Installing dependencies..." -ForegroundColor Yellow
Write-Host "   This may take 2-3 minutes..." -ForegroundColor Gray
npm install

if ($LASTEXITCODE -ne 0) {
    Write-Host "`n❌ npm install failed!" -ForegroundColor Red
    exit 1
}

# Step 4: Verify .env.local
Write-Host "`n⚙️  Checking environment configuration..." -ForegroundColor Yellow
if (Test-Path ".env.local") {
    Write-Host "   ✓ .env.local found" -ForegroundColor Green
    Write-Host "`n   📝 Current configuration:" -ForegroundColor Cyan
    Get-Content .env.local | ForEach-Object {
        if ($_ -match "^[A-Z]") {
            $key = $_ -replace "=.*", ""
            Write-Host "      ✓ $key is configured" -ForegroundColor Green
        }
    }
} else {
    Write-Host "   ⚠️  .env.local not found" -ForegroundColor Red
    Write-Host "   Please configure .env.local with your API keys" -ForegroundColor Yellow
}

# Step 5: Check MongoDB
Write-Host "`n🗄️  Checking MongoDB..." -ForegroundColor Yellow
try {
    $mongoRunning = Get-Process mongod -ErrorAction SilentlyContinue
    if ($mongoRunning) {
        Write-Host "   ✓ MongoDB is running" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️  MongoDB not detected" -ForegroundColor Yellow
        Write-Host "   To start MongoDB, run: mongod" -ForegroundColor Gray
    }
} catch {
    Write-Host "   ⚠️  Cannot verify MongoDB (may not be installed)" -ForegroundColor Yellow
}

# Step 6: Summary
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "✅ SETUP COMPLETE!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan

Write-Host "`n📍 Next Steps:" -ForegroundColor Yellow
Write-Host "   1. Start MongoDB: mongod" -ForegroundColor Gray
Write-Host "   2. Run: npm run dev" -ForegroundColor Cyan
Write-Host "   3. Open: http://localhost:3002" -ForegroundColor Cyan
Write-Host "   4. Backend (optional): node backend/server.js" -ForegroundColor Gray

Write-Host "`n🔑 Make sure .env.local has:" -ForegroundColor Yellow
Write-Host "   • PAYSTACK_SECRET_KEY" -ForegroundColor Gray
Write-Host "   • HUGGINGFACE_API_KEY" -ForegroundColor Gray
Write-Host "   • MONGODB_URI" -ForegroundColor Gray

Write-Host "`n💡 Tip: Run './start.ps1' to start everything together" -ForegroundColor Cyan
Write-Host "`n"
