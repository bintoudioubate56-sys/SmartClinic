'use client'

import { useState } from 'react';
import MedicalRecordForm from './MedicalRecordForm';

export default function ConsultationManager({ 
  patient, 
  staff 
}: { 
  patient: any; 
  staff: any;
}) {
  const [showForm, setShowForm] = useState(false);
  const [editingRecord, setEditingRecord] = useState<any>(null);

  const sortedRecords = [...(patient.medical_records || [])].sort((a, b) => 
    new Date(b.consultation_date).getTime() - new Date(a.consultation_date).getTime()
  );

  return (
    <div className="space-y-8">
      {/* Action Bar */}
      <div className="flex justify-between items-center bg-white p-4 rounded-3xl border border-slate-100 shadow-sm">
        <h2 className="text-xl font-black text-slate-800 ml-2">Consultations</h2>
        <button 
          onClick={() => {
            setEditingRecord(null);
            setShowForm(!showForm);
          }}
          className={`px-6 py-3 rounded-2xl font-black transition-all flex items-center gap-2 ${
            showForm 
              ? 'bg-slate-100 text-slate-600 hover:bg-slate-200' 
              : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-100'
          }`}
        >
          {showForm ? (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              Annuler
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
              Nouvelle Consultation
            </>
          )}
        </button>
      </div>

      {/* Form Area */}
      {showForm && (
        <div className="animate-in fade-in slide-in-from-top-4 duration-300">
          <MedicalRecordForm 
            patientId={patient.id}
            clinicId={staff.clinic_id}
            doctorId={staff.id}
            existingRecord={editingRecord}
          />
        </div>
      )}

      {/* History List */}
      <section className="space-y-4">
        {sortedRecords.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-3xl border-2 border-dashed border-slate-100">
            <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
            </div>
            <p className="text-slate-400 font-medium italic">Aucun antécédent médical enregistré.</p>
          </div>
        ) : (
          sortedRecords.map((record) => (
            <div key={record.id} className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-all group">
              <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full mb-3 inline-block uppercase tracking-widest">
                      {new Date(record.consultation_date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                    <h4 className="text-xl font-black text-slate-800 leading-tight">
                      {record.chief_complaint}
                    </h4>
                  </div>
                  <button 
                    onClick={() => {
                      setEditingRecord(record);
                      setShowForm(true);
                      window.scrollTo({ top: 100, behavior: 'smooth' });
                    }}
                    className="text-slate-300 hover:text-indigo-600 p-2 rounded-xl hover:bg-indigo-50 transition-all"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Diagnostic</p>
                    <p className="text-slate-700 font-medium leading-relaxed">{record.diagnosis}</p>
                  </div>
                  {record.treatment && (
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Traitement & Ordonnance</p>
                      <p className="text-indigo-900 font-medium leading-relaxed">{record.treatment}</p>
                    </div>
                  )}
                </div>

                {record.record_attachments?.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-6 border-t border-slate-50">
                    {record.record_attachments.map((file: any) => (
                      <div key={file.id} className="flex items-center gap-2 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-500 hover:text-indigo-600 hover:border-indigo-100 transition-all cursor-pointer">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" /></svg>
                        {file.file_name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </section>
    </div>
  );
}
