/*
  Warnings:

  - You are about to drop the `privileges` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `privileges`;

-- CreateTable
CREATE TABLE `Privilege` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `read` BOOLEAN NOT NULL DEFAULT false,
    `write` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
