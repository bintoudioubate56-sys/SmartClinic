'use client'

import { useState, useEffect } from 'react'
import { QRDisplay } from './QRDisplay'
import { logAudit } from '@/app/actions/audit'
import { User, FileText, Calendar, Pill } from 'lucide-react'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function PatientCard({ patient }: { patient: any }) {
  const [activeTab, setActiveTab] = useState('infos')

  useEffect(() => {
    if (patient?.id) {
      logAudit('view_patient', 'patients', patient.id)
    }
  }, [patient?.id])

  if (!patient) return null

  const tabs = [
    { id: 'infos', label: 'Infos', icon: User },
    { id: 'medical', label: 'Dossier médical', icon: FileText },
    { id: 'rdv', label: 'RDV', icon: Calendar },
    { id: 'ordonnances', label: 'Ordonnances', icon: Pill },
  ]

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mt-6">
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex" aria-label="Tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  w-1/4 py-4 px-1 text-center border-b-2 font-medium text-sm flex items-center justify-center space-x-2
                  ${activeTab === tab.id 
                    ? 'border-teal-500 text-teal-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </nav>
      </div>

      <div className="p-6">
        {activeTab === 'infos' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-400 uppercase tracking-wider">Identité</h4>
                <div className="mt-2 text-lg font-semibold text-gray-900">{patient.nom}</div>
                <div className="text-sm text-gray-500">ID: {patient.patient_number}</div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-400 uppercase tracking-wider">Contact</h4>
                  <div className="mt-1 text-sm text-gray-900">{patient.email || 'Non renseigné'}</div>
                  <div className="text-sm text-gray-900">{patient.tel || 'Non renseigné'}</div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-400 uppercase tracking-wider">Naissance</h4>
                  <div className="mt-1 text-sm text-gray-900">{new Date(patient.dob).toLocaleDateString()}</div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-400 uppercase tracking-wider">Groupe Sanguin</h4>
                <div className="mt-1 text-sm font-medium px-2 py-1 bg-red-50 text-red-700 rounded inline-block">
                  {patient.group_sanguin || 'Inconnu'}
                </div>
              </div>
            </div>
            
            <div className="md:col-span-1 flex justify-center">
              <QRDisplay qrUrl={patient.qr_code_url} patientNumber={patient.patient_number} />
            </div>
          </div>
        )}

        {activeTab === 'medical' && (
          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-medium text-gray-400 uppercase tracking-wider">Allergies</h4>
              <div className="mt-2 flex flex-wrap gap-2">
                {patient.allergies?.length > 0 ? patient.allergies.map((allergy: string, idx: number) => (
                  <span key={idx} className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                    {allergy}
                  </span>
                )) : <span className="text-sm text-gray-500">Aucune allergie connue</span>}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-400 uppercase tracking-wider">Antécédents Critiques</h4>
              <div className="mt-2 text-sm text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-100">
                {patient.antecedents_critiques ? patient.antecedents_critiques : 'Aucun antécédent particulier'}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'rdv' && (
          <div className="text-center py-10 text-gray-500 px-4">
            Aucun rendez-vous à venir (Module RDV à implémenter).
          </div>
        )}

        {activeTab === 'ordonnances' && (
          <div className="text-center py-10 text-gray-500 px-4">
            Aucune prescription active (Module Ordonnance à implémenter).
          </div>
        )}
      </div>
    </div>
  )
}
