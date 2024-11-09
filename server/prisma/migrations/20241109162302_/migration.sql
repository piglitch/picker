/*
  Warnings:

  - A unique constraint covering the columns `[key]` on the table `File` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "File_key_key" ON "File"("key");
