-- CreateEnum
CREATE TYPE "ControllerStatus" AS ENUM ('HOME', 'VISITOR', 'NONE');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('CONTROLLER', 'MENTOR', 'INSTRUCTOR', 'STAFF');

-- CreateEnum
CREATE TYPE "StaffPosition" AS ENUM ('ATM', 'DATM', 'TA', 'EC', 'FE', 'WM', 'ATA', 'AWM', 'AEC', 'AFE', 'INS', 'MTR');

-- CreateEnum
CREATE TYPE "CertificationOption" AS ENUM ('NONE', 'MINOR', 'MAJOR', 'SOLO');

-- CreateEnum
CREATE TYPE "LogType" AS ENUM ('CREATE', 'UPDATE', 'DELETE');

-- CreateEnum
CREATE TYPE "LogModel" AS ENUM ('USER', 'STAFF_POSITION', 'ROLE', 'EVENT', 'EVENT_POSITION', 'FILE_CATEGORY', 'FILE', 'STAFFING_REQUEST', 'AIRPORT_TRACON_GROUP', 'AIRPORT_RUNWAY', 'AIRPORT_PROCEDURE', 'AIRPORT', 'FEEDBACK', 'VISITOR_APPLICATION', 'SOLO_CERTIFICATION', 'CERTIFICATION', 'CERTIFICATION_TYPE', 'LESSON', 'COMMON_MISTAKE', 'LESSON_RUBRIC', 'TRAINING_SESSION');

-- CreateEnum
CREATE TYPE "VisitorApplicationStatus" AS ENUM ('PENDING', 'APPROVED', 'DENIED');

-- CreateEnum
CREATE TYPE "FeedbackStatus" AS ENUM ('PENDING', 'RELEASED', 'STASHED');

-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('HOME', 'SUPPORT', 'GROUP_FLIGHT', 'TRAINING');

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
    "updatedAt"        TIMESTAMP(3)       NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VatsimUpdateMetadata"
(
    "id"        TEXT         NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VatsimUpdateMetadata_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ControllerLog"
(
    "id"     TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "ControllerLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ControllerLogMonth"
(
    "id"            TEXT             NOT NULL,
    "logId"         TEXT             NOT NULL,
    "month"         INTEGER          NOT NULL,
    "year"          INTEGER          NOT NULL,
    "deliveryHours" DOUBLE PRECISION NOT NULL,
    "groundHours"   DOUBLE PRECISION NOT NULL,
    "towerHours"    DOUBLE PRECISION NOT NULL,
    "approachHours" DOUBLE PRECISION NOT NULL,
    "centerHours"   DOUBLE PRECISION NOT NULL,

    CONSTRAINT "ControllerLogMonth_pkey" PRIMARY KEY ("id")
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

-- CreateTable
CREATE TABLE "VisitorApplication"
(
    "id"              TEXT                       NOT NULL,
    "userId"          TEXT                       NOT NULL,
    "homeFacility"    TEXT                       NOT NULL,
    "whyVisit"        TEXT                       NOT NULL,
    "submittedAt"     TIMESTAMP(3)               NOT NULL,
    "decidedAt"       TIMESTAMP(3),
    "reasonForDenial" TEXT,
    "status"          "VisitorApplicationStatus" NOT NULL,

    CONSTRAINT "VisitorApplication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Feedback"
(
    "id"                 TEXT             NOT NULL,
    "pilotId"            TEXT             NOT NULL,
    "pilotCallsign"      TEXT             NOT NULL,
    "controllerId"       TEXT             NOT NULL,
    "controllerPosition" TEXT             NOT NULL,
    "rating"             INTEGER          NOT NULL,
    "comments"           TEXT,
    "staffComments"      TEXT,
    "status"             "FeedbackStatus" NOT NULL,
    "submittedAt"        TIMESTAMP(3)     NOT NULL,
    "decidedAt"          TIMESTAMP(3),

    CONSTRAINT "Feedback_pkey" PRIMARY KEY ("id")
);

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
    "iata"          TEXT NOT NULL,
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
    "runwayId"  TEXT NOT NULL,
    "route"     TEXT NOT NULL,
    "procedure" TEXT NOT NULL,

    CONSTRAINT "RunwayInstruction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event"
(
    "id"              TEXT         NOT NULL,
    "name"            TEXT         NOT NULL,
    "type"            "EventType"  NOT NULL,
    "description"     TEXT         NOT NULL,
    "start"           TIMESTAMP(3) NOT NULL,
    "end"             TIMESTAMP(3) NOT NULL,
    "external"        BOOLEAN      NOT NULL,
    "host"            TEXT,
    "positionsLocked" BOOLEAN      NOT NULL,
    "bannerKey"       TEXT         NOT NULL,
    "featuredFields"  TEXT[],

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventPosition"
(
    "id"        TEXT NOT NULL,
    "eventId"   TEXT NOT NULL,
    "position"  TEXT NOT NULL,
    "minRating" INTEGER,
    "signupCap" INTEGER,

    CONSTRAINT "EventPosition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StaffingRequest"
(
    "id"          TEXT NOT NULL,
    "userId"      TEXT NOT NULL,
    "name"        TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "StaffingRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FileCategory"
(
    "id"   TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "FileCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "File"
(
    "id"          TEXT         NOT NULL,
    "name"        TEXT         NOT NULL,
    "description" TEXT         NOT NULL,
    "categoryId"  TEXT         NOT NULL,
    "key"         TEXT         NOT NULL,
    "updatedAt"   TIMESTAMP(3) NOT NULL,

    CONSTRAINT "File_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lesson"
(
    "id"          TEXT         NOT NULL,
    "identifier"  TEXT         NOT NULL,
    "name"        TEXT         NOT NULL,
    "description" TEXT         NOT NULL,
    "facility"    TEXT         NOT NULL,
    "rubricId"    TEXT,
    "updatedAt"   TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Lesson_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LessonRubric"
(
    "id" TEXT NOT NULL,

    CONSTRAINT "LessonRubric_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LessonRubricCriteria"
(
    "id"          TEXT    NOT NULL,
    "rubricId"    TEXT    NOT NULL,
    "criteria"    TEXT    NOT NULL,
    "description" TEXT    NOT NULL,
    "maxPoints"   INTEGER NOT NULL,

    CONSTRAINT "LessonRubricCriteria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LessonRubricCell"
(
    "id"          TEXT    NOT NULL,
    "criteriaId"  TEXT    NOT NULL,
    "points"      INTEGER NOT NULL,
    "description" TEXT    NOT NULL,

    CONSTRAINT "LessonRubricCell_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommonMistake"
(
    "id"               TEXT NOT NULL,
    "name"             TEXT NOT NULL,
    "description"      TEXT NOT NULL,
    "facility"         TEXT,
    "trainingTicketId" TEXT,

    CONSTRAINT "CommonMistake_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrainingSession"
(
    "id"           TEXT         NOT NULL,
    "studentId"    TEXT         NOT NULL,
    "instructorId" TEXT         NOT NULL,
    "start"        TIMESTAMP(3) NOT NULL,
    "end"          TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TrainingSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrainingTicket"
(
    "id"        TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "lessonId"  TEXT NOT NULL,

    CONSTRAINT "TrainingTicket_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RubricCriteraScore"
(
    "id"               TEXT NOT NULL,
    "criteriaId"       TEXT NOT NULL,
    "cellId"           TEXT NOT NULL,
    "trainingTicketId" TEXT,

    CONSTRAINT "RubricCriteraScore_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_EventPositionToUser"
(
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
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

-- CreateIndex
CREATE UNIQUE INDEX "ControllerLog_userId_key" ON "ControllerLog" ("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Certification_certificationOption_userId_key" ON "Certification" ("certificationOption", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "VisitorApplication_userId_key" ON "VisitorApplication" ("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Airport_icao_key" ON "Airport" ("icao");

-- CreateIndex
CREATE UNIQUE INDEX "Lesson_rubricId_key" ON "Lesson" ("rubricId");

-- CreateIndex
CREATE UNIQUE INDEX "_EventPositionToUser_AB_unique" ON "_EventPositionToUser" ("A", "B");

-- CreateIndex
CREATE INDEX "_EventPositionToUser_B_index" ON "_EventPositionToUser" ("B");

-- AddForeignKey
ALTER TABLE "Account"
    ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session"
    ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ControllerLog"
    ADD CONSTRAINT "ControllerLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ControllerLogMonth"
    ADD CONSTRAINT "ControllerLogMonth_logId_fkey" FOREIGN KEY ("logId") REFERENCES "ControllerLog" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

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

-- AddForeignKey
ALTER TABLE "VisitorApplication"
    ADD CONSTRAINT "VisitorApplication_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feedback"
    ADD CONSTRAINT "Feedback_pilotId_fkey" FOREIGN KEY ("pilotId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feedback"
    ADD CONSTRAINT "Feedback_controllerId_fkey" FOREIGN KEY ("controllerId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Airport"
    ADD CONSTRAINT "Airport_traconGroupId_fkey" FOREIGN KEY ("traconGroupId") REFERENCES "TraconGroup" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Runway"
    ADD CONSTRAINT "Runway_airportId_fkey" FOREIGN KEY ("airportId") REFERENCES "Airport" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RunwayInstruction"
    ADD CONSTRAINT "RunwayInstruction_runwayId_fkey" FOREIGN KEY ("runwayId") REFERENCES "Runway" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventPosition"
    ADD CONSTRAINT "EventPosition_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StaffingRequest"
    ADD CONSTRAINT "StaffingRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "File"
    ADD CONSTRAINT "File_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "FileCategory" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lesson"
    ADD CONSTRAINT "Lesson_rubricId_fkey" FOREIGN KEY ("rubricId") REFERENCES "LessonRubric" ("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LessonRubricCriteria"
    ADD CONSTRAINT "LessonRubricCriteria_rubricId_fkey" FOREIGN KEY ("rubricId") REFERENCES "LessonRubric" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LessonRubricCell"
    ADD CONSTRAINT "LessonRubricCell_criteriaId_fkey" FOREIGN KEY ("criteriaId") REFERENCES "LessonRubricCriteria" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommonMistake"
    ADD CONSTRAINT "CommonMistake_trainingTicketId_fkey" FOREIGN KEY ("trainingTicketId") REFERENCES "TrainingTicket" ("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrainingSession"
    ADD CONSTRAINT "trainingSessions" FOREIGN KEY ("studentId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrainingSession"
    ADD CONSTRAINT "trainingSessionsGiven" FOREIGN KEY ("instructorId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrainingTicket"
    ADD CONSTRAINT "TrainingTicket_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "TrainingSession" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrainingTicket"
    ADD CONSTRAINT "TrainingTicket_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RubricCriteraScore"
    ADD CONSTRAINT "RubricCriteraScore_criteriaId_fkey" FOREIGN KEY ("criteriaId") REFERENCES "LessonRubricCriteria" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RubricCriteraScore"
    ADD CONSTRAINT "RubricCriteraScore_cellId_fkey" FOREIGN KEY ("cellId") REFERENCES "LessonRubricCell" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RubricCriteraScore"
    ADD CONSTRAINT "RubricCriteraScore_trainingTicketId_fkey" FOREIGN KEY ("trainingTicketId") REFERENCES "TrainingTicket" ("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EventPositionToUser"
    ADD CONSTRAINT "_EventPositionToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "EventPosition" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EventPositionToUser"
    ADD CONSTRAINT "_EventPositionToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE;
