/*
  Warnings:

  - Added the required column `passed` to the `TrainingTicket` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TrainingSession"
    ADD COLUMN "additionalComments" TEXT,
ADD COLUMN     "trainerComments" TEXT;

-- AlterTable
ALTER TABLE "TrainingTicket"
    ADD COLUMN "passed" BOOLEAN NOT NULL;
