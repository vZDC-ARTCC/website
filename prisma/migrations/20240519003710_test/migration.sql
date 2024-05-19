/*
  Warnings:

  - Added the required column `bannerKey` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Made the column `bannerUrl` on table `Event` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "bannerKey" TEXT NOT NULL,
ALTER COLUMN "bannerUrl" SET NOT NULL;
