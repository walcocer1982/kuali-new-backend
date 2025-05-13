/*
  Warnings:

  - The values [NUEVO,CONTACTADO,INTERESADO,CALIFICADO,OPORTUNIDAD,CERRADO,DESCARTADO] on the enum `LeadStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `linkedinUrl` on the `Lead` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `Lead` table. All the data in the column will be lost.
  - You are about to drop the column `seniority` on the `Lead` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "InteractionType" AS ENUM ('CALL', 'EMAIL', 'MEETING', 'DEMO', 'OTHER');

-- AlterEnum
BEGIN;
CREATE TYPE "LeadStatus_new" AS ENUM ('NEW', 'CONTACTED', 'QUALIFIED', 'OPPORTUNITY', 'CUSTOMER', 'LOST');
ALTER TABLE "Lead" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Lead" ALTER COLUMN "status" TYPE "LeadStatus_new" USING ("status"::text::"LeadStatus_new");
ALTER TYPE "LeadStatus" RENAME TO "LeadStatus_old";
ALTER TYPE "LeadStatus_new" RENAME TO "LeadStatus";
DROP TYPE "LeadStatus_old";
ALTER TABLE "Lead" ALTER COLUMN "status" SET DEFAULT 'NEW';
COMMIT;

-- AlterTable
ALTER TABLE "Lead" DROP COLUMN "linkedinUrl",
DROP COLUMN "role",
DROP COLUMN "seniority",
ADD COLUMN     "acquisitionCost" DECIMAL(65,30),
ADD COLUMN     "annualRevenue" DECIMAL(65,30),
ADD COLUMN     "campaignId" TEXT,
ADD COLUMN     "companyName" TEXT,
ADD COLUMN     "companySize" TEXT,
ADD COLUMN     "industry" TEXT,
ADD COLUMN     "lastContactAt" TIMESTAMP(3),
ADD COLUMN     "leadScore" INTEGER,
ADD COLUMN     "leadSource" TEXT,
ADD COLUMN     "utmCampaign" TEXT,
ADD COLUMN     "utmMedium" TEXT,
ADD COLUMN     "utmSource" TEXT,
ALTER COLUMN "status" SET DEFAULT 'NEW';

-- CreateTable
CREATE TABLE "Interaction" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "type" "InteractionType" NOT NULL,
    "notes" TEXT,
    "result" TEXT,
    "scheduledAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Interaction_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Interaction" ADD CONSTRAINT "Interaction_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
