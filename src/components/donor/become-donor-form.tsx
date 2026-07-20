'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { 
  User, 
  Phone, 
  MapPin, 
  Activity, 
  Calendar, 
  ShieldAlert, 
  Clock,
  ExternalLink
} from 'lucide-react';
import Link from 'next/link';

import { BecomeDonorSchema, type BecomeDonorInput } from '@/lib/validators/donor';
import { saveDonorProfile } from '@/app/actions/donor';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { BLOOD_TYPE_LABELS, BloodType } from '@/lib/constants/bloodTypes';
import { Gender, ContactPreference, Relationship } from '@prisma/client';

interface BecomeDonorFormProps {
  profile: {
    fullName: string;
    phone: string | null;
    state: string;
    district: string;
  };
  initialData: {
    bloodType: BloodType;
    dateOfBirth: Date;
    gender: Gender;
    weight: number;
    preferredContact: ContactPreference;
    isHealthy: boolean;
    hasMedicationRestriction: boolean;
    hadRecentSurgery: boolean;
    donatedWithinLast3Months: boolean;
    isAvailable: 'yes' | 'no';
    lastDonatedAt: Date | null;
    emergencyContactName: string | null;
    emergencyContactPhone: string | null;
    emergencyContactRelation: Relationship | null;
  } | null;
}

export function BecomeDonorForm({ profile, initialData }: BecomeDonorFormProps) {
  const router = useRouter();
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const hasDonorProfile = !!initialData;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<BecomeDonorInput>({
    resolver: zodResolver(BecomeDonorSchema) as any,
    defaultValues: {
      bloodType: initialData?.bloodType || undefined,
      dateOfBirth: initialData?.dateOfBirth 
        ? new Date(initialData.dateOfBirth).toISOString().split('T')[0] as unknown as Date 
        : undefined,
      gender: initialData?.gender || undefined,
      weight: initialData?.weight || undefined,
      hasDonatedBefore: initialData?.lastDonatedAt ? 'yes' : 'no',
      lastDonatedAt: initialData?.lastDonatedAt 
        ? new Date(initialData.lastDonatedAt).toISOString().split('T')[0] as unknown as Date 
        : undefined,
      isAvailable: initialData?.isAvailable || 'yes',
      preferredContact: initialData?.preferredContact || 'PHONE',
      isHealthy: initialData ? initialData.isHealthy : true,
      hasMedicationRestriction: initialData ? initialData.hasMedicationRestriction : false,
      hadRecentSurgery: initialData ? initialData.hadRecentSurgery : false,
      donatedWithinLast3Months: initialData ? initialData.donatedWithinLast3Months : false,
      emergencyContactName: initialData?.emergencyContactName || '',
      emergencyContactPhone: initialData?.emergencyContactPhone || '',
      emergencyContactRelation: initialData?.emergencyContactRelation || '',
      consentChecked: false,
    },
  });

  const watchHasDonated = watch('hasDonatedBefore');
  const watchIsHealthy = watch('isHealthy');
  const watchHasMedication = watch('hasMedicationRestriction');
  const watchHadSurgery = watch('hadRecentSurgery');
  const watchDonatedRecently = watch('donatedWithinLast3Months');

  // Real-time calculation of current eligibility based on medical fields
  const isCurrentlyEligible = 
    watchIsHealthy === true &&
    watchHasMedication === false &&
    watchHadSurgery === false &&
    watchDonatedRecently === false;

  const onSubmit = async (data: BecomeDonorInput) => {
    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const response = await saveDonorProfile(data);
      if (response.success) {
        // Redirect to dashboard with success query parameter
        const successParam = response.isEligible ? 'donor_registered' : 'donor_registered_ineligible';
        router.push(`/dashboard?success=${successParam}`);
        router.refresh();
      } else {
        setErrorMsg(response.error || 'Failed to save donor details.');
      }
    } catch (err) {
      console.error('Submit error:', err);
      setErrorMsg('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-2xl mx-auto pb-12">
      {errorMsg && (
        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-start gap-2.5 text-sm text-destructive font-medium animate-fade-in">
          <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* SECTION 1: Profile Information (Read-only) */}
      <Card className="shadow-premium border-border/40">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle className="text-lg font-bold">1. Profile Information</CardTitle>
            <CardDescription>Verified contact & location details from your account</CardDescription>
          </div>
          <Link href="/profile" className="text-xs font-semibold text-primary hover:underline flex items-center gap-1">
            <span>Edit Profile</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm mt-2">
          <div className="flex flex-col gap-1 p-3 bg-muted/40 rounded-lg border border-border/30">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Full Name</span>
            <span className="font-medium text-foreground flex items-center gap-1.5">
              <User className="w-4 h-4 text-muted-foreground" />
              {profile.fullName}
            </span>
          </div>
          <div className="flex flex-col gap-1 p-3 bg-muted/40 rounded-lg border border-border/30">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Phone Number</span>
            <span className="font-medium text-foreground flex items-center gap-1.5">
              <Phone className="w-4 h-4 text-muted-foreground" />
              {profile.phone || 'Not provided'}
            </span>
          </div>
          <div className="flex flex-col gap-1 p-3 bg-muted/40 rounded-lg border border-border/30">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">State</span>
            <span className="font-medium text-foreground flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              {profile.state}
            </span>
          </div>
          <div className="flex flex-col gap-1 p-3 bg-muted/40 rounded-lg border border-border/30">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">District</span>
            <span className="font-medium text-foreground flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              {profile.district}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* SECTION 2: Blood & Personal Information */}
      <Card className="shadow-premium border-border/40">
        <CardHeader>
          <CardTitle className="text-lg font-bold">2. Blood & Personal Details</CardTitle>
          <CardDescription>Provide your vital details required for donor matching</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              id="bloodType"
              label="Blood Type"
              error={errors.bloodType?.message}
              disabled={isSubmitting}
              options={Object.keys(BLOOD_TYPE_LABELS).map(bt => ({
                label: BLOOD_TYPE_LABELS[bt as BloodType],
                value: bt
              }))}
              placeholder="Select Blood Type"
              {...register('bloodType')}
            />

            <Input
              id="dateOfBirth"
              label="Date of Birth"
              type="date"
              error={errors.dateOfBirth?.message}
              disabled={isSubmitting}
              icon={<Calendar className="w-4 h-4" />}
              {...register('dateOfBirth')}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              id="gender"
              label="Gender"
              error={errors.gender?.message}
              disabled={isSubmitting}
              options={[
                { label: 'Male', value: Gender.MALE },
                { label: 'Female', value: Gender.FEMALE },
                { label: 'Other', value: Gender.OTHER },
                { label: 'Prefer not to say', value: Gender.PREFER_NOT_TO_SAY },
              ]}
              placeholder="Select Gender"
              {...register('gender')}
            />

            <Input
              id="weight"
              label="Weight (kg)"
              type="number"
              step="0.1"
              placeholder="e.g. 65"
              error={errors.weight?.message}
              disabled={isSubmitting}
              icon={<Activity className="w-4 h-4" />}
              {...register('weight')}
            />
          </div>
        </CardContent>
      </Card>

      {/* SECTION 3: Donation History */}
      <Card className="shadow-premium border-border/40">
        <CardHeader>
          <CardTitle className="text-lg font-bold">3. Donation History</CardTitle>
          <CardDescription>Tell us about your previous blood donations</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Have you donated blood before?
            </span>
            <div className="flex gap-6 mt-1">
              <label className="flex items-center gap-2 cursor-pointer text-sm">
                <input
                  type="radio"
                  value="yes"
                  disabled={isSubmitting}
                  className="w-4 h-4 text-primary focus:ring-primary focus:ring-2"
                  {...register('hasDonatedBefore')}
                />
                <span>Yes</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-sm">
                <input
                  type="radio"
                  value="no"
                  disabled={isSubmitting}
                  className="w-4 h-4 text-primary focus:ring-primary focus:ring-2"
                  {...register('hasDonatedBefore')}
                />
                <span>No</span>
              </label>
            </div>
            {errors.hasDonatedBefore?.message && (
              <p className="text-xs text-destructive font-medium mt-1">
                {errors.hasDonatedBefore.message}
              </p>
            )}
          </div>

          {watchHasDonated === 'yes' && (
            <div className="pt-2 animate-fade-in">
              <Input
                id="lastDonatedAt"
                label="Last Blood Donation Date"
                type="date"
                error={errors.lastDonatedAt?.message}
                disabled={isSubmitting}
                icon={<Clock className="w-4 h-4" />}
                {...register('lastDonatedAt')}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* SECTION 4: Medical Eligibility */}
      <Card className="shadow-premium border-border/40">
        <CardHeader>
          <CardTitle className="text-lg font-bold">4. Medical Eligibility</CardTitle>
          <CardDescription>Please answer accurately to verify your medical status</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Question 1 */}
          <div className="flex items-start justify-between gap-4 py-2 border-b border-border/20">
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-semibold text-foreground">Are you currently feeling healthy and fit?</span>
              <span className="text-xs text-muted-foreground">General check for immediate donation fitness</span>
            </div>
            <div className="flex gap-4 shrink-0">
              <label className="flex items-center gap-1.5 cursor-pointer text-sm">
                <input
                  type="radio"
                  checked={watchIsHealthy === true}
                  onChange={() => setValue('isHealthy', true)}
                  disabled={isSubmitting}
                  className="w-4 h-4"
                />
                <span>Yes</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer text-sm">
                <input
                  type="radio"
                  checked={watchIsHealthy === false}
                  onChange={() => setValue('isHealthy', false)}
                  disabled={isSubmitting}
                  className="w-4 h-4"
                />
                <span>No</span>
              </label>
            </div>
          </div>

          {/* Question 2 */}
          <div className="flex items-start justify-between gap-4 py-2 border-b border-border/20">
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-semibold text-foreground">Are you taking medications that prevent blood donation?</span>
              <span className="text-xs text-muted-foreground">Antibiotics, blood thinners, or deferred prescriptions</span>
            </div>
            <div className="flex gap-4 shrink-0">
              <label className="flex items-center gap-1.5 cursor-pointer text-sm">
                <input
                  type="radio"
                  checked={watchHasMedication === true}
                  onChange={() => setValue('hasMedicationRestriction', true)}
                  disabled={isSubmitting}
                  className="w-4 h-4"
                />
                <span>Yes</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer text-sm">
                <input
                  type="radio"
                  checked={watchHasMedication === false}
                  onChange={() => setValue('hasMedicationRestriction', false)}
                  disabled={isSubmitting}
                  className="w-4 h-4"
                />
                <span>No</span>
              </label>
            </div>
          </div>

          {/* Question 3 */}
          <div className="flex items-start justify-between gap-4 py-2 border-b border-border/20">
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-semibold text-foreground">Have you undergone major surgery within the last 6 months?</span>
              <span className="text-xs text-muted-foreground">Post-operative recovery period is required</span>
            </div>
            <div className="flex gap-4 shrink-0">
              <label className="flex items-center gap-1.5 cursor-pointer text-sm">
                <input
                  type="radio"
                  checked={watchHadSurgery === true}
                  onChange={() => setValue('hadRecentSurgery', true)}
                  disabled={isSubmitting}
                  className="w-4 h-4"
                />
                <span>Yes</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer text-sm">
                <input
                  type="radio"
                  checked={watchHadSurgery === false}
                  onChange={() => setValue('hadRecentSurgery', false)}
                  disabled={isSubmitting}
                  className="w-4 h-4"
                />
                <span>No</span>
              </label>
            </div>
          </div>

          {/* Question 4 */}
          <div className="flex items-start justify-between gap-4 py-2">
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-semibold text-foreground">Have you donated blood within the last 3 months?</span>
              <span className="text-xs text-muted-foreground">Standard 90-day recovery interval is required</span>
            </div>
            <div className="flex gap-4 shrink-0">
              <label className="flex items-center gap-1.5 cursor-pointer text-sm">
                <input
                  type="radio"
                  checked={watchDonatedRecently === true}
                  onChange={() => setValue('donatedWithinLast3Months', true)}
                  disabled={isSubmitting}
                  className="w-4 h-4"
                />
                <span>Yes</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer text-sm">
                <input
                  type="radio"
                  checked={watchDonatedRecently === false}
                  onChange={() => setValue('donatedWithinLast3Months', false)}
                  disabled={isSubmitting}
                  className="w-4 h-4"
                />
                <span>No</span>
              </label>
            </div>
          </div>

          {/* Real-time Ineligibility warning alert */}
          {!isCurrentlyEligible && (
            <div className="p-3.5 bg-amber-50 border border-amber-200/60 rounded-lg flex items-start gap-2.5 text-xs text-amber-850 font-medium animate-fade-in mt-3">
              <ShieldAlert className="w-4.5 h-4.5 shrink-0 mt-0.5 text-amber-600" />
              <div>
                <strong className="block text-amber-900 mb-0.5">Temporary Ineligibility Notice</strong>
                Based on your answers, you are currently temporarily ineligible to donate. 
                You can still submit and register your profile now, but you will be marked as <strong>inactive</strong> in the active donor search pool until you meet all eligibility criteria.
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* SECTION 5: Availability & Contact Preference */}
      <Card className="shadow-premium border-border/40">
        <CardHeader>
          <CardTitle className="text-lg font-bold">5. Availability & Contact Preferences</CardTitle>
          <CardDescription>Control how and when coordinators can reach you</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-2 border-b border-border/20 pb-4">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Are you available to donate blood now?
            </span>
            <span className="text-xs text-muted-foreground mb-1">
              Toggle this off if you need to pause requests temporarily
            </span>
            <div className="flex gap-6 mt-1">
              <label className="flex items-center gap-2 cursor-pointer text-sm">
                <input
                  type="radio"
                  value="yes"
                  disabled={isSubmitting}
                  className="w-4 h-4"
                  {...register('isAvailable')}
                />
                <span>Yes (Available now)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-sm">
                <input
                  type="radio"
                  value="no"
                  disabled={isSubmitting}
                  className="w-4 h-4"
                  {...register('isAvailable')}
                />
                <span>No (Unavailable)</span>
              </label>
            </div>
            {errors.isAvailable?.message && (
              <p className="text-xs text-destructive font-medium mt-1">
                {errors.isAvailable.message}
              </p>
            )}
          </div>

          <Select
            id="preferredContact"
            label="Preferred Contact Method"
            error={errors.preferredContact?.message}
            disabled={isSubmitting}
            options={[
              { label: 'Phone Call', value: ContactPreference.PHONE },
              { label: 'Email', value: ContactPreference.EMAIL },
              { label: 'Both (Phone & Email)', value: ContactPreference.BOTH },
            ]}
            placeholder="Select contact preference"
            {...register('preferredContact')}
          />
        </CardContent>
      </Card>

      {/* SECTION 6: Emergency Contact */}
      <Card className="shadow-premium border-border/40">
        <CardHeader>
          <CardTitle className="text-lg font-bold">6. Emergency Contact (Optional)</CardTitle>
          <CardDescription>Provide a contact person we can reach during emergencies</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            id="emergencyContactName"
            label="Emergency Contact Name"
            placeholder="e.g. Jane Doe"
            error={errors.emergencyContactName?.message}
            disabled={isSubmitting}
            icon={<User className="w-4 h-4" />}
            {...register('emergencyContactName')}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              id="emergencyContactPhone"
              label="Contact Phone Number"
              placeholder="e.g. 9876543210"
              error={errors.emergencyContactPhone?.message}
              disabled={isSubmitting}
              icon={<Phone className="w-4 h-4" />}
              {...register('emergencyContactPhone')}
            />

            <Select
              id="emergencyContactRelation"
              label="Relationship"
              error={errors.emergencyContactRelation?.message}
              disabled={isSubmitting}
              options={[
                { label: 'Mother', value: Relationship.MOTHER },
                { label: 'Father', value: Relationship.FATHER },
                { label: 'Brother', value: Relationship.BROTHER },
                { label: 'Sister', value: Relationship.SISTER },
                { label: 'Spouse', value: Relationship.SPOUSE },
                { label: 'Friend', value: Relationship.FRIEND },
                { label: 'Other', value: Relationship.OTHER },
              ]}
              placeholder="Select Relationship"
              {...register('emergencyContactRelation')}
            />
          </div>
        </CardContent>
      </Card>

      {/* SECTION 7: Declaration & Consent */}
      <Card className="shadow-premium border-border/40">
        <CardHeader>
          <CardTitle className="text-lg font-bold">7. Declaration</CardTitle>
          <CardDescription>Please review and confirm to complete donor registration</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <label className="flex items-start gap-3 cursor-pointer text-sm font-medium text-foreground select-none">
            <input
              type="checkbox"
              disabled={isSubmitting}
              className="w-4 h-4 mt-0.5 rounded border-border text-primary focus:ring-primary/20"
              {...register('consentChecked')}
            />
            <span>
              I hereby declare that all the information provided above is true and accurate. I consent to having my donor profile added to the registry and understand that I may be contacted directly in the event of local medical blood emergencies.
            </span>
          </label>
          {errors.consentChecked?.message && (
            <p className="text-xs text-destructive font-medium">
              {errors.consentChecked.message}
            </p>
          )}

          <Button
            type="submit"
            className="w-full mt-4"
            isLoading={isSubmitting}
          >
            {isSubmitting 
              ? 'Saving Donor Profile...' 
              : hasDonorProfile 
                ? 'Update Donor Registration' 
                : 'Complete Donor Registration'}
          </Button>
        </CardContent>
      </Card>
    </form>
  );
}
