import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  // Create a supabase client to handle the session
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Fetch the user to verify the session
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Define allowed roles based on path
  const path = request.nextUrl.pathname
  
  // Exclude auth routes and public routes from protection
  if (path.startsWith('/login') || path.startsWith('/register') || path.startsWith('/qr') || path === '/') {
    return supabaseResponse
  }

  // If there's no user, redirect to login
  if (!user && path.startsWith('/dashboard')) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // Check role-based access for /dashboard routes
  if (user && path.startsWith('/dashboard')) {
    let role = user.user_metadata?.role || user.app_metadata?.role

    // If role is not in metadata, try fetching it from the users table
    if (!role) {
      const { data: userData } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single()
      
      role = userData?.role
    }

    const segments = path.split('/')
    const requestedRolePath = segments[2] // e.g. /dashboard/admin -> admin

    // If the user's role doesn't match the requested path section, redirect them home/correct dashboard
    if (requestedRolePath && requestedRolePath !== role) {
      const url = request.nextUrl.clone()
      // If role exists, redirect to their dashboard, otherwise send to a general place
      url.pathname = role ? `/dashboard/${role}` : '/login'
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}
