-- CreateEnum
CREATE TYPE "DonorRequestStatus" AS ENUM ('PENDING', 'ACCEPTED', 'DECLINED', 'FULFILLED', 'EXPIRED');

-- CreateTable
CREATE TABLE "donor_requests" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "emergencyRequestId" UUID NOT NULL,
    "donorProfileId" UUID NOT NULL,
    "status" "DonorRequestStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "donor_requests_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "donor_requests_donorProfileId_status_idx" ON "donor_requests"("donorProfileId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "donor_requests_emergencyRequestId_donorProfileId_key" ON "donor_requests"("emergencyRequestId", "donorProfileId");

-- AddForeignKey
ALTER TABLE "donor_requests" ADD CONSTRAINT "donor_requests_emergencyRequestId_fkey" FOREIGN KEY ("emergencyRequestId") REFERENCES "emergency_requests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "donor_requests" ADD CONSTRAINT "donor_requests_donorProfileId_fkey" FOREIGN KEY ("donorProfileId") REFERENCES "donor_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
