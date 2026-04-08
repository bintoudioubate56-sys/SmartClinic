import AppointmentList from '@/components/appointments/AppointmentList';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '@/types/database.types';
import Link from 'next/link';

export default async function AppointmentManagementPage() {
  const cookieStore = cookies();
  const supabase = createServerComponentClient<Database>({ 
    cookies: () => cookieStore 
  });
  
  const { data: { user } } = await supabase.auth.getUser();

  // Get clinic_id for current staff
  const { data: staff } = await (supabase
    .from('clinic_staff')
    .select('clinic_id')
    .eq('user_id', user?.id || '')
    .single() as any);

  return (
    <div className="p-6 md:p-10 bg-slate-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12 flex flex-wrap items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black tracking-tight mb-2 text-slate-900">Planning Rendez-vous</h1>
            <p className="text-slate-500 font-medium italic">Gérez les créneaux et les annulations en temps réel.</p>
          </div>
          <Link href="/dashboard/reception/appointments/new" className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
            Nouveau RDV
          </Link>
        </header>

        <AppointmentList clinicId={staff?.clinic_id || ''} />
      </div>
    </div>
  );
}
