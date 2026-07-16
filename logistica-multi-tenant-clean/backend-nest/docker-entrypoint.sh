#!/bin/sh
set -e

# Run migrations
npx prisma migrate deploy

# Seed database only if TS seed script is supported or a JS seed file exists
if [ -f "/app/prisma/seed.ts" ] && command -v ts-node >/dev/null 2>&1; then
  npm run seed
elif [ -f "/app/dist/prisma/seed.js" ]; then
  node /app/dist/prisma/seed.js
else
  echo "Skipping seed: no supported seed script available"
fi

# Start the server
exec "$@"
