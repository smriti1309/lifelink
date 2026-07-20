import { redirect } from 'next/navigation';
import { AuthService } from '@/services/auth';
import { ProfileService } from '@/services/profile';
import { FindDonorsClient } from '@/components/donor/find-donors-client';

export default async function FindDonorsPage() {
  // 1. Enforce user authentication
  const user = await AuthService.getCurrentUser();
  if (!user) {
    redirect('/login');
  }

  // 2. Enforce profile completion before allowing donor searching
  const profile = await ProfileService.getProfile(user.id);
  if (!profile) {
    redirect('/profile?message=complete_profile_first');
  }

  return (
    <div className="flex-1 bg-muted/30 py-8 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="max-w-5xl mx-auto mb-8 text-center md:text-left">
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          Find Compatible Donors
        </h1>
        <p className="mt-2 text-sm text-muted-foreground max-w-xl">
          Search for eligible, active volunteer donors in your state and district using blood transfusion compatibility.
        </p>
      </div>

      <FindDonorsClient />
    </div>
  );
}
