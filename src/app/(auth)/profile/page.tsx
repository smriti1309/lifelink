import { redirect } from 'next/navigation';
import { AuthService } from '@/services/auth';
import { ProfileService } from '@/services/profile';
import { ProfileForm } from '@/components/profile/profile-form';

export default async function ProfilePage() {
  // 1. Retrieve the current active user details on the server
  const user = await AuthService.getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  // 2. Load corresponding profile from Prisma database
  let profile = null;
  try {
    profile = await ProfileService.getProfile(user.id);
  } catch (error) {
    console.error('Error in ProfileService.getProfile:', error);
    throw error;
  }

  // 3. Structure data for form initialization
  const initialData = profile
    ? {
        fullName: profile.fullName,
        phone: profile.phone,
        district: profile.district,
        state: profile.state,
      }
    : null;

  return (
    <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-muted/30 animate-fade-in">
      <div className="w-full max-w-lg">
        <ProfileForm initialData={initialData} />
      </div>
    </div>
  );
}
