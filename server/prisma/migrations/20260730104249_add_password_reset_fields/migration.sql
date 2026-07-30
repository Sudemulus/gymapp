-- AlterTable
ALTER TABLE `users` ADD COLUMN `reset_code_attempts` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `reset_code_expires_at` DATETIME(3) NULL,
    ADD COLUMN `reset_code_hash` VARCHAR(255) NULL,
    ADD COLUMN `reset_requested_at` DATETIME(3) NULL;
