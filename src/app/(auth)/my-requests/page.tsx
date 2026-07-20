import { redirect } from 'next/navigation';
import { AuthService } from '@/services/auth';
import { RequestService } from '@/services/request';
import { MyRequestsClient } from '@/components/request/my-requests-client';

export const dynamic = 'force-dynamic';

export default async function MyRequestsPage() {
  const user = await AuthService.getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  const requests = await RequestService.getMyRequests(user.id);
  const statistics = await RequestService.getRequestStatistics(user.id);

  // Serialize Date objects to avoid Next.js serialization warnings/errors across Server/Client boundary
  const serializedRequests = requests.map(req => ({
    ...req,
    neededBy: req.neededBy.toISOString(),
    createdAt: req.createdAt.toISOString(),
    updatedAt: req.updatedAt.toISOString(),
  }));

  return (
    <div className="flex-1 bg-muted/30">
      <MyRequestsClient initialRequests={serializedRequests} statistics={statistics} />
    </div>
  );
}
