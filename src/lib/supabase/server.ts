import { createServerClient } from '@supabase/ssr';

export async function createClient() {
  // Dynamically import cookies to prevent static bundling on the client-side
  const { cookies } = await import('next/headers');
  const cookieStore = await cookies();

  console.log("===== SUPABASE DEBUG =====");
  console.log("NEXT_PUBLIC_SUPABASE_URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
  console.log("NEXT_PUBLIC_SUPABASE_ANON_KEY exists:", !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

  try {
    const parsed = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL!);
    console.log("Parsed URL:", parsed.toString());
  } catch (err) {
    console.error("FAILED TO PARSE SUPABASE URL:", err);
  }

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          const allCookies = cookieStore.getAll();
          console.log("SERVER COOKIES READ:", allCookies.map(c => c.name));
          return allCookies;
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing user sessions.
          }
        },
      },
    }
  );
}
