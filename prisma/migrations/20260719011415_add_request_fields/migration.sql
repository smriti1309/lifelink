/*
  Warnings:

  - Added the required column `contactName` to the `emergency_requests` table without a default value. This is not possible if the table is not empty.
  - Added the required column `patientAge` to the `emergency_requests` table without a default value. This is not possible if the table is not empty.
  - Added the required column `patientGender` to the `emergency_requests` table without a default value. This is not possible if the table is not empty.
  - Added the required column `patientName` to the `emergency_requests` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "emergency_requests" ADD COLUMN     "contactName" TEXT NOT NULL,
ADD COLUMN     "manualHospitalAddress" TEXT,
ADD COLUMN     "manualHospitalDistrict" TEXT,
ADD COLUMN     "manualHospitalState" TEXT,
ADD COLUMN     "patientAge" INTEGER NOT NULL,
ADD COLUMN     "patientGender" "Gender" NOT NULL,
ADD COLUMN     "patientName" TEXT NOT NULL;
