/*
  Warnings:

  - You are about to drop the column `lessonRubricId` on the `Lesson` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[rubricId]` on the table `Lesson` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Lesson" DROP CONSTRAINT "Lesson_lessonRubricId_fkey";

-- DropIndex
DROP INDEX "Lesson_lessonRubricId_key";

-- AlterTable
ALTER TABLE "Lesson" DROP COLUMN "lessonRubricId";

-- CreateIndex
CREATE UNIQUE INDEX "Lesson_rubricId_key" ON "Lesson" ("rubricId");

-- AddForeignKey
ALTER TABLE "Lesson"
    ADD CONSTRAINT "Lesson_rubricId_fkey" FOREIGN KEY ("rubricId") REFERENCES "LessonRubric" ("id") ON DELETE SET NULL ON UPDATE CASCADE;
