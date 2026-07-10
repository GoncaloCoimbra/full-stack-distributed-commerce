-- CreateTable
CREATE TABLE "TransportProduct" (
    "id" TEXT NOT NULL,
    "transportId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TransportProduct_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TransportProduct_transportId_idx" ON "TransportProduct"("transportId");

-- CreateIndex
CREATE INDEX "TransportProduct_productId_idx" ON "TransportProduct"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "TransportProduct_transportId_productId_key" ON "TransportProduct"("transportId", "productId");

-- AddForeignKey
ALTER TABLE "TransportProduct" ADD CONSTRAINT "TransportProduct_transportId_fkey" FOREIGN KEY ("transportId") REFERENCES "Transport"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransportProduct" ADD CONSTRAINT "TransportProduct_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
