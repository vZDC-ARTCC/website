-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "CertificationOption" ADD VALUE 'CERTIFIED';
ALTER TYPE "CertificationOption" ADD VALUE 'DEL';
ALTER TYPE "CertificationOption" ADD VALUE 'GND';
ALTER TYPE "CertificationOption" ADD VALUE 'TWR';
ALTER TYPE "CertificationOption" ADD VALUE 'APP';
ALTER TYPE "CertificationOption" ADD VALUE 'CTR';
