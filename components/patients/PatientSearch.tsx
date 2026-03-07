'use client'

import { useState, useEffect } from 'react'
import { searchPatientsAction } from '@/app/actions/patients'
import { Search } from 'lucide-react'

export function PatientSearch({ onSelectPatient }: { onSelectPatient?: (patientId: string) => void }) {
  const [query, setQuery] = useState('')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [results, setResults] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Custom hook logic for debouncing
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.trim().length > 1) {
        setIsLoading(true)
        const { patients } = await searchPatientsAction(query)
        setResults(patients || [])
        setIsLoading(false)
      } else {
        setResults([])
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [query])

  return (
    <div className="relative w-full max-w-md">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
          placeholder="Chercher nom, SC-..., tel"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {isLoading && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <span className="h-4 w-4 border-2 border-teal-500 border-t-transparent rounded-full animate-spin"></span>
          </div>
        )}
      </div>

      {results.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white shadow-lg rounded-md border border-gray-100 py-1 text-base overflow-auto sm:text-sm">
          {results.map((patient) => (
            <div
              key={patient.id}
              onClick={() => onSelectPatient && onSelectPatient(patient.id)}
              className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-teal-50"
            >
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-900 truncate">{patient.nom}</span>
                <span className="text-gray-500 text-xs ml-2">{patient.patient_number}</span>
              </div>
              <div className="text-gray-500 text-xs">{patient.tel || "Pas de tel"}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
