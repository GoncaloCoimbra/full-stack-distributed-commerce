import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('=== DATA VERIFICATION ===\n');

  // 1. Count AuditLogs
  const auditLogCount = await prisma.auditLog.count();
  console.log(`Total History Records (AuditLog): ${auditLogCount}`);

  if (auditLogCount > 0) {
    const auditLogs = await prisma.auditLog.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { email: true } },
        company: { select: { name: true } },
      },
    });
    console.log('Last 5 history records:');
    auditLogs.forEach((log, idx) => {
      console.log(
        `  ${idx + 1}. [${log.action}] ${log.entity} by ${log.user.email} at ${log.createdAt}`
      );
    });
  } else {
    console.log('No history records found!');
  }

  console.log('\n---\n');

  // 2. Count Notifications
  const notificationCount = await prisma.notification.count();
  console.log(`Total Notifications: ${notificationCount}`);

  if (notificationCount > 0) {
    const notifications = await prisma.notification.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { email: true } },
        company: { select: { name: true } },
      },
    });
    console.log(' Last 5 notifications:');
    notifications.forEach((notif, idx) => {
      console.log(
        `  ${idx + 1}. [${notif.isRead ? '📖' : '📬'}] ${notif.title} to ${notif.user.email} at ${notif.createdAt}`
      );
    });
  } else {
    console.log('No notification found!');
  }

  console.log('\n---\n');

  // 3. Contar ProductMovements
  const movementCount = await prisma.productMovement.count();
  console.log(` Total Product Movements: ${movementCount}`);

  if (movementCount > 0) {
    const movements = await prisma.productMovement.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        product: { select: { internalCode: true } },
        user: { select: { email: true } },
      },
    });
    console.log(' Last 5 movements:');
    movements.forEach((mov, idx) => {
      console.log(
        `  ${idx + 1}. product ${mov.product.internalCode}: ${mov.previousStatus} → ${mov.newStatus} at ${mov.createdAt}`
      );
    });
  } else {
    console.log('No movement found!');
  }

  console.log('\n=== RESUMO ===');
  console.log(`✓ AuditLogs: ${auditLogCount}`);
  console.log(`✓ Notifications: ${notificationCount}`);
  console.log(`✓ Movements: ${movementCount}`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
