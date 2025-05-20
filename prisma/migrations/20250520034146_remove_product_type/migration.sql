/*
  Warnings:

  - You are about to drop the column `type` on the `Product` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `Product` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Product_name_type_key";

-- DropIndex
DROP INDEX "Product_type_idx";

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "type";

-- CreateIndex
CREATE UNIQUE INDEX "Product_name_key" ON "Product"("name");
