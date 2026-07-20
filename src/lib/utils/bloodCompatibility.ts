import { BloodType } from '@prisma/client';
import { COMPATIBLE_DONORS } from '@/lib/constants/bloodTypes';

/**
 * Blood Transfusion Compatibility Utility
 * 
 * Maps a patient's required blood group to all compatible donor blood groups
 * for red blood cell transfusions.
 * 
 * Centralized and reusable across:
 * - Find Donors matching searches
 * - Automatic Request Matching algorithms
 * - Internal Blood Request Workflows
 * - Notification Center alerts
 * - Future email, SMS, push notifications, or donor recommenders
 */
export function getCompatibleDonorGroups(bloodType: BloodType): BloodType[] {
  // Direct type-safe lookup from the base blood group mappings
  return COMPATIBLE_DONORS[bloodType as keyof typeof COMPATIBLE_DONORS] as unknown as BloodType[] || [bloodType];
}
