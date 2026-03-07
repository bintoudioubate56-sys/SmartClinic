'use client'

import { useState } from 'react'
import { PatientForm } from '@/components/patients/PatientForm'
import { PatientSearch } from '@/components/patients/PatientSearch'
import { PatientCard } from '@/components/patients/PatientCard'
import { getPatientAction } from '@/app/actions/patients'
import { Users, UserPlus, Search } from 'lucide-react'

export default function ReceptionPatientsPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectedPatient, setSelectedPatient] = useState<any>(null)
  const [showForm, setShowForm] = useState(false)

  const handleSelectPatient = async (id: string) => {
    const { patient } = await getPatientAction(id)
    if (patient) {
      setSelectedPatient(patient)
      setShowForm(false)
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleCreateSuccess = (newPatient: any) => {
    setSelectedPatient(newPatient)
    setShowForm(false)
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Patients</h1>
          <p className="text-gray-500 mt-1">Recherchez ou créez de nouveaux dossiers patients.</p>
        </div>
        <button
          onClick={() => {
            setShowForm(!showForm)
            setSelectedPatient(null)
          }}
          className="flex items-center space-x-2 bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors"
        >
          {showForm ? (
            <>
              <Search className="w-5 h-5" />
              <span>Rechercher</span>
            </>
          ) : (
            <>
              <UserPlus className="w-5 h-5" />
              <span>Nouveau Patient</span>
            </>
          )}
        </button>
      </div>

      <div className="flex flex-col space-y-6">
        {!showForm && !selectedPatient && (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
            <Users className="w-16 h-16 text-gray-300 mb-4" />
            <h2 className="text-xl font-medium text-gray-900">Commencez par rechercher un patient</h2>
            <div className="mt-6 w-full max-w-md px-4">
              <PatientSearch onSelectPatient={handleSelectPatient} />
            </div>
          </div>
        )}

        {(showForm || selectedPatient) && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                  <Search className="w-5 h-5 text-teal-600" />
                  <span>Recherche rapide</span>
                </h3>
                <PatientSearch onSelectPatient={handleSelectPatient} />
              </div>
            </div>

            <div className="lg:col-span-2">
              {showForm ? (
                <PatientForm onSuccess={handleCreateSuccess} />
              ) : (
                selectedPatient && <PatientCard patient={selectedPatient} />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
