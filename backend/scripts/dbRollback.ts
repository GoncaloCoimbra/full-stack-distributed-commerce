import { execSync } from 'child_process';

const rollbackCommand = process.env.DB_ROLLBACK_COMMAND || 'npx prisma migrate rollback --force';

try {
  execSync(rollbackCommand, { stdio: 'inherit' });
} catch (error) {
  console.error('Database rollback failed:', error);
  process.exit(1);
}
