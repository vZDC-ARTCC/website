/*
  Warnings:

  - Added the required column `instructorOnly` to the `Lesson` table without a default value. This is not possible if the table is not empty.
  - Added the required column `notifyInstructorOnPass` to the `Lesson` table without a default value. This is not possible if the table is not empty.
  - Added the required column `passed` to the `TrainingTicket` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "RubricCriteraScore" DROP CONSTRAINT "RubricCriteraScore_cellId_fkey";

-- DropForeignKey
ALTER TABLE "RubricCriteraScore" DROP CONSTRAINT "RubricCriteraScore_criteriaId_fkey";

-- DropForeignKey
ALTER TABLE "RubricCriteraScore" DROP CONSTRAINT "RubricCriteraScore_trainingTicketId_fkey";

-- DropForeignKey
ALTER TABLE "TrainingTicket" DROP CONSTRAINT "TrainingTicket_lessonId_fkey";

-- DropForeignKey
ALTER TABLE "TrainingTicket" DROP CONSTRAINT "TrainingTicket_sessionId_fkey";

-- AlterTable
ALTER TABLE "Lesson"
    ADD COLUMN "instructorOnly" BOOLEAN NOT NULL,
ADD COLUMN     "notifyInstructorOnPass" BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE "TrainingTicket"
    ADD COLUMN "passed" BOOLEAN NOT NULL;

-- AddForeignKey
ALTER TABLE "TrainingTicket"
    ADD CONSTRAINT "TrainingTicket_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "TrainingSession" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrainingTicket"
    ADD CONSTRAINT "TrainingTicket_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RubricCriteraScore"
    ADD CONSTRAINT "RubricCriteraScore_criteriaId_fkey" FOREIGN KEY ("criteriaId") REFERENCES "LessonRubricCriteria" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RubricCriteraScore"
    ADD CONSTRAINT "RubricCriteraScore_cellId_fkey" FOREIGN KEY ("cellId") REFERENCES "LessonRubricCell" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RubricCriteraScore"
    ADD CONSTRAINT "RubricCriteraScore_trainingTicketId_fkey" FOREIGN KEY ("trainingTicketId") REFERENCES "TrainingTicket" ("id") ON DELETE CASCADE ON UPDATE CASCADE;
