-- AlterTable
ALTER TABLE "User"
    ADD COLUMN "primaryTrainerId" TEXT;

-- CreateTable
CREATE TABLE "TrainerRequest"
(
    "id"        TEXT NOT NULL,
    "studentId" TEXT NOT NULL,

    CONSTRAINT "TrainerRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_AssignedOthers"
(
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_InterestedTrainers"
(
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "TrainerRequest_studentId_key" ON "TrainerRequest" ("studentId");

-- CreateIndex
CREATE UNIQUE INDEX "_AssignedOthers_AB_unique" ON "_AssignedOthers" ("A", "B");

-- CreateIndex
CREATE INDEX "_AssignedOthers_B_index" ON "_AssignedOthers" ("B");

-- CreateIndex
CREATE UNIQUE INDEX "_InterestedTrainers_AB_unique" ON "_InterestedTrainers" ("A", "B");

-- CreateIndex
CREATE INDEX "_InterestedTrainers_B_index" ON "_InterestedTrainers" ("B");

-- AddForeignKey
ALTER TABLE "User"
    ADD CONSTRAINT "User_primaryTrainerId_fkey" FOREIGN KEY ("primaryTrainerId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrainerRequest"
    ADD CONSTRAINT "TrainerRequest_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AssignedOthers"
    ADD CONSTRAINT "_AssignedOthers_A_fkey" FOREIGN KEY ("A") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AssignedOthers"
    ADD CONSTRAINT "_AssignedOthers_B_fkey" FOREIGN KEY ("B") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_InterestedTrainers"
    ADD CONSTRAINT "_InterestedTrainers_A_fkey" FOREIGN KEY ("A") REFERENCES "TrainerRequest" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_InterestedTrainers"
    ADD CONSTRAINT "_InterestedTrainers_B_fkey" FOREIGN KEY ("B") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE;
