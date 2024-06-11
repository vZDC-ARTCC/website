/*
  Warnings:

  - A unique constraint covering the columns `[logId,month,year]` on the table `ControllerLogMonth` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ControllerLogMonth_logId_month_year_key" ON "ControllerLogMonth" ("logId", "month", "year");
