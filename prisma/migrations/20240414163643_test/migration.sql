/*
  Warnings:

  - You are about to drop the column `pilotCid` on the `Feedback` table. All the data in the column will be lost.
  - You are about to drop the column `pilotEmail` on the `Feedback` table. All the data in the column will be lost.
  - You are about to drop the column `pilotName` on the `Feedback` table. All the data in the column will be lost.
  - Added the required column `pilotId` to the `Feedback` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Feedback" DROP CONSTRAINT "Feedback_controllerId_fkey";

-- DropForeignKey
ALTER TABLE "VisitorApplication" DROP CONSTRAINT "VisitorApplication_userId_fkey";

-- AlterTable
ALTER TABLE "Feedback" DROP COLUMN "pilotCid",
DROP
COLUMN "pilotEmail",
DROP
COLUMN "pilotName",
ADD COLUMN     "pilotId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "VisitorApplication"
    ADD CONSTRAINT "VisitorApplication_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feedback"
    ADD CONSTRAINT "Feedback_pilotId_fkey" FOREIGN KEY ("pilotId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feedback"
    ADD CONSTRAINT "Feedback_controllerId_fkey" FOREIGN KEY ("controllerId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE;
