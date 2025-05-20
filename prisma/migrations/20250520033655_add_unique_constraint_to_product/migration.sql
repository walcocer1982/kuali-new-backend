/*
  Warnings:

  - A unique constraint covering the columns `[name,type]` on the table `Product` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE INDEX "Product_type_idx" ON "Product"("type");

-- CreateIndex
CREATE UNIQUE INDEX "Product_name_type_key" ON "Product"("name", "type");
