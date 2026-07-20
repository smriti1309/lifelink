'use client';

import * as React from 'react';
import { 
  Building2, 
  Send, 
  CheckCircle2, 
  ShieldAlert, 
  Info,
  UserCheck
} from 'lucide-react';
import { BloodType, RequestUrgency, RequestStatus, DonorRequestStatus, DonorStatus, ContactPreference, ReplacementRequirement } from '@prisma/client';
import { getCompatibleDonorGroups } from '@/lib/utils/bloodCompatibility';
import { BLOOD_TYPE_LABELS } from '@/lib/constants/bloodTypes';
import { searchCompatibleDonors, sendInternalBloodRequests } from '@/app/actions/donor';
import { DonorCard } from '../donor/donor-card';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useRouter, usePathname } from 'next/navigation';

interface MatchingDonor {
  id: string;
  fullName: string;
  bloodType: BloodType;
  state: string;
  district: string;
  status: DonorStatus;
  preferredContact: ContactPreference;
}

interface RequestMatchesClientProps {
  success?: string;
  request: {
    id: string;
    bloodType: BloodType;
    needsBloodUnits: boolean;
    unitsRequired: number;
    needsReplacementDonors: boolean;
    replacementDonorCount: number | null;
    replacementRequirement: ReplacementRequirement | null;
    urgency: RequestUrgency;
    status: RequestStatus;
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
    donorRequests: {
      id: string;
      donorProfileId: string;
      status: DonorRequestStatus;
      donorProfile: {
        bloodType: BloodType;
        status: DonorStatus;
        preferredContact: ContactPreference;
        profile: {
          fullName: string;
          phone: string | null;
          state: string;
          district: string;
        };
      };
    }[];
  };
}

export function RequestMatchesClient({ request, success }: RequestMatchesClientProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [matchingDonors, setMatchingDonors] = React.useState<MatchingDonor[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [selectedDonorIds, setSelectedDonorIds] = React.useState<string[]>([]);
  const [isSending, setIsSending] = React.useState(false);
  const [actionSuccessMsg, setActionSuccessMsg] = React.useState<string | null>(null);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  const successMsg = actionSuccessMsg || (success === 'request_created' 
    ? 'Emergency Blood Request filed successfully! We have automatically searched and found compatible donors in your location below.' 
    : null);

  const requestState = request.hospital?.state || request.manualHospitalState || '';
  const requestDistrict = request.hospital?.district || request.manualHospitalDistrict || '';
  const hospitalName = request.hospital?.name || request.hospitalName || 'Manual Entry';
  const hospitalAddress = request.hospital?.address || request.manualHospitalAddress || '';

  const bloodLabel = BLOOD_TYPE_LABELS[request.bloodType as keyof typeof BLOOD_TYPE_LABELS] || request.bloodType;
  const compatibleGroups = getCompatibleDonorGroups(request.bloodType);
  const compatibleLabels = compatibleGroups.map(bg => BLOOD_TYPE_LABELS[bg as keyof typeof BLOOD_TYPE_LABELS] || bg).join(', ');

  const compatibleLabelText = React.useMemo(() => {
    if (request.needsReplacementDonors && !request.needsBloodUnits) {
      if (request.replacementRequirement === 'SAME_BLOOD_GROUP') {
        return `Exact Match (${bloodLabel})`;
      } else if (request.replacementRequirement === 'ANY_BLOOD_GROUP') {
        return 'Any Blood Group Accepted';
      }
    }
    return compatibleLabels;
  }, [request.needsReplacementDonors, request.needsBloodUnits, request.replacementRequirement, bloodLabel, compatibleLabels]);

  // Get already requested donor profile IDs
  const requestedDonorProfileIds = React.useMemo(() => {
    return new Set(request.donorRequests.map(r => r.donorProfileId));
  }, [request.donorRequests]);

  // Extract donors who accepted this request
  const acceptedDonors = React.useMemo(() => {
    return request.donorRequests.filter(r => r.status === 'ACCEPTED');
  }, [request.donorRequests]);

  React.useEffect(() => {
    let active = true;
    searchCompatibleDonors({
      bloodType: request.bloodType,
      state: requestState,
      district: requestDistrict,
      availableOnly: true,
      eligibleOnly: true,
      needsBloodUnits: request.needsBloodUnits,
      needsReplacementDonors: request.needsReplacementDonors,
      replacementRequirement: request.replacementRequirement,
    })
      .then((res) => {
        if (active) {
          if (res.success) {
            setMatchingDonors(res.donors);
          } else {
            setErrorMsg(res.error || 'Failed to search compatible donors.');
          }
        }
      })
      .catch(() => {
        if (active) {
          setErrorMsg('Failed to query matches.');
        }
      })
      .finally(() => {
        if (active) {
          setIsLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [request.bloodType, requestState, requestDistrict, request.needsBloodUnits, request.needsReplacementDonors, request.replacementRequirement]);

  const handleToggleSelect = (donorId: string) => {
    setSelectedDonorIds(prev => 
      prev.includes(donorId) 
        ? prev.filter(id => id !== donorId) 
        : [...prev, donorId]
    );
  };

  const handleSendRequests = async () => {
    if (selectedDonorIds.length === 0) return;
    setIsSending(true);
    setErrorMsg(null);
    setActionSuccessMsg(null);

    try {
      const res = await sendInternalBloodRequests(request.id, selectedDonorIds);
      if (res.success) {
        setActionSuccessMsg(`Blood request alerts sent to ${selectedDonorIds.length} donor(s) successfully.`);
        setSelectedDonorIds([]);
        // Clear ?success=request_created from URL and refresh server state without resetting component state
        router.replace(pathname);
        router.refresh();
      } else {
        setErrorMsg(res.error || 'Failed to send requests.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to complete action.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* SUCCESS / ERROR NOTIFICATION */}
      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm rounded-xl font-semibold flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}
      {errorMsg && (
        <div className="p-4 bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-xl font-semibold flex items-center gap-2 animate-fade-in">
          <ShieldAlert className="w-5 h-5 shrink-0 text-destructive" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* REQUEST SUMMARY HEADER CARD */}
      <Card className="shadow-premium border-border/40 overflow-hidden">
        <CardHeader className="bg-muted/30 border-b border-border/20 py-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <CardTitle className="text-xl font-bold">Emergency Request Details</CardTitle>
              <CardDescription>Filed request for blood transfusion</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-full bg-primary/10 text-primary border border-primary/20">
                {request.urgency === RequestUrgency.IMMEDIATE ? 'Critical' : request.urgency === RequestUrgency.URGENT ? 'Urgent' : 'Normal'}
              </span>
              <span className={cn(
                "px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-full border",
                request.status === RequestStatus.FULFILLED
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : "bg-blue-50 text-blue-700 border-blue-200"
              )}>
                {request.status === RequestStatus.FULFILLED ? 'Fulfilled' : 'Active'}
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 py-6 text-sm">
          <div className="flex flex-col gap-1 p-3.5 bg-muted/40 rounded-xl border border-border/30">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Required Blood Group</span>
            <span className="text-lg font-extrabold text-foreground">{bloodLabel}</span>
          </div>

          <div className="flex flex-col gap-1 p-3.5 bg-muted/40 rounded-xl border border-border/30">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Requirement Type</span>
            <span className="font-semibold text-foreground">
              {request.needsBloodUnits && `${request.unitsRequired} Blood Units`}
              {request.needsBloodUnits && request.needsReplacementDonors && " & "}
              {request.needsReplacementDonors && (
                <>
                  {request.replacementDonorCount} Replacement Donors
                  <span className="block text-xs font-normal text-muted-foreground mt-0.5">
                    {request.replacementRequirement === 'SAME_BLOOD_GROUP' 
                      ? 'Same Blood Group Required' 
                      : 'Any Blood Group Accepted'}
                  </span>
                </>
              )}
            </span>
          </div>

          <div className="flex flex-col gap-1 p-3.5 bg-muted/40 rounded-xl border border-border/30 sm:col-span-2">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Hospital Details</span>
            <span className="font-semibold text-foreground flex items-center gap-1.5 truncate">
              <Building2 className="w-4 h-4 text-muted-foreground" />
              {hospitalName}
            </span>
            <span className="text-xs text-muted-foreground truncate mt-0.5 ml-5">{hospitalAddress}</span>
          </div>
        </CardContent>
      </Card>

      {/* DONORS WHO ACCEPTED SECTION */}
      {acceptedDonors.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-emerald-600" />
            <h2 className="text-lg font-bold text-foreground">
              Donors Who Accepted ({acceptedDonors.length})
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            {acceptedDonors.map((r) => (
              <DonorCard
                key={r.id}
                fullName={r.donorProfile.profile.fullName}
                bloodType={r.donorProfile.bloodType}
                state={r.donorProfile.profile.state}
                district={r.donorProfile.profile.district}
                status={r.donorProfile.status}
                preferredContact={r.donorProfile.preferredContact}
                showPhone={true}
                phone={r.donorProfile.profile.phone}
              />
            ))}
          </div>
        </div>
      )}

      {/* COMPATIBLE MATCHES SEARCH */}
      {request.status !== RequestStatus.FULFILLED ? (
        <div className="space-y-4 pt-4 border-t border-border/20">
          <div className="flex flex-col gap-1.5 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-lg font-bold text-foreground">Compatible Matching Donors</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Compatible Blood Groups: <strong className="text-foreground">{compatibleLabelText}</strong>
              </p>
            </div>
            
            {selectedDonorIds.length > 0 && (
              <Button
                onClick={handleSendRequests}
                disabled={isSending}
                className="flex items-center justify-center gap-2 self-start md:self-auto"
                isLoading={isSending}
              >
                <Send className="w-4 h-4" />
                <span>Send Blood Request ({selectedDonorIds.length})</span>
              </Button>
            )}
          </div>

          {isLoading ? (
            <p className="text-sm text-muted-foreground">Searching matching donors...</p>
          ) : (
            <>
              {(() => {
                if (matchingDonors.length === 0) {
                  return (
                    <div className="p-8 text-center border border-dashed border-border/60 rounded-2xl max-w-xl mx-auto flex flex-col items-center gap-3 mt-4">
                      <div className="p-3 bg-muted/65 rounded-full text-muted-foreground">
                        <Info className="w-8 h-8" />
                      </div>
                      <p className="text-sm font-semibold text-foreground">No available matching donors found</p>
                      <p className="text-xs text-muted-foreground leading-relaxed max-w-sm">
                        No compatible donors are currently available in your selected location.
                        Your emergency request has been saved and can still be reviewed by coordinators or matched with future donors.
                      </p>
                    </div>
                  );
                }

                return (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
                    {matchingDonors.map((donor) => {
                      const donorRequest = request.donorRequests.find(r => r.donorProfileId === donor.id);
                      return (
                        <DonorCard
                          key={donor.id}
                          fullName={donor.fullName}
                          bloodType={donor.bloodType}
                          state={donor.state}
                          district={donor.district}
                          status={donor.status}
                          preferredContact={donor.preferredContact}
                          isSelected={selectedDonorIds.includes(donor.id)}
                          onSelectChange={donorRequest ? undefined : () => handleToggleSelect(donor.id)}
                          requestStatus={donorRequest?.status}
                        />
                      );
                    })}
                  </div>
                );
              })()}
            </>
          )}
        </div>
      ) : (
        <div className="p-6 bg-emerald-50/50 border border-emerald-200/50 rounded-2xl flex flex-col items-center gap-2.5 text-center max-w-xl mx-auto mt-6">
          <CheckCircle2 className="w-8 h-8 text-emerald-600" />
          <h3 className="font-bold text-base text-emerald-950">This blood request is fulfilled</h3>
          <p className="text-xs text-emerald-800 leading-relaxed max-w-sm">
            All pending donor alerts have been automatically closed as the required number of donors have already accepted and fulfilled the coordination requirements.
          </p>
        </div>
      )}
    </div>
  );
}
