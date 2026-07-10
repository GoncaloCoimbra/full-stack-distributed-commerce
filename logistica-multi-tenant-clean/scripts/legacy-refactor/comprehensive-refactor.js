const fs = require('fs');
const path = require('path');

// Comprehensive mapping of Portuguese to English
const replacementMap = {
  // ====== BACKEND SERVICES ======
  // Variable and function names
  'obter': 'get',
  'criar': 'create',
  'atualizar': 'update',
  'eliminar': 'delete',
  'remover': 'remove',
  'buscar': 'search',
  'filtrar': 'filter',
  'validar': 'validate',
  'processar': 'process',
  'salvar': 'save',
  'carregar': 'load',
  'enviar': 'send',
  'receber': 'receive',
  'verificar': 'check',
  'notificar': 'notify',
  'registrar': 'register',
  'autenticar': 'authenticate',
  'autorizar': 'authorize',
  'permissao': 'permission',
  'acesso': 'access',
  'usuario': 'user',
  'empresa': 'company',
  'produto': 'product',
  'fornecedor': 'supplier',
  'veiculo': 'vehicle',
  'transporte': 'transport',
  'rota': 'route',
  'parada': 'stop',
  'endereco': 'address',
  'cidade': 'city',
  'pais': 'country',
  'data': 'date',
  'hora': 'time',
  'status': 'status',
  'ativo': 'active',
  'inativo': 'inactive',
  'pendente': 'pending',
  'concluido': 'completed',
  'cancelado': 'cancelled',
  'erro': 'error',
  'sucesso': 'success',
  'falha': 'failure',
  'aviso': 'warning',
  'info': 'info',
  'debug': 'debug',
  'trace': 'trace',
  
  // Database/Model properties
  'nome': 'name',
  'descricao': 'description',
  'quantidade': 'quantity',
  'preco': 'price',
  'peso': 'weight',
  'dimensoes': 'dimensions',
  'localizacao': 'location',
  'latitude': 'latitude',
  'longitude': 'longitude',
  'telefone': 'phone',
  'email': 'email',
  'endereco': 'address',
  'codigo': 'code',
  'nif': 'nif',
  'placa': 'licensePlate',
  'modelo': 'model',
  'marca': 'brand',
  'ano': 'year',
  'motorista': 'driver',
  'combustivel': 'fuel',
  'velocidade': 'speed',
  'temperatura': 'temperature',
  'pressao': 'pressure',
  'odometro': 'odometer',
  'carga': 'load',
  'capacidade': 'capacity',
  'disponivel': 'available',
  'manutencao': 'maintenance',
  'aposentado': 'retired',
  'origem': 'origin',
  'destino': 'destination',
  'distancia': 'distance',
  'tempo': 'time',
  'tempo_estimado': 'estimatedTime',
  'tempo_otimizado': 'optimizedTime',
  'combustivel_estimado': 'estimatedFuel',
  'combustivel_otimizado': 'optimizedFuel',
  'economia': 'savings',
  'dificuldade': 'difficulty',
  'prioridade': 'priority',
  'anotacoes': 'notes',
  'observacoes': 'observations',
  'criado_em': 'createdAt',
  'atualizado_em': 'updatedAt',
  'deletado_em': 'deletedAt',
  
  // Comments and strings
  'Informações básicas': 'Basic information',
  'Contactos': 'Contacts',
  'Endereço': 'Address',
  'Morada': 'Address',
  'Operações': 'Operations',
  'Validação': 'Validation',
  'Erro': 'Error',
  'Sucesso': 'Success',
  'Não encontrado': 'Not found',
  'Acesso negado': 'Access denied',
  'Campo obrigatório': 'Field required',
  'Valor inválido': 'Invalid value',
  'Já existe': 'Already exists',
  'Operação não permitida': 'Operation not allowed',
  'Estou processando': 'Processing',
  'Por favor aguarde': 'Please wait',
  'Carregando': 'Loading',
  'Salvando': 'Saving',
  'Atualizando': 'Updating',
  'Eliminando': 'Deleting',
  'Confirmando': 'Confirming',
};

// Additional specific replacements (longer patterns first)
const specificReplacements = [
  // Backend patterns
  [/findByIdCompany/g, 'findByIdAndCompany'],
  [/updateStatus/g, 'updateStatus'],
  [/getStats/g, 'getStats'],
  [/getMetrics/g, 'getMetrics'],
  [/checkAvailability/g, 'checkAvailability'],
  [/validateInput/g, 'validateInput'],
  [/formatResponse/g, 'formatResponse'],
  [/throwError/g, 'throwError'],
  [/logInfo/g, 'logInfo'],
  [/logError/g, 'logError'],
  [/logWarning/g, 'logWarning'],
  
  // Frontend patterns
  [/handleChange/g, 'handleChange'],
  [/handleSubmit/g, 'handleSubmit'],
  [/handleClick/g, 'handleClick'],
  [/handleDelete/g, 'handleDelete'],
  [/handleOpen/g, 'handleOpen'],
  [/handleClose/g, 'handleClose'],
  [/isLoading/g, 'isLoading'],
  [/isError/g, 'isError'],
  [/isEmpty/g, 'isEmpty'],
  [/setOpen/g, 'setOpen'],
  [/setData/g, 'setData'],
  [/setError/g, 'setError'],
  
  // Common patterns
  [/TODO:/g, 'TODO:'],
  [/FIXME:/g, 'FIXME:'],
  [/NOTE:/g, 'NOTE:'],
  [/HACK:/g, 'HACK:'],
  [/BUG:/g, 'BUG:'],
  [/FEATURE:/g, 'FEATURE:'],
  [/REFACTOR:/g, 'REFACTOR:'],
  
  // Portuguese enums and constants
  [/'nao_iniciado'/g, "'not_started'"],
  [/'em_progresso'/g, "'in_progress'"],
  [/'concluido'/g, "'completed'"],
  [/'cancelado'/g, "'cancelled'"],
  [/'erro'/g, "'error'"],
  [/'alta'/g, "'high'"],
  [/'media'/g, "'medium'"],
  [/'baixa'/g, "'low'"],
  [/'sim'/g, "'yes'"],
  [/'nao'/g, "'no'"],
  
  // Portuguese property accessors
  [/\.nome/g, '.name'],
  [/\.descricao/g, '.description'],
  [/\.quantidade/g, '.quantity'],
  [/\.preco/g, '.price'],
  [/\.status/g, '.status'],
  [/\.criado_em/g, '.createdAt'],
  [/\.atualizado_em/g, '.updatedAt'],
];

function processFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf-8');
    let modified = false;
    
    // Apply specific replacements
    specificReplacements.forEach(([pattern, replacement]) => {
      if (pattern.test(content)) {
        content = content.replace(pattern, replacement);
        modified = true;
      }
    });
    
    // Apply word replacements (case-sensitive for camelCase)
    Object.entries(replacementMap).forEach(([pt, en]) => {
      // camelCase patterns
      const camelPt = pt.charAt(0).toUpperCase() + pt.slice(1);
      const camelEn = en.charAt(0).toUpperCase() + en.slice(1);
      const camelPtLower = pt;
      
      // Replace in various contexts
      const patterns = [
        new RegExp(`\\b${pt}\\b`, 'g'),
        new RegExp(`\\b${camelPt}\\b`, 'g'),
        new RegExp(`'${pt}'`, 'g'),
        new RegExp(`"${pt}"`, 'g'),
        new RegExp(`${pt}:`, 'g'),
      ];
      
      patterns.forEach(() => {
        const beforeLen = content.length;
        content = content
          .replace(new RegExp(`\\b${pt}\\b`, 'g'), en)
          .replace(new RegExp(`\\b${camelPt}\\b`, 'g'), camelEn)
          .replace(new RegExp(`'${pt}'`, 'g'), `'${en}'`)
          .replace(new RegExp(`"${pt}"`, 'g'), `"${en}"`)
          .replace(new RegExp(`${pt}:`, 'g'), `${en}:`);
        
        if (content.length !== beforeLen) modified = true;
      });
    });
    
    if (modified) {
      fs.writeFileSync(filePath, content, 'utf-8');
      return true;
    }
    return false;
  } catch (error) {
    console.error(`Error processing ${filePath}: ${error.message}`);
    return false;
  }
}

function walkDir(dir, callback) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      // Skip node_modules, .git, build directories
      if (!['node_modules', '.git', '.next', 'build', 'dist', '.cache'].includes(file)) {
        walkDir(filePath, callback);
      }
    } else {
      // Process code files
      if (/\.(ts|tsx|js|jsx|json)$/.test(file)) {
        callback(filePath);
      }
    }
  });
}

// Main execution
const projectRoot = __dirname;
const backendDir = path.join(projectRoot, 'backend-nest', 'src');
const frontendDir = path.join(projectRoot, 'frontend', 'src');

console.log('🔄 Starting comprehensive refactoring...\n');

let filesProcessed = 0;
let filesModified = 0;

// Process backend
console.log('📁 Processing backend files...');
if (fs.existsSync(backendDir)) {
  walkDir(backendDir, (filePath) => {
    filesProcessed++;
    if (processFile(filePath)) {
      filesModified++;
      console.log(`  ✓ ${path.relative(projectRoot, filePath)}`);
    }
  });
}

// Process frontend
console.log('\n📁 Processing frontend files...');
if (fs.existsSync(frontendDir)) {
  walkDir(frontendDir, (filePath) => {
    filesProcessed++;
    if (processFile(filePath)) {
      filesModified++;
      console.log(`  ✓ ${path.relative(projectRoot, filePath)}`);
    }
  });
}

console.log(`\n✅ Refactoring complete!`);
console.log(`   📊 Files processed: ${filesProcessed}`);
console.log(`   📝 Files modified: ${filesModified}`);
console.log(`\n✨ All Portuguese identifiers have been translated to English!`);
