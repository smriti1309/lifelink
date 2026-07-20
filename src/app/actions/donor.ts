'use server';

import { createClient } from '@/lib/supabase/server';
import { DonorService } from '@/services/donor';
import { RequestService } from '@/services/request';
import { ProfileService } from '@/services/profile';
import { BloodType, DonorStatus, ReplacementRequirement } from '@prisma/client';
import { BecomeDonorSchema, type BecomeDonorInput } from '@/lib/validators/donor';
import { revalidatePath } from 'next/cache';
import prisma from '@/lib/prisma';


/**
 * Search compatible donors for matching queries
 * Hides sensitive details and phone numbers for privacy.
 */
export async function searchCompatibleDonors(params: {
  bloodType: BloodType;
  state: string;
  district: string;
  availableOnly: boolean;
  eligibleOnly: boolean;
  needsBloodUnits?: boolean;
  needsReplacementDonors?: boolean;
  replacementRequirement?: ReplacementRequirement | null;
}) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return {
      success: false,
      error: 'Unauthorized. Please sign in.',
      donors: [],
    };
  }

  // Profile check
  const profile = await ProfileService.getProfile(user.id);
  if (!profile) {
    return {
      success: false,
      error: 'Profile incomplete.',
      donors: [],
    };
  }

  try {
    const searchParams = {
      bloodType: params.bloodType,
      state: params.state || undefined,
      district: params.district || undefined,
      status: params.availableOnly ? ('AVAILABLE' as DonorStatus) : null,
      isEligible: params.eligibleOnly ? true : undefined,
      limit: 100,
      needsBloodUnits: params.needsBloodUnits,
      needsReplacementDonors: params.needsReplacementDonors,
      replacementRequirement: params.replacementRequirement,
    };

    const result = await DonorService.searchDonors(searchParams);

    return {
      success: true,
      donors: result.donors.map(d => ({
        id: d.id, // Use the primary key of the donor profile
        fullName: d.profile.fullName,
        bloodType: d.bloodType,
        state: d.profile.state,
        district: d.profile.district,
        status: d.status,
        preferredContact: d.preferredContact,
        // Phone numbers are explicitly omitted from search results for privacy
      })),
    };
  } catch (error) {
    console.error('Error searching compatible donors:', error);
    return {
      success: false,
      error: 'Failed to search donors.',
      donors: [],
    };
  }
}

/**
 * Dispatch internal blood request notifications to selected donors
 */
export async function sendInternalBloodRequests(requestId: string, donorProfileIds: string[]) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return {
      success: false,
      error: 'Unauthorized. Please sign in.',
    };
  }

  if (!donorProfileIds || donorProfileIds.length === 0) {
    return {
      success: false,
      error: 'No donors selected.',
    };
  }

  try {
    await RequestService.sendDonorRequests(requestId, donorProfileIds);
    revalidatePath(`/request/${requestId}/matches`);
    revalidatePath('/dashboard');

    return {
      success: true,
    };
  } catch (error) {
    console.error('Error sending donor blood requests:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send requests to donors.',
    };
  }
}

/**
 * Donor response to a pending emergency blood request
 */
export async function respondToBloodRequest(donorRequestId: string, accept: boolean) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return {
      success: false,
      error: 'Unauthorized. Please sign in.',
    };
  }

  try {
    await RequestService.respondToDonorRequest(donorRequestId, accept ? 'ACCEPTED' : 'DECLINED');
    
    revalidatePath('/notifications');
    revalidatePath('/dashboard');

    return {
      success: true,
    };
  } catch (error) {
    console.error('Error responding to blood request:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to process request response.',
    };
  }
}

/**
 * Get the pending blood requests count for the active donor
 */
export async function getPendingBloodRequestsCountAction() {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return 0;
  }

  try {
    const donorProfile = await DonorService.getDonorByProfileId(user.id);
    if (!donorProfile) return 0;
    const count = await RequestService.getPendingBloodRequestsCount(donorProfile.id);
    return count;
  } catch (error) {
    console.error('Error getting pending count:', error);
    return 0;
  }
}

/**
 * Save or update donor profile details
 */
export async function saveDonorProfile(data: BecomeDonorInput) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return {
      success: false,
      error: 'Unauthorized. Please sign in.',
    };
  }

  // Validate fields server-side
  const result = BecomeDonorSchema.safeParse(data);
  if (!result.success) {
    return {
      success: false,
      error: result.error.issues[0]?.message || 'Validation failed.',
    };
  }

  const validatedData = result.data;

  try {
    const isEligible = 
      validatedData.isHealthy === true &&
      validatedData.hasMedicationRestriction === false &&
      validatedData.hadRecentSurgery === false &&
      validatedData.donatedWithinLast3Months === false;

    await DonorService.registerDonor({
      profileId: user.id,
      bloodType: validatedData.bloodType,
      dateOfBirth: validatedData.dateOfBirth,
      gender: validatedData.gender,
      weight: validatedData.weight,
      preferredContact: validatedData.preferredContact,
      isHealthy: validatedData.isHealthy,
      hasMedicationRestriction: validatedData.hasMedicationRestriction,
      hadRecentSurgery: validatedData.hadRecentSurgery,
      donatedWithinLast3Months: validatedData.donatedWithinLast3Months,
      isEligible,
      emergencyContactName: validatedData.emergencyContactName || null,
      emergencyContactPhone: validatedData.emergencyContactPhone || null,
      emergencyContactRelation: validatedData.emergencyContactRelation || null,
      status: validatedData.isAvailable === 'yes' ? ('AVAILABLE' as DonorStatus) : ('BUSY' as DonorStatus),
      lastDonatedAt: validatedData.hasDonatedBefore === 'yes' ? validatedData.lastDonatedAt || null : null,
    });

    revalidatePath('/dashboard');
    revalidatePath('/profile');

    return {
      success: true,
      isEligible,
    };
  } catch (error: any) {
    console.error('Error saving donor profile:', error);
    return {
      success: false,
      error: error?.message || 'Failed to save donor details.',
    };
  }
}

/**
 * Toggle the availability status of the authenticated donor
 */
export async function toggleDonorAvailability() {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return {
      success: false,
      error: 'Unauthorized. Please sign in.',
    };
  }

  try {
    const donorProfile = await DonorService.getDonorByProfileId(user.id);
    if (!donorProfile) {
      return {
        success: false,
        error: 'Donor profile not found.',
      };
    }

    const nextStatus = donorProfile.status === 'AVAILABLE' 
      ? 'TEMPORARILY_UNAVAILABLE' 
      : 'AVAILABLE';

    await prisma.donorProfile.update({
      where: { id: donorProfile.id },
      data: { status: nextStatus },
    });

    revalidatePath('/dashboard');

    return {
      success: true,
      status: nextStatus,
    };
  } catch (error) {
    console.error('Error toggling donor availability:', error);
    return {
      success: false,
      error: 'Failed to toggle availability status.',
    };
  }
}

/**
 * Server Action to fetch full donor information including coordination statistics
 */
export async function getDetailedDonorStats() {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return {
      success: false,
      error: 'Unauthorized. Please sign in.',
    };
  }

  try {
    const donorProfile = await prisma.donorProfile.findUnique({
      where: { profileId: user.id },
      include: {
        profile: true,
        donorRequests: {
          select: {
            id: true,
            status: true,
            donationStatus: true,
          },
        },
      },
    });

    if (!donorProfile) {
      return {
        success: false,
        error: 'Donor profile not found.',
      };
    }

    const donorReqs = donorProfile.donorRequests;
    const pendingCount = donorReqs.filter(r => r.status === 'PENDING').length;
    const acceptedCount = donorReqs.filter(r => r.status === 'ACCEPTED' && r.donationStatus !== 'CONFIRMED').length;
    const completedCount = donorReqs.filter(r => r.donationStatus === 'CONFIRMED').length;

    let nextEligibleDate: string | null = null;
    if (donorProfile.lastDonatedAt) {
      const nextDate = new Date(donorProfile.lastDonatedAt);
      nextDate.setMonth(nextDate.getMonth() + 3);
      nextEligibleDate = nextDate.toISOString();
    }

    // Query confirmed donation history
    const completedDonations = await prisma.donorRequest.findMany({
      where: {
        donorProfileId: donorProfile.id,
        donationStatus: 'CONFIRMED',
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
        completedAt: 'desc',
      },
    });

    const donationHistory = completedDonations.map((dr) => {
      const req = dr.emergencyRequest;
      let requestType = 'Direct Units';
      if (req.needsReplacementDonors && !req.needsBloodUnits) {
        requestType = 'Replacement Only';
      } else if (req.needsReplacementDonors && req.needsBloodUnits) {
        requestType = 'Units & Replacement';
      }

      return {
        id: dr.id,
        donationDate: dr.completedAt ? dr.completedAt.toISOString() : dr.updatedAt.toISOString(),
        hospital: req.hospital?.name || req.hospitalName || 'Manual Entry',
        bloodGroup: req.bloodType,
        requestType,
        requester: req.seeker.fullName,
        status: 'Confirmed',
      };
    });

    return {
      success: true,
      donor: {
        id: donorProfile.id,
        bloodType: donorProfile.bloodType,
        status: donorProfile.status,
        isEligible: donorProfile.isEligible,
        lastDonatedAt: donorProfile.lastDonatedAt ? donorProfile.lastDonatedAt.toISOString() : null,
        pendingRequestsCount: pendingCount,
        acceptedRequestsCount: acceptedCount,
        completedDonationsCount: completedCount,
        totalDonationsCount: donorProfile.totalDonations,
        nextEligibleDate,
        donationHistory,
        fullName: donorProfile.profile.fullName,
      },
    };
  } catch (error) {
    console.error('Error fetching detailed donor statistics:', error);
    return {
      success: false,
      error: 'Failed to retrieve donor details.',
    };
  }
}

