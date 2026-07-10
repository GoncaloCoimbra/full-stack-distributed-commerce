# Comprehensive refactoring with complex pattern support
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

$completed = 0
$failed = 0

foreach ($file in $files) {
    $filePath = Join-Path $pagesDir $file
    if (-Not (Test-Path $filePath)) {
        continue
    }
    
    try {
        $content = Get-Content -Path $filePath -Raw -Encoding UTF8
        $originalContent = $content
        
        # Replace individual className patterns with inline styles
        $content = $content -replace 'className="text-white"', "style={{ color: 'var(--color-text)' }}"
        $content = $content -replace 'className="text-amber-300"', "style={{ color: 'var(--color-text-muted)' }}"
        $content = $content -replace 'className="text-amber-100"', "style={{ color: 'var(--color-text)' }}"
        $content = $content -replace 'className="text-red-300"', "style={{ color: '#f87171' }}"
        $content = $content -replace 'className="text-green-400"', "style={{ color: '#34d399' }}"
        $content = $content -replace 'className="text-blue-600"', "style={{ color: '#2563eb' }}"
        
        # Replace border styles
        $content = $content -replace 'className="border border-amber-500/30"', "style={{ border: '1px solid var(--color-border)' }}"
        $content = $content -replace 'className="border-2 border-red-500/50"', "style={{ border: '2px solid rgba(244, 63, 94, 0.5)' }}"
        $content = $content -replace 'className="border-b-2 border-amber-500/20"', "style={{ borderBottom: '2px solid rgba(251, 146, 60, 0.2)' }}"
        
        # Replace rounded styles
        $content = $content -replace 'className="rounded-lg"', "style={{ borderRadius: 'var(--radius-md)' }}"
        $content = $content -replace 'className="rounded-xl"', "style={{ borderRadius: '0.75rem' }}"
        $content = $content -replace 'className="rounded-full"', "style={{ borderRadius: '9999px' }}"
        $content = $content -replace 'className="rounded-r"', "style={{ borderTopRightRadius: '0.375rem', borderBottomRightRadius: '0.375rem' }}"
        
        # Replace padding styles  
        $content = $content -replace 'className="px-4 py-2"', "style={{ padding: 'var(--space-md)' }}"
        $content = $content -replace 'className="p-4"', "style={{ padding: '1rem' }}"
        $content = $content -replace 'className="p-6"', "style={{ padding: '1.5rem' }}"
        $content = $content -replace 'className="p-8"', "style={{ padding: '2rem' }}"
        $content = $content -replace 'className="px-6"', "style={{ paddingLeft: '1.5rem', paddingRight: '1.5rem' }}"
        
        # Replace main container pattern
        $content = $content -replace 'className="p-8 bg-gradient-to-br from-\[#0f172a\] to-\[#1e293b\] min-h-screen"', "style={{ padding: '2rem', minHeight: '100vh', backgroundColor: 'var(--color-surface)' }}"
        $content = $content -replace 'className="bg-gradient-to-br from-slate-800 to-slate-900 min-h-screen', "style={{ minHeight: '100vh', backgroundColor: '#1e293b' }}"
        
        # Replace element tags with components
        # Be careful with this - need to maintain attributes
        $content = $content -replace '<input\s+([^>]*?)type="text"', '<Input type="text" $1'
        $content = $content -replace '<input\s+([^>]*?)type="email"', '<Input type="email" $1'
        $content = $content -replace '<input\s+([^>]*?)type="password"', '<Input type="password" $1'
        $content = $content -replace '<input\s+([^>]*?)type="number"', '<Input type="number" $1'
        
        if ($content -ne $originalContent) {
            Set-Content -Path $filePath -Value $content -Encoding UTF8
            Write-Host "✅ $file" -ForegroundColor Green
            $completed++
        } else {
            Write-Host "⏳ $file" -ForegroundColor Gray
        }
    } catch {
        Write-Host "❌ $file - ERROR" -ForegroundColor Red
        $failed++
    }
}

Write-Host "`nCompleted: $completed | Failed: $failed | Total: $($files.Count)"
