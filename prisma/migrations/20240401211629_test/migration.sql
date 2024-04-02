-- CreateTable
CREATE TABLE "TraconGroup"
(
    "id"   TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "TraconGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Airport"
(
    "id"            TEXT NOT NULL,
    "icao"          TEXT NOT NULL,
    "name"          TEXT NOT NULL,
    "city"          TEXT NOT NULL,
    "traconGroupId" TEXT NOT NULL,

    CONSTRAINT "Airport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Runway"
(
    "id"        TEXT NOT NULL,
    "name"      TEXT NOT NULL,
    "airportId" TEXT NOT NULL,

    CONSTRAINT "Runway_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RunwayInstruction"
(
    "id"        TEXT NOT NULL,
    "name"      TEXT NOT NULL,
    "runwayId"  TEXT NOT NULL,
    "route"     TEXT NOT NULL,
    "procedure" TEXT NOT NULL,

    CONSTRAINT "RunwayInstruction_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Airport"
    ADD CONSTRAINT "Airport_traconGroupId_fkey" FOREIGN KEY ("traconGroupId") REFERENCES "TraconGroup" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Runway"
    ADD CONSTRAINT "Runway_airportId_fkey" FOREIGN KEY ("airportId") REFERENCES "Airport" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RunwayInstruction"
    ADD CONSTRAINT "RunwayInstruction_runwayId_fkey" FOREIGN KEY ("runwayId") REFERENCES "Runway" ("id") ON DELETE CASCADE ON UPDATE CASCADE;
