-- DropForeignKey
ALTER TABLE "LessonRubricCriteria" DROP CONSTRAINT "LessonRubricCriteria_rubricId_fkey";

-- AlterTable
ALTER TABLE "LessonRubricCriteria"
    ALTER COLUMN "rubricId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "LessonRubricCriteria"
    ADD CONSTRAINT "LessonRubricCriteria_rubricId_fkey" FOREIGN KEY ("rubricId") REFERENCES "LessonRubric" ("id") ON DELETE SET NULL ON UPDATE CASCADE;
