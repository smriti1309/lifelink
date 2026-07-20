import { redirect } from 'next/navigation';
import { AuthService } from '@/services/auth';
import { ProfileService } from '@/services/profile';
import { EmergencyRequestForm } from '@/components/request/emergency-request-form';

export default async function NewRequestPage() {
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

  return (
    <div className="flex-1 bg-muted/30 py-8 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="max-w-2xl mx-auto mb-6 text-center">
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          File Emergency Blood Request
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Enter patient requirement details to coordinate transfusions or seek replacement donors
        </p>
      </div>

      <EmergencyRequestForm 
        seekerProfile={{
          fullName: profile.fullName,
          phone: profile.phone
        }} 
      />
    </div>
  );
}
