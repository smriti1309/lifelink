'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { Badge } from '@/components/ui/badge';
import { 
  getDetailedDonorStats, 
  toggleDonorAvailability 
} from '@/app/actions/donor';
import { 
  Droplet, 
  Activity, 
  Calendar, 
  Heart, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Edit2, 
  X,
  ShieldCheck,
  CheckCircle,
  HelpCircle
} from 'lucide-react';
import { BLOOD_TYPE_LABELS } from '@/lib/constants/bloodTypes';

interface DonorDashboardButtonProps {
  hasDonorProfile: boolean;
}

interface DonationHistoryItem {
  id: string;
  donationDate: string;
  hospital: string;
  bloodGroup: string;
  requestType: string;
  requester: string;
  status: string;
}

interface DonorDetails {
  id: string;
  bloodType: string;
  status: string;
  isEligible: boolean;
  lastDonatedAt: string | null;
  pendingRequestsCount: number;
  acceptedRequestsCount: number;
  completedDonationsCount: number;
  totalDonationsCount: number;
  nextEligibleDate: string | null;
  donationHistory: DonationHistoryItem[];
  fullName: string;
}

export function DonorDashboardButton({ hasDonorProfile }: DonorDashboardButtonProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = React.useState(false);
  const [donor, setDonor] = React.useState<DonorDetails | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isToggling, setIsToggling] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  // Fetch donor details when modal is opened
  const handleOpen = async () => {
    setIsOpen(true);
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const res = await getDetailedDonorStats();
      if (res.success && res.donor) {
        setDonor(res.donor as any);
      } else {
        setErrorMsg(res.error || 'Failed to fetch donor details.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleAvailability = async () => {
    if (!donor) return;
    setIsToggling(true);
    setErrorMsg(null);
    try {
      const res = await toggleDonorAvailability();
      if (res.success && res.status) {
        setDonor(prev => prev ? { ...prev, status: res.status! } : null);
        router.refresh();
      } else {
        setErrorMsg(res.error || 'Failed to update availability.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to update availability status.');
    } finally {
      setIsToggling(false);
    }
  };

  // If user has no donor profile, render the onboarding button as is
  if (!hasDonorProfile) {
    return (
      <Link href="/become-donor">
        <Button size="sm" variant="primary">
          Become a Donor
        </Button>
      </Link>
    );
  }

  const bloodLabel = donor ? (BLOOD_TYPE_LABELS[donor.bloodType as keyof typeof BLOOD_TYPE_LABELS] || donor.bloodType) : '';
  const lastDonationDateText = donor?.lastDonatedAt 
    ? new Date(donor.lastDonatedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
    : 'Never';

  return (
    <>
      {/* View Details Button replacing the old Update Donor Profile button */}
      <Button size="sm" variant="outline" onClick={handleOpen}>
        View Details
      </Button>

      {/* Donor Profile Details Modal */}
      <Modal
        isOpen={isOpen}
        onClose={() => !isToggling && setIsOpen(false)}
        title="Donor Profile Details"
        size="md"
      >
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <Activity className="w-8 h-8 text-primary animate-pulse-slow" />
            <span className="text-sm font-semibold text-muted-foreground">Loading donor details...</span>
          </div>
        ) : errorMsg ? (
          <div className="p-4 bg-destructive-light text-destructive border border-destructive/20 rounded-xl flex items-start gap-2.5 text-xs">
            <AlertCircle className="w-4.5 h-4.5 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Error Loading Profile</p>
              <p className="mt-0.5">{errorMsg}</p>
            </div>
          </div>
        ) : donor ? (
          <div className="space-y-6">
            
            {/* Top overview widget */}
            <div className="flex items-center gap-4 bg-muted/20 p-4 rounded-xl border border-border/40">
              <span className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 text-primary font-black text-xl">
                {bloodLabel}
              </span>
              <div>
                <h4 className="font-bold text-foreground text-sm">{donor.fullName}</h4>
                <p className="text-xs text-muted-foreground mt-0.5 font-medium">Volunteer Emergency Donor</p>
              </div>
            </div>

            {/* Donor Metrics Details */}
            <div className="grid grid-cols-2 gap-4">
              <div className="py-2 border-b border-border/40 text-xs">
                <span className="font-semibold text-muted-foreground block uppercase">Availability Status</span>
                <span className="mt-1 block">
                  {donor.status === 'AVAILABLE' ? (
                    <Badge variant="success">Available</Badge>
                  ) : (
                    <Badge variant="secondary">Unavailable</Badge>
                  )}
                </span>
              </div>

              <div className="py-2 border-b border-border/40 text-xs">
                <span className="font-semibold text-muted-foreground block uppercase">Eligibility Status</span>
                <span className="mt-1 block">
                  {donor.isEligible ? (
                    <Badge variant="success">Eligible</Badge>
                  ) : (
                    <Badge variant="destructive">Not Eligible</Badge>
                  )}
                </span>
              </div>

              <div className="py-2 border-b border-border/40 text-xs col-span-2">
                <span className="font-semibold text-muted-foreground block uppercase">Last Donation Date</span>
                <span className="text-foreground font-bold block mt-1 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                  {lastDonationDateText}
                </span>
              </div>

              {!donor.isEligible && donor.nextEligibleDate && (
                <div className="py-2 border-b border-border/40 text-xs col-span-2 animate-fade-in">
                  <span className="font-semibold text-muted-foreground block uppercase">Next Eligible Date</span>
                  <span className="text-foreground font-bold block mt-1 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                    {new Date(donor.nextEligibleDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </span>
                </div>
              )}
            </div>

            {/* Request statistics widgets */}
            <div>
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-2">Coordination Activities</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="p-3 bg-muted/40 rounded-xl border border-border/20">
                  <span className="block text-lg font-black text-foreground">{donor.pendingRequestsCount}</span>
                  <span className="text-[9px] text-muted-foreground font-semibold uppercase">Pending</span>
                </div>
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                  <span className="block text-lg font-black text-emerald-800">{donor.acceptedRequestsCount}</span>
                  <span className="text-[9px] text-emerald-600 font-semibold uppercase">Accepted</span>
                </div>
                <div className="p-3 bg-primary-light rounded-xl border border-primary/10">
                  <span className="block text-lg font-black text-primary">{donor.completedDonationsCount}</span>
                  <span className="text-[9px] text-primary/70 font-semibold uppercase">Completed</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="block text-lg font-black text-foreground/75">{donor.totalDonationsCount}</span>
                  <span className="text-[9px] text-muted-foreground font-semibold uppercase">Total Donated</span>
                </div>
              </div>
            </div>

            {/* Donation History Section */}
            {donor.donationHistory && donor.donationHistory.length > 0 && (
              <div className="space-y-3">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Donation History</span>
                <div className="overflow-x-auto rounded-xl border border-border/30 bg-muted/10 max-h-[160px] overflow-y-auto">
                  <table className="w-full text-left border-collapse text-[11px]">
                    <thead>
                      <tr className="bg-muted/40 border-b border-border/30 text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
                        <th className="p-2">Date</th>
                        <th className="p-2">Hospital</th>
                        <th className="p-2">Group</th>
                        <th className="p-2">Type</th>
                        <th className="p-2">Requester</th>
                        <th className="p-2">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/20">
                      {donor.donationHistory.map((item) => (
                        <tr key={item.id} className="hover:bg-muted/20 transition-colors">
                          <td className="p-2 whitespace-nowrap font-medium text-foreground">
                            {new Date(item.donationDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </td>
                          <td className="p-2 font-medium text-foreground max-w-[100px] truncate" title={item.hospital}>
                            {item.hospital}
                          </td>
                          <td className="p-2">
                            <span className="inline-flex px-1.5 py-0.5 rounded text-[9px] font-bold bg-primary/10 text-primary">
                              {BLOOD_TYPE_LABELS[item.bloodGroup as keyof typeof BLOOD_TYPE_LABELS] || item.bloodGroup}
                            </span>
                          </td>
                          <td className="p-2 text-muted-foreground whitespace-nowrap">{item.requestType}</td>
                          <td className="p-2 text-muted-foreground truncate max-w-[80px]" title={item.requester}>{item.requester}</td>
                          <td className="p-2">
                            <span className="inline-flex px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              {item.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Dialog Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-end gap-2 pt-2 border-t border-border/40">
              <Button
                variant="outline"
                size="sm"
                onClick={handleToggleAvailability}
                isLoading={isToggling}
                className="flex items-center justify-center gap-1.5"
              >
                <Activity className="w-3.5 h-3.5" />
                {donor.status === 'AVAILABLE' ? 'Mark Unavailable' : 'Mark Available'}
              </Button>
              
              <Link href="/become-donor">
                <Button variant="primary" size="sm" className="w-full sm:w-auto flex items-center justify-center gap-1.5">
                  <Edit2 className="w-3.5 h-3.5" />
                  Edit Donor Profile
                </Button>
              </Link>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsOpen(false)}
                disabled={isToggling}
              >
                Close
              </Button>
            </div>

          </div>
        ) : null}
      </Modal>
    </>
  );
}
