import * as React from 'react';
import Link from 'next/link';
import {
  Users,
  HeartHandshake,
  AlertCircle,
  CheckCircle2,
  Clock,
  ArrowRight,
  BarChart3,
  ShieldCheck,
} from 'lucide-react';
import { getAdminDashboardMetricsAction } from '@/app/actions/admin';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export const metadata = {
  title: 'Admin Dashboard | LifeLink Administration',
  description: 'LifeLink platform metrics and management overview.',
};

export default async function AdminDashboardPage() {
  const metrics = await getAdminDashboardMetricsAction();

  const metricCards = [
    {
      title: 'Total Users',
      value: metrics.totalUsers,
      description: 'Registered user profiles across platform',
      icon: Users,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10 border-blue-500/20',
      link: '/admin/users',
    },
    {
      title: 'Registered Donors',
      value: metrics.totalDonors,
      description: 'Active & verified donor profiles',
      icon: HeartHandshake,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10 border-emerald-500/20',
      link: '/admin/donors',
    },
    {
      title: 'Emergency Requests',
      value: metrics.activeRequests,
      description: 'Currently active blood requests',
      icon: AlertCircle,
      color: 'text-red-400',
      bgColor: 'bg-red-500/10 border-red-500/20',
      link: '/admin/requests',
    },
    {
      title: 'Completed Donations',
      value: metrics.completedDonations,
      description: 'Confirmed successful blood donations',
      icon: CheckCircle2,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10 border-purple-500/20',
      link: '/admin/analytics',
    },
    {
      title: 'Pending Requests',
      value: metrics.pendingRequests,
      description: 'Awaiting donor responses',
      icon: Clock,
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/10 border-amber-500/20',
      link: '/admin/requests',
    },
  ];

  const quickActions = [
    {
      title: 'Manage User Profiles',
      description: 'View registered members and user detail records.',
      href: '/admin/users',
      icon: Users,
      badge: 'Users',
      badgeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    },
    {
      title: 'Donor Verifications',
      description: 'Review donor eligibility and toggle verification status.',
      href: '/admin/donors',
      icon: HeartHandshake,
      badge: 'Donors',
      badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    },
    {
      title: 'Emergency Requests',
      description: 'Monitor active blood emergencies and hospital needs.',
      href: '/admin/requests',
      icon: AlertCircle,
      badge: 'Requests',
      badgeColor: 'bg-red-500/10 text-red-400 border-red-500/30',
    },
    {
      title: 'Platform Analytics',
      description: 'Explore blood group distribution and donation stats.',
      href: '/admin/analytics',
      icon: BarChart3,
      badge: 'Analytics',
      badgeColor: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-black text-white tracking-tight">Overview Dashboard</h1>
            <Badge variant="outline" className="border-red-500/30 bg-red-500/10 text-red-400 text-xs font-bold">
              <ShieldCheck className="w-3.5 h-3.5 mr-1" /> System Active
            </Badge>
          </div>
          <p className="text-xs text-slate-400">
            Real-time platform activity metrics, user profiles, and emergency blood donation tracking.
          </p>
        </div>

        <Link href="/admin/analytics">
          <Button variant="outline" size="sm" className="border-slate-700 bg-slate-900 text-white hover:bg-slate-800 text-xs font-semibold">
            <BarChart3 className="w-4 h-4 mr-2 text-primary" /> View Detailed Analytics
          </Button>
        </Link>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {metricCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link key={card.title} href={card.link} className="group">
              <Card className="bg-slate-950/80 border-slate-800 group-hover:border-slate-700 transition-all duration-200 shadow-lg h-full flex flex-col justify-between">
                <CardHeader className="p-4 pb-2 border-b-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-400">{card.title}</span>
                    <div className={`p-2 rounded-xl border ${card.bgColor}`}>
                      <Icon className={`w-4 h-4 ${card.color}`} />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-1">
                  <div className="text-3xl font-black text-white tracking-tight">{card.value}</div>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">{card.description}</p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Quick Actions Section */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight">Quick Actions & Shortcuts</h2>
          <p className="text-xs text-slate-400">Direct shortcuts to admin management modules</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link key={action.title} href={action.href} className="group">
                <Card className="bg-slate-950/80 border-slate-800 group-hover:border-slate-700 group-hover:bg-slate-900/90 transition-all duration-200 p-5 h-full flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 group-hover:text-white group-hover:border-slate-700">
                        <Icon className="w-5 h-5" />
                      </div>
                      <Badge variant="outline" className={`text-[10px] font-bold px-2 py-0.5 ${action.badgeColor}`}>
                        {action.badge}
                      </Badge>
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-white group-hover:text-primary transition-colors">
                        {action.title}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1">
                        {action.description}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 mt-2 border-t border-slate-800/60 flex items-center text-xs font-semibold text-primary group-hover:translate-x-1 transition-transform">
                    Access Module <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
