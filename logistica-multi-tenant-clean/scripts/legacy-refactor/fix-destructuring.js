const fs = require('fs');
const path = require('path');

function fixDestructuring(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      if (!['node_modules', '.git', '.next', 'build', 'dist'].includes(file)) {
        fixDestructuring(filePath);
      }
    } else if (/\.(ts|tsx|js|jsx)$/.test(file)) {
      try {
        let content = fs.readFileSync(filePath, 'utf-8');
        const original = content;
        
        // Fix destructuring patterns: { date: something } to { data: something }
        content = content.replace(/\{\s*date\s*:/g, '{ data:');
        content = content.replace(/,\s*date\s*:/g, ', data:');
        
        // Fix other destructuring related issues
        content = content.replace(/\.date\s*\?/g, '.data ?');
        content = content.replace(/\.date\s*&&/g, '.data &&');
        
        if (content !== original) {
          fs.writeFileSync(filePath, content, 'utf-8');
          console.log(`✓ Fixed: ${path.relative(projectRoot, filePath)}`);
        }
      } catch (error) {
        console.error(`Error processing ${filePath}: ${error.message}`);
      }
    }
  });
}

const projectRoot = __dirname;
const dirs = [
  path.join(projectRoot, 'frontend', 'src'),
  path.join(projectRoot, 'backend-nest', 'src'),
];

console.log('🔧 Fixing destructuring patterns...\n');

dirs.forEach(dir => {
  if (fs.existsSync(dir)) {
    fixDestructuring(dir);
  }
});

console.log('\n✅ All destructuring patterns fixed!');
