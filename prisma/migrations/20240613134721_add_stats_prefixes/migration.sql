-- CreateTable
CREATE TABLE "StatisticsPrefixes"
(
    "id"       TEXT NOT NULL,
    "prefixes" TEXT[],

    CONSTRAINT "StatisticsPrefixes_pkey" PRIMARY KEY ("id")
);
