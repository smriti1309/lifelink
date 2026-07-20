-- CreateEnum
CREATE TYPE "ReplacementRequirement" AS ENUM ('SAME_BLOOD_GROUP', 'ANY_BLOOD_GROUP');

-- AlterTable
ALTER TABLE "emergency_requests" ADD COLUMN     "replacementRequirement" "ReplacementRequirement";
