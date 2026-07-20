'use server';

import { createClient } from '@/lib/supabase/server';
import { ProfileService } from '@/services/profile';
import { ProfileSchema, type ProfileInput } from '@/lib/validators/profile';
import { revalidatePath } from 'next/cache';

export async function saveProfile(data: ProfileInput) {
  // 1. Fetch current authenticated user session on the server
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return {
      success: false,
      error: 'Unauthorized. Please sign in.',
    };
  }

  // 2. Validate input fields server-side
  const result = ProfileSchema.safeParse(data);
  if (!result.success) {
    return {
      success: false,
      error: result.error.issues[0]?.message || 'Validation failed.',
    };
  }

  const validatedData = result.data;

  try {
    // 3. Determine if profile already exists in database
    const existingProfile = await ProfileService.getProfile(user.id);

    if (existingProfile) {
      // Update existing record
      await ProfileService.updateProfile(user.id, validatedData);
    } else {
      // Create new record
      await ProfileService.createProfile(user.id, user.email!, validatedData);
    }

    // 4. Revalidate cache
    revalidatePath('/profile');
    revalidatePath('/dashboard');

    return {
      success: true,
    };
  } catch (error: any) {
    console.error('Error saving profile:', error);
    
    // Check for duplicate constraint violations (e.g., phone number, email)
    let errorMessage = 'Failed to save profile. Please check your inputs and try again.';
    
    if (error?.code === 'P2002') {
      const target = error?.meta?.target;
      if (Array.isArray(target) && target.includes('phone')) {
        errorMessage = 'This phone number is already registered to another user.';
      } else if (typeof target === 'string' && target.includes('phone')) {
        errorMessage = 'This phone number is already registered to another user.';
      } else {
        errorMessage = 'A unique constraint violation occurred in the database.';
      }
    } else if (error?.message) {
      errorMessage = error.message;
    }
    
    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Server Action to check if the current user has a completed profile
 */
export async function checkUserProfileStatus() {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return {
      success: false,
      error: 'Not authenticated',
    };
  }

  try {
    const profile = await ProfileService.getProfile(user.id);
    return {
      success: true,
      hasProfile: !!profile,
    };
  } catch (error) {
    console.error('Error checking profile status:', error);
    return {
      success: false,
      error: 'Failed to verify profile status.',
    };
  }
}

