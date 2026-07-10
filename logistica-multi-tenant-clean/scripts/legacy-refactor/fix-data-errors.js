const fs = require('fs');
const path = require('path');

function fixDataErrors(dir, pattern = /\.(date)(?!\w)/g) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      if (!['node_modules', '.git', '.next', 'build', 'dist'].includes(file)) {
        fixDataErrors(filePath, pattern);
      }
    } else if (/\.(ts|tsx|js|jsx)$/.test(file)) {
      try {
        let content = fs.readFileSync(filePath, 'utf-8');
        const original = content;
        
        // Fix .date to .data (but not .date functions)
        content = content.replace(/\.date(?!\s*\()/g, '.data');
        
        // Fix config.date to config.data
        content = content.replace(/config\.date/g, 'config.data');
        
        // Fix error.response.date to error.response.data
        content = content.replace(/error\.response\.date/g, 'error.response.data');
        
        // Fix response.date to response.data
        content = content.replace(/response\.date/g, 'response.data');
        
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

console.log('🔧 Fixing .date -> .data errors...\n');

dirs.forEach(dir => {
  if (fs.existsSync(dir)) {
    fixDataErrors(dir);
  }
});

console.log('\n✅ All .date/.data errors fixed!');
