-- CreateTable
CREATE TABLE "Version" (
    "id" TEXT NOT NULL,
    "versionNumber" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Version_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChangeDetail" (
    "id" TEXT NOT NULL,
    "detail" TEXT NOT NULL,
    "versionId" TEXT NOT NULL,

    CONSTRAINT "ChangeDetail_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Version_versionNumber_key" ON "Version"("versionNumber");

-- AddForeignKey
ALTER TABLE "ChangeDetail" ADD CONSTRAINT "ChangeDetail_versionId_fkey" FOREIGN KEY ("versionId") REFERENCES "Version"("id") ON DELETE CASCADE ON UPDATE CASCADE;
