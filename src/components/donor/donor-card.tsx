'use client';
 
import * as React from 'react';
import { MapPin, Phone, Activity, Mail, CheckSquare, Square } from 'lucide-react';
import { BloodType, DonorStatus, ContactPreference, DonorRequestStatus } from '@prisma/client';
import { BLOOD_TYPE_LABELS } from '@/lib/constants/bloodTypes';
import { cn } from '@/lib/utils';
 
interface DonorCardProps {
  fullName: string;
  bloodType: BloodType;
  state: string;
  district: string;
  status: DonorStatus;
  preferredContact: ContactPreference;
  showPhone?: boolean;
  phone?: string | null;
  isSelected?: boolean;
  onSelectChange?: (selected: boolean) => void;
  requestStatus?: DonorRequestStatus;
}
 
export function DonorCard({
  fullName,
  bloodType,
  state,
  district,
  status,
  preferredContact,
  showPhone = false,
  phone = null,
  isSelected = false,
  onSelectChange,
  requestStatus,
}: DonorCardProps) {
  const bloodLabel = BLOOD_TYPE_LABELS[bloodType as keyof typeof BLOOD_TYPE_LABELS] || bloodType;
 
  const isAvailable = status === 'AVAILABLE';
 
  const handleCardClick = () => {
    if (onSelectChange && !requestStatus) {
      onSelectChange(!isSelected);
    }
  };
 
  return (
    <div
      onClick={onSelectChange && !requestStatus ? handleCardClick : undefined}
      className={cn(
        "relative p-5 rounded-xl border border-border/40 bg-card text-card-foreground shadow-premium hover:shadow-premium-md transition-all-300 flex flex-col justify-between gap-4",
        {
          "border-primary ring-2 ring-primary/10 bg-primary-light/5": isSelected && !requestStatus,
          "cursor-pointer hover:border-border/80": onSelectChange !== undefined && !requestStatus,
        }
      )}
    >
      {/* Select Checkbox Indicator */}
      {onSelectChange !== undefined && !requestStatus && (
        <div className="absolute top-4 right-4 text-primary">
          {isSelected ? (
            <CheckSquare className="w-5 h-5 fill-primary text-white" />
          ) : (
            <Square className="w-5 h-5 text-muted-foreground" />
          )}
        </div>
      )}
 
      {/* Donor Card Header */}
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center font-extrabold text-primary text-lg shrink-0">
          {bloodLabel}
        </div>
        <div className="flex-1 min-w-0 pr-6">
          <h3 className="font-bold text-base text-foreground truncate">{fullName}</h3>
          <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{district}, {state}</span>
          </div>
        </div>
      </div>
 
      {/* Badges / Contact Info */}
      <div className="flex flex-col gap-2.5 pt-3 border-t border-border/20 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground font-medium">Availability</span>
          <span
            className={cn(
              "px-2.5 py-0.5 rounded-full font-semibold border text-[10px] tracking-wide uppercase",
              isAvailable 
                ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                : "bg-amber-50 text-amber-700 border-amber-200"
            )}
          >
            {isAvailable ? 'Available' : 'Unavailable'}
          </span>
        </div>
 
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground font-medium">Contact Preference</span>
          <span className="font-semibold text-foreground flex items-center gap-1">
            {preferredContact === ContactPreference.PHONE && <Phone className="w-3 h-3 text-muted-foreground" />}
            {preferredContact === ContactPreference.EMAIL && <Mail className="w-3 h-3 text-muted-foreground" />}
            {preferredContact === ContactPreference.BOTH && <Activity className="w-3 h-3 text-muted-foreground" />}
            {preferredContact === ContactPreference.PHONE && 'Phone Call'}
            {preferredContact === ContactPreference.EMAIL && 'Email Address'}
            {preferredContact === ContactPreference.BOTH && 'Phone or Email'}
          </span>
        </div>
 
        {/* Conditional Request Status Badge */}
        {requestStatus && (
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground font-medium">Request Status</span>
            <span
              className={cn(
                "px-2.5 py-0.5 rounded-full font-semibold border text-[10px] tracking-wide uppercase",
                requestStatus === 'ACCEPTED' && "bg-emerald-50 text-emerald-700 border-emerald-200",
                requestStatus === 'PENDING' && "bg-amber-50 text-amber-700 border-amber-200",
                requestStatus === 'DECLINED' && "bg-rose-50 text-rose-700 border-rose-200",
                requestStatus === 'FULFILLED' && "bg-blue-50 text-blue-700 border-blue-200",
                requestStatus === 'EXPIRED' && "bg-gray-50 text-gray-700 border-gray-200"
              )}
            >
              {requestStatus === 'PENDING' ? 'Pending Request' : requestStatus}
            </span>
          </div>
        )}
 
        {/* Conditional Phone Disclosure after request accept */}
        {showPhone && phone && (
          <div className="mt-2 p-2.5 bg-emerald-50/60 border border-emerald-100 rounded-lg flex items-center gap-2 text-emerald-950 font-bold animate-fade-in text-sm justify-center">
            <Phone className="w-4 h-4 text-emerald-600" />
            <a href={`tel:${phone}`} className="hover:underline">{phone}</a>
          </div>
        )}
      </div>
    </div>
  );
}
