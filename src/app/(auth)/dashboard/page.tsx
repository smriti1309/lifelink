import { redirect } from 'next/navigation';
import { AuthService } from '@/services/auth';
import { ProfileService } from '@/services/profile';
import { DonorService } from '@/services/donor';
import { RequestService } from '@/services/request';
import prisma from '@/lib/prisma';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { DonorDashboardButton } from '@/components/dashboard/donor-dashboard-button';
import { 
  CheckCircle2, 
  ShieldAlert, 
  Activity, 
  Clock, 
  Heart, 
  FileText, 
  PlusCircle, 
  XCircle, 
  ArrowRight 
} from 'lucide-react';

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function DashboardPage({ searchParams }: PageProps) {
  const user = await AuthService.getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  const profile = await ProfileService.getProfile(user.id);
  const donorProfile = await DonorService.getDonorByProfileId(user.id);

  // Await search params for Next.js 15/16 compliance
  const resolvedSearchParams = await searchParams;
  const success = resolvedSearchParams.success;

  // Fetch statistics and activity feed
  const stats = await RequestService.getRequestStatistics(user.id);
  const userRequests = await prisma.emergencyRequest.findMany({
    where: { seekerId: user.id },
    include: {
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
    orderBy: {
      updatedAt: 'desc',
    },
  });

  interface ActivityItem {
    id: string;
    type: 'CREATED' | 'ACCEPTED' | 'FULFILLED' | 'CANCELLED';
    title: string;
    description: string;
    timestamp: Date;
  }

  const activities: ActivityItem[] = [];

  for (const req of userRequests) {
    // Created Event
    activities.push({
      id: `${req.id}-created`,
      type: 'CREATED',
      title: 'Request Created',
      description: `Filed a request for ${req.bloodType.replace('_', '+')} blood for patient ${req.patientName}.`,
      timestamp: req.createdAt,
    });

    // Fulfilled Event
    if (req.status === 'FULFILLED') {
      activities.push({
        id: `${req.id}-fulfilled`,
        type: 'FULFILLED',
        title: 'Request Fulfilled',
        description: `Request for ${req.bloodType.replace('_', '+')} blood for patient ${req.patientName} was fulfilled.`,
        timestamp: req.updatedAt,
      });
    }

    // Cancelled Event
    if (req.status === 'CANCELLED') {
      activities.push({
        id: `${req.id}-cancelled`,
        type: 'CANCELLED',
        title: 'Request Cancelled',
        description: `Request for ${req.bloodType.replace('_', '+')} blood for patient ${req.patientName} was cancelled.`,
        timestamp: req.updatedAt,
      });
    }

    // Accepted Event(s)
    const acceptedDonors = req.donorRequests.filter(dr => dr.status === 'ACCEPTED');
    for (const dr of acceptedDonors) {
      activities.push({
        id: `${dr.id}-accepted`,
        type: 'ACCEPTED',
        title: 'Donor Accepted',
        description: `Donor ${dr.donorProfile.profile.fullName} accepted your request for ${req.patientName}.`,
        timestamp: dr.updatedAt,
      });
    }
  }

  activities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  const recentActivities = activities.slice(0, 5);

  const formatDateTime = (dateValue: Date) => {
    return dateValue.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
          Dashboard
        </h1>
        <p className="text-muted-foreground mt-1">
          Welcome back to LifeLink Emergency Blood Coordination Platform.
        </p>
      </div>

      {/* Success Notification Banners */}
      {success === 'donor_registered' && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm rounded-lg flex items-start gap-3 font-medium animate-fade-in max-w-2xl">
          <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600 mt-0.5" />
          <div>
            <strong className="block text-emerald-900 mb-0.5">Donor Profile Registered Successfully!</strong>
            Thank you for volunteering. You are now active in the emergency donor search pool.
          </div>
        </div>
      )}

      {success === 'donor_registered_ineligible' && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 text-amber-800 text-sm rounded-lg flex items-start gap-3 font-medium animate-fade-in max-w-2xl">
          <ShieldAlert className="w-5 h-5 shrink-0 text-amber-600 mt-0.5" />
          <div>
            <strong className="block text-amber-900 mb-0.5">Donor Profile Saved - Currently Inactive</strong>
            Your donor registration details have been saved, but you are currently marked as <strong>inactive</strong> in search results due to temporary medical ineligibility answers. You can update your details at any time.
          </div>
        </div>
      )}

      {success === 'request_created' && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm rounded-lg flex items-start gap-3 font-medium animate-fade-in max-w-2xl">
          <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600 mt-0.5" />
          <div>
            <strong className="block text-emerald-900 mb-0.5">Emergency Request Published!</strong>
            Your blood request was filed successfully and is now active on the coordination board.
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side: Account Info + Activity Feed */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="border-border/40 shadow-premium">
            <CardHeader>
              <CardTitle>Welcome, {profile?.fullName || user.email}</CardTitle>
              <CardDescription>
                Account Details & Emergency Coordination Dashboard
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {profile ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4 py-2 border-b border-border/40">
                    <span className="text-sm font-semibold text-muted-foreground">Full Name</span>
                    <span className="text-sm text-foreground font-medium">{profile.fullName}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 py-2 border-b border-border/40">
                    <span className="text-sm font-semibold text-muted-foreground">Email Address</span>
                    <span className="text-sm text-foreground font-medium">{profile.email}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 py-2 border-b border-border/40">
                    <span className="text-sm font-semibold text-muted-foreground">Phone Number</span>
                    <span className="text-sm text-foreground font-medium">{profile.phone}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 py-2 border-b border-border/40">
                    <span className="text-sm font-semibold text-muted-foreground">Location</span>
                    <span className="text-sm text-foreground font-medium">
                      {profile.district}, {profile.state}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 py-2 border-b border-border/40">
                    <span className="text-sm font-semibold text-muted-foreground">Donor Status</span>
                    <span className="text-sm font-medium">
                      {donorProfile ? (
                        donorProfile.isEligible && donorProfile.status === 'AVAILABLE' ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            Active Donor
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                            Inactive / Deferred
                          </span>
                        )
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-50 text-slate-600 border border-slate-200">
                          Not Registered
                        </span>
                      )}
                    </span>
                  </div>
                  <div className="mt-6 flex flex-wrap gap-4 pt-2">
                    <Link href="/profile">
                      <Button variant="outline" size="sm">
                        Edit Profile
                      </Button>
                    </Link>
                    <Link href="/request/new">
                      <Button variant="outline" size="sm">
                        Create Emergency Request
                      </Button>
                    </Link>
                    <DonorDashboardButton hasDonorProfile={!!donorProfile} />
                  </div>
                </div>
              ) : (
                <div className="py-4 text-center">
                  <p className="text-sm text-muted-foreground mb-4">
                    You have not completed your profile yet. Please complete your profile to use all coordination features.
                  </p>
                  <Link href="/profile">
                    <Button size="sm">
                      Complete Profile
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Activity Log */}
          <Card className="border-border/40 shadow-premium">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Activity className="w-4 h-4 text-primary" />
                Recent Request Activity
              </CardTitle>
              <CardDescription>
                Chronological update feed on requests and donor responses
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {recentActivities.length === 0 ? (
                <div className="p-6 text-center text-sm text-muted-foreground">
                  No recent request activity. Create a request to see updates here.
                </div>
              ) : (
                <div className="divide-y divide-border/40">
                  {recentActivities.map((act) => (
                    <div key={act.id} className="p-4 flex items-start gap-3 hover:bg-muted/10 transition-all-300">
                      <div className="mt-0.5 shrink-0">
                        {act.type === 'CREATED' && <PlusCircle className="w-4 h-4 text-primary" />}
                        {act.type === 'ACCEPTED' && <Heart className="w-4 h-4 text-emerald-600 fill-emerald-600" />}
                        {act.type === 'FULFILLED' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                        {act.type === 'CANCELLED' && <XCircle className="w-4 h-4 text-muted-foreground" />}
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-foreground">{act.title}</span>
                          <span className="text-[10px] text-muted-foreground font-medium flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                            {formatDateTime(act.timestamp)}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">{act.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Side: Shortcut card */}
        <div className="space-y-8">
          <Card className="border-border/40 shadow-premium">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary" />
                My Requests
              </CardTitle>
              <CardDescription>
                View and manage all your emergency blood requests.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="p-3 bg-muted/40 rounded-xl border border-border/30">
                  <span className="block text-xl font-black text-foreground">{stats.total}</span>
                  <span className="text-[10px] text-muted-foreground font-semibold uppercase">Total</span>
                </div>
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                  <span className="block text-xl font-black text-emerald-800">{stats.active}</span>
                  <span className="text-[10px] text-emerald-600 font-semibold uppercase">Active</span>
                </div>
              </div>
              
              <Link href="/my-requests" className="block w-full">
                <Button variant="outline" size="sm" className="w-full flex items-center justify-center gap-1">
                  Manage Requests
                  <ArrowRight className="w-4 h-4 text-muted-foreground" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
