/*
  Warnings:

  - You are about to drop the column `authentication_method_id` on the `authenticator` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `authenticator` DROP FOREIGN KEY `Authenticator_authentication_method_id_fkey`;

-- AlterTable
ALTER TABLE `authenticator` DROP COLUMN `authentication_method_id`;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `role_id` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_role_id_fkey` FOREIGN KEY (`role_id`) REFERENCES `Role`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
