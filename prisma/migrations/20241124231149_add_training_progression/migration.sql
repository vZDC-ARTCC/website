-- AlterTable
ALTER TABLE "User"
    ADD COLUMN "trainingProgressionId" TEXT;

-- CreateTable
CREATE TABLE "TrainingProgression"
(
    "id"   TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "TrainingProgression_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrainingProgressionStep"
(
    "id"            TEXT    NOT NULL,
    "order"         INTEGER NOT NULL DEFAULT 0,
    "lessonId"      TEXT    NOT NULL,
    "progressionId" TEXT    NOT NULL,

    CONSTRAINT "TrainingProgressionStep_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TrainingProgressionStep_lessonId_progressionId_key" ON "TrainingProgressionStep" ("lessonId", "progressionId");

-- AddForeignKey
ALTER TABLE "User"
    ADD CONSTRAINT "User_trainingProgressionId_fkey" FOREIGN KEY ("trainingProgressionId") REFERENCES "TrainingProgression" ("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrainingProgressionStep"
    ADD CONSTRAINT "TrainingProgressionStep_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrainingProgressionStep"
    ADD CONSTRAINT "TrainingProgressionStep_progressionId_fkey" FOREIGN KEY ("progressionId") REFERENCES "TrainingProgression" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;
