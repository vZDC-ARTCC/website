/*
  Warnings:

  - You are about to drop the column `cid` on the `VisitorApplication` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `VisitorApplication` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `VisitorApplication` table. All the data in the column will be lost.
  - You are about to drop the column `rating` on the `VisitorApplication` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `VisitorApplication` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `VisitorApplication` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User"
    ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "VisitorApplication" DROP COLUMN "cid",
DROP
COLUMN "email",
DROP
COLUMN "name",
DROP
COLUMN "rating",
ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "VisitorApplication_userId_key" ON "VisitorApplication" ("userId");

-- AddForeignKey
ALTER TABLE "VisitorApplication"
    ADD CONSTRAINT "VisitorApplication_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;
