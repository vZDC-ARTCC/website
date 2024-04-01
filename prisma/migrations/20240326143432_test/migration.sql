/*
  Warnings:

  - Added the required column `rating` to the `VisitorApplication` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "VisitorApplication"
    ADD COLUMN "rating" TEXT NOT NULL;
