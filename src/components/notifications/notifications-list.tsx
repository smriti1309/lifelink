'use client';

import * as React from 'react';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Check, 
  X, 
  AlertCircle, 
  Info,
  Calendar,
  Activity
} from 'lucide-react';
import { DonorRequestStatus, RequestUrgency, BloodType } from '@prisma/client';
import { BLOOD_TYPE_LABELS } from '@/lib/constants/bloodTypes';
import { respondToBloodRequest } from '@/app/actions/donor';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface NotificationItem {
  id: string;
  status: DonorRequestStatus;
  donationStatus: string;
  completedAt: Date | string | null;
  createdAt: Date | string;
  displayStatus: string;
  badgeVariant: string;
  canRespond: boolean;
  deferredReason: string | null;
  emergencyRequest: {
    id: string;
    bloodType: BloodType;
    needsBloodUnits: boolean;
    unitsRequired: number;
    needsReplacementDonors: boolean;
    replacementDonorCount: number | null;
    urgency: RequestUrgency;
    contactName: string;
    contactPhone: string;
    notes: string | null;
    neededBy: Date | string;
    hospitalName: string | null;
    manualHospitalAddress: string | null;
    manualHospitalDistrict: string | null;
    manualHospitalState: string | null;
    hospital: {
      name: string;
      district: string;
      state: string;
      address: string;
    } | null;
  };
}

interface NotificationsListProps {
  notifications: NotificationItem[];
}

export function NotificationsList({ notifications }: NotificationsListProps) {
  const [processingId, setProcessingId] = React.useState<string | null>(null);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  const handleResponse = async (notificationId: string, accept: boolean) => {
    setProcessingId(notificationId);
    setErrorMsg(null);

    try {
      const res = await respondToBloodRequest(notificationId, accept);
      if (res.success) {
        // Refresh page details dynamically
        window.location.reload();
      } else {
        setErrorMsg(res.error || 'Failed to update response.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('An error occurred while updating status.');
    } finally {
      setProcessingId(null);
    }
  };

  if (notifications.length === 0) {
    return (
      <div className="p-8 text-center border border-dashed border-border/60 rounded-2xl max-w-md mx-auto flex flex-col items-center gap-3">
        <div className="p-3 bg-muted/65 rounded-full text-muted-foreground">
          <Info className="w-8 h-8" />
        </div>
        <p className="sm:text-sm font-semibold text-foreground text-xs">No pending requests</p>
        <p className="text-xs text-muted-foreground leading-relaxed max-w-sm">
          You currently have no active emergency blood requests or coordination alerts in your inbox.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {errorMsg && (
        <div className="p-4 bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-xl font-semibold flex items-center gap-2 animate-fade-in">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="space-y-4">
        {notifications.map((item) => {
          const req = item.emergencyRequest;
          const bloodLabel = BLOOD_TYPE_LABELS[req.bloodType as keyof typeof BLOOD_TYPE_LABELS] || req.bloodType;
          const hospitalName = req.hospital?.name || req.hospitalName || 'Manual Entry';
          const hospitalAddress = req.hospital?.address || req.manualHospitalAddress || '';
          const state = req.hospital?.state || req.manualHospitalState || '';
          const district = req.hospital?.district || req.manualHospitalDistrict || '';

          const isAccepted = item.status === 'ACCEPTED' && item.donationStatus !== 'CONFIRMED';
          const isConfirmed = item.donationStatus === 'CONFIRMED';

          return (
            <Card 
              key={item.id} 
              className={cn("shadow-premium border-border/40 transition-all-300 relative", {
                "border-emerald-250 ring-2 ring-emerald-500/5 bg-emerald-50/5": isAccepted || isConfirmed,
                "opacity-75": !item.canRespond && !isAccepted && !isConfirmed,
              })}
            >
              <CardHeader className="pb-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-lg bg-primary/10 flex items-center justify-center font-extrabold text-primary text-base shrink-0">
                      {bloodLabel}
                    </div>
                    <div>
                      <CardTitle className="text-sm font-bold flex items-center gap-1.5">
                        Emergency Blood Request
                      </CardTitle>
                      <CardDescription className="text-xs" suppressHydrationWarning>
                        Received {new Date(item.createdAt).toLocaleDateString()}
                      </CardDescription>
                    </div>
                  </div>

                  {/* Status Badges */}
                  <div>
                    <span 
                      suppressHydrationWarning
                      className={cn(
                        "px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide border",
                        {
                          "bg-amber-50 text-amber-700 border-amber-200": item.badgeVariant === 'warning',
                          "bg-emerald-50 text-emerald-700 border-emerald-200": item.badgeVariant === 'success',
                          "bg-emerald-100 text-emerald-800 border-emerald-250 animate-pulse-slow": item.badgeVariant === 'confirmed',
                          "bg-slate-100 text-slate-600 border-slate-200": item.badgeVariant === 'secondary',
                          "bg-rose-50 text-rose-600 border-rose-200": item.badgeVariant === 'destructive',
                        }
                      )}
                    >
                      {item.displayStatus}
                    </span>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Details grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-muted/30 p-3 rounded-xl border border-border/30">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Required Location</span>
                    <span className="font-semibold text-foreground flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                      {district}, {state}
                    </span>
                  </div>

                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Hospital / Address</span>
                    <span className="font-semibold text-foreground flex items-center gap-1 truncate">
                      <Building2 className="w-3.5 h-3.5 text-muted-foreground" />
                      {hospitalName}
                    </span>
                    <span className="text-[10px] text-muted-foreground pl-4.5 truncate">{hospitalAddress}</span>
                  </div>

                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Required Units & Urgency</span>
                    <span className="font-semibold text-foreground flex items-center gap-1.5">
                      <Activity className="w-3.5 h-3.5 text-muted-foreground" />
                      {req.needsBloodUnits && `${req.unitsRequired} Blood Units`}
                      {req.needsReplacementDonors && ` & ${req.replacementDonorCount} Replacements`}
                      <span className={cn(
                        "px-2 py-0.5 rounded text-[9px] font-bold uppercase",
                        req.urgency === RequestUrgency.IMMEDIATE ? "bg-red-100 text-red-700" : req.urgency === RequestUrgency.URGENT ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-600"
                      )}>
                        {req.urgency === RequestUrgency.IMMEDIATE ? 'Critical' : req.urgency === RequestUrgency.URGENT ? 'Urgent' : 'Normal'}
                      </span>
                    </span>
                  </div>

                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Needed By Date</span>
                    <span className="font-semibold text-foreground flex items-center gap-1" suppressHydrationWarning>
                      <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                      {new Date(req.neededBy).toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Additional Summary / Notes */}
                {req.notes && (
                  <div className="p-3 bg-muted/10 border border-border/20 rounded-xl text-xs text-muted-foreground leading-relaxed">
                    <strong className="block text-foreground text-[10px] uppercase font-bold tracking-wide mb-1">Request Notes</strong>
                    {req.notes}
                  </div>
                )}

                {/* DEFERRED REASON CARD */}
                {item.deferredReason && (
                  <div className="p-3.5 bg-slate-50 border border-slate-200 text-slate-700 rounded-xl text-xs flex items-start gap-2.5 font-medium animate-fade-in">
                    <AlertCircle className="w-4 h-4 shrink-0 text-slate-500 mt-0.5" />
                    <div>
                      {item.deferredReason}
                    </div>
                  </div>
                )}

                {/* COORDINATOR DISCLOSURE (Only if Accepted) */}
                {isConfirmed && (
                  <div className="p-4 bg-emerald-50 border border-emerald-250 text-emerald-850 text-xs rounded-xl flex items-start gap-3 font-medium animate-fade-in">
                    <span className="text-base">🎉</span>
                    <div>
                      <strong className="block text-emerald-950 font-bold mb-0.5 text-xs">Thank you!</strong>
                      Your blood donation has been confirmed. Your donation history and eligibility have been updated.
                    </div>
                  </div>
                )}

                {isAccepted && (
                  <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs animate-fade-in flex flex-col gap-2">
                    <div>
                      <strong className="block text-emerald-950 text-xs font-bold mb-0.5">Coordinator Contact Details</strong>
                      You have accepted this request. Please call or coordinate directly with the contact person.
                    </div>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="font-bold flex items-center gap-1 text-foreground">
                        Coordinator: {req.contactName}
                      </span>
                      <span className="font-extrabold flex items-center gap-1 text-primary text-sm">
                        <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                        <a href={`tel:${req.contactPhone}`} className="hover:underline">{req.contactPhone}</a>
                      </span>
                    </div>
                  </div>
                )}

                {/* ACTION BUTTONS */}
                {item.canRespond && (
                  <div className="flex gap-4 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleResponse(item.id, false)}
                      disabled={processingId === item.id}
                      className="flex-1 flex items-center justify-center gap-1 text-rose-600 hover:bg-rose-50 border-rose-250 hover:text-rose-700"
                    >
                      <X className="w-4 h-4" />
                      <span>Decline</span>
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleResponse(item.id, true)}
                      disabled={processingId === item.id}
                      className="flex-1 flex items-center justify-center gap-1"
                    >
                      <Check className="w-4 h-4" />
                      <span>Accept Request</span>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
