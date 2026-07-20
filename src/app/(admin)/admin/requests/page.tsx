import * as React from 'react';
import { AlertCircle, Hospital, Phone, Calendar, UserCheck } from 'lucide-react';
import { getAdminRequestsAction } from '@/app/actions/admin';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const metadata = {
  title: 'Emergency Requests | LifeLink Admin',
  description: 'Manage active emergency blood donation requests.',
};

export default async function AdminRequestsPage() {
  const { requests, total } = await getAdminRequestsAction();

  const formatBloodType = (type: string) => {
    return type.replace('_PLUS', '+').replace('_MINUS', '-');
  };

  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case 'IMMEDIATE':
        return <Badge variant="outline" className="border-red-500/40 bg-red-500/20 text-red-400 font-black animate-pulse">IMMEDIATE</Badge>;
      case 'URGENT':
        return <Badge variant="outline" className="border-amber-500/40 bg-amber-500/20 text-amber-400 font-bold">URGENT</Badge>;
      default:
        return <Badge variant="outline" className="border-blue-500/30 bg-blue-500/10 text-blue-400 font-medium">NORMAL</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <Badge variant="outline" className="border-emerald-500/30 bg-emerald-500/10 text-emerald-400 font-bold">ACTIVE</Badge>;
      case 'FULFILLED':
        return <Badge variant="outline" className="border-purple-500/30 bg-purple-500/10 text-purple-400 font-bold">FULFILLED</Badge>;
      default:
        return <Badge variant="outline" className="border-slate-700 bg-slate-900 text-slate-400 font-medium">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <AlertCircle className="w-6 h-6 text-red-400" /> Emergency Requests Directory
          </h1>
          <p className="text-xs text-slate-400">
            Monitor and review active, urgent, and fulfilled emergency blood donation requests.
          </p>
        </div>
        <Badge variant="outline" className="border-red-500/30 bg-red-500/10 text-red-400 font-bold px-3 py-1 text-xs">
          Total Requests: {total}
        </Badge>
      </div>

      {/* Table Card */}
      <Card className="bg-slate-950/80 border-slate-800 shadow-xl overflow-hidden">
        <CardHeader className="p-4 sm:p-6 border-b border-slate-800">
          <h2 className="text-sm font-bold text-white">Emergency Blood Requests</h2>
        </CardHeader>
        <CardContent className="p-0">
          {requests.length === 0 ? (
            <div className="p-12 text-center text-slate-500 space-y-2">
              <AlertCircle className="w-8 h-8 mx-auto text-slate-600" />
              <p className="text-sm">No emergency blood requests found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider font-semibold text-[10px] border-b border-slate-800">
                  <tr>
                    <th className="px-6 py-3.5">Patient Details</th>
                    <th className="px-6 py-3.5">Blood Needed</th>
                    <th className="px-6 py-3.5">Hospital</th>
                    <th className="px-6 py-3.5">Urgency</th>
                    <th className="px-6 py-3.5">Status</th>
                    <th className="px-6 py-3.5">Contact / Seeker</th>
                    <th className="px-6 py-3.5">Needed By</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {requests.map((req) => (
                    <tr key={req.id} className="hover:bg-slate-900/50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-bold text-white text-sm">{req.patientName}</p>
                        <p className="text-[11px] text-slate-500 font-mono">ID: {req.id.slice(0, 8)}...</p>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-black bg-primary/10 border border-primary/30 text-primary">
                            {formatBloodType(req.bloodType)}
                          </span>
                          <span className="text-slate-400 font-semibold">{req.unitsRequired} {req.unitsRequired === 1 ? 'Unit' : 'Units'}</span>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-slate-300">
                          <Hospital className="w-3.5 h-3.5 text-slate-500" />
                          <span>{req.hospitalName}</span>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        {getUrgencyBadge(req.urgency)}
                      </td>

                      <td className="px-6 py-4">
                        {getStatusBadge(req.status)}
                      </td>

                      <td className="px-6 py-4 space-y-1">
                        <div className="flex items-center gap-1.5 text-slate-300">
                          <Phone className="w-3.5 h-3.5 text-slate-500" />
                          <span>{req.contactPhone}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                          <UserCheck className="w-3.5 h-3.5 text-slate-500" />
                          <span>{req.seekerName}</span>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-slate-400 font-mono text-[11px]">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-500" />
                          <span>
                            {new Date(req.neededBy).toLocaleDateString(undefined, {
                              month: 'short',
                              day: 'numeric',
                            })}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
