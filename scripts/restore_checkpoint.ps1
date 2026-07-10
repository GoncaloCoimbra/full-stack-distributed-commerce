Param(
    [string]$Ref = ""
)

if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Error "Git não encontrado. Instale o Git e tente novamente."
    exit 1
}

Write-Host "Buscando tags e atualizando referências remotas..."
git fetch --tags --prune

if ([string]::IsNullOrWhiteSpace($Ref)) {
    $latest = git describe --tags --abbrev=0 2>$null
    if ($LASTEXITCODE -ne 0 -or [string]::IsNullOrWhiteSpace($latest)) {
        Write-Host "Nenhuma tag encontrada. Forneça -Ref <commit|branch|tag> para restaurar." -ForegroundColor Yellow
        exit 1
    }
    $Ref = $latest.Trim()
    Write-Host "Usando a tag mais recente: $Ref"
}

Write-Host "Fazendo checkout para: $Ref"
git checkout $Ref
if ($LASTEXITCODE -ne 0) {
    Write-Error "Falha no checkout de $Ref. Verifique se o ref existe e tente novamente."
    exit 1
}

Write-Host "Resetando árvore de trabalho para $Ref (hard reset)..."
git reset --hard $Ref
if ($LASTEXITCODE -ne 0) {
    Write-Error "Falha no reset --hard para $Ref. Verifique permissões e estado do repositório."
    exit 1
}

Write-Host "Restauração concluída para $Ref" -ForegroundColor Green
