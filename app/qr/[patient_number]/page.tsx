import { getPatientByNumberPublicAction } from '@/app/actions/patients'
import { AlertTriangle, Activity, User, FileWarning } from 'lucide-react'
import { notFound } from 'next/navigation'

export const metadata = {
  title: 'Accès d\'urgence Patient | SmartClinic',
}

export default async function UrgencyQRPage({ params }: { params: { patient_number: string } }) {
   const { patient, error } = await getPatientByNumberPublicAction(params.patient_number)

   if (error || !patient) {
       return notFound()
   }

   return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto space-y-6">
        
        {/* Urgent Warning Banner */}
        <div className="bg-red-600 rounded-xl p-4 flex items-start space-x-4 shadow-lg animate-pulse">
            <AlertTriangle className="text-white w-8 h-8 flex-shrink-0" />
            <div>
                <h2 className="text-lg font-bold text-white uppercase tracking-wider">Accès d&apos;urgence - Secours</h2>
                <p className="text-red-100 text-sm mt-1">
                    Ces données sont fournies uniquement pour une intervention médicale d&apos;urgence. 
                    Cet accès au dossier a été historisé (Audit Log).
                </p>
            </div>
        </div>

        {/* Patient Identity */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center space-x-3 mb-4 border-b pb-4">
                <User className="text-gray-400 w-6 h-6" />
                <h3 className="text-xl font-bold text-gray-900">Identité du patient</h3>
            </div>
            
            <div className="text-3xl font-extrabold text-gray-900 mb-2">
                {patient.nom}
            </div>
        </div>

        {/* Medical Vitals */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Blood Type */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-red-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 -mt-4 -mr-4 text-red-50 bg-red-600 rounded-full w-24 h-24 flex items-center justify-center opacity-10">
                    <Activity className="w-12 h-12" />
                </div>
                <div className="flex items-center space-x-2 text-red-600 mb-3">
                    <Activity className="w-5 h-5" />
                    <h3 className="font-semibold uppercase tracking-wider text-sm">Groupe sanguin</h3>
                </div>
                <div className="text-4xl font-extrabold text-gray-900">
                    {patient.group_sanguin || 'Inconnu'}
                </div>
            </div>

            {/* Allergies */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-yellow-100">
                <div className="flex items-center space-x-2 text-yellow-600 mb-3">
                    <AlertTriangle className="w-5 h-5" />
                    <h3 className="font-semibold uppercase tracking-wider text-sm">Allergies</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                    {patient.allergies?.length > 0 ? patient.allergies.map((allergy: string, idx: number) => (
                    <span key={idx} className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-md text-sm font-bold border border-yellow-200">
                        {allergy}
                    </span>
                    )) : <span className="text-gray-500 font-medium text-sm">Aucune allergie connue</span>}
                </div>
            </div>
        </div>

        {/* Critical Information */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center space-x-2 text-gray-600 mb-3 border-b pb-3">
                <FileWarning className="w-5 h-5" />
                <h3 className="font-semibold uppercase tracking-wider">Antécédents Critiques & Pathologies</h3>
            </div>
            <div className="text-gray-800 bg-gray-50 p-4 rounded-lg font-medium">
                {patient.antecedents_critiques ? patient.antecedents_critiques : 'Aucun antécédent critique renseigné.'}
            </div>
        </div>

      </div>
    </div>
   )
}
