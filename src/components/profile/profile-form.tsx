'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { User, Phone, MapPin, AlertCircle, CheckCircle2 } from 'lucide-react';

import { ProfileSchema, type ProfileInput } from '@/lib/validators/profile';
import { saveProfile } from '@/app/actions/profile';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Select } from '@/components/ui/select';
import { Combobox } from '@/components/ui/combobox';
import { STATES, getDistrictsForState } from '@/lib/constants/locations';

interface ProfileFormProps {
  initialData: {
    fullName: string;
    phone: string | null;
    district: string;
    state: string;
  } | null;
}

export function ProfileForm({ initialData }: ProfileFormProps) {
  const router = useRouter();
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [successMsg, setSuccessMsg] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const hasProfile = !!initialData;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProfileInput>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      fullName: initialData?.fullName || '',
      phone: initialData?.phone || '',
      district: initialData?.district || '',
      state: initialData?.state || '',
    },
  });

  const selectedState = watch('state');
  const selectedDistrict = watch('district');

  const onSubmit = async (data: ProfileInput) => {
    setIsSubmitting(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const response = await saveProfile(data);
      if (response.success) {
        setSuccessMsg(hasProfile ? 'Profile updated successfully!' : 'Profile created successfully!');
        
        // Wait briefly for user feedback before redirecting
        setTimeout(() => {
          router.push('/dashboard');
          router.refresh();
        }, 800);
      } else {
        setErrorMsg(response.error || 'Failed to save profile details.');
      }
    } catch (err) {
      console.error('Submit error:', err);
      setErrorMsg('An unexpected connection error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-lg mx-auto shadow-premium border-border/40">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">
          {hasProfile ? 'Edit Profile' : 'Complete Your Profile'}
        </CardTitle>
        <CardDescription>
          {hasProfile 
            ? 'Update your emergency coordination profile details below' 
            : 'Provide your personal details to complete your LifeLink account registration'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {errorMsg && (
            <div className="p-3.5 bg-destructive/10 border border-destructive/20 rounded-lg flex items-start gap-2.5 text-xs text-destructive font-medium animate-fade-in">
              <AlertCircle className="w-4.5 h-4.5 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-lg flex items-start gap-2.5 text-xs text-emerald-800 font-medium animate-fade-in">
              <CheckCircle2 className="w-4.5 h-4.5 shrink-0 mt-0.5 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          <Input
            id="fullName"
            label="Full Name"
            placeholder="John Doe"
            error={errors.fullName?.message}
            icon={<User className="w-4 h-4" />}
            disabled={isSubmitting}
            {...register('fullName')}
          />

          <Input
            id="phone"
            label="Phone Number"
            placeholder="e.g. 9876543210"
            error={errors.phone?.message}
            icon={<Phone className="w-4 h-4" />}
            disabled={isSubmitting}
            {...register('phone')}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              id="state"
              label="State"
              error={errors.state?.message}
              disabled={isSubmitting}
              options={STATES.map(s => ({ label: s, value: s }))}
              placeholder="Select State"
              {...register('state', {
                onChange: () => {
                  setValue('district', '', { shouldValidate: true, shouldDirty: true });
                }
              })}
            />

            <Combobox
              id="district"
              label="District"
              placeholder="Select District"
              error={errors.district?.message}
              icon={<MapPin className="w-4 h-4" />}
              disabled={isSubmitting || !selectedState}
              options={selectedState ? getDistrictsForState(selectedState) : []}
              value={selectedDistrict}
              onChange={(val) => {
                setValue('district', val, { shouldValidate: true, shouldDirty: true });
              }}
              emptyMessage={selectedState ? "No districts found." : "Please select a state first."}
            />
          </div>

          <Button
            type="submit"
            className="w-full mt-4"
            isLoading={isSubmitting}
          >
            {isSubmitting ? 'Saving Profile...' : 'Save Profile'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
