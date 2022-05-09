/*
  Warnings:

  - You are about to drop the column `access_token` on the `authenticator` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `authenticator` DROP COLUMN `access_token`;
