/*
  Warnings:

  - You are about to drop the column `apellido` on the `administradores` table. All the data in the column will be lost.
  - Added the required column `apeMat` to the `administradores` table without a default value. This is not possible if the table is not empty.
  - Added the required column `apePat` to the `administradores` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dni` to the `administradores` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dni` to the `asesores` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dni` to the `usuarios` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `administradores` DROP COLUMN `apellido`,
    ADD COLUMN `apeMat` VARCHAR(50) NOT NULL,
    ADD COLUMN `apePat` VARCHAR(50) NOT NULL,
    ADD COLUMN `dni` VARCHAR(8) NOT NULL;

-- AlterTable
ALTER TABLE `asesores` ADD COLUMN `dni` VARCHAR(8) NOT NULL,
    MODIFY `rol` VARCHAR(191) NOT NULL DEFAULT 'asesor';

-- AlterTable
ALTER TABLE `usuarios` ADD COLUMN `dni` VARCHAR(8) NOT NULL,
    MODIFY `rol` VARCHAR(191) NOT NULL DEFAULT 'asesor',
    MODIFY `verification_code` VARCHAR(4) NULL,
    MODIFY `pdf_url` VARCHAR(255) NULL,
    MODIFY `service_id` INTEGER NULL,
    MODIFY `monto_pagado` DOUBLE NULL DEFAULT 0;
