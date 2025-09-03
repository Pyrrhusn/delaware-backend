/*
  Warnings:

  - You are about to alter the column `BETALINGSINFO` on the `bedrijf` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(0))` to `VarChar(191)`.
  - You are about to alter the column `BETALINGSINFO` on the `bedrijfverandering` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(1))` to `VarChar(191)`.

*/
-- AlterTable
ALTER TABLE `bedrijf` MODIFY `BETALINGSINFO` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `bedrijfverandering` MODIFY `BETALINGSINFO` VARCHAR(191) NOT NULL;
