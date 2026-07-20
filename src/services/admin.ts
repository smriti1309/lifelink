import prisma from '@/lib/prisma';

export class AdminService {
  /**
   * Get system-wide counts and statistics for the admin dashboard
   */
  static async getOverviewMetrics() {
    const [
      totalProfiles,
      totalDonors,
      verifiedDonors,
      activeRequests,
      pendingDonorsCount,
    ] = await Promise.all([
      prisma.profile.count(),
      prisma.donorProfile.count(),
      prisma.donorProfile.count({ where: { isVerified: true } }),
      prisma.emergencyRequest.count({ where: { status: 'ACTIVE' } }),
      prisma.donorProfile.count({ where: { isVerified: false } }),
    ]);

    return {
      totalProfiles,
      totalDonors,
      verifiedDonors,
      activeRequests,
      pendingDonorsCount,
    };
  }

  /**
   * Toggle the verification status of a donor profile
   */
  static async toggleDonorVerification(donorProfileId: string, isVerified: boolean) {
    return prisma.donorProfile.update({
      where: { id: donorProfileId },
      data: { isVerified },
    });
  }

  /**
   * Pre-register a new hospital entity
   */
  static async registerHospital(data: {
    name: string;
    district: string;
    state: string;
    address: string;
    isVerified?: boolean;
  }) {
    return prisma.hospital.create({
      data: {
        name: data.name,
        district: data.district,
        state: data.state,
        address: data.address,
        isVerified: data.isVerified ?? false,
      },
    });
  }

  /**
   * Toggle the verification status of a hospital
   */
  static async toggleHospitalVerification(hospitalId: string, isVerified: boolean) {
    return prisma.hospital.update({
      where: { id: hospitalId },
      data: { isVerified },
    });
  }

  /**
   * List all registered user profiles
   */
  static async listProfiles(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const [profiles, total] = await Promise.all([
      prisma.profile.findMany({
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.profile.count(),
    ]);

    return {
      profiles,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Get hospitals by state and district
   */
  static async getHospitalsByLocation(state: string, district: string) {
    return prisma.hospital.findMany({
      where: {
        state: { equals: state, mode: 'insensitive' as const },
        district: { equals: district, mode: 'insensitive' as const },
        isVerified: true,
      },
      orderBy: { name: 'asc' },
    });
  }
}
