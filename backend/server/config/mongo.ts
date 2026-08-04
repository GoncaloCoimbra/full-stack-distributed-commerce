export function getMongoUri(): string {
  return process.env.MONGODB_URI || 'mongodb://localhost:27017/tranzor_test';
}
