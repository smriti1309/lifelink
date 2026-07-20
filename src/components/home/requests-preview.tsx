import Link from 'next/link';
import { Hospital, MapPin, Calendar, Activity, ArrowRight, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/lib/constants/routes';
import { BLOOD_TYPE_LABELS, BloodType } from '@/lib/constants/bloodTypes';
import { REQUEST_URGENCY_LABELS, RequestUrgency } from '@/lib/constants/status';
import { formatDate } from '@/utils/format';

interface MockRequest {
  id: string;
  bloodType: BloodType;
  needsBloodUnits: boolean;
  unitsRequired: number;
  needsReplacementDonors: boolean;
  replacementDonorCount: number | null;
  hospitalName: string;
  district: string;
  state: string;
  urgency: RequestUrgency;
  neededBy: Date;
}

// Development demo data clearly marked
const MOCK_HOMEPAGE_REQUESTS: MockRequest[] = [
  {
    id: 'demo-req-1',
    bloodType: 'O_MINUS',
    needsBloodUnits: true,
    unitsRequired: 2,
    needsReplacementDonors: true,
    replacementDonorCount: 2,
    hospitalName: 'District General Medical Center',
    district: 'Sangamon',
    state: 'IL',
    urgency: 'IMMEDIATE',
    neededBy: new Date(Date.now() + 1000 * 60 * 60 * 12), // 12 hours from now
  },
  {
    id: 'demo-req-2',
    bloodType: 'A_PLUS',
    needsBloodUnits: true,
    unitsRequired: 3,
    needsReplacementDonors: false,
    replacementDonorCount: null,
    hospitalName: 'St. Jude Heart Institute',
    district: 'Massac',
    state: 'NY',
    urgency: 'URGENT',
    neededBy: new Date(Date.now() + 1000 * 60 * 60 * 36), // 36 hours from now
  },
  {
    id: 'demo-req-3',
    bloodType: 'B_MINUS',
    needsBloodUnits: false,
    unitsRequired: 0,
    needsReplacementDonors: true,
    replacementDonorCount: 4,
    hospitalName: 'County Children Hospital',
    district: 'Napa',
    state: 'CA',
    urgency: 'NORMAL',
    neededBy: new Date(Date.now() + 1000 * 60 * 60 * 72), // 3 days from now
  },
];

export function RequestsPreview() {
  return (
    <section className="bg-muted/30 border-y border-border/30 py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-12">
          <div className="flex flex-col gap-2">
            <h2 className="text-3xl font-extrabold text-foreground tracking-tight">
              Active Emergency Requests
            </h2>
            <p className="text-sm text-muted-foreground max-w-xl">
              Urgent blood requirements and replacement coordination alerts currently active in our network.
            </p>
          </div>
          <Link href={ROUTES.PUBLIC.REQUESTS} className="shrink-0">
            <Button variant="outline" size="sm" className="bg-white gap-2 font-semibold">
              <span>View All Requests</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        {/* Development Data Alert */}
        <div className="mb-8 p-3 rounded-lg bg-warning-light border border-warning/20 text-warning text-xs flex items-center gap-2 max-w-xl">
          <Info className="w-4 h-4 shrink-0" />
          <span>Showing sample development/demo data. Direct integration will be implemented in subsequent phases.</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {MOCK_HOMEPAGE_REQUESTS.map((request) => {
            const urgencyVariant = 
              request.urgency === 'IMMEDIATE' ? 'destructive' :
              request.urgency === 'URGENT' ? 'warning' : 'primary';

            return (
              <Card key={request.id} hoverable={true} className="flex flex-col justify-between border-border/60">
                <div>
                  {/* Card Header Info */}
                  <CardHeader className="p-6 pb-4 flex flex-row items-start justify-between gap-4 border-b border-border/30 bg-muted/10">
                    <div className="flex flex-col gap-1.5">
                      <Badge variant={urgencyVariant} className="w-fit text-[10px] py-0 px-2 tracking-wider uppercase">
                        {REQUEST_URGENCY_LABELS[request.urgency]}
                      </Badge>
                      <div className="flex items-center text-xs text-muted-foreground gap-1 mt-1">
                        <MapPin className="w-3.5 h-3.5 shrink-0" />
                        <span>{request.district}, {request.state}</span>
                      </div>
                    </div>

                    {/* Blood Type Display */}
                    <div className="flex flex-col items-center justify-center w-12 h-12 rounded-xl bg-primary-light border border-primary/20 text-primary shrink-0">
                      <span className="text-base font-black tracking-tighter">
                        {BLOOD_TYPE_LABELS[request.bloodType]}
                      </span>
                    </div>
                  </CardHeader>

                  {/* Card Content Info */}
                  <CardContent className="p-6 flex flex-col gap-4 text-xs text-slate-700">
                    <div className="flex items-start gap-2.5">
                      <Hospital className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                      <div className="flex flex-col gap-0.5">
                        <span className="font-semibold text-foreground">Location</span>
                        <span className="text-muted-foreground line-clamp-1">{request.hospitalName}</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <Calendar className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                      <div className="flex flex-col gap-0.5">
                        <span className="font-semibold text-foreground">Needed By</span>
                        <span className="text-muted-foreground">{formatDate(request.neededBy)} ({request.neededBy.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})})</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <Activity className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                      <div className="flex flex-col gap-1 w-full">
                        <span className="font-semibold text-foreground">Request Details</span>
                        <div className="flex flex-wrap gap-1.5 mt-0.5">
                          {request.needsBloodUnits && (
                            <Badge variant="outline" className="text-[10px] bg-white border-border text-foreground px-2 py-0">
                              {request.unitsRequired} Units Required
                            </Badge>
                          )}
                          {request.needsReplacementDonors && (
                            <Badge variant="outline" className="text-[10px] bg-white border-success/20 text-success px-2 py-0">
                              {request.replacementDonorCount} Replacement Donors Needed
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </div>

                <CardFooter className="p-6 pt-0 mt-auto">
                  <Link href={`${ROUTES.AUTH.DASHBOARD}`} className="w-full">
                    <Button variant="outline" size="sm" className="w-full bg-white hover:bg-muted font-bold">
                      View Details
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
