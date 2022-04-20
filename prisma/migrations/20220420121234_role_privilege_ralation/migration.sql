/*
  Warnings:

  - Added the required column `roleId` to the `Privilege` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `privilege` ADD COLUMN `roleId` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `_PrivilegeToRole` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_PrivilegeToRole_AB_unique`(`A`, `B`),
    INDEX `_PrivilegeToRole_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_PrivilegeToRole` ADD FOREIGN KEY (`A`) REFERENCES `Privilege`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_PrivilegeToRole` ADD FOREIGN KEY (`B`) REFERENCES `Role`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
