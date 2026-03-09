'use client'

import { Download } from 'lucide-react'

import Image from 'next/image'

export function QRDisplay({ qrUrl, patientNumber }: { qrUrl: string, patientNumber: string }) {
  if (!qrUrl) {
    return (
      <div className="flex flex-col items-center justify-center h-48 bg-gray-50 border border-dashed border-gray-300 rounded-lg">
        <p className="text-sm text-gray-500">Génération du QR Code en cours...</p>
      </div>
    )
  }

  const downloadQR = async () => {
    try {
      const response = await fetch(qrUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `QR-${patientNumber}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erreur lors du téléchargement du QR code:', error);
    }
  }

  return (
    <div className="flex flex-col items-center space-y-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
      <h4 className="font-semibold text-gray-800">Scan d&apos;urgence</h4>
      <div className="relative w-48 h-48 bg-white border border-gray-200 rounded-lg overflow-hidden flex items-center justify-center p-2">
        <Image
          src={qrUrl}
          alt={`QR Code Patient ${patientNumber}`}
          width={192}
          height={192}
          className="w-full h-full object-contain"
          unoptimized={true}
        />
      </div>
      <button
        onClick={downloadQR}
        className="flex items-center space-x-2 text-sm text-teal-600 hover:text-teal-700 font-medium px-4 py-2 bg-teal-50 rounded-lg hover:bg-teal-100 transition-colors"
      >
        <Download className="w-4 h-4" />
        <span>Télécharger carte PVC</span>
      </button>
    </div>
  )
}
