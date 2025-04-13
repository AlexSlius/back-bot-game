/*
  Warnings:

  - You are about to drop the column `tineZona` on the `cities` table. All the data in the column will be lost.
  - Added the required column `tineZoneId` to the `cities` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "cities" DROP COLUMN "tineZona",
ADD COLUMN     "tineZoneId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "cities" ADD CONSTRAINT "cities_tineZoneId_fkey" FOREIGN KEY ("tineZoneId") REFERENCES "timeZones"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
