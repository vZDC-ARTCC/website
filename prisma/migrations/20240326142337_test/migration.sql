-- CreateEnum
CREATE TYPE "VisitorApplicationStatus" AS ENUM ('PENDING', 'APPROVED', 'DENIED');

-- CreateTable
CREATE TABLE "VisitorApplication"
(
    "id"           TEXT                       NOT NULL,
    "firstName"    TEXT                       NOT NULL,
    "lastName"     TEXT                       NOT NULL,
    "email"        TEXT                       NOT NULL,
    "cid"          TEXT                       NOT NULL,
    "homeFacility" TEXT                       NOT NULL,
    "whyVisit"     TEXT                       NOT NULL,
    "submittedAt"  TIMESTAMP(3)               NOT NULL,
    "status"       "VisitorApplicationStatus" NOT NULL,

    CONSTRAINT "VisitorApplication_pkey" PRIMARY KEY ("id")
);
