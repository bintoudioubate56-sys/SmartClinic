import AppointmentForm from '@/components/appointments/AppointmentForm';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '@/types/database.types';
import Link from 'next/link';

export default async function NewAppointmentPage() {
  const cookieStore = cookies();
  const supabase = createServerComponentClient<Database>({ 
    cookies: () => cookieStore 
  });
  
  const { data: { user } } = await supabase.auth.getUser();

  // 1. Get current staff clinic_id
  const { data: staff } = await (supabase
    .from('clinic_staff')
    .select('clinic_id')
    .eq('user_id', user?.id || '')
    .single() as any);

  // 2. Get active doctors in this clinic
  const { data: doctorsData } = await (supabase
    .from('clinic_staff')
    .select('id, user_id, role, is_active')
    .eq('clinic_id', staff?.clinic_id || '')
    .eq('role', 'doctor')
    .eq('is_active', true) as any);

  // Note: In a real app, you'd join with a profiles table for names.
  const doctors = (doctorsData || []).map((d: any) => ({
    id: d.id,
    name: `Dr. ${d.user_id.substring(0, 5)}` 
  }));

  return (
    <div className="p-6 md:p-10 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <header className="mb-10">
          <nav className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-1 flex items-center gap-2">
            <Link href="/dashboard/reception/appointments" className="hover:underline">Rendez-vous</Link>
            <span>/</span>
            <span className="text-slate-400">Nouveau</span>
          </nav>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Programmer une Visite</h1>
        </header>

        <AppointmentForm clinicId={staff?.clinic_id || ''} doctors={doctors} />
      </div>
    </div>
  );
}
