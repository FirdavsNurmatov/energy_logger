-- CreateTable
CREATE TABLE "public"."energy_logs" (
    "id" BIGSERIAL NOT NULL,
    "device_id" INTEGER NOT NULL,
    "current_a" DECIMAL(65,30),
    "voltage_v" DECIMAL(65,30),
    "power_w" DECIMAL(65,30) NOT NULL,
    "createtAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "energy_logs_pkey" PRIMARY KEY ("id")
);
