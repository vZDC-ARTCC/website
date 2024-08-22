/*
  Warnings:

  - You are about to drop the column `primaryTrainerId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `TrainerRequest` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_AssignedOthers` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_InterestedTrainers` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "TrainerRequest" DROP CONSTRAINT "TrainerRequest_studentId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_primaryTrainerId_fkey";

-- DropForeignKey
ALTER TABLE "_AssignedOthers" DROP CONSTRAINT "_AssignedOthers_A_fkey";

-- DropForeignKey
ALTER TABLE "_AssignedOthers" DROP CONSTRAINT "_AssignedOthers_B_fkey";

-- DropForeignKey
ALTER TABLE "_InterestedTrainers" DROP CONSTRAINT "_InterestedTrainers_A_fkey";

-- DropForeignKey
ALTER TABLE "_InterestedTrainers" DROP CONSTRAINT "_InterestedTrainers_B_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "primaryTrainerId",
ADD COLUMN     "noRequestTrainerRelease" BOOLEAN,
ADD COLUMN     "noRequestTrainingAssignments" BOOLEAN;

-- DropTable
DROP TABLE "TrainerRequest";

-- DropTable
DROP TABLE "_AssignedOthers";

-- DropTable
DROP TABLE "_InterestedTrainers";

-- CreateTable
CREATE TABLE "TrainingAssignment"
(
    "id"               TEXT NOT NULL,
    "studentId"        TEXT NOT NULL,
    "primaryTrainerId" TEXT NOT NULL,

    CONSTRAINT "TrainingAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrainingAssignmentRequest"
(
    "id"        TEXT NOT NULL,
    "studentId" TEXT NOT NULL,

    CONSTRAINT "TrainingAssignmentRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrainerReleaseRequest"
(
    "id"        TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "trainerId" TEXT NOT NULL,

    CONSTRAINT "TrainerReleaseRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_TrainingAssignmentOtherTrainers"
(
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_TrainingAssignmentRequestInterestedTrainers"
(
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "TrainingAssignment_studentId_key" ON "TrainingAssignment" ("studentId");

-- CreateIndex
CREATE UNIQUE INDEX "TrainingAssignmentRequest_studentId_key" ON "TrainingAssignmentRequest" ("studentId");

-- CreateIndex
CREATE UNIQUE INDEX "TrainerReleaseRequest_studentId_key" ON "TrainerReleaseRequest" ("studentId");

-- CreateIndex
CREATE UNIQUE INDEX "_TrainingAssignmentOtherTrainers_AB_unique" ON "_TrainingAssignmentOtherTrainers" ("A", "B");

-- CreateIndex
CREATE INDEX "_TrainingAssignmentOtherTrainers_B_index" ON "_TrainingAssignmentOtherTrainers" ("B");

-- CreateIndex
CREATE UNIQUE INDEX "_TrainingAssignmentRequestInterestedTrainers_AB_unique" ON "_TrainingAssignmentRequestInterestedTrainers" ("A", "B");

-- CreateIndex
CREATE INDEX "_TrainingAssignmentRequestInterestedTrainers_B_index" ON "_TrainingAssignmentRequestInterestedTrainers" ("B");

-- AddForeignKey
ALTER TABLE "TrainingAssignment"
    ADD CONSTRAINT "TrainingAssignment_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrainingAssignment"
    ADD CONSTRAINT "TrainingAssignment_primaryTrainerId_fkey" FOREIGN KEY ("primaryTrainerId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrainingAssignmentRequest"
    ADD CONSTRAINT "TrainingAssignmentRequest_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrainerReleaseRequest"
    ADD CONSTRAINT "TrainerReleaseRequest_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrainerReleaseRequest"
    ADD CONSTRAINT "TrainerReleaseRequest_trainerId_fkey" FOREIGN KEY ("trainerId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TrainingAssignmentOtherTrainers"
    ADD CONSTRAINT "_TrainingAssignmentOtherTrainers_A_fkey" FOREIGN KEY ("A") REFERENCES "TrainingAssignment" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TrainingAssignmentOtherTrainers"
    ADD CONSTRAINT "_TrainingAssignmentOtherTrainers_B_fkey" FOREIGN KEY ("B") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TrainingAssignmentRequestInterestedTrainers"
    ADD CONSTRAINT "_TrainingAssignmentRequestInterestedTrainers_A_fkey" FOREIGN KEY ("A") REFERENCES "TrainingAssignmentRequest" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TrainingAssignmentRequestInterestedTrainers"
    ADD CONSTRAINT "_TrainingAssignmentRequestInterestedTrainers_B_fkey" FOREIGN KEY ("B") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE;
