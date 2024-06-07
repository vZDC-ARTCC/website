-- AlterEnum
ALTER TYPE "LogModel" ADD VALUE 'INCIDENT_REPORT';

-- CreateTable
CREATE TABLE "ControllerPosition"
(
    "id"       TEXT         NOT NULL,
    "logId"    TEXT         NOT NULL,
    "position" TEXT         NOT NULL,
    "start"    TIMESTAMP(3) NOT NULL,
    "end"      TIMESTAMP(3),
    "active"   BOOLEAN      NOT NULL,

    CONSTRAINT "ControllerPosition_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ControllerPosition"
    ADD CONSTRAINT "ControllerPosition_logId_fkey" FOREIGN KEY ("logId") REFERENCES "ControllerLog" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;
