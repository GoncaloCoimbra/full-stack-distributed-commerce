const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'backend-nest/src/modules/transports/transports.service.ts');
let content = fs.readFileSync(filePath, 'utf-8');

const replacements = [
  // Comments and English translations
  [/🗺️ MAPEAMENTO DE CIDADES PARA COORDENADAS GPS/g, '🗺️ CITY TO GPS COORDINATES MAPPING'],
  [/Se a cidade não for encontrada, usar Lisboa como fallback/g, 'If city is not found, use Lisbon as fallback'],
  [/Cidade .* não encontrada\. Usando Lisboa como fallback\./g, 'City not found. Using Lisbon as fallback.'],
  [/🔍 Checking city coordinates for/g, '🔍 Checking city coordinates for'],
  [/MAPEAMENTO DE CIDADES/g, 'CITY COORDINATES MAPPING'],
  [/Transporte não encontrado/g, 'Transport not found'],
  [/Vehicle em manutenção/g, 'Vehicle in maintenance'],
  [/'Transporte não encontrado'/g, '\'Transport not found\''],
  [/Código gerado:/g, 'Generated code:'],
  [/Transporte criado:/g, 'Transport created:'],
  [/Status mudado:/g, 'Status changed:'],
  [/Quantidade atualizada:/g, 'Quantity updated:'],
  [/Movimento registrado/g, 'Movement recorded'],
  [/Vehicle .* → IN_USE \(bloqueado\)/g, 'Vehicle $1 → IN_USE (locked)'],
  [/Transporte criado com sucesso!/g, 'Transport created successfully!'],
  [/products:/g, 'products:'],
  [/Vehicle: /g, 'Vehicle: '],
  [/Transporte em/g, 'Transport in'],
  [/Estado inesperado do transporte/g, 'Unexpected transport state'],
  [/Eliminado com sucesso/g, 'Successfully deleted'],
  [/'Transporte em .* - aguarde anterior\.'/, '\'Transport in progress - wait for earlier one\''],
  // Portuguese error messages in logger
  [/Tentando remover transporte/g, 'Attempting to remove transport'],
  [/Transporte encontrado:/g, 'Transport found:'],
  [/products associados:/g, 'associated products:'],
  [/BLOQUEADO - Transporte em/g, 'BLOCKED - Transport in'],
  [/BLOQUEADO - Transporte já entregue/g, 'BLOCKED - Transport already delivered'],
  [/Transport PENDING with/g, 'Transport PENDING with'],
  [/Returning products to stock/g, 'Returning products to stock'],
  [/products a devolver:/g, 'products to return:'],
  [/IN_STORAGE \(devolvido ao stock\)/g, 'IN_STORAGE (returned to stock)'],
  [/Relações product-transporte eliminadas/g, 'Product-transport relationships deleted'],
  [/product\(s\) devolvido\(s\) ao stock/g, 'product(s) returned to stock'],
  [/product pode ser eliminado/g, 'product can be deleted'],
  [/Produto .* não encontrado/g, 'Product $1 not found'],
  [/STOCK INSUFICIENTE/g, 'INSUFFICIENT STOCK'],
  [/product não encontrado ou inválido/g, 'product not found or invalid'],
  [/Falha na eliminação do transporte/g, 'Transport deletion failed'],
  [/CRON JOB SUMMARY/g, 'CRON JOB SUMMARY'],
  [/CRON JOB EXECUTED: Auto-Arrive Transports/g, 'CRON JOB EXECUTED: Auto-Arrive Transports'],
  [/Looking for IN_TRANSIT transports with/g, 'Looking for IN_TRANSIT transports with'],
  [/Found .* transport\(s\) to process/g, 'Found $1 transport(s) to process'],
  [/No transports to process today/g, 'No transports to process today'],
  [/Processing transport /g, 'Processing transport '],
  [/Route:/g, 'Route:'],
  [/Processed:/g, 'Processed:'],
  [/De:/g, 'From:'],
  [/Para:/g, 'To:'],
  [/Data real de chegada definida automaticamente:/g, 'Actual arrival date set automatically:'],
  [/Atualização simples de campos/g, 'Simple field update'],
  [/Atualização simples de campos logísticos/g, 'Simple logistic field update'],
  [/Status mudando para DELIVERED/g, 'Status changing to DELIVERED'],
  [/Status mudando para CANCELED/g, 'Status changing to CANCELED'],
  [/Iniciando automação/g, 'Starting automation'],
  [/Revertendo automação/g, 'Reverting automation'],
  [/product .* → /g, 'product $1 → '],
  [/Processando .* product\(s\)/g, 'Processing $1 product(s)'],
  [/Recebido por:/g, 'Received by:'],
  [/Observações:/g, 'Notes:'],
  [/Error sending delivery notification:/g, 'Error sending delivery notification:'],
  [/Error sending cancellation notification:/g, 'Error sending cancellation notification:'],
];

replacements.forEach(([pattern, replacement]) => {
  content = content.replace(new RegExp(pattern, 'g'), replacement);
});

fs.writeFileSync(filePath, content, 'utf-8');
console.log('Backend service refactoring completed!');
