'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { SearchBar } from '@/components/ui/search-bar';
import { cancelEmergencyRequest } from '@/app/actions/request';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  AlertCircle, 
  Droplet, 
  Activity, 
  CheckCircle2, 
  XCircle, 
  HelpCircle,
  Eye,
  Users
} from 'lucide-react';
import { BLOOD_TYPE_LABELS } from '@/lib/constants/bloodTypes';
import { REQUEST_URGENCY_LABELS } from '@/lib/constants/status';
import { EmptyState } from '@/components/ui/empty-state';

// Types for request objects returned from backend
interface UserRequest {
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
  acceptedCount: number;
  pendingCount: number;
  declinedCount: number;
  totalDonorRequests: number;
}

interface Statistics {
  total: number;
  active: number;
  fulfilled: number;
  cancelled: number;
  pendingResponses: number;
}

interface MyRequestsClientProps {
  initialRequests: UserRequest[];
  statistics: Statistics;
}

export function MyRequestsClient({ initialRequests, statistics }: MyRequestsClientProps) {
  const router = useRouter();
  const [requests, setRequests] = React.useState<UserRequest[]>(initialRequests);
  const [stats, setStats] = React.useState<Statistics>(statistics);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedStatus, setSelectedStatus] = React.useState<'ALL' | 'ACTIVE' | 'FULFILLED' | 'EXPIRED' | 'CANCELLED'>('ALL');
  
  // Cancellation Modal State
  const [isCancelModalOpen, setIsCancelModalOpen] = React.useState(false);
  const [requestToCancel, setRequestToCancel] = React.useState<string | null>(null);
  const [isCancelling, setIsCancelling] = React.useState(false);
  const [cancelError, setCancelError] = React.useState<string | null>(null);

  // Sync initial requests if they change
  React.useEffect(() => {
    setRequests(initialRequests);
    setStats(statistics);
  }, [initialRequests, statistics]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleCancelClick = (requestId: string) => {
    setRequestToCancel(requestId);
    setCancelError(null);
    setIsCancelModalOpen(true);
  };

  const handleCancelConfirm = async () => {
    if (!requestToCancel) return;
    setIsCancelling(true);
    setCancelError(null);
    try {
      const res = await cancelEmergencyRequest(requestToCancel);
      if (res.success) {
        setIsCancelModalOpen(false);
        setRequestToCancel(null);
        router.refresh();
      } else {
        setCancelError(res.error || 'Failed to cancel the request.');
      }
    } catch (err) {
      console.error(err);
      setCancelError('An unexpected error occurred. Please try again.');
    } finally {
      setIsCancelling(false);
    }
  };

  const filteredRequests = React.useMemo(() => {
    return requests.filter((req) => {
      // 1. Status Filter
      if (selectedStatus !== 'ALL' && req.status !== selectedStatus) {
        return false;
      }

      // 2. Search Query Filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const patientNameMatch = req.patientName.toLowerCase().includes(query);
        
        const hospitalNameText = req.hospital?.name || req.hospitalName || '';
        const hospitalMatch = hospitalNameText.toLowerCase().includes(query);
        
        const bloodLabel = BLOOD_TYPE_LABELS[req.bloodType as keyof typeof BLOOD_TYPE_LABELS] || req.bloodType;
        const bloodMatch = bloodLabel.toLowerCase().includes(query) || req.bloodType.toLowerCase().includes(query);

        return patientNameMatch || hospitalMatch || bloodMatch;
      }

      return true;
    });
  }, [requests, searchQuery, selectedStatus]);

  // Formatter for Date
  const formatDate = (dateValue: Date | string) => {
    const d = new Date(dateValue);
    return d.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case 'IMMEDIATE':
        return <Badge variant="destructive">Immediate</Badge>;
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

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          My Requests
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Track and manage your emergency blood coordination requests.
        </p>
      </div>

      {/* Summary Section */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="border-border/40 shadow-premium">
          <CardHeader className="p-4 flex flex-row items-center justify-between pb-2 border-b-0">
            <CardDescription className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Requests</CardDescription>
            <Activity className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <span className="text-2xl font-bold text-foreground">{stats.total}</span>
          </CardContent>
        </Card>
        
        <Card className="border-border/40 shadow-premium">
          <CardHeader className="p-4 flex flex-row items-center justify-between pb-2 border-b-0">
            <CardDescription className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Active</CardDescription>
            <Droplet className="w-4 h-4 text-emerald-600 animate-pulse" />
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <span className="text-2xl font-bold text-emerald-700">{stats.active}</span>
          </CardContent>
        </Card>

        <Card className="border-border/40 shadow-premium">
          <CardHeader className="p-4 flex flex-row items-center justify-between pb-2 border-b-0">
            <CardDescription className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Fulfilled</CardDescription>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <span className="text-2xl font-bold text-emerald-700">{stats.fulfilled}</span>
          </CardContent>
        </Card>

        <Card className="border-border/40 shadow-premium">
          <CardHeader className="p-4 flex flex-row items-center justify-between pb-2 border-b-0">
            <CardDescription className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Cancelled</CardDescription>
            <XCircle className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <span className="text-2xl font-bold text-foreground/75">{stats.cancelled}</span>
          </CardContent>
        </Card>

        <Card className="border-border/40 shadow-premium col-span-2 md:col-span-1">
          <CardHeader className="p-4 flex flex-row items-center justify-between pb-2 border-b-0">
            <CardDescription className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Pending Alerts</CardDescription>
            <Users className="w-4 h-4 text-warning" />
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <span className="text-2xl font-bold text-warning font-extrabold">{stats.pendingResponses}</span>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters Section */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-muted/20 p-4 rounded-xl border border-border/40">
        <div className="w-full md:max-w-md">
          <SearchBar 
            onSearch={handleSearch} 
            placeholder="Search patient, hospital or blood type..."
            initialValue={searchQuery}
          />
        </div>
        
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          {(['ALL', 'ACTIVE', 'FULFILLED', 'EXPIRED', 'CANCELLED'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all-300 border cursor-pointer",
                selectedStatus === status
                  ? "bg-primary border-primary text-white shadow-premium"
                  : "bg-white border-border text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              {status === 'ALL' ? 'All Requests' : status.charAt(0) + status.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Requests Display */}
      {filteredRequests.length === 0 ? (
        <div className="py-12 border border-dashed border-border rounded-2xl bg-muted/5">
          <EmptyState 
            icon={Droplet}
            title={searchQuery || selectedStatus !== 'ALL' ? "No Matching Requests" : "No Requests Yet"}
            description={
              searchQuery || selectedStatus !== 'ALL' 
                ? "Try adjusting your search criteria or status filter to locate your request." 
                : "Create your first emergency blood request to connect with nearby donors."
            }
            actionText="Request Blood"
            onAction={() => router.push('/request/new')}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRequests.map((req) => {
            const bloodLabel = BLOOD_TYPE_LABELS[req.bloodType as keyof typeof BLOOD_TYPE_LABELS] || req.bloodType;
            const hospitalNameText = req.hospital?.name || req.hospitalName || 'Manual Entry';
            const locationText = req.hospital 
              ? `${req.hospital.district}, ${req.hospital.state}`
              : `${req.manualHospitalDistrict || ''}, ${req.manualHospitalState || ''}`;

            return (
              <Card key={req.id} hoverable className="border-border/40 flex flex-col justify-between">
                <div>
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      {/* Blood group badge */}
                      <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 text-primary font-bold text-base">
                        {bloodLabel}
                      </span>
                      <div className="flex items-center gap-2">
                        {getUrgencyBadge(req.urgency)}
                        {getStatusBadge(req.status)}
                      </div>
                    </div>
                    <CardTitle className="mt-3 text-lg font-bold text-foreground">
                      Patient: {req.patientName}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-1.5 mt-1 font-medium">
                      <Calendar className="w-3.5 h-3.5 shrink-0" />
                      Needed by: {formatDate(req.neededBy)}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-4 py-0">
                    <div className="space-y-2 text-xs">
                      <div className="flex items-start gap-2 text-muted-foreground">
                        <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                        <div>
                          <strong className="text-foreground font-semibold block">{hospitalNameText}</strong>
                          <span>{locationText}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="w-3.5 h-3.5 shrink-0" />
                        <span>Created: {formatDate(req.createdAt)}</span>
                      </div>
                    </div>

                    <hr className="border-border/50" />

                    {/* Progress details */}
                    <div className="space-y-3">
                      {req.needsBloodUnits && (
                        <div>
                          <div className="flex justify-between text-xs font-semibold text-muted-foreground mb-1">
                            <span>Blood Units (Required: {req.unitsRequired})</span>
                            <span className="text-foreground">Accepted: {req.acceptedCount}</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                            <div 
                              className="bg-success h-full transition-all duration-500" 
                              style={{ width: `${Math.min(100, (req.acceptedCount / req.unitsRequired) * 100)}%` }}
                            />
                          </div>
                        </div>
                      )}

                      {req.needsReplacementDonors && (
                        <div>
                          <div className="flex justify-between text-xs font-semibold text-muted-foreground mb-1">
                            <span>Replacement Donors (Target: {req.replacementDonorCount || 1})</span>
                            <span className="text-foreground">Accepted: {req.acceptedCount}</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                            <div 
                              className="bg-primary h-full transition-all duration-500" 
                              style={{ width: `${Math.min(100, (req.acceptedCount / (req.replacementDonorCount || 1)) * 100)}%` }}
                            />
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-3 gap-2 text-center text-xs mt-2 pt-1">
                        <div className="bg-emerald-50 text-emerald-800 p-1.5 rounded-lg border border-emerald-100 font-semibold">
                          <span className="block text-emerald-950 font-bold">{req.acceptedCount}</span>
                          Accepted
                        </div>
                        <div className="bg-amber-50 text-amber-800 p-1.5 rounded-lg border border-amber-100 font-semibold">
                          <span className="block text-amber-950 font-bold">{req.pendingCount}</span>
                          Pending
                        </div>
                        <div className="bg-rose-50 text-rose-800 p-1.5 rounded-lg border border-rose-100 font-semibold">
                          <span className="block text-rose-950 font-bold">{req.declinedCount}</span>
                          Declined
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </div>

                <div className="p-6 pt-4 border-t border-border/40 mt-4 flex items-center justify-end gap-2 bg-muted/5">
                  <Link href={`/my-requests/${req.id}`}>
                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5" />
                      Details
                    </Button>
                  </Link>

                  {req.status === 'ACTIVE' && (
                    <>
                      <Link href={`/request/${req.id}/matches`}>
                        <Button variant="primary" size="sm">
                          Matches
                        </Button>
                      </Link>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-destructive border-destructive hover:bg-destructive-light hover:text-destructive"
                        onClick={() => handleCancelClick(req.id)}
                      >
                        Cancel
                      </Button>
                    </>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}

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
    </div>
  );
}
