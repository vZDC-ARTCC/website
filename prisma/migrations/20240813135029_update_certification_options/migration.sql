/*
  Warnings:

  - The values [MINOR,MAJOR] on the enum `CertificationOption` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "CertificationOption_new" AS ENUM ('NONE', 'UNRESTRICTED', 'TIER_1', 'SOLO');
ALTER TABLE "CertificationType" ALTER COLUMN "certificationOptions" TYPE "CertificationOption_new"[] USING ("certificationOptions"::text::"CertificationOption_new"[]);
ALTER TABLE "Certification" ALTER COLUMN "certificationOption" TYPE "CertificationOption_new" USING ("certificationOption"::text::"CertificationOption_new");
ALTER TYPE "CertificationOption" RENAME TO "CertificationOption_old";
ALTER TYPE "CertificationOption_new" RENAME TO "CertificationOption";
DROP TYPE "CertificationOption_old";
COMMIT;
