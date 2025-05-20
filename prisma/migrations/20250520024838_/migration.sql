/*
  Warnings:

  - The values [CALL,EMAIL,MEETING,OTHER] on the enum `InteractionType` will be removed. If these variants are still used in the database, this will fail.
  - The values [OPORTUNIDAD] on the enum `LeadStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- CreateEnum
CREATE TYPE "TemplateType" AS ENUM ('BIENVENIDA', 'SEGUIMIENTO', 'CIERRE');

-- CreateEnum
CREATE TYPE "ProductType" AS ENUM ('CV_SCANNER', 'ADMIN_PERSONAS', 'LLAMADAS_AUTOMATIZADAS');

-- AlterEnum
BEGIN;
CREATE TYPE "InteractionType_new" AS ENUM ('LLAMADA', 'CORREO', 'REUNION', 'DEMO', 'WHATSAPP', 'OTRO');
ALTER TABLE "Interaction" ALTER COLUMN "type" TYPE "InteractionType_new" USING ("type"::text::"InteractionType_new");
ALTER TYPE "InteractionType" RENAME TO "InteractionType_old";
ALTER TYPE "InteractionType_new" RENAME TO "InteractionType";
DROP TYPE "InteractionType_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "LeadStatus_new" AS ENUM ('NUEVO', 'CONTACTADO', 'CALIFICADO', 'CLIENTE', 'PERDIDO');
ALTER TABLE "Lead" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Lead" ALTER COLUMN "status" TYPE "LeadStatus_new" USING ("status"::text::"LeadStatus_new");
ALTER TYPE "LeadStatus" RENAME TO "LeadStatus_old";
ALTER TYPE "LeadStatus_new" RENAME TO "LeadStatus";
DROP TYPE "LeadStatus_old";
ALTER TABLE "Lead" ALTER COLUMN "status" SET DEFAULT 'NUEVO';
COMMIT;

-- AlterTable
ALTER TABLE "Template" ADD COLUMN     "productId" TEXT,
ADD COLUMN     "type" "TemplateType";

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" "ProductType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TemplateInteraction" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "type" "TemplateType" NOT NULL,
    "notes" TEXT NOT NULL,
    "result" TEXT NOT NULL,
    "examples" JSONB NOT NULL DEFAULT '[]',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TemplateInteraction_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Template" ADD CONSTRAINT "Template_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TemplateInteraction" ADD CONSTRAINT "TemplateInteraction_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
