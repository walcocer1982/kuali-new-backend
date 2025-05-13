/*
  Warnings:

  - The values [PENDIENTE,ENVIADO,ENTREGADO,LEIDO,RESPONDIDO,FALLIDO] on the enum `ContactStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ContactStatus_new" AS ENUM ('PENDING', 'SENT', 'DELIVERED', 'READ', 'REPLIED', 'FAILED');
ALTER TABLE "Contact_Log" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Contact_Log" ALTER COLUMN "status" TYPE "ContactStatus_new" USING ("status"::text::"ContactStatus_new");
ALTER TYPE "ContactStatus" RENAME TO "ContactStatus_old";
ALTER TYPE "ContactStatus_new" RENAME TO "ContactStatus";
DROP TYPE "ContactStatus_old";
ALTER TABLE "Contact_Log" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;

-- AlterTable
ALTER TABLE "Contact_Log" ALTER COLUMN "status" SET DEFAULT 'PENDING';
