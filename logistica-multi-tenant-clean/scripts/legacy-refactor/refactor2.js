const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'frontend/src/pages/LiveTrackingAndRouteOptimization.tsx');
let content = fs.readFileSync(filePath, 'utf-8');

// Mapping of Portuguese to English - more comprehensive
const replacements = [
  // Tab names and status strings  
  [/'rastreamento'/g, '\'tracking\''],
  [/'rotas'/g, '\'routes\''],
  [/'historico'/g, '\'history\''],
  [/'mapa'/g, '\'map\''],
  [/'lista'/g, '\'list\''],
  [/'ativo'/g, '\'active\''],
  [/'inativo'/g, '\'inactive\''],
  [/'em_viagem'/g, '\'in_transit\''],
  [/'manutencao'/g, '\'maintenance\''],
  [/'carregando'/g, '\'loading\''],
  [/'descarga'/g, '\'unloading\''],
  [/'planejada'/g, '\'planned\''],
  [/'em_andamento'/g, '\'in_progress\''],
  [/'concluida'/g, '\'completed\''],
  [/'cancelada'/g, '\'cancelled\''],
  [/'atrasada'/g, '\'delayed\''],
  [/'baixa'/g, '\'low\''],
  [/'media'/g, '\'medium\''],
  [/'alta'/g, '\'high\''],
  [/'critica'/g, '\'critical\''],
  [/'coleta'/g, '\'pickup\''],
  [/'entrega'/g, '\'delivery\''],
  [/'ponto_interesse'/g, '\'point_of_interest\''],
  [/'reabastecimento'/g, '\'refuel\''],
  [/'descanso'/g, '\'rest\''],
  [/'perigo'/g, '\'danger\''],
  [/'restrito'/g, '\'restricted\''],
  [/'monitorado'/g, '\'monitored\''],
  [/'preferencial'/g, '\'preferred\''],
  [/'entrada'/g, '\'entry\''],
  [/'saida'/g, '\'exit\''],
  [/'velocidade'/g, '\'speeding\''],
  [/'parada_longa'/g, '\'long_stop\''],
  [/'combustivel'/g, '\'fuel\''],
  [/'temperatura'/g, '\'temperature\''],
  [/'inicio_viagem'/g, '\'trip_start\''],
  [/'fim_viagem'/g, '\'trip_end\''],
  [/'parada'/g, '\'stop\''],
  [/'incidente'/g, '\'incident\''],
  [/'alerta'/g, '\'alert\''],
  [/'todos'/g, '\'all\''],
  [/'normal'/g, '\'normal\''],
  [/'resolvido'/g, '\'resolved\''],
  // Property names in object literals
  [/origem:/g, 'origin:'],
  [/destino:/g, 'destination:'],
  [/paradas:/g, 'stops:'],
  [/veiculo:/g, 'vehicle:'],
  [/prioridade:/g, 'priority:'],
  [/parametros:/g, 'parameters:'],
  [/evitarPedagios:/g, 'avoidTolls:'],
  [/evitarCentrosUrbanos:/g, 'avoidUrbanCenters:'],
  [/priorizarTempo:/g, 'prioritizeTime:'],
  [/otimizarCombustivel:/g, 'optimizeFuel:'],
  [/considerarTransito:/g, 'considerTraffic:'],
  [/evitarEstradasPercursos:/g, 'avoidHighways:'],
  [/combustivelEconomizado:/g, 'fuelSaved:'],
  [/tempoEconomizado:/g, 'timeSaved:'],
  [/alertasResolvidos:/g, 'alertsResolved:'],
  // Comments
  [/\/\/ quando a lista chega do backend/g, '// When list arrives from backend'],
  [/\/\/ alterna aba com base na querystring/g, '// Switch tab based on query string'],
  [/\/\/ Carregar routes de rastreamento GPS/g, '// Load GPS tracking routes'],
  [/\/\/ Estados para rastreamento GPS/g, '// GPS tracking state'],
  [/\/\/ selectedRota tracking handled/g, '// selectedRoute tracking handled'],
  [/\/\/ garantir que o ID seja sempre string/g, '// Ensure ID is always string'],
  [/\/\/ útil para links de footer/g, '// Useful for footer/sidebar links'],
];

replacements.forEach(([pattern, replacement]) => {
  content = content.replace(pattern, replacement);
});

fs.writeFileSync(filePath, content, 'utf-8');
console.log('Comprehensive refactoring completed!');
