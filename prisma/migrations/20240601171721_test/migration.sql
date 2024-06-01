/*
  Warnings:

  - You are about to drop the column `passed` on the `TrainingTicket` table. All the data in the column will be lost.
  - Added the required column `passing` to the `LessonRubricCriteria` table without a default value. This is not possible if the table is not empty.
  - Added the required column `passed` to the `RubricCriteraScore` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "LessonRubricCriteria"
    ADD COLUMN "passing" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "RubricCriteraScore"
    ADD COLUMN "passed" BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE "TrainingTicket" DROP COLUMN "passed";
