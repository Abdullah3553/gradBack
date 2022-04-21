-- CreateTable
CREATE TABLE `_Authentication_methodToAuthenticator` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_Authentication_methodToAuthenticator_AB_unique`(`A`, `B`),
    INDEX `_Authentication_methodToAuthenticator_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_Authentication_methodToAuthenticator` ADD FOREIGN KEY (`A`) REFERENCES `Authentication_method`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_Authentication_methodToAuthenticator` ADD FOREIGN KEY (`B`) REFERENCES `Authenticator`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
