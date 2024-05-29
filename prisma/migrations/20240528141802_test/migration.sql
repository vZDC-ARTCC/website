-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "LogModel" ADD VALUE 'LESSON';
ALTER TYPE "LogModel" ADD VALUE 'COMMON_MISTAKE';
ALTER TYPE "LogModel" ADD VALUE 'LESSON_RUBRIC';
ALTER TYPE "LogModel" ADD VALUE 'TRAINING_SESSION';

-- CreateTable
CREATE TABLE "Lesson"
(
    "id"             TEXT         NOT NULL,
    "identifier"     TEXT         NOT NULL,
    "name"           TEXT         NOT NULL,
    "description"    TEXT         NOT NULL,
    "facility"       TEXT         NOT NULL,
    "rubricId"       TEXT         NOT NULL,
    "updatedAt"      TIMESTAMP(3) NOT NULL,
    "lessonRubricId" TEXT         NOT NULL,

    CONSTRAINT "Lesson_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LessonRubric"
(
    "id" TEXT NOT NULL,

    CONSTRAINT "LessonRubric_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LessonRubricCriteria"
(
    "id"          TEXT    NOT NULL,
    "rubricId"    TEXT    NOT NULL,
    "criteria"    TEXT    NOT NULL,
    "description" TEXT    NOT NULL,
    "maxPoints"   INTEGER NOT NULL,

    CONSTRAINT "LessonRubricCriteria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LessonRubricCell"
(
    "id"          TEXT    NOT NULL,
    "criteriaId"  TEXT    NOT NULL,
    "points"      INTEGER NOT NULL,
    "description" TEXT    NOT NULL,

    CONSTRAINT "LessonRubricCell_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommonMistake"
(
    "id"               TEXT NOT NULL,
    "name"             TEXT NOT NULL,
    "description"      TEXT NOT NULL,
    "trainingTicketId" TEXT,

    CONSTRAINT "CommonMistake_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrainingSession"
(
    "id"           TEXT         NOT NULL,
    "studentId"    TEXT         NOT NULL,
    "instructorId" TEXT         NOT NULL,
    "start"        TIMESTAMP(3) NOT NULL,
    "end"          TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TrainingSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrainingTicket"
(
    "id"        TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "lessonId"  TEXT NOT NULL,

    CONSTRAINT "TrainingTicket_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RubricCriteraScore"
(
    "id"               TEXT NOT NULL,
    "criteriaId"       TEXT NOT NULL,
    "cellId"           TEXT NOT NULL,
    "trainingTicketId" TEXT,

    CONSTRAINT "RubricCriteraScore_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Lesson_lessonRubricId_key" ON "Lesson" ("lessonRubricId");

-- AddForeignKey
ALTER TABLE "Lesson"
    ADD CONSTRAINT "Lesson_lessonRubricId_fkey" FOREIGN KEY ("lessonRubricId") REFERENCES "LessonRubric" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LessonRubricCriteria"
    ADD CONSTRAINT "LessonRubricCriteria_rubricId_fkey" FOREIGN KEY ("rubricId") REFERENCES "LessonRubric" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LessonRubricCell"
    ADD CONSTRAINT "LessonRubricCell_criteriaId_fkey" FOREIGN KEY ("criteriaId") REFERENCES "LessonRubricCriteria" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommonMistake"
    ADD CONSTRAINT "CommonMistake_trainingTicketId_fkey" FOREIGN KEY ("trainingTicketId") REFERENCES "TrainingTicket" ("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrainingSession"
    ADD CONSTRAINT "trainingSessions" FOREIGN KEY ("studentId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrainingSession"
    ADD CONSTRAINT "trainingSessionsGiven" FOREIGN KEY ("instructorId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrainingTicket"
    ADD CONSTRAINT "TrainingTicket_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "TrainingSession" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrainingTicket"
    ADD CONSTRAINT "TrainingTicket_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RubricCriteraScore"
    ADD CONSTRAINT "RubricCriteraScore_criteriaId_fkey" FOREIGN KEY ("criteriaId") REFERENCES "LessonRubricCriteria" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RubricCriteraScore"
    ADD CONSTRAINT "RubricCriteraScore_cellId_fkey" FOREIGN KEY ("cellId") REFERENCES "LessonRubricCell" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RubricCriteraScore"
    ADD CONSTRAINT "RubricCriteraScore_trainingTicketId_fkey" FOREIGN KEY ("trainingTicketId") REFERENCES "TrainingTicket" ("id") ON DELETE SET NULL ON UPDATE CASCADE;
