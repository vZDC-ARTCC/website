/*
  Warnings:

  - Added the required column `closed` to the `IncidentReport` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "IncidentReport"
    ADD COLUMN "closed" BOOLEAN NOT NULL;
