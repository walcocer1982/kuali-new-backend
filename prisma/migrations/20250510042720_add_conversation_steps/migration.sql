-- CreateEnum
CREATE TYPE "LeadStatus" AS ENUM ('NUEVO', 'CONTACTADO', 'INTERESADO', 'CALIFICADO', 'OPORTUNIDAD', 'CERRADO', 'DESCARTADO');

-- CreateEnum
CREATE TYPE "ContactStatus" AS ENUM ('PENDIENTE', 'ENVIADO', 'ENTREGADO', 'LEIDO', 'RESPONDIDO', 'FALLIDO');

-- CreateTable
CREATE TABLE "Company" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sector" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lead" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT,
    "linkedinUrl" TEXT,
    "role" TEXT,
    "seniority" TEXT,
    "status" "LeadStatus" NOT NULL DEFAULT 'NUEVO',
    "companyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Template" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Template_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contact_Log" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Contact_Log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConversationStep" (
    "id" TEXT NOT NULL,
    "product" TEXT NOT NULL,
    "stepName" TEXT NOT NULL,
    "sellerScript" TEXT NOT NULL,
    "clientReply" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ConversationStep_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Lead_email_key" ON "Lead"("email");

-- AddForeignKey
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contact_Log" ADD CONSTRAINT "Contact_Log_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contact_Log" ADD CONSTRAINT "Contact_Log_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "Template"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConversationStep" ADD CONSTRAINT "ConversationStep_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "Template"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
