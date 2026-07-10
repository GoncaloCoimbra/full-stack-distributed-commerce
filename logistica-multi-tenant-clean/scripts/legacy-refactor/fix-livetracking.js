const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'frontend/src/pages/LiveTrackingAndRouteOptimization.tsx');

let content = fs.readFileSync(filePath, 'utf8');

// Variable name replacements
const replacements = [
  [/tempoEstimado/g, 'estimatedTime'],
  [/tempoOtimizado/g, 'optimizedTime'],
  [/tempoReal/g, 'actualTime'],
  [/combustivelEstimado/g, 'estimatedFuel'],
  [/combustivelOtimizado/g, 'optimizedFuel'],
  [/combustivelReal/g, 'actualFuel'],
  [/veiculoAtribuido/g, 'assignedVehicle'],
  [/novaRotaOtimizada/g, 'optimizedNewRoute'],
  [/concluida/g, 'completed'],
  [/notas\b/g, 'notes'],
];

replacements.forEach(([pattern, replacement]) => {
  content = content.replace(pattern, replacement);
});

fs.writeFileSync(filePath, content, 'utf8');
console.log('✓ Fixed remaining Portuguese names in LiveTrackingAndRouteOptimization.tsx');
