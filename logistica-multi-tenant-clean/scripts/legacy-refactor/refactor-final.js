const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'frontend/src/pages/LiveTrackingAndRouteOptimization.tsx');
let content = fs.readFileSync(filePath, 'utf-8');

// Additional replacements for remaining Portuguese
const replacements = [
  // Interface type references
  [/\(status: Veiculo\['status'\]\)/g, "(status: Vehicle['status'])"],
  // Variable names that were missed
  [/const veiculosFiltrados =/g, 'const filteredVehicles ='],
  [/veiculosFiltrados\.map/g, 'filteredVehicles.map'],
  [/const rotasVeiculo =/g, 'const routesVehicle ='],
  [/rotasVeiculo\.length/g, 'routesVehicle.length'],
  [/rotasVeiculo\[0\]/g, 'routesVehicle[0]'],
  // Property assignments that were missed
  [/\.parada,/g, '.stop,'],
  [/\.endereco:/g, '.address:'],
  [/\.veiculoAtribuido:/g, '.assignedVehicle:'],
  [/\.parametros\./g, '.parameters.'],
  [/\.otimizarCombustivel/g, '.optimizeFuel'],
  // Within string literals and JSX
  [/Lista veiculos/g, 'List vehicles'],
  // Variables in loops
  [/\.map\(veiculo =>/g, '.map(vehicle =>'],
  [/{veiculo\.id}/g, '{vehicle.id}'],
  [/{veiculo\.licensePlate}/g, '{vehicle.licensePlate}'],
  [/{veiculo\.status}/g, '{vehicle.status}'],
  [/{veiculo\.speed}/g, '{vehicle.speed}'],
  [/{veiculo\.fuel}/g, '{vehicle.fuel}'],
  [/{veiculo\.location}/g, '{vehicle.location}'],
  [/veiculo\.odometer/g, 'vehicle.odometer'],
];

replacements.forEach(([pattern, replacement]) => {
  content = content.replace(new RegExp(pattern.source || pattern, 'g'), replacement);
});

fs.writeFileSync(filePath, content, 'utf-8');
console.log('Final cleanup refactoring completed!');
