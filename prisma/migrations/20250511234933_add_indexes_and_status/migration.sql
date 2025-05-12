-- DropForeignKey
ALTER TABLE "Contact_Log" DROP CONSTRAINT "Contact_Log_leadId_fkey";

-- DropForeignKey
ALTER TABLE "Contact_Log" DROP CONSTRAINT "Contact_Log_templateId_fkey";

-- DropForeignKey
ALTER TABLE "Lead" DROP CONSTRAINT "Lead_companyId_fkey";

-- AlterTable
ALTER TABLE "Contact_Log" ADD COLUMN     "status" "ContactStatus" NOT NULL DEFAULT 'PENDIENTE';

-- AlterTable
ALTER TABLE "Template" ADD COLUMN     "tags" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- CreateIndex
CREATE INDEX "Company_name_idx" ON "Company"("name");

-- CreateIndex
CREATE INDEX "Contact_Log_status_idx" ON "Contact_Log"("status");

-- CreateIndex
CREATE INDEX "Contact_Log_createdAt_idx" ON "Contact_Log"("createdAt");

-- CreateIndex
CREATE INDEX "Lead_status_idx" ON "Lead"("status");

-- CreateIndex
CREATE INDEX "Lead_firstName_lastName_idx" ON "Lead"("firstName", "lastName");

-- CreateIndex
CREATE INDEX "Template_title_idx" ON "Template"("title");

-- CreateIndex
CREATE INDEX "Template_tags_idx" ON "Template"("tags");

-- AddForeignKey
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contact_Log" ADD CONSTRAINT "Contact_Log_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contact_Log" ADD CONSTRAINT "Contact_Log_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "Template"("id") ON DELETE CASCADE ON UPDATE CASCADE;
