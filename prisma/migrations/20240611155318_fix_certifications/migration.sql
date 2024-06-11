/*
  Warnings:

  - A unique constraint covering the columns `[certificationTypeId,userId]` on the table `Certification` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Certification_certificationOption_userId_key";

-- CreateIndex
CREATE UNIQUE INDEX "Certification_certificationTypeId_userId_key" ON "Certification" ("certificationTypeId", "userId");
