-- CreateTable
CREATE TABLE "SyncTimes"
(
    "id"       TEXT NOT NULL,
    "roster"   TIMESTAMP(3),
    "stats"    TIMESTAMP(3),
    "loas"     TIMESTAMP(3),
    "events"   TIMESTAMP(3),
    "soloCert" TIMESTAMP(3),

    CONSTRAINT "SyncTimes_pkey" PRIMARY KEY ("id")
);
