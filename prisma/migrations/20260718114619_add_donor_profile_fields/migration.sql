/*
  Warnings:

  - Added the required column `dateOfBirth` to the `donor_profiles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `donatedWithinLast3Months` to the `donor_profiles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gender` to the `donor_profiles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hadRecentSurgery` to the `donor_profiles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hasMedicationRestriction` to the `donor_profiles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isEligible` to the `donor_profiles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isHealthy` to the `donor_profiles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `preferredContact` to the `donor_profiles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `weight` to the `donor_profiles` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY');

-- CreateEnum
CREATE TYPE "ContactPreference" AS ENUM ('PHONE', 'EMAIL', 'BOTH');

-- CreateEnum
CREATE TYPE "Relationship" AS ENUM ('MOTHER', 'FATHER', 'BROTHER', 'SISTER', 'SPOUSE', 'FRIEND', 'OTHER');

-- AlterTable
ALTER TABLE "donor_profiles" ADD COLUMN     "dateOfBirth" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "donatedWithinLast3Months" BOOLEAN NOT NULL,
ADD COLUMN     "emergencyContactName" TEXT,
ADD COLUMN     "emergencyContactPhone" TEXT,
ADD COLUMN     "emergencyContactRelation" "Relationship",
ADD COLUMN     "gender" "Gender" NOT NULL,
ADD COLUMN     "hadRecentSurgery" BOOLEAN NOT NULL,
ADD COLUMN     "hasMedicationRestriction" BOOLEAN NOT NULL,
ADD COLUMN     "isEligible" BOOLEAN NOT NULL,
ADD COLUMN     "isHealthy" BOOLEAN NOT NULL,
ADD COLUMN     "preferredContact" "ContactPreference" NOT NULL,
ADD COLUMN     "weight" DOUBLE PRECISION NOT NULL;
