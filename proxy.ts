import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import type { Database } from '@/types/database.types';

export async function proxy(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient<Database>({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const url = req.nextUrl.clone();
  const path = url.pathname;

  // 1. Redirect to login if no session and accessing protected route
  if (!session && path.startsWith('/dashboard')) {
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // 2. Role-Based Access Control (RBAC)
  if (session) {
    const role = session.user.user_metadata?.role;

    // Patients cannot access staff dashboards
    if (role === 'patient' && (path.startsWith('/dashboard/doctor') || path.startsWith('/dashboard/reception'))) {
      url.pathname = '/dashboard/patient';
      return NextResponse.redirect(url);
    }

    // Doctors cannot access reception dashboard
    if (role === 'doctor' && path.startsWith('/dashboard/reception')) {
      url.pathname = '/dashboard/doctor';
      return NextResponse.redirect(url);
    }

    // Receptionists cannot access doctor dashboard (medical records)
    if (role === 'receptionist' && path.startsWith('/dashboard/doctor')) {
      url.pathname = '/dashboard/reception';
      return NextResponse.redirect(url);
    }
    
    // Redirect /login to dashboard if already logged in
    if (path === '/login') {
      const dashboardPath = role === 'admin' ? '/dashboard/admin' : `/dashboard/${role}`;
      url.pathname = dashboardPath;
      return NextResponse.redirect(url);
    }
  }

  return res;
}

export const config = {
  matcher: ['/dashboard/:path*', '/login'],
};
