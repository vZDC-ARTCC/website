-- CreateEnum
CREATE TYPE "ControllerStatus" AS ENUM ('HOME', 'VISITOR');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('CONTROLLER', 'MENTOR', 'INSTRUCTOR', 'STAFF');

-- CreateEnum
CREATE TYPE "StaffPosition" AS ENUM ('ATM', 'DATM', 'TA', 'EC', 'FE', 'WM', 'ATA', 'AWM', 'AEC', 'AFE', 'INS', 'MTR');

-- CreateEnum
CREATE TYPE "CertificationOption" AS ENUM ('NONE', 'MINOR', 'MAJOR', 'SOLO');

-- CreateEnum
CREATE TYPE "LogType" AS ENUM ('CREATE', 'UPDATE', 'DELETE');

-- CreateEnum
CREATE TYPE "LogModel" AS ENUM ('USER', 'SOLO_CERTIFICATION', 'CERTIFICATION', 'CERTIFICATION_TYPE');

-- CreateTable
CREATE TABLE "Account"
(
    "id"                TEXT NOT NULL,
    "userId"            TEXT NOT NULL,
    "type"              TEXT NOT NULL,
    "provider"          TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token"     TEXT,
    "access_token"      TEXT,
    "expires_at"        INTEGER,
    "token_type"        TEXT,
    "scopes"            TEXT[],
    "id_token"          TEXT,
    "session_state"     TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken"
(
    "identifier" TEXT         NOT NULL,
    "token"      TEXT         NOT NULL,
    "expires"    TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "Session"
(
    "id"           TEXT         NOT NULL,
    "sessionToken" TEXT         NOT NULL,
    "userId"       TEXT         NOT NULL,
    "expires"      TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User"
(
    "id"               TEXT               NOT NULL,
    "cid"              TEXT               NOT NULL,
    "firstName"        TEXT,
    "lastName"         TEXT,
    "fullName"         TEXT,
    "email"            TEXT,
    "emailVerified"    TIMESTAMP(3),
    "artcc"            TEXT               NOT NULL,
    "rating"           INTEGER            NOT NULL,
    "division"         TEXT               NOT NULL,
    "roles"            "Role"[],
    "staffPositions"   "StaffPosition"[],
    "preferredName"    TEXT,
    "bio"              TEXT,
    "avatarUrl"        TEXT,
    "controllerStatus" "ControllerStatus" NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DossierEntry"
(
    "id"        TEXT         NOT NULL,
    "userId"    TEXT         NOT NULL,
    "writerId"  TEXT         NOT NULL,
    "message"   TEXT         NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DossierEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CertificationType"
(
    "id"                   TEXT    NOT NULL,
    "name"                 TEXT    NOT NULL,
    "order"                INTEGER NOT NULL,
    "canSoloCert"          BOOLEAN NOT NULL,
    "certificationOptions" "CertificationOption"[],

    CONSTRAINT "CertificationType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SoloCertification"
(
    "id"                  TEXT         NOT NULL,
    "expires"             TIMESTAMP(3) NOT NULL,
    "position"            TEXT         NOT NULL,
    "userId"              TEXT         NOT NULL,
    "certificationTypeId" TEXT         NOT NULL,

    CONSTRAINT "SoloCertification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Certification"
(
    "id"                  TEXT                  NOT NULL,
    "certificationOption" "CertificationOption" NOT NULL,
    "certificationTypeId" TEXT                  NOT NULL,
    "userId"              TEXT                  NOT NULL,

    CONSTRAINT "Certification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Log"
(
    "id"        TEXT         NOT NULL,
    "type"      "LogType"    NOT NULL,
    "model"     "LogModel"   NOT NULL,
    "message"   TEXT         NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "userId"    TEXT         NOT NULL,

    CONSTRAINT "Log_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account" ("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken" ("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken" ("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session" ("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "User_cid_key" ON "User" ("cid");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User" ("email");

-- AddForeignKey
ALTER TABLE "Account"
    ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session"
    ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DossierEntry"
    ADD CONSTRAINT "dossierEntries" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DossierEntry"
    ADD CONSTRAINT "writtenDossierEntries" FOREIGN KEY ("writerId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SoloCertification"
    ADD CONSTRAINT "SoloCertification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SoloCertification"
    ADD CONSTRAINT "SoloCertification_certificationTypeId_fkey" FOREIGN KEY ("certificationTypeId") REFERENCES "CertificationType" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Certification"
    ADD CONSTRAINT "Certification_certificationTypeId_fkey" FOREIGN KEY ("certificationTypeId") REFERENCES "CertificationType" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Certification"
    ADD CONSTRAINT "Certification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Log"
    ADD CONSTRAINT "Log_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;
