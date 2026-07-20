import { BloodType, Gender, RequestUrgency } from '@prisma/client';
import { z } from 'zod';

export enum ReplacementRequirement {
  SAME_BLOOD_GROUP = 'SAME_BLOOD_GROUP',
  ANY_BLOOD_GROUP = 'ANY_BLOOD_GROUP',
}

export const EmergencyRequestSchema = z.object({
  patientName: z.string().trim().min(1, { message: 'Patient name is required' }).max(100),
  patientAge: z.preprocess(
    (val) => (val === '' || val === null || val === undefined ? undefined : Number(val)),
    z.number({ message: 'Age is required' })
      .int()
      .min(0, { message: 'Age cannot be negative' })
      .max(125, { message: 'Please enter a valid age' })
  ),
  patientGender: z.nativeEnum(Gender, {
    message: 'Please select patient gender',
  }),
  bloodType: z.nativeEnum(BloodType, {
    message: 'Please select a blood type',
  }),
  needsBloodUnits: z.boolean().default(true),
  unitsRequired: z.preprocess(
    (val) => (val === '' || val === null || val === undefined ? undefined : Number(val)),
    z.number({ message: 'Number of units is required' })
      .int()
      .min(1, { message: 'At least 1 unit of blood is required' })
  ),
  needsReplacementDonors: z.boolean().default(false),
  replacementDonorCount: z.preprocess(
    (val) => (val === '' || val === null || val === undefined ? null : Number(val)),
    z.number().int().min(1, { message: 'At least 1 replacement donor is required' }).nullable().optional()
  ),
  replacementRequirement: z.nativeEnum(ReplacementRequirement).optional().nullable(),
  hospitalSelectType: z.enum(['registered', 'manual'], {
    message: 'Please select hospital entry type',
  }),
  state: z.string().min(1, { message: 'State is required' }),
  district: z.string().min(1, { message: 'District is required' }),
  hospitalId: z.string().optional().nullable().or(z.literal('')),
  hospitalName: z.string().trim().optional(),
  manualHospitalAddress: z.string().trim().optional(),
  urgency: z.nativeEnum(RequestUrgency, {
    message: 'Please select urgency level',
  }),
  contactName: z.string().trim().min(1, { message: 'Contact name is required' }).max(100),
  contactPhone: z.string().trim().min(1, { message: 'Contact phone number is required' }).regex(/^(?:\+91|91|0)?[6-9]\d{9}$/, {
    message: 'Please enter a valid 10-digit Indian phone number',
  }),
  notes: z.string().trim().optional().nullable(),
  neededBy: z.preprocess(
    (val) => (typeof val === 'string' ? new Date(val as any) : val),
    z.date({ message: 'Needed by date is required' })
      .refine(
        (date) => {
          return date > new Date();
        },
        { message: 'Needed by date must be in the future' }
      )
  ),
  declarationChecked: z.boolean().refine((val) => val === true, {
    message: 'You must confirm that the request details are accurate',
  }),
}).refine(
  (data) => {
    if (data.needsReplacementDonors && (data.replacementDonorCount === null || data.replacementDonorCount === undefined)) {
      return false;
    }
    return true;
  },
  {
    message: 'Please enter the number of replacement donors needed',
    path: ['replacementDonorCount'],
  }
).refine(
  (data) => {
    if (data.needsReplacementDonors && !data.replacementRequirement) {
      return false;
    }
    return true;
  },
  {
    message: 'Please select a replacement donor requirement',
    path: ['replacementRequirement'],
  }
).refine(
  (data) => {
    if (data.hospitalSelectType === 'registered' && !data.hospitalId) {
      return false;
    }
    return true;
  },
  {
    message: 'Please select a registered hospital',
    path: ['hospitalId'],
  }
).refine(
  (data) => {
    if (data.hospitalSelectType === 'manual' && !data.hospitalName) {
      return false;
    }
    return true;
  },
  {
    message: 'Please enter the hospital name',
    path: ['hospitalName'],
  }
).refine(
  (data) => {
    if (data.hospitalSelectType === 'manual' && !data.manualHospitalAddress) {
      return false;
    }
    return true;
  },
  {
    message: 'Please enter the hospital address',
    path: ['manualHospitalAddress'],
  }
);

export type EmergencyRequestInput = z.infer<typeof EmergencyRequestSchema>;
