import { createServerComponentClient, createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '@/types/database.types';

/**
 * Client for Server Components (read-only)
 */
export const createClient = () => {
  const cookieStore = cookies();
  return createServerComponentClient<Database>({
    cookies: () => cookieStore,
  });
};

/**
 * Client for Server Actions (read-write)
 */
export const createActionClient = () => {
  const cookieStore = cookies();
  return createServerActionClient<Database>({
    cookies: () => cookieStore,
  });
};
