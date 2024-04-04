-- CreateTable
CREATE TABLE "VatsimUpdateMetadata" (
    "id" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VatsimUpdateMetadata_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ControllerLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "ControllerLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ControllerLogMonth" (
    "id" TEXT NOT NULL,
    "logId" TEXT NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "deliveryHours" DOUBLE PRECISION NOT NULL,
    "groundHours" DOUBLE PRECISION NOT NULL,
    "towerHours" DOUBLE PRECISION NOT NULL,
    "approachHours" DOUBLE PRECISION NOT NULL,
    "centerHours" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "ControllerLogMonth_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ControllerLog_userId_key" ON "ControllerLog"("userId");

-- AddForeignKey
ALTER TABLE "ControllerLog" ADD CONSTRAINT "ControllerLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ControllerLogMonth" ADD CONSTRAINT "ControllerLogMonth_logId_fkey" FOREIGN KEY ("logId") REFERENCES "ControllerLog"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
