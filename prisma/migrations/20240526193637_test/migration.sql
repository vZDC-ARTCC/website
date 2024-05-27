-- CreateTable
CREATE TABLE "FileCategory"
(
    "id"   TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "FileCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "File"
(
    "id"         TEXT         NOT NULL,
    "categoryId" TEXT         NOT NULL,
    "key"        TEXT         NOT NULL,
    "updatedAt"  TIMESTAMP(3) NOT NULL,

    CONSTRAINT "File_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "File"
    ADD CONSTRAINT "File_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "FileCategory" ("id") ON DELETE CASCADE ON UPDATE CASCADE;
