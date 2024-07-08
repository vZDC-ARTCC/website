/*
  Warnings:

  - The values [WEBMASTER] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.

*/
-- CreateEnum
CREATE TYPE "SpecialRole" AS ENUM ('WEBMASTER');

-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('CONTROLLER', 'MENTOR', 'INSTRUCTOR', 'STAFF');
ALTER TABLE "User" ALTER COLUMN "roles" TYPE "Role_new"[] USING ("roles"::text::"Role_new"[]);
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "Role_old";
COMMIT;
