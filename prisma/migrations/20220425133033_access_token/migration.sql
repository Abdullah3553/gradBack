/*
  Warnings:

  - You are about to drop the `_authentication_methodtoauthenticator` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `authentication_methodId` to the `Authenticator` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `_authentication_methodtoauthenticator` DROP FOREIGN KEY `_authentication_methodtoauthenticator_ibfk_1`;

-- DropForeignKey
ALTER TABLE `_authentication_methodtoauthenticator` DROP FOREIGN KEY `_authentication_methodtoauthenticator_ibfk_2`;

-- AlterTable
ALTER TABLE `authenticator` ADD COLUMN `authentication_methodId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- DropTable
DROP TABLE `_authentication_methodtoauthenticator`;

-- CreateTable
CREATE TABLE `RefreshToken` (
    `id` VARCHAR(191) NOT NULL,
    `hashedToken` VARCHAR(191) NOT NULL,
    `userId` INTEGER NOT NULL,
    `revoked` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `RefreshToken_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Authenticator` ADD CONSTRAINT `Authenticator_authentication_methodId_fkey` FOREIGN KEY (`authentication_methodId`) REFERENCES `Authentication_method`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RefreshToken` ADD CONSTRAINT `RefreshToken_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
