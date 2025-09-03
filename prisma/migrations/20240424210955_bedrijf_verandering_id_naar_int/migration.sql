/*
  Warnings:

  - The primary key for the `bedrijfverandering` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `ID` on the `bedrijfverandering` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.

*/
-- AlterTable
ALTER TABLE `bedrijfverandering` DROP PRIMARY KEY,
    MODIFY `ID` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`ID`);
