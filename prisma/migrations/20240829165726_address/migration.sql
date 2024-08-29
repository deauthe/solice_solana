/*
  Warnings:

  - A unique constraint covering the columns `[address]` on the table `CandyMachine` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `address` to the `CandyMachine` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CandyMachine" ADD COLUMN     "address" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "CandyMachine_address_key" ON "CandyMachine"("address");
