$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $PSScriptRoot
Set-Location $root

Write-Host '[quality-gate] Running backend tests'
Push-Location backend
npm test -- --runInBand
Pop-Location

Write-Host '[quality-gate] Running ChatOps tests'
Push-Location Chatops/backend
npm test -- --runInBand
Pop-Location

Write-Host '[quality-gate] Running Logistics tests'
Push-Location 'logistica-multi-tenant-clean/backend-nest'
npm test -- --runInBand
Pop-Location

Write-Host '[quality-gate] Quality gate completed'
