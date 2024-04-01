/*
  Warnings:

  - Added the required column `submittedAt` to the `Feedback` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Feedback"
    ADD COLUMN "decidedAt" TIMESTAMP(3),
ADD COLUMN     "submittedAt" TIMESTAMP(3) NOT NULL;
