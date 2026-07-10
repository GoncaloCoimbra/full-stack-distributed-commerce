# Script de Verificação - Mega Bloco Fases 5-7

Write-Host "═══════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  VERIFICAÇÃO DE MÓDULOS CRIADOS" -ForegroundColor Cyan
Write-Host "
" -ForegroundColor Cyan

$modules = @(
    @{Name="Products"; Path="src\modules\products"},
    @{Name="Companies"; Path="src\modules\companies"},
    @{Name="Suppliers"; Path="src\modules\suppliers"},
    @{Name="Vehicles"; Path="src\modules\vehicles"},
    @{Name="Transports"; Path="src\modules\transports"},
    @{Name="Dashboard"; Path="src\modules\dashboard"},
    @{Name="Audit Log"; Path="src\modules\audit-log"}
)

$allGood = $true

foreach ($module in $modules) {
    $exists = Test-Path $module.Path
    if ($exists) {
        Write-Host " $($module.Name) Module" -ForegroundColor Green
        
        $files = Get-ChildItem -Path $module.Path -Recurse -File | Measure-Object
        Write-Host "   📁 $($files.Count) ficheiros criados" -ForegroundColor Gray
    } else {
        Write-Host " $($module.Name) Module - NÃO ENCONTRADO" -ForegroundColor Red
        $allGood = $false
    }
}

Write-Host "
" -ForegroundColor Cyan

if ($allGood) {
    Write-Host " ALL MODULES CREATED SUCCESSFULLY!" -ForegroundColor Green
    Write-Host "
 Próximos passos:" -ForegroundColor Yellow
    Write-Host "  1. npm install (se necessário)" -ForegroundColor White
    Write-Host "  2. npm run build" -ForegroundColor White
    Write-Host "  3. npm run start:dev" -ForegroundColor White
    Write-Host "  4. Aceder ao Swagger: http://localhost:3000/api/docs
" -ForegroundColor White
} else {
    Write-Host "  SOME MODULES WERE NOT CREATED" -ForegroundColor Red
    Write-Host "Execute o script novamente ou crie manualmente
" -ForegroundColor Yellow
}
