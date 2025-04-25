/*
  Warnings:

  - You are about to drop the `_UserAuth` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `userId` to the `auths` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_UserAuth" DROP CONSTRAINT "_UserAuth_A_fkey";

-- DropForeignKey
ALTER TABLE "_UserAuth" DROP CONSTRAINT "_UserAuth_B_fkey";

-- AlterTable
ALTER TABLE "auths" ADD COLUMN     "userId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "_UserAuth";

-- AddForeignKey
ALTER TABLE "auths" ADD CONSTRAINT "auths_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
