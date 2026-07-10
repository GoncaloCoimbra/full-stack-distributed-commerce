/*
  Warnings:

  - You are about to drop the column `scheduledDate` on the `Transport` table. All the data in the column will be lost.
  - Added the required column `departureDate` to the `Transport` table without a default value. This is not possible if the table is not empty.
  - Added the required column `estimatedArrival` to the `Transport` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalWeight` to the `Transport` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Company" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Transport" DROP COLUMN "scheduledDate",
ADD COLUMN     "departureDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "estimatedArrival" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "totalWeight" DOUBLE PRECISION NOT NULL;
