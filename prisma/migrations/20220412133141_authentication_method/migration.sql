-- CreateTable
CREATE TABLE `authentication_method` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `file_path` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `authentication_method_title_key`(`title`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
