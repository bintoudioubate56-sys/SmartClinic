import PatientForm from '@/components/patients/PatientForm';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '@/types/database.types';
import Link from 'next/link';

export default async function NewPatientPage() {
  const cookieStore = cookies();
  const supabase = createServerComponentClient<Database>({ 
    cookies: () => cookieStore 
  });
  
  const { data: { user } } = await supabase.auth.getUser();

  // Get clinic_id for current staff - casting as any due to auth-helpers inference issues
  const { data: staff } = await (supabase
    .from('clinic_staff')
    .select('clinic_id')
    .eq('user_id', user?.id || '')
    .single() as any);

  return (
    <div className="p-6 md:p-10 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <header className="mb-10 flex items-center justify-between">
          <div>
            <nav className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-1 flex items-center gap-2">
              <Link href="/dashboard/reception" className="hover:underline">Dashboard</Link>
              <span>/</span>
              <span className="text-slate-400">Nouveau Patient</span>
            </nav>
            <h1 className="text-3xl font-black text-slate-800">Enregistrer un Patient</h1>
          </div>
        </header>

        <PatientForm clinicId={staff?.clinic_id ?? ''} />
      </div>
    </div>
  );
}
