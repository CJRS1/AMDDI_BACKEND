/*
  Warnings:

  - You are about to drop the column `fecha_servicio` on the `servicios` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id_usuario]` on the table `usuario_servicio` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id_servicio]` on the table `usuario_servicio` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `asesor_especialidad_id_asesor_fkey` ON `asesor_especialidad`;

-- DropIndex
DROP INDEX `asesor_especialidad_id_especialidad_fkey` ON `asesor_especialidad`;

-- DropIndex
DROP INDEX `asignaciones_id_asesor_fkey` ON `asignaciones`;

-- DropIndex
DROP INDEX `asignaciones_id_usuarios_fkey` ON `asignaciones`;

-- DropIndex
DROP INDEX `usuario_servicio_id_servicio_fkey` ON `usuario_servicio`;

-- DropIndex
DROP INDEX `usuario_servicio_id_usuario_fkey` ON `usuario_servicio`;

-- AlterTable
ALTER TABLE `asignaciones` ADD COLUMN `estado_asignacion` VARCHAR(191) NOT NULL DEFAULT 'Etapa 1';

-- AlterTable
ALTER TABLE `servicios` DROP COLUMN `fecha_servicio`;

-- AlterTable
ALTER TABLE `usuarios` ADD COLUMN `fecha_servivio_monto` VARCHAR(191) NULL,
    ADD COLUMN `tema` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `estado` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `estado` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `estado_estado_key`(`estado`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `usuario_servicio_id_usuario_key` ON `usuario_servicio`(`id_usuario`);

-- CreateIndex
CREATE UNIQUE INDEX `usuario_servicio_id_servicio_key` ON `usuario_servicio`(`id_servicio`);

-- AddForeignKey
ALTER TABLE `usuario_servicio` ADD CONSTRAINT `usuario_servicio_id_usuario_fkey` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `usuario_servicio` ADD CONSTRAINT `usuario_servicio_id_servicio_fkey` FOREIGN KEY (`id_servicio`) REFERENCES `servicios`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `asignaciones` ADD CONSTRAINT `asignaciones_estado_asignacion_fkey` FOREIGN KEY (`estado_asignacion`) REFERENCES `estado`(`estado`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `asignaciones` ADD CONSTRAINT `asignaciones_id_asesor_fkey` FOREIGN KEY (`id_asesor`) REFERENCES `asesores`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `asignaciones` ADD CONSTRAINT `asignaciones_id_usuarios_fkey` FOREIGN KEY (`id_usuarios`) REFERENCES `usuarios`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `asesor_especialidad` ADD CONSTRAINT `asesor_especialidad_id_asesor_fkey` FOREIGN KEY (`id_asesor`) REFERENCES `asesores`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `asesor_especialidad` ADD CONSTRAINT `asesor_especialidad_id_especialidad_fkey` FOREIGN KEY (`id_especialidad`) REFERENCES `especialidades`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
