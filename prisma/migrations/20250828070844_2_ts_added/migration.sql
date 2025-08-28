-- CreateTable
CREATE TABLE `energy_logs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `device_id` INTEGER NOT NULL,
    `current_a` DECIMAL(10, 3) NULL,
    `voltage_v` DECIMAL(10, 3) NULL,
    `power_w` DECIMAL(10, 3) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `energy_logs_by_hour` (
    `hour` DATETIME(3) NOT NULL,
    `device_id` INTEGER NOT NULL,
    `avg_power` DECIMAL(10, 3) NOT NULL,
    `min_power` DECIMAL(10, 3) NOT NULL,
    `max_power` DECIMAL(10, 3) NOT NULL,

    PRIMARY KEY (`hour`, `device_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `energy_logs_by_day` (
    `day` DATETIME(3) NOT NULL,
    `device_id` INTEGER NOT NULL,
    `avg_power` DECIMAL(10, 3) NOT NULL,
    `min_power` DECIMAL(10, 3) NOT NULL,
    `max_power` DECIMAL(10, 3) NOT NULL,

    PRIMARY KEY (`day`, `device_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
