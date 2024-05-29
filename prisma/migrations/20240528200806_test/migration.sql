/*
  Warnings:

  - A unique constraint covering the columns `[certificationOption,userId]` on the table `Certification` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Certification_certificationOption_userId_key" ON "Certification" ("certificationOption", "userId");
