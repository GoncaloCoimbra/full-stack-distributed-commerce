# Bulk refactoring script for all 31 pages
$pagesDir = "c:\Users\gonca\OneDrive\Ambiente de Trabalho\website\logistica-multi-tenant\frontend\src\pages"
$files = @(
    "SupplierList.tsx", "TransportList.tsx", "VehicleList.tsx", "Tasks.tsx", 
    "CompanyManagement.tsx", "GlobalUserManagement.tsx", "AuditLog.tsx", 
    "Referrals.tsx", "Tutorials.tsx", "Login.tsx", "Register.tsx", "Profile.tsx", 
    "Settings.tsx", "NewProduct.tsx", "SuperAdminProfile.tsx", "Dashboard.tsx", 
    "SuperAdminDashboard.tsx", "DashboardAdvanced.tsx", "ProductDetails.tsx", 
    "TutorialDetail.tsx", "AdminHome.tsx", "SuperAdminHome.tsx", "OperatorHome.tsx", 
    "ApiDocumentation.tsx", "HelpCenter.tsx", "Updates.tsx", "SystemStatus.tsx", 
    "cookies.tsx", "Privacy Policy.tsx", "TermsofUse.tsx", 
    "LiveTrackingAndRouteOptimization.tsx"
)

# Simple replacements using variables to avoid quoting issues
$r1_find = 'className="p-8 bg-gradient-to-br from-\[#0f172a\] to-\[#1e293b\] min-h-screen"'
$r1_replace = 'style={{ padding: ''var(--space-2xl)'', minHeight: ''100vh'', backgroundColor: ''var(--color-surface)'' }}'

$r2_find = 'className="text-white"'
$r2_replace = 'style={{ color: ''var(--color-text)'' }}'

$r3_find = 'className="text-amber-300"'
$r3_replace = 'style={{ color: ''var(--color-text-muted)'' }}'

$r4_find = 'className="rounded-lg"'
$r4_replace = 'style={{ borderRadius: ''var(--radius-md)'' }}'

$r5_find = 'className="border border-amber-500/30"'
$r5_replace = 'style={{ border: ''1px solid var(--color-border)'' }}'

$r6_find = 'className="px-4 py-2"'
$r6_replace = 'style={{ padding: ''var(--space-md)'' }}'

# Array of replacement pairs
$replacements = @(
    @($r1_find, $r1_replace),
    @($r2_find, $r2_replace),
    @($r3_find, $r3_replace),
    @($r4_find, $r4_replace),
    @($r5_find, $r5_replace),
    @($r6_find, $r6_replace)
)

$completed = 0
$failed = 0
$skipped = 0

foreach ($file in $files) {
    $filePath = Join-Path $pagesDir $file
    if (-Not (Test-Path $filePath)) {
        Write-Host "⏭️  Skipping $file (not found)" -ForegroundColor Yellow
        $skipped++
        continue
    }
    
    Write-Host "🔄 Processing $file..." -ForegroundColor Cyan
    
    try {
        $content = Get-Content -Path $filePath -Raw -Encoding UTF8
        $originalContent = $content
        
        # Apply replacements
        foreach ($pair in $replacements) {
            $pattern = $pair[0]
            $replacement = $pair[1]
            $content = $content -replace [regex]::Escape($pattern), $replacement
        }
        
        if ($content -ne $originalContent) {
            Set-Content -Path $filePath -Value $content -Encoding UTF8
            Write-Host "✅ $file - REFACTORED" -ForegroundColor Green
            $completed++
        } else {
            Write-Host "⏳ $file - No changes needed" -ForegroundColor Gray
        }
    } catch {
        Write-Host "❌ $file - ERROR: $_" -ForegroundColor Red
        $failed++
    }
}

Write-Host "`n📊 SUMMARY:" -ForegroundColor White
Write-Host "✅ Refactored: $completed" -ForegroundColor Green
Write-Host "❌ Failed: $failed" -ForegroundColor Red  
Write-Host "⏭️  Skipped: $skipped" -ForegroundColor Yellow
Write-Host "📈 Total: $($files.Count)" -ForegroundColor Cyan
