-- CreateTable
CREATE TABLE "StaffingRequest"
(
    "id"          TEXT NOT NULL,
    "userId"      TEXT NOT NULL,
    "name"        TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "StaffingRequest_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "StaffingRequest"
    ADD CONSTRAINT "StaffingRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE;
