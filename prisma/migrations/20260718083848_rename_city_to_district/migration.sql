/*
  Warnings:

  - You are about to drop the column `city` on the `hospitals` table. All the data in the column will be lost.
  - You are about to drop the column `city` on the `profiles` table. All the data in the column will be lost.
  - Added the required column `district` to the `hospitals` table without a default value. This is not possible if the table is not empty.
  - Added the required column `district` to the `profiles` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "hospitals_city_state_idx";

-- AlterTable
ALTER TABLE "hospitals" DROP COLUMN "city",
ADD COLUMN     "district" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "profiles" DROP COLUMN "city",
ADD COLUMN     "district" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "hospitals_district_state_idx" ON "hospitals"("district", "state");
