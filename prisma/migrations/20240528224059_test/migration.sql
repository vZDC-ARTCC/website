/*
  Warnings:

  - Made the column `rubricId` on table `LessonRubricCriteria` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "LessonRubricCriteria" DROP CONSTRAINT "LessonRubricCriteria_rubricId_fkey";

-- AlterTable
ALTER TABLE "Lesson"
    ALTER COLUMN "rubricId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "LessonRubricCriteria"
    ALTER COLUMN "rubricId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "LessonRubricCriteria"
    ADD CONSTRAINT "LessonRubricCriteria_rubricId_fkey" FOREIGN KEY ("rubricId") REFERENCES "LessonRubric" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;
