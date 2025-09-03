/*
  Warnings:

  - You are about to alter the column `BETALINGSINFO` on the `bedrijf` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Json`.
  - You are about to alter the column `BETALINGSINFO` on the `bedrijfverandering` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Json`.

*/
-- AlterTable
ALTER TABLE `bedrijf` MODIFY `BETALINGSINFO` JSON NOT NULL;

-- AlterTable
ALTER TABLE `bedrijfverandering` MODIFY `BETALINGSINFO` JSON NOT NULL;
