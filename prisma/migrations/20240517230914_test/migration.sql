-- CreateTable
CREATE TABLE "Event"
(
    "id"          TEXT         NOT NULL,
    "name"        TEXT         NOT NULL,
    "description" TEXT         NOT NULL,
    "start"       TIMESTAMP(3) NOT NULL,
    "end"         TIMESTAMP(3) NOT NULL,
    "external"    BOOLEAN      NOT NULL,
    "host"        TEXT,
    "bannerUrl"   TEXT         NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventPosition"
(
    "id"        TEXT NOT NULL,
    "eventId"   TEXT NOT NULL,
    "position"  TEXT NOT NULL,
    "signupCap" INTEGER,

    CONSTRAINT "EventPosition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_EventPositionToUser"
(
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_EventPositionToUser_AB_unique" ON "_EventPositionToUser" ("A", "B");

-- CreateIndex
CREATE INDEX "_EventPositionToUser_B_index" ON "_EventPositionToUser" ("B");

-- AddForeignKey
ALTER TABLE "EventPosition"
    ADD CONSTRAINT "EventPosition_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EventPositionToUser"
    ADD CONSTRAINT "_EventPositionToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "EventPosition" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EventPositionToUser"
    ADD CONSTRAINT "_EventPositionToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE;
