-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "BloodType" AS ENUM ('A_PLUS', 'A_MINUS', 'B_PLUS', 'B_MINUS', 'AB_PLUS', 'AB_MINUS', 'O_PLUS', 'O_MINUS');

-- CreateEnum
CREATE TYPE "DonorStatus" AS ENUM ('AVAILABLE', 'TEMPORARILY_UNAVAILABLE');

-- CreateEnum
CREATE TYPE "RequestUrgency" AS ENUM ('IMMEDIATE', 'URGENT', 'NORMAL');

-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('ACTIVE', 'FULFILLED', 'CANCELLED', 'EXPIRED');

-- CreateTable
CREATE TABLE "profiles" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "phone" TEXT,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "donor_profiles" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "profileId" UUID NOT NULL,
    "bloodType" "BloodType" NOT NULL,
    "status" "DonorStatus" NOT NULL DEFAULT 'AVAILABLE',
    "lastDonatedAt" TIMESTAMP(3),
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "donor_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hospitals" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hospitals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "emergency_requests" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "seekerId" UUID NOT NULL,
    "bloodType" "BloodType" NOT NULL,
    "needsBloodUnits" BOOLEAN NOT NULL DEFAULT true,
    "unitsRequired" INTEGER NOT NULL DEFAULT 1,
    "needsReplacementDonors" BOOLEAN NOT NULL DEFAULT false,
    "replacementDonorCount" INTEGER,
    "hospitalId" UUID,
    "hospitalName" TEXT,
    "urgency" "RequestUrgency" NOT NULL DEFAULT 'NORMAL',
    "status" "RequestStatus" NOT NULL DEFAULT 'ACTIVE',
    "contactPhone" TEXT NOT NULL,
    "notes" TEXT,
    "neededBy" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "emergency_requests_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "profiles_email_key" ON "profiles"("email");

-- CreateIndex
CREATE UNIQUE INDEX "donor_profiles_profileId_key" ON "donor_profiles"("profileId");

-- CreateIndex
CREATE INDEX "donor_profiles_bloodType_status_idx" ON "donor_profiles"("bloodType", "status");

-- CreateIndex
CREATE INDEX "hospitals_city_state_idx" ON "hospitals"("city", "state");

-- CreateIndex
CREATE INDEX "emergency_requests_bloodType_status_idx" ON "emergency_requests"("bloodType", "status");

-- CreateIndex
CREATE INDEX "emergency_requests_status_idx" ON "emergency_requests"("status");

-- CreateIndex
CREATE INDEX "emergency_requests_createdAt_idx" ON "emergency_requests"("createdAt");

-- CreateIndex
CREATE INDEX "emergency_requests_urgency_idx" ON "emergency_requests"("urgency");

-- AddForeignKey
ALTER TABLE "donor_profiles" ADD CONSTRAINT "donor_profiles_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "emergency_requests" ADD CONSTRAINT "emergency_requests_seekerId_fkey" FOREIGN KEY ("seekerId") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "emergency_requests" ADD CONSTRAINT "emergency_requests_hospitalId_fkey" FOREIGN KEY ("hospitalId") REFERENCES "hospitals"("id") ON DELETE SET NULL ON UPDATE CASCADE;

