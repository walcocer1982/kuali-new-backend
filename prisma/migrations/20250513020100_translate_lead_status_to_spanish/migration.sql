-- Traducir el enum LeadStatus a español
BEGIN;
CREATE TYPE "LeadStatus_new" AS ENUM ('NUEVO', 'CONTACTADO', 'CALIFICADO', 'OPORTUNIDAD', 'CLIENTE', 'PERDIDO');
ALTER TABLE "Lead" ALTER COLUMN "status" DROP DEFAULT;
-- Mapear los valores antiguos a los nuevos
ALTER TABLE "Lead" ALTER COLUMN "status" TYPE "LeadStatus_new" USING (
  CASE status::text
    WHEN 'NEW' THEN 'NUEVO'
    WHEN 'CONTACTED' THEN 'CONTACTADO'
    WHEN 'QUALIFIED' THEN 'CALIFICADO'
    WHEN 'OPPORTUNITY' THEN 'OPORTUNIDAD'
    WHEN 'CUSTOMER' THEN 'CLIENTE'
    WHEN 'LOST' THEN 'PERDIDO'
  END::text::"LeadStatus_new"
);
ALTER TYPE "LeadStatus" RENAME TO "LeadStatus_old";
ALTER TYPE "LeadStatus_new" RENAME TO "LeadStatus";
DROP TYPE "LeadStatus_old";
ALTER TABLE "Lead" ALTER COLUMN "status" SET DEFAULT 'NUEVO';
COMMIT; 