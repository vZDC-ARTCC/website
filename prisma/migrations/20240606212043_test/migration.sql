-- CreateTable
CREATE TABLE "IncidentReport"
(
    "id"               TEXT         NOT NULL,
    "reporterId"       TEXT         NOT NULL,
    "reporteeId"       TEXT         NOT NULL,
    "timestamp"        TIMESTAMP(3) NOT NULL,
    "reason"           TEXT         NOT NULL,
    "reporterCallsign" TEXT,
    "reporteeCallsign" TEXT,

    CONSTRAINT "IncidentReport_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "IncidentReport"
    ADD CONSTRAINT "IncidentReport_reporterId_fkey" FOREIGN KEY ("reporterId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IncidentReport"
    ADD CONSTRAINT "IncidentReport_reporteeId_fkey" FOREIGN KEY ("reporteeId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE;
