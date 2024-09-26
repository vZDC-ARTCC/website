/*
  Warnings:

  - Added the required column `submittedAt` to the `TrainerReleaseRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `submittedAt` to the `TrainingAssignmentRequest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TrainerReleaseRequest"
    ADD COLUMN "submittedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "TrainingAssignmentRequest"
    ADD COLUMN "submittedAt" TIMESTAMP(3) NOT NULL;
