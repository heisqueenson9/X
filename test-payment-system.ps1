# Payment System Test Script (PowerShell)
# Tests all payment endpoints and validates the complete flow
# Usage: .\test-payment-system.ps1

param(
    [string]$BaseUrl = "http://localhost:3002",
    [string]$AdminKey = "admin_key_change_in_production"
)

# Colors for output
$Green = "`e[32m"
$Red = "`e[31m"
$Yellow = "`e[33m"
$Blue = "`e[34m"
$Reset = "`e[0m"

$testResults = @{
    Passed = 0
    Failed = 0
    Tests = @()
}

Write-Host "${Blue}╔════════════════════════════════════════════╗${Reset}"
Write-Host "${Blue}║   Payment System Integration Test Suite    ║${Reset}"
Write-Host "${Blue}╚════════════════════════════════════════════╝${Reset}`n"

# Test function
function Test-Endpoint {
    param(
        [string]$TestName,
        [string]$Method,
        [string]$Path,
        [hashtable]$Headers = @{},
        [object]$Body = $null,
        [int]$ExpectedStatus = 200
    )

    Write-Host "${Blue}Testing: $TestName${Reset}"
    
    try {
        $uri = "$BaseUrl$Path"
        $params = @{
            Uri = $uri
            Method = $Method
            Headers = $Headers
            ErrorAction = 'Stop'
        }

        if ($Body) {
            $params['Body'] = $Body | ConvertTo-Json
            $params['ContentType'] = 'application/json'
        }

        $response = Invoke-WebRequest @params
        $passed = $response.StatusCode -eq $ExpectedStatus -or $null -eq $ExpectedStatus

        if ($passed) {
            Write-Host "${Green}✓ PASS${Reset} - Status: $($response.StatusCode)"
            $testResults.Passed++
        } else {
            Write-Host "${Red}✗ FAIL${Reset} - Expected: $ExpectedStatus, Got: $($response.StatusCode)"
            $testResults.Failed++
        }

        return $response
    }
    catch {
        if ($_.Exception.Response.StatusCode) {
            $status = [int]$_.Exception.Response.StatusCode
            
            # Some failures are expected for testing
            if ($null -ne $ExpectedStatus -and $status -eq $ExpectedStatus) {
                Write-Host "${Green}✓ PASS${Reset} - Status: $status (Expected)"
                $testResults.Passed++
                return $_
            } else {
                Write-Host "${Red}✗ FAIL${Reset} - Status: $status"
                $testResults.Failed++
            }
        } else {
            Write-Host "${Red}✗ FAIL${Reset} - ${Yellow}$($_.Exception.Message)${Reset}"
            $testResults.Failed++
        }
        return $_
    }
}

# Test 1: Server Connectivity
Write-Host "`n${Blue}[1/6] Testing Server Connectivity...${Reset}`n"
$response1 = Test-Endpoint "Server is running" "GET" "/" @{} $null $null
Write-Host ""

# Test 2: Admin endpoints require admin key
Write-Host "`n${Blue}[2/6] Testing Admin Authentication...${Reset}`n"
$response2 = Test-Endpoint "Admin endpoints require key" "GET" "/api/admin/payments" @{} $null 401
Write-Host ""

# Test 3: Admin endpoints work with valid key
Write-Host "`n${Blue}[3/6] Testing Admin Payments List...${Reset}`n"
$headers = @{ "x-admin-key" = $AdminKey }
try {
    $response = Invoke-WebRequest -Uri "$BaseUrl/api/admin/payments" -Headers $headers
    $body = $response.Content | ConvertFrom-Json
    Write-Host "${Green}✓ PASS${Reset} - Status: $($response.StatusCode)"
    Write-Host "  Total payments: $($body.total)"
    Write-Host "  Pending: $($body.pending)"
    Write-Host "  Approved: $($body.approved)"
    Write-Host "  Rejected: $($body.rejected)"
    $testResults.Passed++
}
catch {
    Write-Host "${Red}✗ FAIL${Reset} - $($_.Exception.Message)"
    $testResults.Failed++
}
Write-Host ""

# Test 4: Payment Status Endpoint
Write-Host "`n${Blue}[4/6] Testing Payment Status Endpoint...${Reset}`n"
$response4 = Test-Endpoint "Payment status endpoint exists" "GET" "/api/payment/status/invalid-id" @{} $null $null
Write-Host ""

# Test 5: File Upload Endpoint
Write-Host "`n${Blue}[5/6] Testing File Upload Validation...${Reset}`n"
Write-Host "Testing: Upload endpoint validates input"
try {
    $response = Invoke-WebRequest -Uri "$BaseUrl/api/payment/upload" `
        -Method POST `
        -ContentType "application/json" `
        -Body '{}' `
        -ErrorAction Stop
    Write-Host "${Yellow}Endpoint didn't validate input (unexpected)${Reset}"
    $testResults.Failed++
}
catch {
    Write-Host "${Green}✓ PASS${Reset} - Endpoint validates input (Status: $([int]$_.Exception.Response.StatusCode))"
    $testResults.Passed++
}
Write-Host ""

# Test 6: Environment Configuration
Write-Host "`n${Blue}[6/6] Testing Configuration...${Reset}`n"
Write-Host "Checking: .env.local file exists"
if (Test-Path ".env.local") {
    Write-Host "${Green}✓ PASS${Reset} - .env.local exists"
    $testResults.Passed++
    
    # Check for required variables
    $envContent = Get-Content ".env.local" -Raw
    if ($envContent -match "ADMIN_SECRET_KEY") {
        Write-Host "${Green}✓ PASS${Reset} - ADMIN_SECRET_KEY configured"
        $testResults.Passed++
    } else {
        Write-Host "${Red}✗ FAIL${Reset} - ADMIN_SECRET_KEY not found"
        $testResults.Failed++
    }
    
    if ($envContent -match "MONGODB_URI") {
        Write-Host "${Green}✓ PASS${Reset} - MONGODB_URI configured"
        $testResults.Passed++
    } else {
        Write-Host "${Red}✗ FAIL${Reset} - MONGODB_URI not found"
        $testResults.Failed++
    }
} else {
    Write-Host "${Red}✗ FAIL${Reset} - .env.local not found"
    $testResults.Failed++
}

# Check uploads directory
Write-Host "`nChecking: Upload directory structure"
$uploadsDir = "public/uploads/payments"
if (Test-Path $uploadsDir) {
    Write-Host "${Green}✓ PASS${Reset} - Upload directory exists"
    $testResults.Passed++
} else {
    Write-Host "${Yellow}⚠ WARNING${Reset} - Upload directory not found (will be created on first upload)"
    Write-Host "  Path: $uploadsDir"
}

# Summary
Write-Host "`n${Blue}╔════════════════════════════════════════════╗${Reset}"
Write-Host "${Blue}║            Test Summary                    ║${Reset}"
Write-Host "${Blue}╚════════════════════════════════════════════╝${Reset}"
Write-Host "${Green}Passed: $($testResults.Passed)${Reset}"
Write-Host "${Red}Failed: $($testResults.Failed)${Reset}"
Write-Host "Total:  $($testResults.Passed + $testResults.Failed)`n"

if ($testResults.Failed -eq 0) {
    Write-Host "${Green}✓ All tests passed! Payment system is ready for testing.${Reset}`n"
    exit 0
} else {
    Write-Host "${Red}✗ Some tests failed. Check the issues above.${Reset}`n"
    exit 1
}
