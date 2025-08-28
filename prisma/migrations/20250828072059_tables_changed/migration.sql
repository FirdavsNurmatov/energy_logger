/*
  Warnings:

  - You are about to drop the column `avg_power` on the `energy_logs_by_day` table. All the data in the column will be lost.
  - You are about to drop the column `max_power` on the `energy_logs_by_day` table. All the data in the column will be lost.
  - You are about to drop the column `min_power` on the `energy_logs_by_day` table. All the data in the column will be lost.
  - You are about to drop the column `avg_power` on the `energy_logs_by_hour` table. All the data in the column will be lost.
  - You are about to drop the column `max_power` on the `energy_logs_by_hour` table. All the data in the column will be lost.
  - You are about to drop the column `min_power` on the `energy_logs_by_hour` table. All the data in the column will be lost.
  - Added the required column `energy_kwh` to the `energy_logs_by_day` table without a default value. This is not possible if the table is not empty.
  - Added the required column `energy_kwh` to the `energy_logs_by_hour` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `energy_logs_by_day` DROP COLUMN `avg_power`,
    DROP COLUMN `max_power`,
    DROP COLUMN `min_power`,
    ADD COLUMN `energy_kwh` DECIMAL(14, 3) NOT NULL;

-- AlterTable
ALTER TABLE `energy_logs_by_hour` DROP COLUMN `avg_power`,
    DROP COLUMN `max_power`,
    DROP COLUMN `min_power`,
    ADD COLUMN `energy_kwh` DECIMAL(12, 3) NOT NULL;
