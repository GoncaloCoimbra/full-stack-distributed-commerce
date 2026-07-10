#!/bin/bash
set -e

docker compose --env-file .env.staging -f docker-compose.prod.yml -f docker-compose.staging.yml down -v

echo "Staging environment stopped."
