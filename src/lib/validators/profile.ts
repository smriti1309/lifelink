import { z } from 'zod';

export const ProfileSchema = z.object({
  fullName: z
    .string()
    .min(1, { message: 'Full name is required' })
    .max(100, { message: 'Name must be under 100 characters' })
    .trim(),
  phone: z
    .string()
    .min(1, { message: 'Phone number is required' })
    .regex(/^(?:\+91|91|0)?[6-9]\d{9}$/, {
      message: 'Please enter a valid 10-digit Indian mobile number',
    })
    .trim(),
  district: z
    .string()
    .min(1, { message: 'District is required' })
    .max(50, { message: 'District name must be under 50 characters' })
    .trim(),
  state: z
    .string()
    .min(1, { message: 'State is required' })
    .max(50, { message: 'State name must be under 50 characters' })
    .trim(),
});

export type ProfileInput = z.infer<typeof ProfileSchema>;
