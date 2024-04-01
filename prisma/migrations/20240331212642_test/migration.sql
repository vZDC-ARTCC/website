-- AlterTable
ALTER TABLE "VisitorApplication"
    ADD COLUMN "decidedAt" TIMESTAMP(3),
ADD COLUMN     "reasonForDenial" TEXT;
