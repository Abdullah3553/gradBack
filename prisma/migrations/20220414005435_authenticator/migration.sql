-- CreateTable
CREATE TABLE `authenticator` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `signature` VARCHAR(191) NOT NULL,
    `priority` INTEGER NOT NULL,
    `access_token` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
