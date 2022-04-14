/*
  Warnings:

  - You are about to drop the column `birth_Date` on the `user` table. All the data in the column will be lost.
  - Added the required column `birth_date` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `user` DROP COLUMN `birth_Date`,
    ADD COLUMN `birth_date` DATETIME(3) NOT NULL;
