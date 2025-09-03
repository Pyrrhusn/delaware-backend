/*
  Warnings:

  - You are about to alter the column `BETALINGSSTATUS` on the `bestelling` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `Enum(EnumId(0))`.
  - You are about to alter the column `ORDERSTATUS` on the `bestelling` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `Enum(EnumId(1))`.

*/
-- AlterTable
ALTER TABLE `bestelling` MODIFY `BETALINGSSTATUS` ENUM('BETAALD', 'NIETBETAALD') NOT NULL,
    MODIFY `ORDERSTATUS` ENUM('VERZONDEN', 'GELEVERD', 'INBEHANDELING') NOT NULL;
