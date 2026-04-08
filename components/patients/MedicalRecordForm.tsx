'use client'

import { useState, useRef, useEffect } from 'react';
import { uploadAttachment } from '@/actions/medical-records';
import { performOfflineAwareAction } from '@/lib/offline/actions';
import { useRouter } from 'next/navigation';

export default function MedicalRecordForm({ 
  patientId, 
  clinicId, 
  doctorId,
  appointmentId,
  existingRecord
}: { 
  patientId: string; 
  clinicId: string;
  doctorId: string;
  appointmentId?: string;
  existingRecord?: any;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<any[]>(existingRecord?.record_attachments || []);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleStatus = () => setIsOnline(navigator.onLine);
    window.addEventListener('online', handleStatus);
    window.addEventListener('offline', handleStatus);
    return () => {
      window.removeEventListener('online', handleStatus);
      window.removeEventListener('offline', handleStatus);
    };
  }, []);

  // 24h Rule check
  const isReadOnly = existingRecord 
    ? (new Date().getTime() - new Date(existingRecord.created_at).getTime()) > 24 * 60 * 60 * 1000 
    : false;

  const [formData, setFormData] = useState({
    chief_complaint: existingRecord?.chief_complaint || '',
    diagnosis: existingRecord?.diagnosis || '',
    treatment: existingRecord?.treatment || '',
    prescription: existingRecord?.prescription || '',
    notes: existingRecord?.notes || '',
    follow_up_date: existingRecord?.follow_up_date || ''
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !existingRecord?.id || !isOnline) return;

    setUploading(true);
    setError(null);

    for (let i = 0; i < Math.min(files.length, 5); i++) {
      const file = files[i];
      const data = new FormData();
      data.append('file', file);

      const res = await uploadAttachment(
        existingRecord.id,
        patientId,
        clinicId,
        file.name,
        file.type,
        file.size,
        data
      );

      if (res.success) {
        setUploadedFiles(prev => [...prev, res.data]);
      } else {
        setError(res.error);
      }
    }
    setUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isReadOnly) return;

    setLoading(true);
    setError(null);

    const res = await performOfflineAwareAction('create_record', {
      clinic_id: clinicId,
      patient_id: patientId,
      doctor_id: doctorId,
      appointment_id: appointmentId,
      ...formData
    });

    setLoading(false);

    if (res.success) {
      setSuccess(true);
      if (!res.isOffline) {
        router.refresh();
      }
    } else {
      setError(res.error);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-100/50 overflow-hidden text-slate-900">
      <header className="p-6 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
        <div>
          <h3 className="text-xl font-black tracking-tight">{existingRecord ? 'Consulter le Dossier' : 'Nouvelle Consultation'}</h3>
          {isReadOnly && <span className="text-[10px] font-black uppercase text-amber-600 bg-amber-50 px-2 py-0.5 rounded mt-1 inline-block tracking-widest">Lecture seule (Archives)</span>}
          {!isOnline && <span className="text-[10px] font-black uppercase text-red-600 bg-red-50 px-2 py-0.5 rounded mt-1 inline-block tracking-widest ml-2">Mode Hors-ligne activé</span>}
        </div>
      </header>

      <form onSubmit={handleSubmit} className="p-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Main Clinical Info */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                Motif de consultation *
              </label>
              <textarea
                required
                disabled={isReadOnly}
                value={formData.chief_complaint}
                onChange={e => setFormData({...formData, chief_complaint: e.target.value})}
                className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:border-indigo-500 transition-all font-medium min-h-[100px] disabled:opacity-60"
                placeholder="Décrivez les symptômes rapportés par le patient..."
              />
            </div>

            <div>
              <label className="block text-sm font-black text-slate-400 uppercase tracking-widest mb-3">Diagnostic *</label>
              <textarea
                required
                disabled={isReadOnly}
                value={formData.diagnosis}
                onChange={e => setFormData({...formData, diagnosis: e.target.value})}
                className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:border-indigo-500 transition-all font-medium min-h-[100px] disabled:opacity-60"
                placeholder="Conclusion du médecin..."
              />
            </div>
          </div>

          {/* Prescriptions & Treatment */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-black text-slate-400 uppercase tracking-widest mb-3 text-indigo-600">Ordonnance / Traitement</label>
              <textarea
                disabled={isReadOnly}
                value={formData.treatment}
                onChange={e => setFormData({...formData, treatment: e.target.value})}
                className="w-full px-5 py-4 bg-indigo-50/30 border-2 border-indigo-50 rounded-2xl focus:border-indigo-500 transition-all font-medium min-h-[100px] text-indigo-950 disabled:opacity-60"
                placeholder="Médicaments, posologie..."
              />
            </div>

            <div>
              <label className="block text-sm font-black text-slate-400 uppercase tracking-widest mb-3">Date de suivi recommandée</label>
              <input
                type="date"
                disabled={isReadOnly}
                value={formData.follow_up_date}
                onChange={e => setFormData({...formData, follow_up_date: e.target.value})}
                className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:border-indigo-500 transition-all font-medium disabled:opacity-60"
              />
            </div>
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-black text-slate-400 uppercase tracking-widest mb-3">Notes confidentielles</label>
          <textarea
            disabled={isReadOnly}
            value={formData.notes}
            onChange={e => setFormData({...formData, notes: e.target.value})}
            className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:border-indigo-500 transition-all font-medium min-h-[80px] disabled:opacity-60"
            placeholder="Observations internes..."
          />
        </div>

        {/* Attachments Section - Only if record exists */}
        {existingRecord?.id && (
          <div className="border-t border-slate-100 pt-8">
            <label className="block text-sm font-black text-slate-400 uppercase tracking-widest mb-4">Pièces Jointes (Analyses, IRM, Courriers)</label>
            
            <div className="flex flex-wrap gap-4 mb-6">
              {uploadedFiles.map((file) => (
                <div key={file.id} className="group relative w-32 h-32 bg-slate-100 rounded-2xl flex flex-col items-center justify-center p-4 border border-slate-200 hover:border-indigo-200 transition-all cursor-pointer">
                  <div className="text-slate-400 group-hover:text-indigo-500 mb-2">
                    {file.file_type.includes('pdf') ? (
                      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" /></svg>
                    ) : (
                      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" /></svg>
                    )}
                  </div>
                  <p className="text-[10px] font-black text-center truncate w-full text-slate-500 uppercase">{file.file_name}</p>
                </div>
              ))}

              {!isReadOnly && uploadedFiles.length < 5 && (
                <button
                  type="button"
                  disabled={!isOnline}
                  onClick={() => fileInputRef.current?.click()}
                  className={`w-32 h-32 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-2 transition-all ${
                    isOnline 
                      ? 'bg-slate-50 border-slate-200 text-slate-400 hover:border-indigo-400 hover:bg-white hover:text-indigo-500' 
                      : 'bg-slate-100 border-slate-200 text-slate-300 cursor-not-allowed'
                  }`}
                >
                  {uploading ? (
                    <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                      <span className="text-[10px] font-black uppercase tracking-widest">{isOnline ? 'Uploader' : 'Indisponible'}</span>
                    </>
                  )}
                </button>
              )}
            </div>
            {!isOnline && <p className="text-[10px] text-red-500 font-bold uppercase tracking-widest mb-4">L'upload de fichiers nécessite une connexion internet.</p>}
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileUpload} 
              className="hidden" 
              accept=".pdf,.jpg,.jpeg,.png"
              multiple
            />
          </div>
        )}

        {error && <p className="p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-bold">{error}</p>}
        {success && <p className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl text-sm font-bold">Consultation enregistrée {isOnline ? '' : 'localement (Hors-ligne)'}.</p>}

        {!isReadOnly && (
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={loading}
              className="px-10 py-5 bg-indigo-600 text-white rounded-2xl font-black hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 disabled:opacity-50 flex items-center gap-3"
            >
              {loading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
              {existingRecord ? 'Mettre à jour le Dossier' : 'Enregistrer la Consultation'}
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
