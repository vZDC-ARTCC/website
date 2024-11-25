-- AlterTable
ALTER TABLE "TrainingProgression"
    ADD COLUMN "autoAssignNewHomeObs" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "autoAssignNewVisitor" BOOLEAN NOT NULL DEFAULT false;
