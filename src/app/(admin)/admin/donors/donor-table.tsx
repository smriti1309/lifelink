'use client';

import * as React from 'react';
import { HeartHandshake, Mail, Phone, MapPin, CheckCircle2, XCircle, ShieldCheck } from 'lucide-react';
import { toggleDonorVerificationAction } from '@/app/actions/admin';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface DonorItem {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  bloodType: string;
  district: string;
  state: string;
  status: string;
  isVerified: boolean;
  totalDonations: number;
  createdAt: string;
}

export function DonorTable({ initialDonors }: { initialDonors: DonorItem[] }) {
  const [donors, setDonors] = React.useState<DonorItem[]>(initialDonors);
  const [loadingId, setLoadingId] = React.useState<string | null>(null);

  const handleToggleVerification = async (donorId: string, currentStatus: boolean) => {
    setLoadingId(donorId);
    try {
      const result = await toggleDonorVerificationAction(donorId, currentStatus);
      if (result.success) {
        setDonors(prev =>
          prev.map(d => (d.id === donorId ? { ...d, isVerified: result.isVerified ?? !currentStatus } : d))
        );
      }
    } catch (err) {
      console.error('Error toggling verification:', err);
    } finally {
      setLoadingId(null);
    }
  };

  const formatBloodType = (type: string) => {
    return type.replace('_PLUS', '+').replace('_MINUS', '-');
  };

  if (donors.length === 0) {
    return (
      <div className="p-12 text-center text-slate-500 space-y-2">
        <HeartHandshake className="w-8 h-8 mx-auto text-slate-600" />
        <p className="text-sm">No registered donor profiles found.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs text-slate-300">
        <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider font-semibold text-[10px] border-b border-slate-800">
          <tr>
            <th className="px-6 py-3.5">Donor Name</th>
            <th className="px-6 py-3.5">Blood Type</th>
            <th className="px-6 py-3.5">Contact Details</th>
            <th className="px-6 py-3.5">Location</th>
            <th className="px-6 py-3.5">Status</th>
            <th className="px-6 py-3.5">Verification</th>
            <th className="px-6 py-3.5 text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60">
          {donors.map((donor) => (
            <tr key={donor.id} className="hover:bg-slate-900/50 transition-colors">
              <td className="px-6 py-4">
                <div className="font-bold text-white text-sm">{donor.fullName}</div>
                <p className="text-[11px] text-slate-500 font-mono">Total Donations: {donor.totalDonations}</p>
              </td>

              <td className="px-6 py-4">
                <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-black bg-primary/10 border border-primary/30 text-primary">
                  {formatBloodType(donor.bloodType)}
                </span>
              </td>

              <td className="px-6 py-4 space-y-1">
                <div className="flex items-center gap-1.5 text-slate-300">
                  <Mail className="w-3.5 h-3.5 text-slate-500" />
                  <span>{donor.email}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-400">
                  <Phone className="w-3.5 h-3.5 text-slate-500" />
                  <span>{donor.phone}</span>
                </div>
              </td>

              <td className="px-6 py-4">
                <div className="flex items-center gap-1.5 text-slate-300">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  <span>{donor.district}, {donor.state}</span>
                </div>
              </td>

              <td className="px-6 py-4">
                <Badge
                  variant="outline"
                  className={
                    donor.status === 'AVAILABLE'
                      ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400 font-bold'
                      : 'border-amber-500/30 bg-amber-500/10 text-amber-400 font-medium'
                  }
                >
                  {donor.status}
                </Badge>
              </td>

              <td className="px-6 py-4">
                {donor.isVerified ? (
                  <Badge variant="outline" className="border-blue-500/30 bg-blue-500/10 text-blue-400 font-bold flex items-center gap-1 w-fit">
                    <ShieldCheck className="w-3.5 h-3.5" /> Verified
                  </Badge>
                ) : (
                  <Badge variant="outline" className="border-slate-700 bg-slate-900 text-slate-400 font-medium w-fit">
                    Unverified
                  </Badge>
                )}
              </td>

              <td className="px-6 py-4 text-right">
                <Button
                  size="sm"
                  variant={donor.isVerified ? 'outline' : 'primary'}
                  isLoading={loadingId === donor.id}
                  onClick={() => handleToggleVerification(donor.id, donor.isVerified)}
                  className={
                    donor.isVerified
                      ? 'border-slate-700 text-slate-300 hover:bg-slate-800 text-xs'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs'
                  }
                >
                  {donor.isVerified ? (
                    <span className="flex items-center gap-1">
                      <XCircle className="w-3.5 h-3.5 text-red-400" /> Revoke
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Verify Donor
                    </span>
                  )}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
