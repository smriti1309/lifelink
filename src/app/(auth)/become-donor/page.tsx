import { redirect } from 'next/navigation';
import { AuthService } from '@/services/auth';
import { ProfileService } from '@/services/profile';
import { DonorService } from '@/services/donor';
import { BecomeDonorForm } from '@/components/donor/become-donor-form';

export default async function BecomeDonorPage() {
  // 1. Retrieve the current active user
  const user = await AuthService.getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  // 2. Load profile details from database
  const profile = await ProfileService.getProfile(user.id);

  // If no profile exists yet, redirect user to complete profile first
  if (!profile) {
    redirect('/profile?message=complete_profile_first');
  }

  // 3. Load corresponding donor profile if already registered
  const donorProfile = await DonorService.getDonorByProfileId(user.id);

  // 4. Structure existing donor data for form initialization
  const initialData = donorProfile
    ? {
        bloodType: donorProfile.bloodType,
        dateOfBirth: donorProfile.dateOfBirth,
        gender: donorProfile.gender,
        weight: donorProfile.weight,
        preferredContact: donorProfile.preferredContact,
        isHealthy: donorProfile.isHealthy,
        hasMedicationRestriction: donorProfile.hasMedicationRestriction,
        hadRecentSurgery: donorProfile.hadRecentSurgery,
        donatedWithinLast3Months: donorProfile.donatedWithinLast3Months,
        isAvailable: donorProfile.status === 'AVAILABLE' ? 'yes' as const : 'no' as const,
        lastDonatedAt: donorProfile.lastDonatedAt,
        emergencyContactName: donorProfile.emergencyContactName,
        emergencyContactPhone: donorProfile.emergencyContactPhone,
        emergencyContactRelation: donorProfile.emergencyContactRelation,
      }
    : null;

  return (
    <div className="flex-1 bg-muted/30 py-8 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="max-w-2xl mx-auto mb-6 text-center">
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          {initialData ? 'Update Donor Registration' : 'Become a Blood Donor'}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {initialData 
            ? 'Keep your availability, contact methods, and medical details up to date'
            : 'Join our local registry to coordinate and volunteer during emergency blood shortages'}
        </p>
      </div>
      
      <BecomeDonorForm profile={profile} initialData={initialData} />
    </div>
  );
}
