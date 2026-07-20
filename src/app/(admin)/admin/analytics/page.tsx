import * as React from 'react';
import {
  BarChart3,
  HeartHandshake,
  AlertCircle,
  CheckCircle2,
  Clock,
  Droplet,
  Info,
  TrendingUp,
} from 'lucide-react';
import { getAdminAnalyticsDataAction } from '@/app/actions/admin';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const metadata = {
  title: 'Platform Analytics | LifeLink Admin',
  description: 'Detailed platform metrics and blood group distribution analytics.',
};

export default async function AdminAnalyticsPage() {
  const analytics = await getAdminAnalyticsDataAction();
  const { metrics, bloodTypeDistribution, requestedBloodTypeDistribution, isDemo } = analytics;

  const totalRegisteredDonors = bloodTypeDistribution.reduce((acc, curr) => acc + curr.count, 0) || 1;
  const totalRequestedUnits = requestedBloodTypeDistribution.reduce((acc, curr) => acc + curr.count, 0) || 1;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-purple-400" /> Platform Analytics & Metrics
          </h1>
          <p className="text-xs text-slate-400">
            Statistical breakdown of blood group availability, donor response rates, and emergency requests.
          </p>
        </div>
        {isDemo && (
          <Badge variant="outline" className="border-amber-500/30 bg-amber-500/10 text-amber-400 font-bold px-3 py-1 text-xs self-start sm:self-auto flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5" /> Demonstration Data Active
          </Badge>
        )}
      </div>

      {/* Overview Metric Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-slate-950/80 border-slate-800 p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Active Donors</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <HeartHandshake className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-white mt-2">{metrics.activeDonors}</div>
          <p className="text-[11px] text-slate-400 mt-1">Ready for emergency contact</p>
        </Card>

        <Card className="bg-slate-950/80 border-slate-800 p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Total Requests</span>
            <div className="p-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-white mt-2">{metrics.totalRequests}</div>
          <p className="text-[11px] text-slate-400 mt-1">Submitted platform emergencies</p>
        </Card>

        <Card className="bg-slate-950/80 border-slate-800 p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Completed Donations</span>
            <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-white mt-2">{metrics.completedDonations}</div>
          <p className="text-[11px] text-slate-400 mt-1">Verified successful transfers</p>
        </Card>

        <Card className="bg-slate-950/80 border-slate-800 p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Pending Requests</span>
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-white mt-2">{metrics.pendingRequests}</div>
          <p className="text-[11px] text-slate-400 mt-1">In coordination matching</p>
        </Card>
      </div>

      {/* Analytics Distributions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Donor Blood Group Distribution */}
        <Card className="bg-slate-950/80 border-slate-800 p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Droplet className="w-5 h-5 text-primary fill-primary" /> Registered Donor Blood Group Distribution
              </h2>
              <p className="text-xs text-slate-400">Share of available donors categorized by ABO/Rh group</p>
            </div>
            <Badge variant="outline" className="border-slate-700 bg-slate-900 text-slate-300 text-xs">
              {totalRegisteredDonors} Donors
            </Badge>
          </div>

          <div className="space-y-4">
            {bloodTypeDistribution.map((item) => {
              const percentage = Math.round((item.count / totalRegisteredDonors) * 100);
              return (
                <div key={item.bloodType} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-medium">
                    <span className="text-slate-200 font-black flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-primary" />
                      Group {item.bloodType}
                    </span>
                    <span className="text-slate-400 font-mono">
                      {item.count} donors ({percentage}%)
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className="h-full bg-gradient-to-r from-primary/80 to-primary rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Most Requested Blood Groups */}
        <Card className="bg-slate-950/80 border-slate-800 p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-red-400" /> Most Requested Blood Groups
              </h2>
              <p className="text-xs text-slate-400">Frequency of emergency hospital blood requests</p>
            </div>
            <Badge variant="outline" className="border-slate-700 bg-slate-900 text-slate-300 text-xs">
              {totalRequestedUnits} Requests
            </Badge>
          </div>

          <div className="space-y-4">
            {requestedBloodTypeDistribution.map((item) => {
              const percentage = Math.round((item.count / totalRequestedUnits) * 100);
              return (
                <div key={item.bloodType} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-medium">
                    <span className="text-slate-200 font-black flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-red-500" />
                      Group {item.bloodType}
                    </span>
                    <span className="text-slate-400 font-mono">
                      {item.count} requests ({percentage}%)
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className="h-full bg-gradient-to-r from-red-600 to-red-400 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}
