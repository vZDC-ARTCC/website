-- CreateEnum
CREATE TYPE "HighlightColorType" AS ENUM ('INHERIT', 'RED', 'LIGHTSKYBLUE', 'ORANGE', 'DARKCYAN', 'LIGHTGREEN', 'SALMON', 'MEDIUMPURPLE');

-- AlterTable
ALTER TABLE "File" ADD COLUMN     "highlightColor" "HighlightColorType" NOT NULL DEFAULT 'INHERIT';
