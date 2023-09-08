-- AlterTable
ALTER TABLE `asignaciones` ALTER COLUMN `estado_asignacion` DROP DEFAULT;

-- AlterTable
ALTER TABLE `estado` MODIFY `estado` VARCHAR(191) NULL DEFAULT 'Etapa 1';
