import { notFound, redirect } from 'next/navigation';
import { AuthService } from '@/services/auth';
import { getRequestDetails } from '@/app/actions/request';
import { RequestDetailsClient } from '@/components/request/request-details-client';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function RequestDetailsPage({ params }: PageProps) {
  const user = await AuthService.getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  const { id } = await params;
  const res = await getRequestDetails(id);

  if (!res.success || !res.request) {
    notFound();
  }

  // Serialize Date objects to avoid serialization warnings/errors across Next.js Server/Client boundary
  const serializedRequest = {
    ...res.request,
    neededBy: res.request.neededBy.toISOString(),
    createdAt: res.request.createdAt.toISOString(),
    updatedAt: res.request.updatedAt.toISOString(),
    seeker: {
      fullName: res.request.seeker.fullName,
      email: res.request.seeker.email,
      phone: res.request.seeker.phone,
    },
    donorRequests: res.request.donorRequests.map((dr: any) => ({
      ...dr,
      createdAt: dr.createdAt.toISOString(),
      updatedAt: dr.updatedAt.toISOString(),
      completedAt: dr.completedAt ? (typeof dr.completedAt === 'string' ? dr.completedAt : dr.completedAt.toISOString()) : null,
      donorProfile: {
        ...dr.donorProfile,
        lastDonatedAt: dr.donorProfile.lastDonatedAt 
          ? (typeof dr.donorProfile.lastDonatedAt === 'string' ? dr.donorProfile.lastDonatedAt : dr.donorProfile.lastDonatedAt.toISOString())
          : null,
      }
    }))
  };

  return (
    <div className="flex-1 bg-muted/30">
      <RequestDetailsClient request={serializedRequest as any} />
    </div>
  );
}
