/*
  Warnings:

  - You are about to drop the column `fecha_estimada` on the `usuarios` table. All the data in the column will be lost.
  - You are about to drop the column `fecha_servivio_monto` on the `usuarios` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `asesor_especialidad_id_asesor_fkey` ON `asesor_especialidad`;

-- DropIndex
DROP INDEX `asesor_especialidad_id_especialidad_fkey` ON `asesor_especialidad`;

-- DropIndex
DROP INDEX `asignaciones_estado_asignacion_fkey` ON `asignaciones`;

-- DropIndex
DROP INDEX `asignaciones_id_asesor_fkey` ON `asignaciones`;

-- DropIndex
DROP INDEX `asignaciones_id_usuarios_fkey` ON `asignaciones`;

-- DropIndex
DROP INDEX `usuario_servicio_id_servicio_key` ON `usuario_servicio`;

-- AlterTable
ALTER TABLE `usuarios` DROP COLUMN `fecha_estimada`,
    DROP COLUMN `fecha_servivio_monto`;

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
