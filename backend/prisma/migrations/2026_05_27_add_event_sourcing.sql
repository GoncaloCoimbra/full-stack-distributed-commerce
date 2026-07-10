/**
 * Prisma Migration - Event Sourcing e WORM Auditoria
 * 
 * Execute com:
 * npx prisma migrate dev --name add_event_sourcing_and_audit
 */

-- CreateTable order_events (Event Store)
CREATE TABLE "order_events" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "order_id" TEXT NOT NULL,
  "event_type" TEXT NOT NULL,
  "aggregate_version" INTEGER NOT NULL,
  "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "actor" JSONB NOT NULL,
  "data" JSONB NOT NULL,
  "metadata" JSONB,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT "fk_order_events_order_id" FOREIGN KEY ("order_id")
    REFERENCES "Order"("id") ON DELETE CASCADE
);

-- CreateIndex para queries rápidas por order_id e timestamp
CREATE INDEX "idx_order_events_order_id" ON "order_events"("order_id");
CREATE INDEX "idx_order_events_timestamp" ON "order_events"("timestamp" DESC);
CREATE INDEX "idx_order_events_event_type" ON "order_events"("event_type");

-- CreateTable audit_logs (Write-Once Read-Many)
CREATE TABLE "audit_logs" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "user_id" TEXT NOT NULL,
  "action" TEXT NOT NULL,
  "resource_type" TEXT NOT NULL,
  "resource_id" TEXT NOT NULL,
  "old_value" JSONB,
  "new_value" JSONB,
  "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "ip_address" TEXT,
  "user_agent" TEXT,
  "status" TEXT NOT NULL DEFAULT 'success',
  
  CONSTRAINT "fk_audit_logs_user_id" FOREIGN KEY ("user_id")
    REFERENCES "User"("id") ON DELETE SET NULL
);

-- CreateIndex para auditoria rápida
CREATE INDEX "idx_audit_logs_user_id" ON "audit_logs"("user_id");
CREATE INDEX "idx_audit_logs_timestamp" ON "audit_logs"("timestamp" DESC);
CREATE INDEX "idx_audit_logs_resource" ON "audit_logs"("resource_type", "resource_id");

-- CREATE TRIGGER para WORM (Write-Once Read-Many) na tabela de auditoria
-- Rejeita qualquer UPDATE ou DELETE
CREATE OR REPLACE FUNCTION prevent_audit_modification() RETURNS TRIGGER AS $$
BEGIN
  RAISE EXCEPTION 'Audit logs are immutable and cannot be modified';
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER audit_logs_immutable
BEFORE UPDATE OR DELETE ON audit_logs
FOR EACH ROW
EXECUTE FUNCTION prevent_audit_modification();

-- CreateTable untuk Índices Parciais
-- Index parcial para encomendas pendentes de ESCOLAS (otimização específica)
CREATE INDEX "idx_pending_school_orders" ON "Order"("user_id", "status") 
WHERE "status" = 'pending' AND "user_id" IN (
  SELECT "id" FROM "User" WHERE "role" = 'b2b_school'
);

-- Index parcial para pagamentos recentes com falha
CREATE INDEX "idx_failed_payments_recent" ON "Order"("payment_status", "updated_at")
WHERE "payment_status" = 'failed' AND "updated_at" > NOW() - INTERVAL '7 days';
