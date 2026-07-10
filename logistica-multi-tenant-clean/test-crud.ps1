#!/usr/bin/env pwsh

# Test CRUD Operations for all modules

$baseUrl = "http://localhost:3000/api"
$authToken = $null
$companyId = $null

Write-Host "=== TESTING LOGISTICA API CRUD OPERATIONS ===" -ForegroundColor Cyan

# Helper function to make requests
function Test-ApiRequest {
    param(
        [string]$Method,
        [string]$Endpoint,
        [object]$Body = $null,
        [string]$Description
    )
    
    try {
        $url = "$baseUrl$Endpoint"
        $headers = @{"Content-Type" = "application/json"}
        
        if ($authToken) {
            $headers["Authorization"] = "Bearer $authToken"
        }
        
        $params = @{
            Uri     = $url
            Method  = $Method
            Headers = $headers
        }
        
        if ($Body) {
            $params["Body"] = $Body | ConvertTo-Json -Depth 10
        }
        
        $response = Invoke-WebRequest @params
        Write-Host "✅ $Description - Status: $($response.StatusCode)" -ForegroundColor Green
        return $response.Content | ConvertFrom-Json
    }
    catch {
        Write-Host "❌ $Description - Error: $($_.Exception.Message)" -ForegroundColor Red
        return $null
    }
}

# Test 1: Authentication
Write-Host "`n--- AUTHENTICATION ---" -ForegroundColor Yellow
$loginBody = @{
    email    = "admin@logistica.com"
    password = "admin123"
} | ConvertTo-Json

$loginResponse = Test-ApiRequest -Method "POST" -Endpoint "/auth/login" -Body $loginBody -Description "Login"
if ($loginResponse) {
    $authToken = $loginResponse.accessToken
    Write-Host "Token obtained: $($authToken.Substring(0, 20))..." -ForegroundColor Cyan
}

# Test 2: Vehicles CRUD
Write-Host "`n--- VEHICLES CRUD ---" -ForegroundColor Yellow

# Get all vehicles
$vehiclesGet = Test-ApiRequest -Method "GET" -Endpoint "/vehicles" -Description "GET all vehicles"

# Create vehicle
$vehicleBody = @{
    licensePlate = "TEST-999"
    model        = "Test Model"
    brand        = "Test Brand"
    type         = "Carrinha"
    capacity     = 500
    year         = 2024
    status       = "available"
} | ConvertTo-Json

$vehicleCreate = Test-ApiRequest -Method "POST" -Endpoint "/vehicles" -Body $vehicleBody -Description "CREATE vehicle"
$vehicleId = $vehicleCreate.id

# Get single vehicle
if ($vehicleId) {
    Test-ApiRequest -Method "GET" -Endpoint "/vehicles/$vehicleId" -Description "GET single vehicle"
    
    # Update vehicle
    $updateBody = @{
        capacity = 600
        status   = "available"
    } | ConvertTo-Json
    Test-ApiRequest -Method "PATCH" -Endpoint "/vehicles/$vehicleId" -Body $updateBody -Description "UPDATE vehicle"
}

# Test 3: Products CRUD
Write-Host "`n--- PRODUCTS CRUD ---" -ForegroundColor Yellow

# Get all products
Test-ApiRequest -Method "GET" -Endpoint "/products" -Description "GET all products"

# Test 4: Suppliers CRUD
Write-Host "`n--- SUPPLIERS CRUD ---" -ForegroundColor Yellow

# Get all suppliers
Test-ApiRequest -Method "GET" -Endpoint "/suppliers" -Description "GET all suppliers"

# Test 5: Transports CRUD
Write-Host "`n--- TRANSPORTS CRUD ---" -ForegroundColor Yellow

# Get all transports
Test-ApiRequest -Method "GET" -Endpoint "/transports" -Description "GET all transports"
Test-ApiRequest -Method "GET" -Endpoint "/transports/pending" -Description "GET pending transports"
Test-ApiRequest -Method "GET" -Endpoint "/transports/in-transit" -Description "GET in-transit transports"

# Test 6: Tasks CRUD
Write-Host "`n--- TASKS CRUD ---" -ForegroundColor Yellow

# Get all tasks
Test-ApiRequest -Method "GET" -Endpoint "/tasks" -Description "GET all tasks"

# Test 7: Notifications
Write-Host "`n--- NOTIFICATIONS ---" -ForegroundColor Yellow

# Get notifications
Test-ApiRequest -Method "GET" -Endpoint "/notifications" -Description "GET notifications"

# Test 8: Dashboard
Write-Host "`n--- DASHBOARD ---" -ForegroundColor Yellow

# Get dashboard stats
Test-ApiRequest -Method "GET" -Endpoint "/dashboard/stats" -Description "GET dashboard stats"

# Cleanup - Delete test vehicle if created
if ($vehicleId) {
    Write-Host "`n--- CLEANUP ---" -ForegroundColor Yellow
    Test-ApiRequest -Method "DELETE" -Endpoint "/vehicles/$vehicleId" -Description "DELETE test vehicle"
}

Write-Host "`n=== TEST COMPLETE ===" -ForegroundColor Cyan
