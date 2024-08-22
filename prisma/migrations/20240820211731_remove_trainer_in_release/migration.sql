/*
  Warnings:

  - You are about to drop the column `trainerId` on the `TrainerReleaseRequest` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "TrainerReleaseRequest" DROP CONSTRAINT "TrainerReleaseRequest_trainerId_fkey";

-- AlterTable
ALTER TABLE "TrainerReleaseRequest" DROP COLUMN "trainerId";
