/*
  Warnings:

  - Added the required column `status` to the `Feedback` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "FeedbackStatus" AS ENUM ('PENDING', 'RELEASED', 'STASHED');

-- AlterTable
ALTER TABLE "Feedback"
    ADD COLUMN "staffComments" TEXT,
ADD COLUMN     "status" "FeedbackStatus" NOT NULL;
