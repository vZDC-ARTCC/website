-- AlterTable
ALTER TABLE "TrainingProgression"
    ADD COLUMN "nextProgressionId" TEXT;

-- AddForeignKey
ALTER TABLE "TrainingProgression"
    ADD CONSTRAINT "TrainingProgression_nextProgressionId_fkey" FOREIGN KEY ("nextProgressionId") REFERENCES "TrainingProgression" ("id") ON DELETE SET NULL ON UPDATE CASCADE;
