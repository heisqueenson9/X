#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Start all services for Paraphrasing X
.DESCRIPTION
    Starts Next.js dev server, Node.js backend, and opens browser
#>

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "🚀 PARAPHRASING X - STARTUP" -ForegroundColor Green
Write-Host "========================================`n" -ForegroundColor Cyan

$projectPath = "c:\Users\USER\Downloads\page_content\paraphrasing-x"
Set-Location $projectPath

# Function to start process in new window
function Start-ProcessWindow {
    param(
        [string]$Title,
        [string]$Command,
        [string]$Arguments = ""
    )
    
    Write-Host "🔄 Starting: $Title" -ForegroundColor Yellow
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$projectPath'; $Command $Arguments; Read-Host 'Press Enter to close'"
}

# Check prerequisites
Write-Host "⚙️  Checking prerequisites..." -ForegroundColor Yellow

# Check Node.js
try {
    $nodeVersion = node --version
    Write-Host "   ✓ Node.js $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Node.js not found! Install from https://nodejs.org/" -ForegroundColor Red
    exit 1
}

# Check npm
try {
    $npmVersion = npm --version
    Write-Host "   ✓ npm $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "   ❌ npm not found!" -ForegroundColor Red
    exit 1
}

# Check MongoDB
$mongoRunning = Get-Process mongod -ErrorAction SilentlyContinue
if ($mongoRunning) {
    Write-Host "   ✓ MongoDB running on port 27017" -ForegroundColor Green
} else {
    Write-Host "   ⚠️  MongoDB not running" -ForegroundColor Yellow
    Write-Host "   Start MongoDB in a new window: mongod" -ForegroundColor Gray
}

# Start services
Write-Host "`n📡 Starting services..." -ForegroundColor Yellow

# Start Next.js dev server (in current window)
Write-Host "`n🔵 Next.js Dev Server:" -ForegroundColor Cyan
Write-Host "   Starting on http://localhost:3002" -ForegroundColor Gray
npm run dev

# (The above command blocks, so backend won't start automatically)
# User can start backend separately in another window with: node backend/server.js

Write-Host "`n"
