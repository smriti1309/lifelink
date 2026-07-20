import { z } from 'zod';
import { BloodType, Gender, ContactPreference, Relationship } from '@prisma/client';

export const BecomeDonorSchema = z.object({
  bloodType: z.nativeEnum(BloodType, {
    message: 'Please select a valid blood type',
  }),
  dateOfBirth: z.preprocess(
    (val) => (typeof val === 'string' ? new Date(val as any) : val),
    z.date({ message: 'Date of birth is required' })
      .refine(
        (date) => {
          const age = new Date().getFullYear() - date.getFullYear();
          return age >= 18;
        },
        { message: 'You must be at least 18 years old to become a donor' }
      )
  ),
  gender: z.nativeEnum(Gender, {
    message: 'Please select a valid gender option',
  }),
  weight: z.preprocess(
    (val) => Number(val),
    z.number({ message: 'Weight is required' })
      .min(45, { message: 'You must weigh at least 45 kg to donate blood' })
  ),
  hasDonatedBefore: z.enum(['yes', 'no'], {
    message: 'Please select whether you have donated blood before',
  }),
  lastDonatedAt: z.preprocess(
    (val) => (val ? new Date(val as any) : null),
    z.date().nullable().optional()
  ),
  isAvailable: z.enum(['yes', 'no'], {
    message: 'Please select your availability status',
  }),
  preferredContact: z.nativeEnum(ContactPreference, {
    message: 'Please select a preferred contact method',
  }),
  // Medical eligibility
  isHealthy: z.boolean({ message: 'Please answer if you are currently feeling healthy' }),
  hasMedicationRestriction: z.boolean({ message: 'Please answer if you are taking restricting medication' }),
  hadRecentSurgery: z.boolean({ message: 'Please answer if you have undergone surgery in the last 6 months' }),
  donatedWithinLast3Months: z.boolean({ message: 'Please answer if you have donated blood in the last 3 months' }),
  // Emergency Contact
  emergencyContactName: z.string().trim().optional(),
  emergencyContactPhone: z.string().trim().optional(),
  emergencyContactRelation: z.nativeEnum(Relationship).optional().nullable().or(z.literal('')),
  // Declaration
  consentChecked: z.boolean().refine((val) => val === true, {
    message: 'You must consent to being contacted for emergency blood requests',
  }),
}).refine(
  (data) => {
    if (data.hasDonatedBefore === 'yes' && !data.lastDonatedAt) {
      return false;
    }
    return true;
  },
  {
    message: 'Please enter the date of your last donation',
    path: ['lastDonatedAt'],
  }
).refine(
  (data) => {
    if (data.hasDonatedBefore === 'yes' && data.lastDonatedAt && data.lastDonatedAt > new Date()) {
      return false;
    }
    return true;
  },
  {
    message: 'Last donation date cannot be in the future',
    path: ['lastDonatedAt'],
  }
).refine(
  (data) => {
    if (data.emergencyContactName && (!data.emergencyContactPhone || !data.emergencyContactRelation)) {
      return false;
    }
    return true;
  },
  {
    message: 'Please complete all emergency contact fields if a contact name is provided',
    path: ['emergencyContactPhone'],
  }
).refine(
  (data) => {
    if (data.emergencyContactName && data.emergencyContactPhone && !/^(?:\+91|91|0)?[6-9]\d{9}$/.test(data.emergencyContactPhone)) {
      return false;
    }
    return true;
  },
  {
    message: 'Please enter a valid 10-digit emergency contact phone number',
    path: ['emergencyContactPhone'],
  }
);

export type BecomeDonorInput = z.infer<typeof BecomeDonorSchema>;
