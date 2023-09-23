/*
  Warnings:

  - You are about to drop the column `id_estado` on the `asignaciones` table. All the data in the column will be lost.
  - You are about to drop the `estado` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `asignaciones` DROP FOREIGN KEY `asignaciones_id_estado_fkey`;

-- AlterTable
ALTER TABLE `asignaciones` DROP COLUMN `id_estado`;

-- AlterTable
ALTER TABLE `usuarios` ADD COLUMN `estado` VARCHAR(191) NULL,
    ADD COLUMN `id_amddi` INTEGER NULL,
    ADD COLUMN `institucion_educativa` VARCHAR(255) NULL,
    ADD COLUMN `monto_restante` DOUBLE NULL DEFAULT 0,
    MODIFY `pais` VARCHAR(191) NULL;

-- DropTable
DROP TABLE `estado`;

-- CreateTable
CREATE TABLE `estado_tesis` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `estado` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `estado_observacion` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `estado` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
