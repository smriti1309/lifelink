import { redirect } from 'next/navigation';
import { AuthService } from '@/services/auth';
import { ProfileService } from '@/services/profile';
import { RequestService } from '@/services/request';
import { DonorService } from '@/services/donor';
import { NotificationsList } from '@/components/notifications/notifications-list';

export const dynamic = 'force-dynamic';

export default async function NotificationsPage() {
  // 1. Enforce user authentication
  const user = await AuthService.getCurrentUser();
  if (!user) {
    redirect('/login');
  }

  // 2. Enforce profile completeness
  const profile = await ProfileService.getProfile(user.id);
  if (!profile) {
    redirect('/profile?message=complete_profile_first');
  }

  // 3. Load donor profile and request alerts from database
  const donorProfile = await DonorService.getDonorByProfileId(user.id);
  const notifications = donorProfile
    ? await RequestService.getDonorNotifications(donorProfile.id)
    : [];

  const isDonorEligible = donorProfile ? donorProfile.isEligible : true;

  // 4. Safely serialize presentation properties and dates for client component compatibility
  const serializedNotifications = notifications.map((n) => {
    const isPending = n.status === 'PENDING';
    const isAccepted = n.status === 'ACCEPTED' && n.donationStatus !== 'CONFIRMED';
    const isConfirmed = n.donationStatus === 'CONFIRMED';
    const isFulfilled = n.status === 'FULFILLED' && n.donationStatus !== 'CONFIRMED';
    const isDeclined = n.status === 'DECLINED';
    const isExpired = n.status === 'EXPIRED';

    let displayStatus = 'Pending';
    let badgeVariant = 'warning';
    let canRespond = false;
    let deferredReason: string | null = null;

    if (isConfirmed) {
      displayStatus = 'Donation Confirmed';
      badgeVariant = 'confirmed';
    } else if (isAccepted) {
      displayStatus = 'Accepted';
      badgeVariant = 'success';
    } else if (isFulfilled) {
      displayStatus = 'Fulfilled / Closed';
      badgeVariant = 'secondary';
    } else if (isDeclined) {
      displayStatus = 'Declined';
      badgeVariant = 'destructive';
    } else if (isExpired) {
      displayStatus = isDonorEligible ? 'Unavailable' : 'Donation Window Closed';
      badgeVariant = 'secondary';
      if (!isDonorEligible) {
        deferredReason = 'You recently donated blood and are temporarily deferred until your next eligible donation date.';
      }
    } else if (isPending) {
      if (!isDonorEligible) {
        displayStatus = 'Unavailable';
        badgeVariant = 'secondary';
        deferredReason = 'You recently donated blood and are temporarily deferred until your next eligible donation date.';
      } else {
        displayStatus = 'Pending';
        badgeVariant = 'warning';
        canRespond = true;
      }
    }

    return {
      id: n.id,
      status: n.status,
      donationStatus: n.donationStatus,
      completedAt: n.completedAt ? n.completedAt.toISOString() : null,
      createdAt: typeof n.createdAt === 'string' ? n.createdAt : n.createdAt.toISOString(),
      displayStatus,
      badgeVariant,
      canRespond,
      deferredReason,
      emergencyRequest: {
        id: n.emergencyRequest.id,
        bloodType: n.emergencyRequest.bloodType,
        needsBloodUnits: n.emergencyRequest.needsBloodUnits,
        unitsRequired: n.emergencyRequest.unitsRequired,
        needsReplacementDonors: n.emergencyRequest.needsReplacementDonors,
        replacementDonorCount: n.emergencyRequest.replacementDonorCount,
        urgency: n.emergencyRequest.urgency,
        contactName: n.emergencyRequest.contactName,
        contactPhone: n.emergencyRequest.contactPhone,
        notes: n.emergencyRequest.notes,
        neededBy: typeof n.emergencyRequest.neededBy === 'string' ? n.emergencyRequest.neededBy : n.emergencyRequest.neededBy.toISOString(),
        hospitalName: n.emergencyRequest.hospitalName,
        manualHospitalAddress: n.emergencyRequest.manualHospitalAddress,
        manualHospitalDistrict: n.emergencyRequest.manualHospitalDistrict,
        manualHospitalState: n.emergencyRequest.manualHospitalState,
        hospital: n.emergencyRequest.hospital ? {
          name: n.emergencyRequest.hospital.name,
          district: n.emergencyRequest.hospital.district,
          state: n.emergencyRequest.hospital.state,
          address: n.emergencyRequest.hospital.address,
        } : null,
      },
    };
  });

  return (
    <div className="flex-1 bg-muted/30 py-8 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="max-w-3xl mx-auto mb-8 text-center md:text-left">
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          Pending Blood Requests
        </h1>
        <p className="mt-2 text-sm text-muted-foreground max-w-xl">
          Review and respond to active emergency blood request alerts matched to your profile compatibility and location.
        </p>
      </div>

      <NotificationsList notifications={serializedNotifications} />
    </div>
  );
}
