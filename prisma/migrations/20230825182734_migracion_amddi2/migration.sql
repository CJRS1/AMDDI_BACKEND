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
ALTER TABLE `servicios` ADD COLUMN `fecha_servicio` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `usuarios` ADD COLUMN `fecha_estimada` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `usuario_servicio` ADD CONSTRAINT `usuario_servicio_id_usuario_fkey` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `usuario_servicio` ADD CONSTRAINT `usuario_servicio_id_servicio_fkey` FOREIGN KEY (`id_servicio`) REFERENCES `servicios`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `asignaciones` ADD CONSTRAINT `asignaciones_id_asesor_fkey` FOREIGN KEY (`id_asesor`) REFERENCES `asesores`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `asignaciones` ADD CONSTRAINT `asignaciones_id_usuarios_fkey` FOREIGN KEY (`id_usuarios`) REFERENCES `usuarios`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `asesor_especialidad` ADD CONSTRAINT `asesor_especialidad_id_asesor_fkey` FOREIGN KEY (`id_asesor`) REFERENCES `asesores`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `asesor_especialidad` ADD CONSTRAINT `asesor_especialidad_id_especialidad_fkey` FOREIGN KEY (`id_especialidad`) REFERENCES `especialidades`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
