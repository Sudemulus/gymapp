-- AlterTable
ALTER TABLE `exercises` MODIFY `muscle_group` ENUM('CHEST', 'BACK', 'SHOULDERS', 'BICEPS', 'TRICEPS', 'LEGS', 'CORE', 'CARDIO', 'FULL_BODY', 'OTHER') NOT NULL;

-- AlterTable
ALTER TABLE `workout_sets` ADD COLUMN `completed` BOOLEAN NOT NULL DEFAULT false;
