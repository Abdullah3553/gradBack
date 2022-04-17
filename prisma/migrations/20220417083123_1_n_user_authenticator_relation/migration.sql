/*
  Warnings:

  - Added the required column `authentication_method_id` to the `Authenticator` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `authenticator` ADD COLUMN `authentication_method_id` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Authenticator` ADD CONSTRAINT `Authenticator_authentication_method_id_fkey` FOREIGN KEY (`authentication_method_id`) REFERENCES `Authentication_method`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
