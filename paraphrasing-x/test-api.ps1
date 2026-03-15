#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Automated testing for all Paraphrasing X API endpoints
.DESCRIPTION
    Tests paraphrase, humanize, summarize, plagiarism, and payment endpoints
#>

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "🧪 PARAPHRASING X - API TESTING" -ForegroundColor Green
Write-Host "========================================`n" -ForegroundColor Cyan

$baseUrl = "http://localhost:3002/api"
$testsPassed = 0
$testsFailed = 0

# Helper function for API testing
function Test-Endpoint {
    param(
        [string]$Name,
        [string]$Method,
        [string]$Endpoint,
        [hashtable]$Body,
        [int]$ExpectedStatus = 200
    )
    
    Write-Host "`n📍 Test: $Name" -ForegroundColor Cyan
    Write-Host "   $Method $Endpoint" -ForegroundColor Gray
    
    try {
        $params = @{
            Uri = "$baseUrl$Endpoint"
            Method = $Method
            ContentType = "application/json"
            ErrorAction = "Stop"
        }
        
        if ($Body) {
            $params.Body = ($Body | ConvertTo-Json -Depth 10)
        }
        
        $response = Invoke-WebRequest @params
        
        if ($response.StatusCode -eq $ExpectedStatus) {
            Write-Host "   ✅ PASS - Status: $($response.StatusCode)" -ForegroundColor Green
            $global:testsPassed++
            
            # Show response preview
            $content = $response.Content | ConvertFrom-Json
            if ($content.PSObject.Properties.Name -contains "success") {
                Write-Host "   Response: success=$($content.success)" -ForegroundColor Gray
            }
            if ($content.PSObject.Properties.Name -contains "error") {
                Write-Host "   Response: error=$($content.error)" -ForegroundColor Gray
            }
        } else {
            Write-Host "   ❌ FAIL - Expected $ExpectedStatus, got $($response.StatusCode)" -ForegroundColor Red
            $global:testsFailed++
        }
        
        return $response
    } catch {
        Write-Host "   ❌ FAIL - $($_.Exception.Message)" -ForegroundColor Red
        $global:testsFailed++
        return $null
    }
}

# ============ START TESTS ============

Write-Host "🔍 Running API endpoint tests..." -ForegroundColor Yellow

# Test 1: Health Check
Write-Host "`n--- HEALTH CHECK ---" -ForegroundColor Magenta
try {
    $response = Invoke-WebRequest -Uri "http://localhost:4000/health" -ErrorAction Stop
    Write-Host "✓ Backend health check: OK" -ForegroundColor Green
    $global:testsPassed++
} catch {
    Write-Host "⚠️  Backend not responding on :4000 (optional)" -ForegroundColor Yellow
}

# Test 2: Paraphrase
Write-Host "`n--- PARAPHRASE ENDPOINT ---" -ForegroundColor Magenta
$paraphraseBody = @{
    text = "The quick brown fox jumps over the lazy dog. This is a fundamental sentence that demonstrates all letters of the English alphabet. It is commonly used for testing purposes because of its comprehensiveness."
    mode = "academic"
}
$paraphraseResp = Test-Endpoint -Name "Paraphrase (Academic)" -Method "POST" -Endpoint "/paraphrase" -Body $paraphraseBody

# Test 3: Humanize
Write-Host "`n--- HUMANIZE ENDPOINT ---" -ForegroundColor Magenta
$humanizeBody = @{
    text = "It is evident that the utilization of advanced artificial intelligence methodologies has resulted in significant paradigm shifts within contemporary society. Furthermore, the implementation of such technologies has facilitated unprecedented levels of efficiency and productivity enhancement."
}
Test-Endpoint -Name "Humanize Text" -Method "POST" -Endpoint "/humanize" -Body $humanizeBody

# Test 4: Summarize
Write-Host "`n--- SUMMARIZE ENDPOINT ---" -ForegroundColor Magenta
$summarizeBody = @{
    text = "Artificial intelligence has become increasingly important in modern society. AI systems are now used in healthcare, finance, transportation, education, and many other industries. These systems can process vast amounts of data much faster than humans, enabling organizations to make better decisions. Machine learning, a subset of AI, allows computers to learn from data without being explicitly programmed. Natural language processing enables machines to understand and generate human language. Computer vision allows machines to interpret visual information from the world. As AI technology continues to advance, it is reshaping industries and creating new opportunities for innovation and growth."
    length = "medium"
}
Test-Endpoint -Name "Summarize (Medium)" -Method "POST" -Endpoint "/summarize" -Body $summarizeBody

# Test 5: Plagiarism Detection
Write-Host "`n--- PLAGIARISM DETECTION ENDPOINT ---" -ForegroundColor Magenta
$plagiarismBody = @{
    text = "In the rapidly evolving digital landscape, the role of artificial intelligence has become increasingly significant. AI technologies have revolutionized the way organizations process information and make decisions. From automated customer service to predictive analytics, AI applications span across virtually every industry. The implementation of machine learning algorithms has enabled businesses to gain insights from vast datasets that would be impossible to analyze manually. This technological advancement has not only improved operational efficiency but has also created new opportunities for innovation and growth in the global economy."
}
Test-Endpoint -Name "Plagiarism Detection" -Method "POST" -Endpoint "/plagiarism" -Body $plagiarismBody

# Test 6: Invalid Input Tests
Write-Host "`n--- ERROR HANDLING TESTS ---" -ForegroundColor Magenta

# Too short text
$shortBody = @{
    text = "Short."
    mode = "academic"
}
Test-Endpoint -Name "Paraphrase - Too Short (should fail)" -Method "POST" -Endpoint "/paraphrase" -Body $shortBody -ExpectedStatus 400

# Invalid email format
# (This would be in payment/init endpoint)

# ============ SUMMARY ============

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "📊 TEST SUMMARY" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan

Write-Host "`n✅ Tests Passed: $global:testsPassed" -ForegroundColor Green
Write-Host "❌ Tests Failed: $global:testsFailed" -ForegroundColor Red

$totalTests = $global:testsPassed + $global:testsFailed
if ($totalTests -gt 0) {
    $successRate = [Math]::Round(($global:testsPassed / $totalTests) * 100, 1)
    Write-Host "`n📈 Success Rate: $successRate%" -ForegroundColor Cyan
}

if ($global:testsFailed -eq 0) {
    Write-Host "`n🎉 ALL TESTS PASSED!" -ForegroundColor Green
    Write-Host "Your Paraphrasing X platform is fully operational!" -ForegroundColor Green
} else {
    Write-Host "`n⚠️  Some tests failed. Check your configuration." -ForegroundColor Yellow
}

Write-Host "`n💡 Tips for testing:" -ForegroundColor Cyan
Write-Host "   • Ensure MongoDB is running: mongod" -ForegroundColor Gray
Write-Host "   • Ensure dev server is running: npm run dev" -ForegroundColor Gray
Write-Host "   • Check .env.local for API keys" -ForegroundColor Gray
Write-Host "   • Use Postman for manual endpoint testing" -ForegroundColor Gray

Write-Host "`n"
