/*
  Warnings:

  - You are about to drop the `ConversationStep` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `steps` to the `Template` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ConversationStep" DROP CONSTRAINT "ConversationStep_templateId_fkey";

-- AlterTable
ALTER TABLE "Template" ADD COLUMN     "steps" JSONB NOT NULL;

-- DropTable
DROP TABLE "ConversationStep";
