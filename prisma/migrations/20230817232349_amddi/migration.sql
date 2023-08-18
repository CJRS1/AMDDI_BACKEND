-- CreateTable
CREATE TABLE `usuarios` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `pwd_hash` VARCHAR(100) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `nombre` VARCHAR(50) NOT NULL,
    `apeMat` VARCHAR(50) NOT NULL,
    `apePat` VARCHAR(50) NOT NULL,
    `departamento` VARCHAR(50) NOT NULL,
    `carrera` VARCHAR(30) NOT NULL,
    `rol` VARCHAR(20) NOT NULL,
    `verification_code` VARCHAR(4) NOT NULL,
    `pdf_url` VARCHAR(255) NOT NULL,
    `service_id` INTEGER NOT NULL,
    `monto_pagado` DOUBLE NOT NULL DEFAULT 0,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `usuarios_email_key`(`email`),
    UNIQUE INDEX `usuarios_service_id_key`(`service_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `asesores` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `pwd_hash` VARCHAR(100) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `nombre` VARCHAR(50) NOT NULL,
    `apeMat` VARCHAR(50) NOT NULL,
    `apePat` VARCHAR(50) NOT NULL,
    `rol` VARCHAR(191) NOT NULL DEFAULT 'usuario',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `asesores_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `especialidades` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(100) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `servicios` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `servicio` VARCHAR(200) NOT NULL,
    `monto_total` DOUBLE NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `asignaciones` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_asesor` INTEGER NOT NULL,
    `id_usuarios` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `administradores` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `pwd_hash` VARCHAR(100) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `nombre` VARCHAR(50) NOT NULL,
    `apellido` VARCHAR(50) NOT NULL,
    `rol` VARCHAR(191) NOT NULL DEFAULT 'admin',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `administradores_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Asesor_Especialidad` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_asesor` INTEGER NOT NULL,
    `id_especialidad` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `servicios` ADD CONSTRAINT `servicios_id_fkey` FOREIGN KEY (`id`) REFERENCES `usuarios`(`service_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `asignaciones` ADD CONSTRAINT `asignaciones_id_asesor_fkey` FOREIGN KEY (`id_asesor`) REFERENCES `asesores`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `asignaciones` ADD CONSTRAINT `asignaciones_id_usuarios_fkey` FOREIGN KEY (`id_usuarios`) REFERENCES `usuarios`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Asesor_Especialidad` ADD CONSTRAINT `Asesor_Especialidad_id_asesor_fkey` FOREIGN KEY (`id_asesor`) REFERENCES `asesores`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Asesor_Especialidad` ADD CONSTRAINT `Asesor_Especialidad_id_especialidad_fkey` FOREIGN KEY (`id_especialidad`) REFERENCES `especialidades`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
