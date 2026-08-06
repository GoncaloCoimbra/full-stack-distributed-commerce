#!/bin/bash
set -e

if [ ! -f .env.staging ]; then
  echo "Missing .env.staging. Copy .env.example to .env.staging and adjust values first."
  exit 1
fi

docker compose --env-file .env.staging -f docker-compose.prod.yml -f docker-compose.staging.yml up -d --build

echo "Staging environment is running. Access: http://localhost:3101/health"
