/*
  Warnings:

  - You are about to drop the column `ableToEditProfile` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `ableToRequestLoa` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `ableToSignupEvents` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `ableToSubmitFeedback` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `ableToSubmitIncidentReports` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "ableToEditProfile",
DROP
COLUMN "ableToRequestLoa",
DROP
COLUMN "ableToSignupEvents",
DROP
COLUMN "ableToSubmitFeedback",
DROP
COLUMN "ableToSubmitIncidentReports",
ADD COLUMN     "noEditProfile" BOOLEAN,
ADD COLUMN     "noEventSignup" BOOLEAN,
ADD COLUMN     "noRequestLoas" BOOLEAN;
