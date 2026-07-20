import prisma from '@/lib/prisma';
import { Prisma, BloodType, RequestStatus, RequestUrgency, Gender, DonorRequestStatus, ReplacementRequirement, DonationStatus } from '@prisma/client';

export interface RequestCreateParams {
  seekerId: string;
  bloodType: BloodType;
  patientName: string;
  patientAge: number;
  patientGender: Gender;
  contactName: string;
  needsBloodUnits?: boolean;
  unitsRequired?: number;
  needsReplacementDonors?: boolean;
  replacementDonorCount?: number | null;
  replacementRequirement?: ReplacementRequirement | null;
  hospitalId?: string | null;
  hospitalName?: string | null;
  manualHospitalState?: string | null;
  manualHospitalDistrict?: string | null;
  manualHospitalAddress?: string | null;
  urgency: RequestUrgency;
  contactPhone: string;
  notes?: string | null;
  neededBy: Date;
}

export interface RequestSearchParams {
  seekerId?: string;
  bloodType?: BloodType;
  urgency?: RequestUrgency;
  status?: RequestStatus;
  district?: string;
  state?: string;
  page?: number;
  limit?: number;
}

export class RequestService {
  /**
   * File a new emergency blood or replacement donor request
   */
  static async createRequest(data: RequestCreateParams) {
    return prisma.emergencyRequest.create({
      data: {
        seekerId: data.seekerId,
        bloodType: data.bloodType,
        patientName: data.patientName,
        patientAge: data.patientAge,
        patientGender: data.patientGender,
        contactName: data.contactName,
        needsBloodUnits: data.needsBloodUnits ?? true,
        unitsRequired: data.unitsRequired ?? 1,
        needsReplacementDonors: data.needsReplacementDonors ?? false,
        replacementDonorCount: data.replacementDonorCount,
        replacementRequirement: data.replacementRequirement,
        hospitalId: data.hospitalId,
        hospitalName: data.hospitalName,
        manualHospitalState: data.manualHospitalState,
        manualHospitalDistrict: data.manualHospitalDistrict,
        manualHospitalAddress: data.manualHospitalAddress,
        urgency: data.urgency,
        status: 'ACTIVE',
        contactPhone: data.contactPhone,
        notes: data.notes,
        neededBy: data.neededBy,
      },
    });
  }

  /**
   * Retrieve an emergency request by its unique ID
   */
  static async getRequestById(id: string, userId?: string) {
    const request = await prisma.emergencyRequest.findUnique({
      where: { id },
      include: {
        seeker: true,
        hospital: true,
        donorRequests: {
          include: {
            donorProfile: {
              include: {
                profile: true,
              },
            },
          },
        },
      },
    });

    if (!request) return null;

    if (userId && request.seekerId !== userId) {
      throw new Error('Unauthorized access to this request.');
    }

    return request;
  }

  /**
   * Update details or status of an existing request
   */
  static async updateRequest(
    id: string,
    data: Partial<Omit<RequestCreateParams, 'seekerId'>> & { status?: RequestStatus }
  ) {
    return prisma.emergencyRequest.update({
      where: { id },
      data: {
        ...data,
      },
    });
  }

  /**
   * Query active or resolved requests with search parameters
   */
  static async listRequests(params: RequestSearchParams) {
    const {
      seekerId,
      bloodType,
      urgency,
      status = 'ACTIVE',
      district,
      state,
      page = 1,
      limit = 10,
    } = params;
    const skip = (page - 1) * limit;

    const where: Prisma.EmergencyRequestWhereInput = {
      status,
      ...(seekerId && { seekerId }),
      ...(bloodType && { bloodType }),
      ...(urgency && { urgency }),
    };

    // Handles hospital location matching or manual text matching
    if (district || state) {
      const hospitalClause: Prisma.HospitalWhereInput = {};
      if (district) hospitalClause.district = { equals: district, mode: 'insensitive' };
      if (state) hospitalClause.state = { equals: state, mode: 'insensitive' };
      
      const manualHospitalDistrictFilter = district ? { equals: district, mode: 'insensitive' as const } : undefined;
      const manualHospitalStateFilter = state ? { equals: state, mode: 'insensitive' as const } : undefined;

      where.OR = [
        {
          hospital: hospitalClause,
        },
        {
          manualHospitalDistrict: manualHospitalDistrictFilter,
          manualHospitalState: manualHospitalStateFilter,
        }
      ];
    }

    const [requests, total] = await Promise.all([
      prisma.emergencyRequest.findMany({
        where,
        include: {
          seeker: true,
          hospital: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),
      prisma.emergencyRequest.count({ where }),
    ]);

    return {
      requests,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Send internal requests to a list of matching donors
   */
  static async sendDonorRequests(requestId: string, donorProfileIds: string[]) {
    const records = donorProfileIds.map(donorProfileId => ({
      emergencyRequestId: requestId,
      donorProfileId,
      status: 'PENDING' as DonorRequestStatus,
    }));

    return prisma.donorRequest.createMany({
      data: records,
      skipDuplicates: true,
    });
  }

  /**
   * Respond to an individual donor blood request notification
   */
  static async respondToDonorRequest(donorRequestId: string, responseStatus: 'ACCEPTED' | 'DECLINED') {
    return prisma.$transaction(async (tx) => {
      const donorRequest = await tx.donorRequest.findUnique({
        where: { id: donorRequestId },
        include: {
          emergencyRequest: true,
          donorProfile: true,
        },
      });

      if (!donorRequest) {
        throw new Error('Blood request alert not found.');
      }

      if (responseStatus === 'ACCEPTED') {
        const donorProfile = donorRequest.donorProfile;
        if (!donorProfile) {
          throw new Error('Donor profile not found.');
        }

        if (donorProfile.isEligible === false) {
          throw new Error(
            'You are currently not eligible to donate blood because you recently completed a donation.'
          );
        }

        await tx.donorRequest.update({
          where: { id: donorRequestId },
          data: { status: 'ACCEPTED' },
        });
      } else {
        await tx.donorRequest.update({
          where: { id: donorRequestId },
          data: { status: 'DECLINED' },
        });
      }
    });
  }

  /**
   * Confirm that a donor has successfully donated blood for an emergency request
   */
  static async confirmDonation(requestId: string, donorRequestId: string, requesterUserId: string) {
    return prisma.$transaction(async (tx) => {
      // 1. Verify emergency request details and requester ownership
      const emergencyRequest = await tx.emergencyRequest.findUnique({
        where: { id: requestId },
        include: {
          donorRequests: true,
        },
      });

      if (!emergencyRequest) {
        throw new Error('Emergency request not found.');
      }

      if (emergencyRequest.seekerId !== requesterUserId) {
        throw new Error('Unauthorized. Only the request creator can confirm donations.');
      }

      // 2. Verify donor request details
      const donorRequest = await tx.donorRequest.findUnique({
        where: { id: donorRequestId },
      });

      if (!donorRequest || donorRequest.emergencyRequestId !== requestId) {
        throw new Error('Donor request not found or does not belong to this emergency request.');
      }

      if (donorRequest.status !== 'ACCEPTED') {
        throw new Error('Donation cannot be confirmed unless the donor request status is ACCEPTED.');
      }

      if (donorRequest.donationStatus === 'CONFIRMED') {
        throw new Error('This donation has already been confirmed.');
      }

      // 3. Update DonorRequest status to CONFIRMED
      await tx.donorRequest.update({
        where: { id: donorRequestId },
        data: {
          donationStatus: 'CONFIRMED',
          completedAt: new Date(),
        },
      });

      // 4. Update DonorProfile stats, eligibility, and last donation date
      const donorProfile = await tx.donorProfile.findUnique({
        where: { id: donorRequest.donorProfileId },
      });

      if (donorProfile) {
        await tx.donorProfile.update({
          where: { id: donorRequest.donorProfileId },
          data: {
            totalDonations: { increment: 1 },
            lastDonatedAt: new Date(),
            donatedWithinLast3Months: true,
            isEligible: false,
          },
        });
      }

      // Automatically expire all other pending requests for this donor across the platform
      await tx.donorRequest.updateMany({
        where: {
          donorProfileId: donorRequest.donorProfileId,
          status: 'PENDING',
          id: {
            not: donorRequestId,
          },
        },
        data: { status: 'EXPIRED' },
      });

      // 5. Check if required units are fulfilled by counting CONFIRMED donations
      const confirmedCount = await tx.donorRequest.count({
        where: {
          emergencyRequestId: requestId,
          donationStatus: 'CONFIRMED',
        },
      });

      const requiredCount = emergencyRequest.needsReplacementDonors
        ? (emergencyRequest.replacementDonorCount ?? 1)
        : (emergencyRequest.unitsRequired ?? 1);

      if (confirmedCount >= requiredCount) {
        // Lock request as FULFILLED
        await tx.emergencyRequest.update({
          where: { id: requestId },
          data: { status: 'FULFILLED' },
        });

        // Expire every remaining PENDING donor request for this emergency request
        await tx.donorRequest.updateMany({
          where: {
            emergencyRequestId: requestId,
            status: 'PENDING',
          },
          data: { status: 'EXPIRED' },
        });
      }
    });
  }

  /**
   * Fetch actionable blood request alerts sent to a donor
   */
  static async getDonorNotifications(donorProfileId: string) {
    return prisma.donorRequest.findMany({
      where: {
        donorProfileId,
        status: { not: 'DECLINED' },
      },
      include: {
        emergencyRequest: {
          include: {
            seeker: true,
            hospital: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  /**
   * Count total PENDING requests for a donor
   */
  static async getPendingBloodRequestsCount(donorProfileId: string) {
    return prisma.donorRequest.count({
      where: {
        donorProfileId,
        status: 'PENDING',
      },
    });
  }

  /**
   * Fetch all emergency requests created by a specific seeker
   */
  static async getMyRequests(userId: string) {
    const requests = await prisma.emergencyRequest.findMany({
      where: { seekerId: userId },
      include: {
        hospital: true,
        donorRequests: {
          select: {
            status: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return requests.map((req) => {
      const donorReqs = req.donorRequests;
      const acceptedCount = donorReqs.filter((r) => r.status === 'ACCEPTED').length;
      const pendingCount = donorReqs.filter((r) => r.status === 'PENDING').length;
      const declinedCount = donorReqs.filter((r) => r.status === 'DECLINED').length;

      return {
        ...req,
        acceptedCount,
        pendingCount,
        declinedCount,
        totalDonorRequests: donorReqs.length,
      };
    });
  }

  /**
   * Fetch request statistics for a specific user
   */
  static async getRequestStatistics(userId: string) {
    const requests = await prisma.emergencyRequest.findMany({
      where: { seekerId: userId },
      select: {
        status: true,
        donorRequests: {
          where: {
            status: 'PENDING',
          },
          select: {
            id: true,
          },
        },
      },
    });

    const total = requests.length;
    let active = 0;
    let fulfilled = 0;
    let cancelled = 0;
    let pendingResponses = 0;

    for (const req of requests) {
      if (req.status === 'ACTIVE') active++;
      else if (req.status === 'FULFILLED') fulfilled++;
      else if (req.status === 'CANCELLED') cancelled++;

      pendingResponses += req.donorRequests.length;
    }

    return {
      total,
      active,
      fulfilled,
      cancelled,
      pendingResponses,
    };
  }

  /**
   * Cancel an emergency request and expire its pending donor requests
   */
  static async cancelRequest(requestId: string, userId: string) {
    return prisma.$transaction(async (tx) => {
      const request = await tx.emergencyRequest.findUnique({
        where: { id: requestId },
      });

      if (!request) {
        throw new Error('Request not found.');
      }

      if (request.seekerId !== userId) {
        throw new Error('Unauthorized to cancel this request.');
      }

      if (request.status === 'FULFILLED') {
        throw new Error('Fulfilled requests cannot be cancelled.');
      }

      if (request.status === 'CANCELLED') {
        throw new Error('Request is already cancelled.');
      }

      // Mark EmergencyRequest as CANCELLED
      const updatedRequest = await tx.emergencyRequest.update({
        where: { id: requestId },
        data: { status: 'CANCELLED' },
      });

      // Mark every pending DonorRequest as EXPIRED
      await tx.donorRequest.updateMany({
        where: {
          emergencyRequestId: requestId,
          status: 'PENDING',
        },
        data: { status: 'EXPIRED' },
      });

      return updatedRequest;
    });
  }
}

