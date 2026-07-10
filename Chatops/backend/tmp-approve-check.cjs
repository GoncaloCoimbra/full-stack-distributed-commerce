process.env.LOGISTICS_URL = 'http://127.0.0.1:3100';
process.env.REDIS_URL = 'redis://127.0.0.1:6379';
const prismaClient = require('./dist/prismaClient.js');
const { ChatOpsEngine } = require('./dist/chatOpsEngine.js');

prismaClient.prisma.b2BClient = {
  update: async ({ where }) => ({ id: where.id, creditStatus: 'APPROVED' }),
};

(async () => {
  const response = await ChatOpsEngine.handleCommand('/approve-credit company-1', 'tester');
  console.log('response=', response);
})();
