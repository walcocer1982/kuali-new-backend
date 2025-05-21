/*
  Warnings:

  - A unique constraint covering the columns `[whatsappId]` on the table `Lead` will be added. If there are existing duplicate values, this will fail.
  - Made the column `type` on table `Template` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Interaction" ADD COLUMN     "messageId" TEXT,
ADD COLUMN     "whatsappStatus" TEXT;

-- AlterTable
ALTER TABLE "Lead" ADD COLUMN     "lastMessageAt" TIMESTAMP(3),
ADD COLUMN     "whatsappId" TEXT;

-- AlterTable
ALTER TABLE "Template" ALTER COLUMN "type" SET NOT NULL;

-- CreateIndex
CREATE INDEX "Interaction_leadId_idx" ON "Interaction"("leadId");

-- CreateIndex
CREATE INDEX "Interaction_scheduledAt_idx" ON "Interaction"("scheduledAt");

-- CreateIndex
CREATE INDEX "Interaction_type_idx" ON "Interaction"("type");

-- CreateIndex
CREATE UNIQUE INDEX "Lead_whatsappId_key" ON "Lead"("whatsappId");

-- CreateIndex
CREATE INDEX "Lead_phoneNumber_idx" ON "Lead"("phoneNumber");

-- CreateIndex
CREATE INDEX "Lead_whatsappId_idx" ON "Lead"("whatsappId");
