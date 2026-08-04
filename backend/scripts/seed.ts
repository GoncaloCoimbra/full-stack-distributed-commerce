import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import { catalogImportSchema } from '../server/core/validators';
import { importCatalogRows } from '../server/core/catalogSeeder';
import { getMongoUri } from '../server/config/mongo';

dotenv.config();

async function main() {
  const filePath = process.env.SEED_DATA_PATH || path.resolve(__dirname, '../data/product-families.json');
  const payload = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  const rows = catalogImportSchema.parse(payload);

  await mongoose.connect(getMongoUri());

  const summary = await importCatalogRows(rows);

  console.log(`Seed completed: ${summary.length} product families seeded across MongoDB and PostgreSQL.`);
  if (summary.length === 0) {
    console.warn('No catalog rows were imported.');
  }

  await mongoose.disconnect();
}

main().catch(async (error) => {
  console.error('Catalog seed failed:', error);
  await mongoose.disconnect().catch(() => undefined);
  process.exit(1);
});
