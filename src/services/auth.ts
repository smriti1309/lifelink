import { createClient as createBrowserClient } from '@/lib/supabase/client';

export class AuthService {
  /**
   * Helper to dynamically get the correct Supabase client based on execution context (Server vs Client)
   */
  private static async getSupabaseClient() {
    if (typeof window === 'undefined') {
      const { createClient: createServerClient } = await import('@/lib/supabase/server');
      return await createServerClient();
    }
    return createBrowserClient();
  }

  /**
   * Register a new user in Supabase
   */
  static async register(email: string, password: string) {
    const supabase = await this.getSupabaseClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) throw error;
    return data;
  }

  /**
   * Authenticate user with Supabase email + password
   */
  static async login(email: string, password: string) {
    const supabase = await this.getSupabaseClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  }

  /**
   * Terminate active Supabase session
   */
  static async logout() {
    const supabase = await this.getSupabaseClient();
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }

  /**
   * Retrieve the current authenticated user details from Supabase
   */
  static async getCurrentUser() {
    const supabase = await this.getSupabaseClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    console.log("SERVER CURRENT USER:", user ? user.email : 'null', "ERROR:", error);
    if (error) return null;
    return user;
  }

  /**
   * Fetch the current active user session from Supabase
   */
  static async getSession() {
    const supabase = await this.getSupabaseClient();
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return session;
  }

  /**
   * Terminate active Supabase session (alias for compatibility)
   */
  static async signOut() {
    await this.logout();
  }
}
