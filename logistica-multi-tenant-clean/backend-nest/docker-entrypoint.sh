#!/bin/sh
set -e

# Run migrations
npx prisma migrate deploy
# Seed database
npm run seed
# Start the server
exec "$@"
