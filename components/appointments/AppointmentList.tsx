'use client'

import { useState, useEffect } from 'react';
import { getAppointments, updateAppointmentStatus } from '@/actions/appointments';
import Link from 'next/link';

export default function AppointmentList({ clinicId }: { clinicId: string }) {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<{
    date: string;
    status: string;
    doctorId: string;
  }>({
    date: new Date().toISOString().split('T')[0],
    status: '',
    doctorId: ''
  });
  
  const [cancelId, setCancelId] = useState<string | null>(null);
  const [cancelMotif, setCancelMotif] = useState('');

  const fetchAppointments = async () => {
    setLoading(true);
    const res = await getAppointments({ 
      date: filters.date || undefined,
      status: filters.status || undefined,
      doctorId: filters.doctorId || undefined,
      clinicId 
    });
    if (res.success) {
      setAppointments(res.data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAppointments();
  }, [filters]);

  const handleStatusUpdate = async (id: string, status: string, motif?: string) => {
    const res = await updateAppointmentStatus(id, status, motif);
    if (res.success) {
      alert(res.data?.smsFailed ? 'Statut mis à jour, mais échec SMS.' : 'Statut mis à jour.');
      setCancelId(null);
      fetchAppointments();
    } else {
      alert(res.error);
    }
  };

  return (
    <div className="text-slate-900">
      {/* Filters */}
      <section className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm mb-8 flex flex-wrap gap-4 items-end">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Date</label>
          <input 
            type="date" 
            value={filters.date} 
            onChange={e => setFilters({...filters, date: e.target.value})}
            className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-50 rounded-xl focus:border-indigo-500 outline-none font-bold"
          />
        </div>
        <div className="flex-1 min-w-[200px]">
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Statut</label>
          <select 
            value={filters.status} 
            onChange={e => setFilters({...filters, status: e.target.value})}
            className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-50 rounded-xl focus:border-indigo-500 outline-none font-bold appearance-none"
          >
            <option value="">Tous les statuts</option>
            <option value="scheduled">Planifié</option>
            <option value="confirmed">Confirmé</option>
            <option value="cancelled">Annulé</option>
            <option value="completed">Terminé</option>
          </select>
        </div>
      </section>

      {/* List */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Heure</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Patient</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Médecin</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Statut</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 font-medium">
            {loading ? (
              <tr><td colSpan={5} className="p-10 text-center text-slate-400 italic">Chargement...</td></tr>
            ) : appointments.length === 0 ? (
              <tr><td colSpan={5} className="p-10 text-center text-slate-400 italic">Aucun rendez-vous trouvé.</td></tr>
            ) : (
              appointments.map(appt => (
                <tr key={appt.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-black text-indigo-600">
                    {new Date(appt.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-800">{appt.patient?.last_name.toUpperCase()} {appt.patient?.first_name}</p>
                    <p className="text-xs text-slate-400">{appt.patient?.phone}</p>
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    Dr. {appt.doctor?.user_id?.substring(0, 5) || 'Non assigné'}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      appt.status === 'scheduled' ? 'bg-amber-100 text-amber-600' :
                      appt.status === 'completed' ? 'bg-emerald-100 text-emerald-600' :
                      appt.status === 'cancelled' ? 'bg-red-100 text-red-600' :
                      'bg-slate-100 text-slate-600'
                    }`}>
                      {appt.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {appt.status !== 'completed' && appt.status !== 'cancelled' && (
                      <div className="flex justify-end gap-2 text-xs">
                        <button 
                          onClick={() => handleStatusUpdate(appt.id, 'confirmed')}
                          className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 font-bold transition-all"
                        >
                          Confirmer
                        </button>
                        <button 
                          onClick={() => setCancelId(appt.id)}
                          className="px-3 py-1 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 font-bold transition-all"
                        >
                          Annuler
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Cancellation Modal */}
      {cancelId && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-6 z-50">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
            <h2 className="text-2xl font-black text-slate-900 mb-4">Annuler le Rendez-vous</h2>
            <p className="text-slate-500 mb-6 font-medium">Veuillez sélectionner le motif de l'annulation. Un SMS sera envoyé au patient.</p>
            
            <select 
              value={cancelMotif}
              onChange={e => setCancelMotif(e.target.value)}
              className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl mb-6 font-bold text-slate-700 outline-none"
            >
              <option value="">Sélectionner un motif</option>
              <option value="Patient absent">Patient absent</option>
              <option value="Demande patient">À la demande du patient</option>
              <option value="Urgence médecin">Urgence médecin</option>
              <option value="Autre">Autre</option>
            </select>

            <div className="flex gap-4">
              <button 
                onClick={() => setCancelId(null)}
                className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black hover:bg-slate-200"
              >
                Retour
              </button>
              <button 
                disabled={!cancelMotif}
                onClick={() => handleStatusUpdate(cancelId, 'cancelled', cancelMotif)}
                className="flex-1 py-4 bg-red-600 text-white rounded-2xl font-black hover:bg-red-700 disabled:opacity-50"
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
