import * as React from 'react';
import { HeartHandshake, ShieldCheck } from 'lucide-react';
import { getAdminDonorsAction } from '@/app/actions/admin';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DonorTable } from './donor-table';

export const metadata = {
  title: 'Donors Management | LifeLink Admin',
  description: 'Manage registered donor profiles and verification statuses.',
};

export default async function AdminDonorsPage() {
  const { donors, total } = await getAdminDonorsAction();
  const verifiedCount = donors.filter(d => d.isVerified).length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <HeartHandshake className="w-6 h-6 text-emerald-400" /> Registered Donors Directory
          </h1>
          <p className="text-xs text-slate-400">
            Review donor eligibility, blood group profiles, and toggle administrator verification status.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="border-emerald-500/30 bg-emerald-500/10 text-emerald-400 font-bold px-3 py-1 text-xs">
            Total Donors: {total}
          </Badge>
          <Badge variant="outline" className="border-blue-500/30 bg-blue-500/10 text-blue-400 font-bold px-3 py-1 text-xs">
            <ShieldCheck className="w-3.5 h-3.5 mr-1" /> Verified: {verifiedCount}
          </Badge>
        </div>
      </div>

      {/* Donors Table Card */}
      <Card className="bg-slate-950/80 border-slate-800 shadow-xl overflow-hidden">
        <CardHeader className="p-4 sm:p-6 border-b border-slate-800 flex flex-row items-center justify-between">
          <h2 className="text-sm font-bold text-white">Donor Verification Controls</h2>
        </CardHeader>
        <CardContent className="p-0">
          <DonorTable initialDonors={donors} />
        </CardContent>
      </Card>
    </div>
  );
}
