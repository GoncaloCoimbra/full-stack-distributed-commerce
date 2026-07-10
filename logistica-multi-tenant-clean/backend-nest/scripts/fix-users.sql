-- Fix users without companyId
-- This assumes there's at least one company, or we need to create one

-- First, check if there are companies
SELECT * FROM "Company" LIMIT 1;

-- If no companies, create a default one
INSERT INTO "Company" (id, name, nif, email, phone, address, "isActive", "createdAt", "updatedAt")
VALUES ('default-company-id', 'Default Company', '123456789', 'default@company.com', NULL, NULL, true, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Update users without companyId to use the default company
UPDATE "User" SET "companyId" = 'default-company-id' WHERE "companyId" IS NULL;