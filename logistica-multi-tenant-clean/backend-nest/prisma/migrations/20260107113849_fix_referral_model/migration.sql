-- CreateEnum
CREATE TYPE "ReferralStatus" AS ENUM ('NEW', 'CONTACTED', 'CONVERTED', 'LOST');

-- CreateTable
CREATE TABLE "Referral" (
    "id" TEXT NOT NULL,
    "clientName" TEXT NOT NULL,
    "contactInfo" TEXT NOT NULL,
    "referralSource" TEXT NOT NULL,
    "projectType" TEXT NOT NULL,
    "estimatedValue" DOUBLE PRECISION NOT NULL,
    "referralDate" TIMESTAMP(3) NOT NULL,
    "notes" TEXT,
    "referredBy" TEXT NOT NULL,
    "commission" DOUBLE PRECISION,
    "status" "ReferralStatus" NOT NULL DEFAULT 'NEW',
    "companyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Referral_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Referral_companyId_idx" ON "Referral"("companyId");

-- CreateIndex
CREATE INDEX "Referral_status_idx" ON "Referral"("status");

-- AddForeignKey
ALTER TABLE "Referral" ADD CONSTRAINT "Referral_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
