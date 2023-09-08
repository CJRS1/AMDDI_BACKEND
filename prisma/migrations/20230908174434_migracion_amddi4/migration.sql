/*
  Warnings:

  - You are about to drop the column `estado_asignacion` on the `asignaciones` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id_estado]` on the table `asignaciones` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `id_estado` to the `asignaciones` table without a default value. This is not possible if the table is not empty.
  - Made the column `estado` on table `estado` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `asignaciones` DROP FOREIGN KEY `asignaciones_estado_asignacion_fkey`;

-- DropIndex
DROP INDEX `estado_estado_key` ON `estado`;

-- AlterTable
ALTER TABLE `asignaciones` DROP COLUMN `estado_asignacion`,
    ADD COLUMN `id_estado` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `estado` MODIFY `estado` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `asignaciones_id_estado_key` ON `asignaciones`(`id_estado`);

-- AddForeignKey
ALTER TABLE `asignaciones` ADD CONSTRAINT `asignaciones_id_estado_fkey` FOREIGN KEY (`id_estado`) REFERENCES `estado`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
