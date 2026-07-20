'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { cancelEmergencyRequest, confirmDonationAction } from '@/app/actions/request';
import { 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  Clock, 
  AlertCircle, 
  Phone, 
  User, 
  Building2, 
  Droplet,
  Users,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Activity,
  Heart
} from 'lucide-react';
import { BLOOD_TYPE_LABELS } from '@/lib/constants/bloodTypes';
import { REQUEST_URGENCY_LABELS } from '@/lib/constants/status';

// Define TS Interfaces for Details Page
interface DonorProfileInfo {
  id: string;
  bloodType: string;
  lastDonatedAt: Date | string | null;
  profile: {
    fullName: string;
    phone: string | null;
    email: string | null;
    district: string | null;
    state: string | null;
  };
}

interface DonorRequestInfo {
  id: string;
  status: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  donationStatus: string;
  completedAt: Date | string | null;
  donorProfile: DonorProfileInfo;
}

interface DetailedRequest {
  id: string;
  seekerId: string;
  bloodType: string;
  needsBloodUnits: boolean;
  unitsRequired: number;
  needsReplacementDonors: boolean;
  replacementDonorCount: number | null;
  replacementRequirement: string | null;
  hospitalId: string | null;
  hospitalName: string | null;
  urgency: string;
  status: string;
  contactPhone: string;
  notes: string | null;
  neededBy: Date | string;
  createdAt: Date | string;
  updatedAt: Date | string;
  patientName: string;
  patientAge: number;
  patientGender: string;
  contactName: string;
  manualHospitalState: string | null;
  manualHospitalDistrict: string | null;
  manualHospitalAddress: string | null;
  hospital: {
    name: string;
    district: string;
    state: string;
    address: string;
  } | null;
  seeker: {
    fullName: string;
    email: string;
    phone: string | null;
  };
  donorRequests: DonorRequestInfo[];
  acceptedCount: number;
  pendingCount: number;
  declinedCount: number;
  totalDonorRequests: number;
}

interface RequestDetailsClientProps {
  request: DetailedRequest;
}

export function RequestDetailsClient({ request }: RequestDetailsClientProps) {
  const router = useRouter();
  
  // Active Donor Response Tab
  const [activeTab, setActiveTab] = React.useState<'ACCEPTED' | 'PENDING' | 'DECLINED'>('ACCEPTED');
  
  // Cancellation Modal State
  const [isCancelModalOpen, setIsCancelModalOpen] = React.useState(false);
  const [isCancelling, setIsCancelling] = React.useState(false);
  const [cancelError, setCancelError] = React.useState<string | null>(null);

  const handleCancelConfirm = async () => {
    setIsCancelling(true);
    setCancelError(null);
    try {
      const res = await cancelEmergencyRequest(request.id);
      if (res.success) {
        setIsCancelModalOpen(false);
        router.refresh();
      } else {
        setCancelError(res.error || 'Failed to cancel request.');
      }
    } catch (err) {
      console.error(err);
      setCancelError('An unexpected error occurred.');
    } finally {
      setIsCancelling(false);
    }
  };

  // Confirmation Modal State
  const [isConfirmModalOpen, setIsConfirmModalOpen] = React.useState(false);
  const [selectedDonorRequestId, setSelectedDonorRequestId] = React.useState<string | null>(null);
  const [isConfirming, setIsConfirming] = React.useState(false);
  const [confirmError, setConfirmError] = React.useState<string | null>(null);

  const searchParams = useSearchParams();
  const successParam = searchParams.get('success');

  const handleConfirmClick = (donorRequestId: string) => {
    setSelectedDonorRequestId(donorRequestId);
    setConfirmError(null);
    setIsConfirmModalOpen(true);
  };

  const handleConfirmDonation = async () => {
    if (!selectedDonorRequestId) return;
    setIsConfirming(true);
    setConfirmError(null);
    try {
      const res = await confirmDonationAction(request.id, selectedDonorRequestId);
      if (res.success) {
        setIsConfirmModalOpen(false);
        router.push(`/my-requests/${request.id}?success=donation_confirmed`);
        router.refresh();
      } else {
        setConfirmError(res.error || 'Failed to confirm donation.');
      }
    } catch (err) {
      console.error(err);
      setConfirmError('An unexpected error occurred.');
    } finally {
      setIsConfirming(false);
    }
  };

  // Formatter for Date
  const formatDate = (dateValue: Date | string) => {
    const d = new Date(dateValue);
    return d.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatDateTime = (dateValue: Date | string) => {
    const d = new Date(dateValue);
    return d.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case 'IMMEDIATE':
        return <Badge variant="destructive">Immediate (Critical)</Badge>;
      case 'URGENT':
        return <Badge variant="warning">Urgent</Badge>;
      default:
        return <Badge variant="primary">Normal</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <Badge variant="success">Active</Badge>;
      case 'FULFILLED':
        return <Badge variant="success">Fulfilled</Badge>;
      case 'CANCELLED':
        return <Badge variant="secondary">Cancelled</Badge>;
      case 'EXPIRED':
        return <Badge variant="destructive">Expired</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Filters for Donor Requests Tabs
  const acceptedDonors = request.donorRequests.filter(dr => dr.status === 'ACCEPTED');
  const pendingDonors = request.donorRequests.filter(dr => dr.status === 'PENDING');
  const declinedDonors = request.donorRequests.filter(dr => dr.status === 'DECLINED');

  const bloodLabel = BLOOD_TYPE_LABELS[request.bloodType as keyof typeof BLOOD_TYPE_LABELS] || request.bloodType;
  const hospitalNameText = request.hospital?.name || request.hospitalName || 'Manual Entry';
  const hospitalAddressText = request.hospital?.address || request.manualHospitalAddress || 'Address not available';
  const hospitalLocationText = request.hospital
    ? `${request.hospital.district}, ${request.hospital.state}`
    : `${request.manualHospitalDistrict || ''}, ${request.manualHospitalState || ''}`;

  // Timeline States
  const timelineStages = [
    { label: 'Created', description: 'Request created on board', isCompleted: true, date: request.createdAt },
    { 
      label: 'Requests Sent', 
      description: 'Alerted nearby compatible donors', 
      isCompleted: request.totalDonorRequests > 0, 
      date: request.totalDonorRequests > 0 ? request.createdAt : null 
    },
    { 
      label: 'Donor Accepted', 
      description: 'Waiting for donor confirmations', 
      isCompleted: request.acceptedCount > 0, 
      date: request.acceptedCount > 0 ? (acceptedDonors[0]?.updatedAt || null) : null
    },
    { 
      label: 'Request Fulfilled', 
      description: 'Fulfillment goal met', 
      isCompleted: request.status === 'FULFILLED', 
      date: request.status === 'FULFILLED' ? request.updatedAt : null
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {successParam === 'donation_confirmed' && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm rounded-xl flex items-start gap-3 font-medium animate-fade-in">
          <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600 mt-0.5" />
          <div>
            <strong className="block text-emerald-900 mb-0.5">Donation successfully confirmed.</strong>
            Donor history, statistics, and eligibility have been updated accordingly.
          </div>
        </div>
      )}
      {/* Back navigation & Action headers */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <Link href="/my-requests" className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground transition-all-300">
          <ArrowLeft className="w-4 h-4" />
          Back to My Requests
        </Link>

        {request.status === 'ACTIVE' && (
          <div className="flex gap-3 w-full sm:w-auto">
            <Link href={`/request/${request.id}/matches`} className="flex-1 sm:flex-initial">
              <Button variant="primary" size="md" className="w-full">
                View Matching Donors
              </Button>
            </Link>
            <Button
              variant="outline"
              size="md"
              onClick={() => {
                setCancelError(null);
                setIsCancelModalOpen(true);
              }}
              className="flex-1 sm:flex-initial text-destructive border-destructive hover:bg-destructive-light hover:text-destructive"
            >
              Cancel Request
            </Button>
          </div>
        )}
      </div>

      {/* Main Title Section */}
      <div className="bg-white border border-border/40 p-6 rounded-2xl shadow-premium flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 text-primary font-bold text-xl">
              {bloodLabel}
            </span>
            <div>
              <h1 className="text-2xl font-extrabold text-foreground">
                Request for {patientNameText(request.patientName)}
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5 font-medium">
                Request ID: {request.id}
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          {getUrgencyBadge(request.urgency)}
          {getStatusBadge(request.status)}
        </div>
      </div>

      {/* Request Timeline widget */}
      <Card className="border-border/40 shadow-premium">
        <CardHeader>
          <CardTitle>Request Lifecycle Timeline</CardTitle>
          <CardDescription>Track status updates of this request in real-time.</CardDescription>
        </CardHeader>
        <CardContent>
          {request.status === 'CANCELLED' ? (
            <div className="p-4 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl flex items-start gap-3">
              <XCircle className="w-5 h-5 shrink-0 text-amber-600 mt-0.5" />
              <div>
                <strong className="block font-bold">This request has been Cancelled.</strong>
                <p className="text-xs text-amber-800 mt-0.5">You cancelled this request on {formatDateTime(request.updatedAt)}. Pending invitations have expired, but any historical donor details are archived below.</p>
              </div>
            </div>
          ) : request.status === 'EXPIRED' ? (
            <div className="p-4 bg-rose-50 border border-rose-200 text-rose-900 rounded-xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 shrink-0 text-rose-600 mt-0.5" />
              <div>
                <strong className="block font-bold">This request has Expired.</strong>
                <p className="text-xs text-rose-800 mt-0.5">The required date has passed, and this emergency request is no longer active.</p>
              </div>
            </div>
          ) : (
            <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6 md:gap-4 py-4 px-2">
              {/* Connector line for desktop */}
              <div className="absolute top-[34px] left-6 right-6 hidden md:block h-0.5 bg-border/50 -z-10" />
              
              {timelineStages.map((stage, idx) => (
                <div key={idx} className="flex md:flex-col items-center md:items-center text-left md:text-center gap-4 md:gap-2 flex-1 relative">
                  {/* Step Bubble */}
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center border font-bold text-sm transition-all-300 z-10 shrink-0",
                    stage.isCompleted 
                      ? "bg-emerald-600 border-emerald-600 text-white shadow-premium" 
                      : "bg-white border-border text-muted-foreground"
                  )}>
                    {stage.isCompleted ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                  </div>

                  <div>
                    <h4 className={cn(
                      "font-bold text-xs",
                      stage.isCompleted ? "text-emerald-700" : "text-muted-foreground"
                    )}>
                      {stage.label}
                    </h4>
                    <p className="text-[10px] text-muted-foreground mt-0.5 max-w-[140px] leading-relaxed mx-auto">
                      {stage.description}
                    </p>
                    {stage.isCompleted && stage.date && (
                      <span className="block text-[9px] text-muted-foreground font-semibold mt-1">
                        {formatDateTime(stage.date)}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Grid: Request details + Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Summary Cards */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Patient Info Card */}
          <Card className="border-border/40 shadow-premium">
            <CardHeader className="bg-muted/10">
              <CardTitle className="text-base flex items-center gap-2">
                <User className="w-4 h-4 text-primary" />
                Patient Information
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6">
              <div>
                <span className="text-xs font-semibold text-muted-foreground block uppercase">Name</span>
                <span className="text-sm font-bold text-foreground mt-1 block">{request.patientName}</span>
              </div>
              <div>
                <span className="text-xs font-semibold text-muted-foreground block uppercase">Age</span>
                <span className="text-sm font-bold text-foreground mt-1 block">{request.patientAge} Years</span>
              </div>
              <div>
                <span className="text-xs font-semibold text-muted-foreground block uppercase">Gender</span>
                <span className="text-sm font-bold text-foreground mt-1 block capitalize">{request.patientGender.toLowerCase().replace(/_/g, ' ')}</span>
              </div>
            </CardContent>
          </Card>

          {/* Requirement details */}
          <Card className="border-border/40 shadow-premium">
            <CardHeader className="bg-muted/10">
              <CardTitle className="text-base flex items-center gap-2">
                <Droplet className="w-4 h-4 text-primary" />
                Requirement Information
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 text-sm">
              <div className="space-y-4">
                <div>
                  <span className="text-xs font-semibold text-muted-foreground block uppercase">Urgency Urgency</span>
                  <div className="mt-1">{getUrgencyBadge(request.urgency)}</div>
                </div>
                <div>
                  <span className="text-xs font-semibold text-muted-foreground block uppercase">Blood Units Required</span>
                  <span className="font-bold text-foreground block mt-1">
                    {request.needsBloodUnits ? `${request.unitsRequired} Units` : 'No direct units required'}
                  </span>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <span className="text-xs font-semibold text-muted-foreground block uppercase">Needed Before Date</span>
                  <span className="font-bold text-foreground block mt-1 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    {formatDateTime(request.neededBy)}
                  </span>
                </div>
                <div>
                  <span className="text-xs font-semibold text-muted-foreground block uppercase">Replacement Donors Progress</span>
                  <span className="font-bold text-foreground block mt-1">
                    {request.needsReplacementDonors 
                      ? `${request.replacementDonorCount || 1} Donors (${request.replacementRequirement === 'SAME_BLOOD_GROUP' ? 'Same Blood Type' : 'Any Blood Type'})`
                      : 'Replacement donors not requested'}
                  </span>
                </div>
              </div>

              {request.notes && (
                <div className="sm:col-span-2 border-t border-border/40 pt-4 mt-2">
                  <span className="text-xs font-semibold text-muted-foreground block uppercase mb-1">Additional Seeker Notes</span>
                  <p className="text-xs leading-relaxed text-foreground bg-muted/30 p-3 rounded-lg border border-border/20 italic">
                    "{request.notes}"
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Hospital Information */}
          <Card className="border-border/40 shadow-premium">
            <CardHeader className="bg-muted/10">
              <CardTitle className="text-base flex items-center gap-2">
                <Building2 className="w-4 h-4 text-primary" />
                Hospital & Delivery Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6 text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <span className="text-xs font-semibold text-muted-foreground block uppercase">Hospital Name</span>
                  <span className="font-bold text-foreground block mt-1">{hospitalNameText}</span>
                </div>
                <div>
                  <span className="text-xs font-semibold text-muted-foreground block uppercase">State & District</span>
                  <span className="font-bold text-foreground block mt-1">{hospitalLocationText}</span>
                </div>
              </div>
              <div className="border-t border-border/40 pt-4">
                <span className="text-xs font-semibold text-muted-foreground block uppercase">Full Hospital Address</span>
                <span className="font-medium text-foreground block mt-1 flex items-start gap-1.5">
                  <MapPin className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                  {hospitalAddressText}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Side: Request Stats & Contact Seeker */}
        <div className="space-y-8">
          {/* Quick Statistics card */}
          <Card className="border-border/40 shadow-premium">
            <CardHeader className="bg-muted/10">
              <CardTitle className="text-base flex items-center gap-2">
                <Activity className="w-4 h-4 text-primary" />
                Response Statistics
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="p-3 bg-muted/40 rounded-xl border border-border/30">
                  <span className="block text-xl font-black text-foreground">{request.totalDonorRequests}</span>
                  <span className="text-[10px] text-muted-foreground font-semibold uppercase">Alerts Sent</span>
                </div>
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                  <span className="block text-xl font-black text-emerald-800">{request.acceptedCount}</span>
                  <span className="text-[10px] text-emerald-600 font-semibold uppercase">Accepted</span>
                </div>
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-100">
                  <span className="block text-xl font-black text-amber-800">{request.pendingCount}</span>
                  <span className="text-[10px] text-amber-600 font-semibold uppercase">Pending</span>
                </div>
                <div className="p-3 bg-rose-50 rounded-xl border border-rose-100">
                  <span className="block text-xl font-black text-rose-800">{request.declinedCount}</span>
                  <span className="text-[10px] text-rose-600 font-semibold uppercase">Declined</span>
                </div>
              </div>

              <div className="border-t border-border/40 pt-4 mt-2">
                <div className="flex justify-between text-xs font-semibold text-muted-foreground mb-1">
                  <span>Overall Fulfillment</span>
                  <span>{request.status === 'FULFILLED' ? '100% Met' : `${request.acceptedCount} Confirmed`}</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-emerald-600 h-full transition-all duration-500" 
                    style={{ 
                      width: `${Math.min(100, (request.acceptedCount / (request.needsReplacementDonors ? (request.replacementDonorCount || 1) : (request.unitsRequired || 1))) * 100)}%` 
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Coordination Details card */}
          <Card className="border-border/40 shadow-premium">
            <CardHeader className="bg-muted/10">
              <CardTitle className="text-base flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary" />
                Your Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-3 text-xs leading-relaxed text-muted-foreground">
              <p>Nearby compatible donors receive request alerts detailing patient requirements. Once a donor clicks <strong>Accept</strong>, they are shown your phone number so you can coordinate donation times.</p>
              
              <div className="bg-muted/30 p-3 rounded-lg border border-border/20 space-y-2 mt-2">
                <div className="flex justify-between font-semibold">
                  <span>Contact Name:</span>
                  <span className="text-foreground">{request.contactName}</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span>Contact Phone:</span>
                  <span className="text-foreground">{request.contactPhone}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Donor Responses Tabs Section */}
      <Card className="border-border/40 shadow-premium">
        <CardHeader className="pb-0 border-b border-border/40">
          <CardTitle className="text-lg flex items-center gap-2 mb-2">
            <Users className="w-5 h-5 text-primary" />
            Donor Response Registry
          </CardTitle>
          <CardDescription className="pb-4">
            Manage and contact donors who responded to this request.
          </CardDescription>

          {/* Tabs bar */}
          <div className="flex gap-2 -mb-px">
            <button
              onClick={() => setActiveTab('ACCEPTED')}
              className={cn(
                "px-4 py-2 border-b-2 font-bold text-xs transition-all duration-200 cursor-pointer",
                activeTab === 'ACCEPTED'
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              Accepted ({acceptedDonors.length})
            </button>
            <button
              onClick={() => setActiveTab('PENDING')}
              className={cn(
                "px-4 py-2 border-b-2 font-bold text-xs transition-all duration-200 cursor-pointer",
                activeTab === 'PENDING'
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              Pending ({pendingDonors.length})
            </button>
            <button
              onClick={() => setActiveTab('DECLINED')}
              className={cn(
                "px-4 py-2 border-b-2 font-bold text-xs transition-all duration-200 cursor-pointer",
                activeTab === 'DECLINED'
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              Declined ({declinedDonors.length})
            </button>
          </div>
        </CardHeader>
        
        <CardContent className="p-6">
          
          {/* Accepted Tab */}
          {activeTab === 'ACCEPTED' && (
            <div className="space-y-4">
              {acceptedDonors.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground text-sm flex flex-col items-center gap-2">
                  <Heart className="w-8 h-8 text-muted-foreground/50" />
                  <span>No donors have accepted this request yet. We will notify you when a donor accepts.</span>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {acceptedDonors.map((dr) => {
                    const profile = dr.donorProfile.profile;
                    const blood = BLOOD_TYPE_LABELS[dr.donorProfile.bloodType as keyof typeof BLOOD_TYPE_LABELS] || dr.donorProfile.bloodType;
                    const donationDate = dr.donorProfile.lastDonatedAt 
                      ? formatDate(dr.donorProfile.lastDonatedAt)
                      : 'Never';

                    return (
                      <div key={dr.id} className="border border-border/40 p-4 rounded-xl bg-white shadow-premium flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="inline-flex items-center justify-center w-7 h-7 rounded bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold text-xs">
                              {blood}
                            </span>
                            <span className="font-extrabold text-foreground text-sm">{profile.fullName}</span>
                          </div>
                          <div className="text-xs text-muted-foreground space-y-2">
                            <p>Last Donation: <strong>{donationDate}</strong></p>
                            {profile.phone && (
                              <p className="text-foreground font-semibold flex items-center gap-1 mt-1">
                                <Phone className="w-3.5 h-3.5 text-muted-foreground" />
                                Phone: {profile.phone}
                              </p>
                            )}
                            <div className="pt-1">
                              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">Donation Status</span>
                              {dr.donationStatus === 'CONFIRMED' ? (
                                <div className="space-y-1">
                                  <div className="inline-flex items-center gap-1 text-emerald-750 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-250 font-bold text-[10px]">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                    Donation Confirmed
                                  </div>
                                  <p className="text-[10px] text-muted-foreground">Completed on: <strong>{dr.completedAt ? formatDate(dr.completedAt) : ''}</strong></p>
                                </div>
                              ) : (
                                <div className="space-y-1">
                                  <div className="inline-flex items-center gap-1 text-amber-750 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 font-bold text-[10px]">
                                    Accepted
                                  </div>
                                  <p className="text-[10px] text-muted-foreground">Accepted on: <strong>{formatDateTime(dr.updatedAt)}</strong></p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-2 self-stretch sm:self-center shrink-0">
                          {profile.phone && (
                            <a href={`tel:${profile.phone}`} className="flex-1 sm:flex-initial">
                              <Button size="sm" variant="outline" className="flex items-center justify-center gap-1.5 w-full sm:w-auto bg-success text-white border-success hover:bg-success/90 hover:border-success/90 hover:text-white">
                                <Phone className="w-3.5 h-3.5 fill-white text-white" />
                                Call Donor
                              </Button>
                            </a>
                          )}
                          {dr.donationStatus !== 'CONFIRMED' && (
                            <Button 
                              size="sm" 
                              variant="primary" 
                              onClick={() => handleConfirmClick(dr.id)}
                              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 w-full sm:w-auto"
                            >
                              Confirm Donation
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Pending Tab */}
          {activeTab === 'PENDING' && (
            <div className="space-y-4">
              {pendingDonors.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground text-sm flex flex-col items-center gap-2">
                  <Activity className="w-8 h-8 text-muted-foreground/50 animate-pulse" />
                  <span>No pending invitations are active. All matching donors have responded.</span>
                </div>
              ) : (
                <div className="divide-y divide-border/40 border border-border/40 rounded-xl bg-white overflow-hidden shadow-premium">
                  {pendingDonors.map((dr) => {
                    const blood = BLOOD_TYPE_LABELS[dr.donorProfile.bloodType as keyof typeof BLOOD_TYPE_LABELS] || dr.donorProfile.bloodType;

                    return (
                      <div key={dr.id} className="p-4 flex items-center justify-between gap-4 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center justify-center w-7 h-7 rounded bg-muted border border-border text-muted-foreground font-semibold text-xs">
                            {blood}
                          </span>
                          <span className="font-bold text-foreground text-sm">{dr.donorProfile.profile.fullName}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-muted-foreground font-semibold">
                          <Clock className="w-3.5 h-3.5 text-warning" />
                          Waiting for Response
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Declined Tab */}
          {activeTab === 'DECLINED' && (
            <div className="space-y-4">
              {declinedDonors.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground text-sm flex flex-col items-center gap-2">
                  <Heart className="w-8 h-8 text-muted-foreground/50" />
                  <span>No donors have declined this request.</span>
                </div>
              ) : (
                <div className="divide-y divide-border/40 border border-border/40 rounded-xl bg-white overflow-hidden shadow-premium">
                  {declinedDonors.map((dr) => {
                    const blood = BLOOD_TYPE_LABELS[dr.donorProfile.bloodType as keyof typeof BLOOD_TYPE_LABELS] || dr.donorProfile.bloodType;

                    return (
                      <div key={dr.id} className="p-4 flex items-center justify-between gap-4 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center justify-center w-7 h-7 rounded bg-rose-50 border border-rose-200 text-rose-700 font-semibold text-xs">
                            {blood}
                          </span>
                          <span className="font-semibold text-muted-foreground text-sm">{dr.donorProfile.profile.fullName}</span>
                        </div>
                        <div className="flex items-center gap-1 text-destructive font-semibold">
                          <XCircle className="w-3.5 h-3.5 text-destructive" />
                          Declined
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

        </CardContent>
      </Card>

      {/* Confirmation Cancellation Modal */}
      <Modal
        isOpen={isCancelModalOpen}
        onClose={() => !isCancelling && setIsCancelModalOpen(false)}
        title="Cancel Emergency Blood Request?"
        size="sm"
      >
        <div className="space-y-4">
          <div className="flex gap-3 text-sm text-foreground/80 leading-relaxed">
            <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-foreground mb-1">Are you sure you want to cancel this request?</p>
              <p>This action will automatically notify all pending donors, mark their invitations as expired, and remove this request from the active board. <strong>This action cannot be undone.</strong></p>
            </div>
          </div>
          
          {cancelError && (
            <div className="p-3 bg-destructive-light text-destructive text-xs border border-destructive/20 rounded-lg">
              {cancelError}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsCancelModalOpen(false)}
              disabled={isCancelling}
            >
              Keep Request
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleCancelConfirm}
              isLoading={isCancelling}
              className="bg-destructive hover:bg-destructive/90 hover:shadow-md border-transparent text-white"
            >
              Cancel Request
            </Button>
          </div>
        </div>
      </Modal>

      {/* Confirm Blood Donation Modal */}
      <Modal
        isOpen={isConfirmModalOpen}
        onClose={() => !isConfirming && setIsConfirmModalOpen(false)}
        title="Confirm Blood Donation"
        size="sm"
      >
        <div className="space-y-4">
          <div className="flex gap-3 text-sm text-foreground/80 leading-relaxed">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-foreground mb-1">Confirm Blood Donation</p>
              <p>Please confirm that this donor successfully donated blood.</p>
              <p className="mt-2 text-xs text-muted-foreground">This action updates donor history, eligibility, and statistics. This action cannot be undone.</p>
            </div>
          </div>
          
          {confirmError && (
            <div className="p-3 bg-destructive-light text-destructive text-xs border border-destructive/20 rounded-lg">
              {confirmError}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsConfirmModalOpen(false)}
              disabled={isConfirming}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleConfirmDonation}
              isLoading={isConfirming}
              className="bg-emerald-600 hover:bg-emerald-700 hover:shadow-md border-transparent text-white"
            >
              Confirm Donation
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

// Private helper to extract patient first/last name safely
function patientNameText(name: string) {
  if (!name) return 'Patient';
  return name.trim();
}
