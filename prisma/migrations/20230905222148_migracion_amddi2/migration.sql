-- CreateTable
CREATE TABLE `usuarios_temporal` (
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
    `verification_code` VARCHAR(4) NULL,
    `created_at` VARCHAR(191) NOT NULL,
    `fecha_expiracion` DATETIME(3) NOT NULL,

    UNIQUE INDEX `usuarios_temporal_email_key`(`email`),
    UNIQUE INDEX `usuarios_temporal_dni_key`(`dni`),
    UNIQUE INDEX `usuarios_temporal_celular_key`(`celular`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
