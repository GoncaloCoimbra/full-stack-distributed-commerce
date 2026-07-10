E2E tests (Nest)

- Ensure a PostgreSQL database is available and `DATABASE_URL` is set in your environment (or in a .env file).
- Install dev dependencies: `npm install` (from `backend-nest/`)
- Run the e2e tests: `npm run test:e2e`

Note on DB schema changes:
- After pulling changes you may need to apply the new Prisma migration (adds `RefreshToken` model):

  ```bash
  npx prisma migrate dev --name add_refresh_tokens
  npx prisma generate
  ```


Notes:
- Tests will be skipped automatically if `DATABASE_URL` is not set.
- Tests perform cleanup by deleting the created test company.
