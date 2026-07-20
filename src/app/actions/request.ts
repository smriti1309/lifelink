'use server';

import { createClient } from '@/lib/supabase/server';
import { RequestService } from '@/services/request';
import { AdminService } from '@/services/admin';
import { EmergencyRequestSchema, type EmergencyRequestInput } from '@/lib/validators/request';
import { revalidatePath } from 'next/cache';

/**
 * Server Action to fetch hospitals by State and District
 */
export async function fetchHospitals(state: string, district: string) {
  try {
    const hospitals = await AdminService.getHospitalsByLocation(state, district);
    return {
      success: true,
      hospitals: hospitals.map(h => ({
        id: h.id,
        name: h.name,
        address: h.address
      }))
    };
  } catch (error) {
    console.error('Error fetching hospitals:', error);
    return {
      success: false,
      error: 'Failed to fetch registered hospitals.',
      hospitals: []
    };
  }
}

/**
 * Server Action to create a new Emergency Blood Request
 */
export async function createBloodRequest(data: EmergencyRequestInput) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return {
      success: false,
      error: 'Unauthorized. Please sign in.',
    };
  }

  // Validate fields server-side
  const result = EmergencyRequestSchema.safeParse(data);
  if (!result.success) {
    return {
      success: false,
      error: result.error.issues[0]?.message || 'Validation failed.',
    };
  }

  const validatedData = result.data;

  try {
    // Map hospital fields depending on selection type
    const isRegistered = validatedData.hospitalSelectType === 'registered';

    const request = await RequestService.createRequest({
      seekerId: user.id,
      bloodType: validatedData.bloodType,
      patientName: validatedData.patientName,
      patientAge: validatedData.patientAge,
      patientGender: validatedData.patientGender,
      contactName: validatedData.contactName,
      needsBloodUnits: validatedData.needsBloodUnits,
      unitsRequired: validatedData.unitsRequired,
      needsReplacementDonors: validatedData.needsReplacementDonors,
      replacementDonorCount: validatedData.needsReplacementDonors ? validatedData.replacementDonorCount : null,
      replacementRequirement: validatedData.needsReplacementDonors ? validatedData.replacementRequirement : null,
      hospitalId: isRegistered ? validatedData.hospitalId || null : null,
      hospitalName: isRegistered ? null : validatedData.hospitalName || null,
      manualHospitalState: isRegistered ? null : validatedData.state,
      manualHospitalDistrict: isRegistered ? null : validatedData.district,
      manualHospitalAddress: isRegistered ? null : validatedData.manualHospitalAddress || null,
      urgency: validatedData.urgency,
      contactPhone: validatedData.contactPhone,
      notes: validatedData.notes || null,
      neededBy: validatedData.neededBy,
    });

    // Revalidate affected cache paths
    revalidatePath('/dashboard');
    revalidatePath('/my-requests');
    revalidatePath('/emergency-requests');

    return {
      success: true,
      requestId: request.id,
    };
  } catch (error) {
    console.error('Error creating emergency blood request:', error);
    const message = error instanceof Error ? error.message : 'Failed to file emergency request.';
    return {
      success: false,
      error: message,
    };
  }
}

/**
 * Server Action to fetch logged-in user's emergency requests and statistics
 */
export async function getMyRequests() {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return {
      success: false,
      error: 'Unauthorized. Please sign in.',
    };
  }

  try {
    const requests = await RequestService.getMyRequests(user.id);
    const statistics = await RequestService.getRequestStatistics(user.id);
    return {
      success: true,
      requests,
      statistics,
    };
  } catch (error) {
    console.error('Error fetching my requests:', error);
    return {
      success: false,
      error: 'Failed to fetch your requests.',
    };
  }
}

/**
 * Server Action to retrieve detailed emergency request data with donor privacy filters
 */
export async function getRequestDetails(requestId: string) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return {
      success: false,
      error: 'Unauthorized. Please sign in.',
    };
  }

  try {
    const request = await RequestService.getRequestById(requestId, user.id);
    if (!request) {
      return {
        success: false,
        error: 'Request not found.',
      };
    }

    // Apply strict donor contact privacy scrubbing unless request status is ACCEPTED
    const sanitizedDonorRequests = request.donorRequests.map((dr) => {
      const donorProfile = dr.donorProfile;
      const profile = donorProfile.profile;
      const isAccepted = dr.status === 'ACCEPTED';

      return {
        id: dr.id,
        status: dr.status,
        createdAt: dr.createdAt,
        updatedAt: dr.updatedAt,
        donorProfile: {
          id: donorProfile.id,
          bloodType: donorProfile.bloodType,
          lastDonatedAt: donorProfile.lastDonatedAt,
          profile: {
            fullName: profile.fullName,
            phone: isAccepted ? profile.phone : null,
            email: isAccepted ? profile.email : null,
            district: isAccepted ? profile.district : null,
            state: isAccepted ? profile.state : null,
          },
        },
      };
    });

    const acceptedCount = request.donorRequests.filter((r) => r.status === 'ACCEPTED').length;
    const pendingCount = request.donorRequests.filter((r) => r.status === 'PENDING').length;
    const declinedCount = request.donorRequests.filter((r) => r.status === 'DECLINED').length;

    const requestWithStats = {
      ...request,
      donorRequests: sanitizedDonorRequests,
      acceptedCount,
      pendingCount,
      declinedCount,
      totalDonorRequests: request.donorRequests.length,
    };

    return {
      success: true,
      request: requestWithStats,
    };
  } catch (error) {
    console.error('Error fetching request details:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch request details.',
    };
  }
}

/**
 * Server Action to cancel an active Emergency Request
 */
export async function cancelEmergencyRequest(requestId: string) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return {
      success: false,
      error: 'Unauthorized. Please sign in.',
    };
  }

  try {
    await RequestService.cancelRequest(requestId, user.id);

    revalidatePath('/dashboard');
    revalidatePath('/my-requests');
    revalidatePath(`/my-requests/${requestId}`);

    return {
      success: true,
    };
  } catch (error) {
    console.error('Error cancelling emergency request:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to cancel request.',
    };
  }
}

/**
 * Server Action to confirm a donor's blood donation was successfully completed
 */
export async function confirmDonationAction(requestId: string, donorRequestId: string) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return {
      success: false,
      error: 'Unauthorized. Please sign in.',
    };
  }

  try {
    await RequestService.confirmDonation(requestId, donorRequestId, user.id);

    revalidatePath('/dashboard');
    revalidatePath('/my-requests');
    revalidatePath(`/my-requests/${requestId}`);
    revalidatePath('/notifications');

    return {
      success: true,
    };
  } catch (error) {
    console.error('Error confirming donation:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to confirm donation.',
    };
  }
}

