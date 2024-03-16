/*
  Warnings:

  - You are about to drop the column `staffPosition` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "staffPosition",
ADD COLUMN     "staffPositions" "StaffPosition"[];
