-- DropForeignKey
ALTER TABLE "LessonRubricCell" DROP CONSTRAINT "LessonRubricCell_criteriaId_fkey";

-- AddForeignKey
ALTER TABLE "LessonRubricCell" ADD CONSTRAINT "LessonRubricCell_criteriaId_fkey" FOREIGN KEY ("criteriaId") REFERENCES "LessonRubricCriteria"("id") ON DELETE CASCADE ON UPDATE CASCADE;
