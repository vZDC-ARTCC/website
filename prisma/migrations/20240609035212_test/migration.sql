-- AlterTable
ALTER TABLE "User"
    ADD COLUMN "ableToEditProfile" BOOLEAN,
ADD COLUMN     "ableToRequestLoa" BOOLEAN,
ADD COLUMN     "ableToSignupEvents" BOOLEAN,
ADD COLUMN     "ableToSubmitFeedback" BOOLEAN,
ADD COLUMN     "ableToSubmitIncidentReports" BOOLEAN,
ADD COLUMN     "excludedFromVatusaRosterUpdate" BOOLEAN;
