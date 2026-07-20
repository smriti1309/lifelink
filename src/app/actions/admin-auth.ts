'use server';

import { redirect } from 'next/navigation';
import { createAdminSession, destroyAdminSession } from '@/lib/admin-session';

export interface AdminLoginResult {
  success: boolean;
  error?: string;
}

export async function adminLoginAction(formData: FormData): Promise<AdminLoginResult> {
  const email = (formData.get('email') as string || '').trim().toLowerCase();
  const password = (formData.get('password') as string || '').trim();
  const rememberMe = formData.get('rememberMe') === 'on' || formData.get('rememberMe') === 'true';

  if (!email || !password) {
    return {
      success: false,
      error: 'Please provide both email and password.',
    };
  }

  const expectedEmail = (process.env.ADMIN_EMAIL || 'admin@lifelink.org').trim().toLowerCase();
  const expectedPassword = (process.env.ADMIN_PASSWORD || 'admin123!').trim();

  // Validate credentials securely
  if (email !== expectedEmail || password !== expectedPassword) {
    return {
      success: false,
      error: 'Invalid administrator credentials. Access denied.',
    };
  }

  // Create admin session
  await createAdminSession(email, rememberMe);

  return {
    success: true,
  };
}

export async function adminLogoutAction() {
  await destroyAdminSession();
  redirect('/admin');
}
