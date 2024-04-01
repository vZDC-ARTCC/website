-- CreateTable
CREATE TABLE "Feedback"
(
    "id"                 TEXT    NOT NULL,
    "pilotName"          TEXT    NOT NULL,
    "pilotEmail"         TEXT    NOT NULL,
    "pilotCid"           TEXT    NOT NULL,
    "pilotCallsign"      TEXT    NOT NULL,
    "controllerId"       TEXT    NOT NULL,
    "controllerPosition" TEXT    NOT NULL,
    "rating"             INTEGER NOT NULL,
    "comments"           TEXT,

    CONSTRAINT "Feedback_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Feedback"
    ADD CONSTRAINT "Feedback_controllerId_fkey" FOREIGN KEY ("controllerId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;
