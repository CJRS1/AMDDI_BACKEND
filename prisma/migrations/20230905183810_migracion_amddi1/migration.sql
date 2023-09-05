-- CreateTable
CREATE TABLE `usuarios` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `pwd_hash` VARCHAR(100) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `nombre` VARCHAR(50) NOT NULL,
    `apellido_paterno` VARCHAR(50) NOT NULL,
    `apellido_materno` VARCHAR(50) NOT NULL,
    `dni` VARCHAR(8) NOT NULL,
    `celular` VARCHAR(18) NULL,
    `pais` VARCHAR(50) NULL,
    `departamento` VARCHAR(50) NOT NULL,
    `carrera` VARCHAR(30) NOT NULL,
    `tema` VARCHAR(191) NULL,
    `rol` VARCHAR(191) NOT NULL DEFAULT 'usuario',
    `verification_code` VARCHAR(4) NULL,
    `pdf_url` VARCHAR(255) NULL,
    `monto_pagado` DOUBLE NULL DEFAULT 0,
    `monto_total` DOUBLE NULL DEFAULT 0,
    `fecha_servicio_monto` VARCHAR(191) NULL,
    `fecha_estimada` VARCHAR(191) NULL,
    `created_at` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `usuarios_email_key`(`email`),
    UNIQUE INDEX `usuarios_dni_key`(`dni`),
    UNIQUE INDEX `usuarios_celular_key`(`celular`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `asesores` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `pwd_hash` VARCHAR(100) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `nombre` VARCHAR(50) NOT NULL,
    `apellido_materno` VARCHAR(50) NOT NULL,
    `apellido_paterno` VARCHAR(50) NOT NULL,
    `dni` VARCHAR(8) NOT NULL,
    `rol` VARCHAR(191) NOT NULL DEFAULT 'asesor',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `asesores_email_key`(`email`),
    UNIQUE INDEX `asesores_dni_key`(`dni`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `especialidades` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre_especialidad` VARCHAR(100) NOT NULL,

    UNIQUE INDEX `especialidades_nombre_especialidad_key`(`nombre_especialidad`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `usuario_servicio` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_usuario` INTEGER NOT NULL,
    `id_servicio` INTEGER NOT NULL,

    UNIQUE INDEX `usuario_servicio_id_usuario_key`(`id_usuario`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `servicios` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre_servicio` VARCHAR(200) NOT NULL,

    UNIQUE INDEX `servicios_nombre_servicio_key`(`nombre_servicio`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `asignaciones` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_asesor` INTEGER NOT NULL,
    `id_usuarios` INTEGER NOT NULL,
    `estado_asignacion` VARCHAR(191) NOT NULL DEFAULT 'Etapa 1',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `estado` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `estado` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `estado_estado_key`(`estado`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `administradores` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `pwd_hash` VARCHAR(100) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `nombre` VARCHAR(50) NOT NULL,
    `apellido_paterno` VARCHAR(50) NOT NULL,
    `apellido_materno` VARCHAR(50) NOT NULL,
    `dni` VARCHAR(8) NOT NULL,
    `rol` VARCHAR(191) NOT NULL DEFAULT 'admin',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `administradores_email_key`(`email`),
    UNIQUE INDEX `administradores_dni_key`(`dni`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `asesor_especialidad` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_asesor` INTEGER NOT NULL,
    `id_especialidad` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

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
