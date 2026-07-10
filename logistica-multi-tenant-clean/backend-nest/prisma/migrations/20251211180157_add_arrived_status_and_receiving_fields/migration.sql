-- AlterEnum
ALTER TYPE "TransportStatus" ADD VALUE 'ARRIVED';

-- AlterTable
ALTER TABLE "Transport" ADD COLUMN     "actualArrival" TIMESTAMP(3),
ADD COLUMN     "receivedBy" TEXT,
ADD COLUMN     "receivingNotes" TEXT;
