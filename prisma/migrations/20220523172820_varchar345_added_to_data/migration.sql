-- AlterTable
ALTER TABLE `authenticator` MODIFY `signature` VARCHAR(345) NOT NULL;

-- AlterTable
ALTER TABLE `user` MODIFY `username` VARCHAR(345) NOT NULL,
    MODIFY `email` VARCHAR(345) NOT NULL,
    MODIFY `country` VARCHAR(345) NULL,
    MODIFY `street` VARCHAR(345) NULL,
    MODIFY `city` VARCHAR(345) NULL;
