/*
  Warnings:

  - You are about to drop the `reservations` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "reservations" DROP CONSTRAINT "reservations_gameId_fkey";

-- AlterTable
ALTER TABLE "games" ADD COLUMN     "isPlaces" BOOLEAN NOT NULL DEFAULT true,
ALTER COLUMN "places" DROP NOT NULL;

-- AlterTable
ALTER TABLE "teams" ADD COLUMN     "isReservation" BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE "reservations";
