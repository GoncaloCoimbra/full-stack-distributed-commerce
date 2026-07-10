#!/usr/bin/env node
/**
 * BULK REFACTOR SCRIPT
 * ====================
 * Refactora todas as páginas da Logistics frontend para usar novo design system
 * 
 * EXECUTA:
 * node bulk-refactor-pages.js
 */

const fs = require('fs');
const path = require('path');

const PAGES_DIR = path.join(__dirname, 'logistica-multi-tenant/frontend/src/pages');

// Padrões de refactoring
const refactorPatterns = [
  // Imports
  {
    pattern: /import.*theme\.config.*\n/g,
    replacement: '',
    name: 'Remove theme.config import'
  },
  {
    pattern: /import.*getStatusBadgeClass.*\n/g,
    replacement: '',
    name: 'Remove getStatusBadgeClass import'
  },
  
  // Tailwind utility classes
  {
    pattern: /className="p-8 bg-gradient-to-br from-\[#0f172a\] to-\[#1e293b\] min-h-screen"/g,
    replacement: 'style={{ padding: \'var(--space-2xl)\', minHeight: \'100vh\', backgroundColor: \'var(--color-surface)\' }}',
    name: 'Replace main container classes'
  },
  {
    pattern: /className="text-white"/g,
    replacement: 'style={{ color: \'var(--color-text)\' }}',
    name: 'Replace text-white'
  },
  {
    pattern: /className="text-3xl font-bold"/g,
    replacement: 'style={{ fontSize: \'var(--fs-3xl)\', fontWeight: \'bold\' }}',
    name: 'Replace heading classes'
  },
  {
    pattern: /className="px-6 py-4"/g,
    replacement: 'style={{ padding: \'var(--space-lg) var(--space-lg)\' }}',
    name: 'Replace padding'
  },
  {
    pattern: /className="rounded-lg"/g,
    replacement: 'style={{ borderRadius: \'var(--radius-md)\' }}',
    name: 'Replace border-radius'
  },
  {
    pattern: /className="border border-amber-500\/30"/g,
    replacement: 'style={{ border: \'1px solid var(--color-border)\' }}',
    name: 'Replace border'
  },
  {
    pattern: /className="bg-amber-500"/g,
    replacement: 'variant="primary"',
    name: 'Replace button primary color'
  },
  {
    pattern: /className="bg-red-500"/g,
    replacement: 'variant="danger"',
    name: 'Replace button danger color'
  },
  {
    pattern: /className="bg-green-500"/g,
    replacement: 'variant="success"',
    name: 'Replace button success color'
  },
];

async function getPages() {
  try {
    const files = fs.readdirSync(PAGES_DIR);
    return files.filter(file => file.endsWith('.tsx'));
  } catch (error) {
    console.error('❌ Erro ao ler diretório de páginas:', error);
    return [];
  }
}

async function refactorPage(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf-8');
    const originalContent = content;
    let changeCount = 0;

    // Aplicar cada padrão de refactoring
    for (const pattern of refactorPatterns) {
      const matches = content.match(pattern.pattern);
      if (matches) {
        content = content.replace(pattern.pattern, pattern.replacement);
        changeCount += matches.length;
      }
    }

    // Se houve mudanças, salvar
    if (changeCount > 0) {
      fs.writeFileSync(filePath, content, 'utf-8');
      return {
        file: path.basename(filePath),
        status: '✅',
        changes: changeCount,
      };
    } else {
      return {
        file: path.basename(filePath),
        status: '⏭️',
        changes: 0,
      };
    }
  } catch (error) {
    return {
      file: path.basename(filePath),
      status: '❌',
      error: error.message,
    };
  }
}

async function runBulkRefactor() {
  console.log('╔════════════════════════════════════════╗');
  console.log('║    BULK REFACTOR - LOGISTICS PAGES     ║');
  console.log('╚════════════════════════════════════════╝\n');

  const pages = await getPages();
  console.log(`📄 Encontradas ${pages.length} páginas para refactoring\n`);

  const results = [];

  for (const page of pages) {
    const filePath = path.join(PAGES_DIR, page);
    const result = await refactorPage(filePath);
    results.push(result);

    if (result.status === '✅') {
      console.log(`${result.status} ${result.file} (${result.changes} mudanças)`);
    } else if (result.status === '⏭️') {
      console.log(`${result.status} ${result.file} (sem mudanças)`);
    } else {
      console.log(`${result.status} ${result.file} (erro: ${result.error})`);
    }
  }

  console.log('\n' + '='.repeat(40));
  const successful = results.filter(r => r.status === '✅').length;
  const unchanged = results.filter(r => r.status === '⏭️').length;
  const failed = results.filter(r => r.status === '❌').length;

  console.log(`✅ Refatoradas: ${successful}`);
  console.log(`⏭️ Inalteradas: ${unchanged}`);
  console.log(`❌ Falhadas: ${failed}`);
  console.log(`📊 Total de mudanças: ${results.reduce((sum, r) => sum + (r.changes || 0), 0)}`);

  console.log('\n✨ Refactoring concluído!\n');
}

// Executar
runBulkRefactor().catch(console.error);
