import prisma from '@/lib/prisma';
import { Prisma, BloodType, DonorStatus, Gender, ContactPreference, Relationship, ReplacementRequirement } from '@prisma/client';
import { getCompatibleDonorGroups } from '@/lib/utils/bloodCompatibility';

export interface DonorSearchParams {
  bloodType?: BloodType;
  district?: string;
  state?: string;
  status?: DonorStatus | null;
  isEligible?: boolean;
  page?: number;
  limit?: number;
  needsBloodUnits?: boolean;
  needsReplacementDonors?: boolean;
  replacementRequirement?: ReplacementRequirement | null;
}

export class DonorService {
  /**
   * Register or update a user's donor status
   */
  static async registerDonor(data: {
    profileId: string;
    bloodType: BloodType;
    dateOfBirth: Date;
    gender: Gender;
    weight: number;
    preferredContact: ContactPreference;
    isHealthy: boolean;
    hasMedicationRestriction: boolean;
    hadRecentSurgery: boolean;
    donatedWithinLast3Months: boolean;
    isEligible: boolean;
    emergencyContactName?: string | null;
    emergencyContactPhone?: string | null;
    emergencyContactRelation?: Relationship | null;
    status?: DonorStatus;
    lastDonatedAt?: Date | null;
  }) {
    return prisma.donorProfile.upsert({
      where: { profileId: data.profileId },
      update: {
        bloodType: data.bloodType,
        dateOfBirth: data.dateOfBirth,
        gender: data.gender,
        weight: data.weight,
        preferredContact: data.preferredContact,
        isHealthy: data.isHealthy,
        hasMedicationRestriction: data.hasMedicationRestriction,
        hadRecentSurgery: data.hadRecentSurgery,
        donatedWithinLast3Months: data.donatedWithinLast3Months,
        isEligible: data.isEligible,
        emergencyContactName: data.emergencyContactName,
        emergencyContactPhone: data.emergencyContactPhone,
        emergencyContactRelation: data.emergencyContactRelation,
        status: data.status || 'AVAILABLE',
        lastDonatedAt: data.lastDonatedAt,
      },
      create: {
        profileId: data.profileId,
        bloodType: data.bloodType,
        dateOfBirth: data.dateOfBirth,
        gender: data.gender,
        weight: data.weight,
        preferredContact: data.preferredContact,
        isHealthy: data.isHealthy,
        hasMedicationRestriction: data.hasMedicationRestriction,
        hadRecentSurgery: data.hadRecentSurgery,
        donatedWithinLast3Months: data.donatedWithinLast3Months,
        isEligible: data.isEligible,
        emergencyContactName: data.emergencyContactName,
        emergencyContactPhone: data.emergencyContactPhone,
        emergencyContactRelation: data.emergencyContactRelation,
        status: data.status || 'AVAILABLE',
        lastDonatedAt: data.lastDonatedAt,
        isVerified: false,
      },
    });
  }

  /**
   * Retrieve a donor profile by its unique ID
   */
  static async getDonorById(donorId: string) {
    return prisma.donorProfile.findUnique({
      where: { id: donorId },
      include: {
        profile: true,
      },
    });
  }

  /**
   * Retrieve donor status by user UUID
   */
  static async getDonorByProfileId(profileId: string) {
    return prisma.donorProfile.findUnique({
      where: { profileId },
      include: {
        profile: true,
      },
    });
  }

  /**
   * Query available donors with location and blood type constraints
   */
  static async searchDonors(params: DonorSearchParams) {
    const { 
      bloodType, 
      district, 
      state, 
      status = 'AVAILABLE', 
      isEligible = true, 
      page = 1, 
      limit = 10,
      needsBloodUnits,
      needsReplacementDonors,
      replacementRequirement 
    } = params;
    const skip = (page - 1) * limit;

    const profileFilter: Prisma.ProfileWhereInput = {};
    let hasProfileFilter = false;

    if (district) {
      profileFilter.district = { equals: district, mode: 'insensitive' as const };
      hasProfileFilter = true;
    }

    if (state) {
      profileFilter.state = { equals: state, mode: 'insensitive' as const };
      hasProfileFilter = true;
    }

    let bloodTypeFilter = undefined;
    if (bloodType) {
      const isReplacementOnlyRequest = needsReplacementDonors && !needsBloodUnits;
      if (isReplacementOnlyRequest) {
        if (replacementRequirement === 'SAME_BLOOD_GROUP') {
          bloodTypeFilter = { equals: bloodType };
        } else if (replacementRequirement === 'ANY_BLOOD_GROUP') {
          bloodTypeFilter = undefined; // Ignore blood group matching entirely
        } else {
          bloodTypeFilter = { in: getCompatibleDonorGroups(bloodType) };
        }
      } else {
        bloodTypeFilter = { in: getCompatibleDonorGroups(bloodType) };
      }
    }

    const where: Prisma.DonorProfileWhereInput = {
      ...(status !== null && { status }),
      ...(isEligible !== undefined && { isEligible }),
      ...(bloodTypeFilter && { bloodType: bloodTypeFilter }),
      ...(hasProfileFilter && { profile: profileFilter }),
    };

    const [donors, total] = await Promise.all([
      prisma.donorProfile.findMany({
        where,
        include: {
          profile: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),
      prisma.donorProfile.count({ where }),
    ]);

    return {
      donors,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }
}
