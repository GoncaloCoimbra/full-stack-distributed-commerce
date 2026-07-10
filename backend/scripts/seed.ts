import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import { PrismaClient } from '@prisma/client';
import { catalogImportSchema } from '../server/core/validators';
import { importCatalogRows } from '../server/core/catalogSeeder';

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  const filePath = process.env.SEED_DATA_PATH || path.resolve(__dirname, '../data/product-families.json');
  const payload = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  const rows = catalogImportSchema.parse(payload);

  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/Tranzor');
  await prisma.$connect();

  const summary = await importCatalogRows(rows);

  console.log(`Seed completed: ${summary.length} product families seeded across MongoDB and PostgreSQL.`);

  await mongoose.disconnect();
  await prisma.$disconnect();
}

main().catch(async (error) => {
  console.error('Catalog seed failed:', error);
  await mongoose.disconnect().catch(() => undefined);
  await prisma.$disconnect().catch(() => undefined);
  process.exit(1);
});
