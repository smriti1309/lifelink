import * as React from 'react';
import { Users, Mail, Phone, MapPin, ShieldCheck, UserCheck } from 'lucide-react';
import { getAdminUsersAction } from '@/app/actions/admin';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const metadata = {
  title: 'Users Management | LifeLink Admin',
  description: 'Manage registered platform user accounts.',
};

export default async function AdminUsersPage() {
  const { users, total } = await getAdminUsersAction();

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-primary" /> Users Management
          </h1>
          <p className="text-xs text-slate-400">
            Overview of all registered platform user accounts and profiles.
          </p>
        </div>
        <Badge variant="outline" className="self-start sm:self-auto border-blue-500/30 bg-blue-500/10 text-blue-400 font-bold px-3 py-1 text-xs">
          Total Users: {total}
        </Badge>
      </div>

      {/* Users Table */}
      <Card className="bg-slate-950/80 border-slate-800 shadow-xl overflow-hidden">
        <CardHeader className="p-4 sm:p-6 border-b border-slate-800 flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-slate-400" />
            <h2 className="text-sm font-bold text-white">Registered Profiles Directory</h2>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {users.length === 0 ? (
            <div className="p-12 text-center text-slate-500 space-y-2">
              <Users className="w-8 h-8 mx-auto text-slate-600" />
              <p className="text-sm">No registered user profiles found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider font-semibold text-[10px] border-b border-slate-800">
                  <tr>
                    <th className="px-6 py-3.5">User</th>
                    <th className="px-6 py-3.5">Contact Details</th>
                    <th className="px-6 py-3.5">Location</th>
                    <th className="px-6 py-3.5">Role</th>
                    <th className="px-6 py-3.5">Registered On</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-900/50 transition-colors">
                      <td className="px-6 py-4 font-bold text-white">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-black text-primary">
                            {user.fullName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-white text-sm">{user.fullName}</p>
                            <p className="text-[11px] text-slate-500 font-mono">ID: {user.id.slice(0, 8)}...</p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 space-y-1">
                        <div className="flex items-center gap-1.5 text-slate-300">
                          <Mail className="w-3.5 h-3.5 text-slate-500" />
                          <span>{user.email}</span>
                        </div>
                        {user.phone && (
                          <div className="flex items-center gap-1.5 text-slate-400">
                            <Phone className="w-3.5 h-3.5 text-slate-500" />
                            <span>{user.phone}</span>
                          </div>
                        )}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-slate-300">
                          <MapPin className="w-3.5 h-3.5 text-slate-500" />
                          <span>{user.district}, {user.state}</span>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <Badge
                          variant="outline"
                          className={
                            user.role === 'ADMIN'
                              ? 'border-red-500/30 bg-red-500/10 text-red-400 font-bold'
                              : 'border-slate-700 bg-slate-900 text-slate-300 font-medium'
                          }
                        >
                          {user.role}
                        </Badge>
                      </td>

                      <td className="px-6 py-4 text-slate-400 font-mono text-[11px]">
                        {new Date(user.createdAt).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
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
