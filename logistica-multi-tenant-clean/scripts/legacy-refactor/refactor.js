const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'frontend/src/pages/LiveTrackingAndRouteOptimization.tsx');
let content = fs.readFileSync(filePath, 'utf-8');

// Mapping of Portuguese to English variable/property names
const replacements = [
  // State setters and getters
  [/setVeiculos/g, 'setVehicles'],
  [/setRotas/g, 'setRoutes'],
  [/setAlertasAtivos/g, 'setActiveAlerts'],
  [/setEventos/g, 'setEvents'],
  [/setAbaAtiva/g, 'setActiveTab'],
  [/setSelectedVeiculo/g, 'setSelectedVehicle'],
  [/setFiltroStatus/g, 'setStatusFilter'],
  [/setEstatisticas/g, 'setStatistics'],
  [/setNovaRota/g, 'setNewRoute'],
  // Variables
  [/\babaAtiva\b/g, 'activeTab'],
  [/\bveiculos\b/g, 'vehicles'],
  [/\brotas\b/g, 'routes'],
  [/\balertasAtivos\b/g, 'activeAlerts'],
  [/\beventos\b/g, 'events'],
  [/\bselectedVeiculo\b/g, 'selectedVehicle'],
  [/\bfiltroStatus\b/g, 'statusFilter'],
  [/\bestatisticas\b/g, 'statistics'],
  [/\bnovaRota\b/g, 'newRoute'],
  [/\bveiculoSelecionado\b/g, 'selectedVehicle'],
  [/\btotalCombustivelEconomizado\b/g, 'totalFuelSaved'],
  [/\btotalTempoEconomizado\b/g, 'totalTimeSaved'],
  [/\beficienciaMedia\b/g, 'averageEfficiency'],
  [/\bco2Evitado\b/g, 'co2Avoided'],
  // Properties/fields
  [/\.origem\b/g, '.origin'],
  [/\.destino\b/g, '.destination'],
  [/\.paradas\b/g, '.stops'],
  [/\.veiculo\b/g, '.vehicle'],
  [/\.parametros\b/g, '.parameters'],
  [/\.combustivelEstimado\b/g, '.estimatedFuel'],
  [/\.combustivelOtimizado\b/g, '.optimizedFuel'],
  [/\.combustivel\b/g, '.fuel'],
  [/\.tempoEstimado\b/g, '.estimatedTime'],
  [/\.tempoOtimizado\b/g, '.optimizedTime'],
  [/\.tempoReal\b/g, '.realTime'],
  [/\.distancia\b/g, '.distance'],
  [/\.economia\b/g, '.savings'],
  [/\.localizacao\b/g, '.location'],
  [/\.endereco\b/g, '.address'],
  [/\.motorista\b/g, '.driver'],
  [/\.placa\b/g, '.licensePlate'],
  [/\.velocidade\b/g, '.speed'],
  [/\.temperatura\b/g, '.temperature'],
  [/\.pressaoPneus\b/g, '.tirePressure'],
  [/\.odometro\b/g, '.odometer'],
  [/\.ultimaAtualizacao\b/g, '.lastUpdate'],
  [/\.veiculoAtribuido\b/g, '.assignedVehicle'],
  [/\.dificuldade\b/g, '.difficulty'],
  [/\.carga\b/g, '.load'],
  [/\.centro\b/g, '.center'],
  [/\.horarios\b/g, '.schedule'],
  [/\.inicio\b/g, '.start'],
  [/\.fim\b/g, '.end'],
];

replacements.forEach(([pattern, replacement]) => {
  content = content.replace(pattern, replacement);
});

fs.writeFileSync(filePath, content, 'utf-8');
console.log('Refactoring completed!');
