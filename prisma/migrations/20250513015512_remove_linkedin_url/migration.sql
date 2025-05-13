/*
  Warnings:

  - The values [PENDING,SENT,DELIVERED,READ,REPLIED,FAILED] on the enum `ContactStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ContactStatus_new" AS ENUM ('PENDIENTE', 'ENVIADO', 'ENTREGADO', 'LEIDO', 'RESPONDIDO', 'FALLIDO');
ALTER TABLE "Contact_Log" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Contact_Log" ALTER COLUMN "status" TYPE "ContactStatus_new" USING ("status"::text::"ContactStatus_new");
ALTER TYPE "ContactStatus" RENAME TO "ContactStatus_old";
ALTER TYPE "ContactStatus_new" RENAME TO "ContactStatus";
DROP TYPE "ContactStatus_old";
ALTER TABLE "Contact_Log" ALTER COLUMN "status" SET DEFAULT 'PENDIENTE';
COMMIT;

-- DropForeignKey
ALTER TABLE "Contact_Log" DROP CONSTRAINT "Contact_Log_leadId_fkey";

-- DropForeignKey
ALTER TABLE "Contact_Log" DROP CONSTRAINT "Contact_Log_templateId_fkey";

-- DropForeignKey
ALTER TABLE "Lead" DROP CONSTRAINT "Lead_companyId_fkey";

-- DropIndex
DROP INDEX "Lead_email_key";

-- AlterTable
ALTER TABLE "Contact_Log" ALTER COLUMN "status" SET DEFAULT 'PENDIENTE';

-- AddForeignKey
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contact_Log" ADD CONSTRAINT "Contact_Log_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contact_Log" ADD CONSTRAINT "Contact_Log_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "Template"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
