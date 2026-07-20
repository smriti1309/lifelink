'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { 
  User, 
  Phone, 
  MapPin, 
  Calendar, 
  ShieldAlert, 
  Activity, 
  Clock, 
  Building2, 
  FileText 
} from 'lucide-react';

import { STATES, getDistrictsForState } from '@/lib/constants/locations';
import { BLOOD_TYPE_LABELS, BloodType } from '@/lib/constants/bloodTypes';
import { Gender, RequestUrgency, ReplacementRequirement } from '@prisma/client';
import { EmergencyRequestSchema, type EmergencyRequestInput } from '@/lib/validators/request';
import { fetchHospitals, createBloodRequest } from '@/app/actions/request';

import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

interface EmergencyRequestFormProps {
  seekerProfile: {
    fullName: string;
    phone: string | null;
  };
}

export function EmergencyRequestForm({ seekerProfile }: EmergencyRequestFormProps) {
  const router = useRouter();
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Dynamic hospital list state
  const [hospitals, setHospitals] = React.useState<{ id: string; name: string; address: string }[]>([]);
  const [isLoadingHospitals, setIsLoadingHospitals] = React.useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<EmergencyRequestInput>({
    resolver: zodResolver(EmergencyRequestSchema) as any,
    defaultValues: {
      patientName: '',
      patientAge: undefined,
      patientGender: undefined,
      bloodType: undefined,
      needsBloodUnits: true,
      unitsRequired: 1,
      needsReplacementDonors: false,
      replacementDonorCount: undefined,
      replacementRequirement: undefined,
      hospitalSelectType: 'registered',
      state: '',
      district: '',
      hospitalId: '',
      hospitalName: '',
      manualHospitalAddress: '',
      urgency: RequestUrgency.NORMAL,
      contactName: seekerProfile.fullName || '',
      contactPhone: seekerProfile.phone || '',
      notes: '',
      neededBy: undefined,
      declarationChecked: false,
    },
  });

  const selectedState = watch('state');
  const selectedDistrict = watch('district');
  const watchHospitalSelectType = watch('hospitalSelectType');
  const watchNeedsReplacementDonors = watch('needsReplacementDonors');

  // Reset district and hospitals list when State changes
  React.useEffect(() => {
    setValue('district', '');
    setValue('hospitalId', '');
    setHospitals([]);
  }, [selectedState, setValue]);

  // Fetch registered hospitals when state and district are selected
  React.useEffect(() => {
    if (selectedState && selectedDistrict) {
      setIsLoadingHospitals(true);
      setValue('hospitalId', '');
      fetchHospitals(selectedState, selectedDistrict)
        .then((res) => {
          if (res.success) {
            setHospitals(res.hospitals);
            if (res.hospitals.length === 0) {
              setValue('hospitalSelectType', 'manual');
            } else {
              if (getValues('hospitalSelectType') !== 'manual') {
                setValue('hospitalSelectType', 'registered');
              }
            }
          } else {
            setHospitals([]);
            setValue('hospitalSelectType', 'manual');
          }
        })
        .catch(() => {
          setHospitals([]);
          setValue('hospitalSelectType', 'manual');
        })
        .finally(() => {
          setIsLoadingHospitals(false);
        });
    } else {
      setHospitals([]);
    }
  }, [selectedState, selectedDistrict, setValue]);

  const onSubmit = async (data: EmergencyRequestInput) => {
    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const response = await createBloodRequest(data);
      if (response.success) {
        router.push(`/request/${response.requestId}/matches?success=request_created`);
        router.refresh();
      } else {
        setErrorMsg(response.error || 'Failed to file blood request.');
      }
    } catch (err) {
      console.error('Submit request error:', err);
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

      {/* SECTION 1: Patient Information */}
      <Card className="shadow-premium border-border/40">
        <CardHeader>
          <CardTitle className="text-lg font-bold">1. Patient Information</CardTitle>
          <CardDescription>Enter details of the patient requiring blood transfusion</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            id="patientName"
            label="Patient Name"
            placeholder="e.g. John Doe"
            error={errors.patientName?.message}
            disabled={isSubmitting}
            icon={<User className="w-4 h-4" />}
            {...register('patientName')}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              id="patientAge"
              label="Patient Age"
              type="number"
              placeholder="e.g. 45"
              error={errors.patientAge?.message}
              disabled={isSubmitting}
              icon={<Calendar className="w-4 h-4" />}
              {...register('patientAge')}
            />

            <Select
              id="patientGender"
              label="Patient Gender"
              error={errors.patientGender?.message}
              disabled={isSubmitting}
              options={[
                { label: 'Male', value: Gender.MALE },
                { label: 'Female', value: Gender.FEMALE },
                { label: 'Other', value: Gender.OTHER },
                { label: 'Prefer not to say', value: Gender.PREFER_NOT_TO_SAY },
              ]}
              placeholder="Select Gender"
              {...register('patientGender')}
            />
          </div>
        </CardContent>
      </Card>

      {/* SECTION 2: Blood Requirement */}
      <Card className="shadow-premium border-border/40">
        <CardHeader>
          <CardTitle className="text-lg font-bold">2. Blood Requirement Details</CardTitle>
          <CardDescription>Specify the blood group, units needed, and urgency level</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              id="bloodType"
              label="Required Blood Type"
              error={errors.bloodType?.message}
              disabled={isSubmitting}
              options={Object.keys(BLOOD_TYPE_LABELS).map((bt) => ({
                label: BLOOD_TYPE_LABELS[bt as BloodType],
                value: bt,
              }))}
              placeholder="Select Blood Type"
              {...register('bloodType')}
            />

            <Input
              id="unitsRequired"
              label="Number of Blood Units"
              type="number"
              placeholder="e.g. 2"
              error={errors.unitsRequired?.message}
              disabled={isSubmitting}
              icon={<Activity className="w-4 h-4" />}
              {...register('unitsRequired')}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              id="urgency"
              label="Urgency Level"
              error={errors.urgency?.message}
              disabled={isSubmitting}
              options={[
                { label: 'Normal Requirement', value: RequestUrgency.NORMAL },
                { label: 'Urgent (Within 24 Hours)', value: RequestUrgency.URGENT },
                { label: 'Critical (Immediate Attention)', value: RequestUrgency.IMMEDIATE },
              ]}
              placeholder="Select Urgency"
              {...register('urgency')}
            />

            <Input
              id="neededBy"
              label="Needed By Date & Time"
              type="datetime-local"
              error={errors.neededBy?.message}
              disabled={isSubmitting}
              icon={<Clock className="w-4 h-4" />}
              {...register('neededBy')}
            />
          </div>
        </CardContent>
      </Card>

      {/* SECTION 3: Hospital & Location */}
      <Card className="shadow-premium border-border/40">
        <CardHeader>
          <CardTitle className="text-lg font-bold">3. Hospital Location</CardTitle>
          <CardDescription>Select location and registered hospital details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              id="state"
              label="State"
              error={errors.state?.message}
              disabled={isSubmitting}
              options={STATES.map((s) => ({ label: s, value: s }))}
              placeholder="Select State"
              {...register('state')}
            />

            <Select
              id="district"
              label="District"
              error={errors.district?.message}
              disabled={isSubmitting || !selectedState}
              options={selectedState ? getDistrictsForState(selectedState).map((d) => ({ label: d, value: d })) : []}
              placeholder="Select District"
              {...register('district')}
            />
          </div>

          {!selectedState || !selectedDistrict ? (
            <div className="text-sm text-muted-foreground py-4 text-center bg-muted/20 rounded-lg border border-dashed border-border/60">
              Please select state and district first to see hospital options
            </div>
          ) : isLoadingHospitals ? (
            <div className="text-sm text-muted-foreground py-4 text-center">
              Loading hospital list...
            </div>
          ) : hospitals.length === 0 ? (
            <div className="pt-2 animate-fade-in space-y-4">
              <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-700 text-xs font-semibold rounded-lg">
                No verified registered hospitals found in this location. Please enter hospital details manually below.
              </div>
              <Input
                id="hospitalName"
                label="Hospital Name"
                placeholder="e.g. Apollo Speciality Clinic"
                error={errors.hospitalName?.message}
                disabled={isSubmitting}
                icon={<Building2 className="w-4 h-4" />}
                {...register('hospitalName')}
              />

              <div className="flex flex-col gap-1.5">
                <label htmlFor="manualHospitalAddress" className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  Hospital Address
                </label>
                <textarea
                  id="manualHospitalAddress"
                  placeholder="Enter full hospital address (floor, block, street, landmark)..."
                  disabled={isSubmitting}
                  rows={3}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  {...register('manualHospitalAddress')}
                />
                {errors.manualHospitalAddress?.message && (
                  <p className="text-xs text-destructive font-medium mt-0.5">{errors.manualHospitalAddress.message}</p>
                )}
              </div>
            </div>
          ) : watchHospitalSelectType === 'registered' ? (
            <div className="pt-2 animate-fade-in space-y-3 flex flex-col">
              <Select
                id="hospitalId"
                label="Registered Hospital"
                error={errors.hospitalId?.message}
                disabled={isSubmitting}
                options={hospitals.map((h) => ({
                  label: `${h.name} (${h.address})`,
                  value: h.id,
                }))}
                placeholder="Select Registered Hospital"
                {...register('hospitalId')}
              />
              <button
                type="button"
                onClick={() => setValue('hospitalSelectType', 'manual')}
                className="text-xs font-semibold text-primary hover:text-primary-hover hover:underline self-start mt-1"
              >
                Can't find your hospital? Enter it manually.
              </button>
            </div>
          ) : (
            <div className="pt-2 animate-fade-in space-y-4 flex flex-col">
              <Input
                id="hospitalName"
                label="Hospital Name"
                placeholder="e.g. Apollo Speciality Clinic"
                error={errors.hospitalName?.message}
                disabled={isSubmitting}
                icon={<Building2 className="w-4 h-4" />}
                {...register('hospitalName')}
              />

              <div className="flex flex-col gap-1.5">
                <label htmlFor="manualHospitalAddress" className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  Hospital Address
                </label>
                <textarea
                  id="manualHospitalAddress"
                  placeholder="Enter full hospital address (floor, block, street, landmark)..."
                  disabled={isSubmitting}
                  rows={3}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  {...register('manualHospitalAddress')}
                />
                {errors.manualHospitalAddress?.message && (
                  <p className="text-xs text-destructive font-medium mt-0.5">{errors.manualHospitalAddress.message}</p>
                )}
              </div>

              <button
                type="button"
                onClick={() => setValue('hospitalSelectType', 'registered')}
                className="text-xs font-semibold text-primary hover:text-primary-hover hover:underline self-start"
              >
                Want to select a registered hospital instead?
              </button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* SECTION 4: Contact Person */}
      <Card className="shadow-premium border-border/40">
        <CardHeader>
          <CardTitle className="text-lg font-bold">4. Contact Person Details</CardTitle>
          <CardDescription>Details of the person coordinating this blood request</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              id="contactName"
              label="Coordinator Name"
              placeholder="e.g. Jane Doe"
              error={errors.contactName?.message}
              disabled={isSubmitting}
              icon={<User className="w-4 h-4" />}
              {...register('contactName')}
            />

            <Input
              id="contactPhone"
              label="Contact Phone Number"
              placeholder="e.g. 9876543210"
              error={errors.contactPhone?.message}
              disabled={isSubmitting}
              icon={<Phone className="w-4 h-4" />}
              {...register('contactPhone')}
            />
          </div>
        </CardContent>
      </Card>

      {/* SECTION 5: Requirement Setup */}
      <Card className="shadow-premium border-border/40">
        <CardHeader>
          <CardTitle className="text-lg font-bold">5. Transfusion & Replacement Type</CardTitle>
          <CardDescription>Configure request options</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3">
            <label className="flex items-center gap-3 cursor-pointer text-sm select-none">
              <input
                type="checkbox"
                disabled={isSubmitting}
                className="w-4 h-4 rounded border-border text-primary"
                {...register('needsBloodUnits')}
              />
              <div className="flex flex-col">
                <span className="font-semibold">Direct Blood Units Required</span>
                <span className="text-xs text-muted-foreground">Patient requires immediate transfusions from reserves</span>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer text-sm select-none pt-2 border-t border-border/20">
              <input
                type="checkbox"
                disabled={isSubmitting}
                className="w-4 h-4 rounded border-border text-primary"
                {...register('needsReplacementDonors')}
              />
              <div className="flex flex-col">
                <span className="font-semibold">Needs Replacement Donors</span>
                <span className="text-xs text-muted-foreground">Ask donors to donate units at the hospital to replenish stocks</span>
              </div>
            </label>
          </div>

          {watchNeedsReplacementDonors && (
            <div className="pt-2 animate-fade-in space-y-4">
              <Input
                id="replacementDonorCount"
                label="Number of Replacement Donors Needed"
                type="number"
                placeholder="e.g. 2"
                error={errors.replacementDonorCount?.message}
                disabled={isSubmitting}
                icon={<Activity className="w-4 h-4" />}
                {...register('replacementDonorCount')}
              />

              <div className="flex flex-col gap-2 pt-2 border-t border-border/20">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Replacement Donor Requirement
                </span>
                <div className="flex flex-col gap-3 mt-1">
                  <label className="flex items-start gap-2.5 cursor-pointer text-sm font-medium text-foreground select-none">
                    <input
                      type="radio"
                      value={ReplacementRequirement.SAME_BLOOD_GROUP}
                      disabled={isSubmitting}
                      className="w-4 h-4 mt-0.5 text-primary focus:ring-primary/20"
                      {...register('replacementRequirement')}
                    />
                    <div className="flex flex-col">
                      <span>Same Blood Group Required</span>
                      <span className="text-xs text-muted-foreground font-normal">Only donors with the exact same blood group will match.</span>
                    </div>
                  </label>

                  <label className="flex items-start gap-2.5 cursor-pointer text-sm font-medium text-foreground select-none">
                    <input
                      type="radio"
                      value={ReplacementRequirement.ANY_BLOOD_GROUP}
                      disabled={isSubmitting}
                      className="w-4 h-4 mt-0.5 text-primary focus:ring-primary/20"
                      {...register('replacementRequirement')}
                    />
                    <div className="flex flex-col">
                      <span>Any Blood Group Accepted</span>
                      <span className="text-xs text-muted-foreground font-normal">Ignore compatibility, match all eligible and available donors in the selected location.</span>
                    </div>
                  </label>
                </div>
                {errors.replacementRequirement?.message && (
                  <p className="text-xs text-destructive font-medium mt-1">
                    {errors.replacementRequirement.message}
                  </p>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* SECTION 6: Additional Notes */}
      <Card className="shadow-premium border-border/40">
        <CardHeader>
          <CardTitle className="text-lg font-bold">6. Additional Information (Optional)</CardTitle>
          <CardDescription>Add specific instructions or directions for potential donors</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="notes" className="text-sm font-semibold text-foreground flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-muted-foreground" />
              Request Notes
            </label>
            <textarea
              id="notes"
              placeholder="e.g. Please bring original patient ID copy. Direct donation at Block B, room 204..."
              disabled={isSubmitting}
              rows={4}
              className="w-full px-3 py-2 text-sm rounded-lg border border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              {...register('notes')}
            />
            {errors.notes?.message && (
              <p className="text-xs text-destructive font-medium mt-0.5">{errors.notes.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* SECTION 7: Declaration & Consent */}
      <Card className="shadow-premium border-border/40">
        <CardHeader>
          <CardTitle className="text-lg font-bold">7. Declaration</CardTitle>
          <CardDescription>Please review and confirm to publish the emergency request</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <label className="flex items-start gap-3 cursor-pointer text-sm font-medium text-foreground select-none">
            <input
              type="checkbox"
              disabled={isSubmitting}
              className="w-4 h-4 mt-0.5 rounded border-border text-primary focus:ring-primary/20"
              {...register('declarationChecked')}
            />
            <span>
              I hereby declare that the blood requirement described above is genuine and the patient details are accurate. I consent to publishing these details on the active board for coordination.
            </span>
          </label>
          {errors.declarationChecked?.message && (
            <p className="text-xs text-destructive font-medium">
              {errors.declarationChecked.message}
            </p>
          )}

          <Button
            type="submit"
            className="w-full mt-4"
            isLoading={isSubmitting}
          >
            {isSubmitting ? 'Submitting Emergency Request...' : 'Publish Emergency Request'}
          </Button>
        </CardContent>
      </Card>
    </form>
  );
}
