import { redirect, notFound } from 'next/navigation';
import { AuthService } from '@/services/auth';
import { ProfileService } from '@/services/profile';
import prisma from '@/lib/prisma';
import { RequestMatchesClient } from '@/components/request/request-matches-client';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function RequestMatchesPage({ params, searchParams }: PageProps) {
  // 1. Resolve path parameter
  const { id } = await params;
  const resolvedSearchParams = await searchParams;
  const success = typeof resolvedSearchParams.success === 'string' ? resolvedSearchParams.success : undefined;

  // 2. Enforce authentication
  const user = await AuthService.getCurrentUser();
  if (!user) {
    redirect('/login');
  }

  // 3. Enforce profile completeness
  const profile = await ProfileService.getProfile(user.id);
  if (!profile) {
    redirect('/profile?message=complete_profile_first');
  }

  // 4. Retrieve target EmergencyRequest from DB with detailed inclusions
  const request = await prisma.emergencyRequest.findUnique({
    where: { id },
    include: {
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

  if (!request) {
    notFound();
  }

  // 5. Verify the request is associated with the authenticated user's profile
  if (request.seekerId !== user.id) {
    redirect('/dashboard');
  }

  return (
    <div className="flex-1 bg-muted/30 py-8 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="max-w-5xl mx-auto mb-6 text-center md:text-left">
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          Automatic Donor Matching
        </h1>
        <p className="mt-2 text-sm text-muted-foreground max-w-xl">
          We found the following compatible volunteer donors in the requested location. Send them request notifications to start coordination.
        </p>
      </div>

      <RequestMatchesClient request={request} success={success} />
    </div>
  );
}
