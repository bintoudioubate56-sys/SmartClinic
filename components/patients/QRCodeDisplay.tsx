'use client'

import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';

export default function QRCodeDisplay({ qrToken, patientName }: { qrToken: string; patientName: string }) {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  useEffect(() => {
    const generateQR = async () => {
      try {
        const domain = typeof window !== 'undefined' ? window.location.origin : '';
        const url = `${domain}/emergency/${qrToken}`;
        const dataUrl = await QRCode.toDataURL(url, {
          width: 400,
          margin: 2,
          color: {
            dark: '#0f172a', // Slate 900
            light: '#ffffff',
          },
        });
        setQrDataUrl(dataUrl);
      } catch (err) {
        console.error('QR Generation Error:', err);
      }
    };

    generateQR();
  }, [qrToken]);

  const downloadQR = () => {
    const link = document.createElement('a');
    link.href = qrDataUrl;
    link.download = `QR_URGENCE_${patientName.toUpperCase().replace(/\s+/g, '_')}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col items-center gap-6 p-8 bg-white border border-slate-100 rounded-3xl shadow-xl shadow-slate-100/50">
      <div className="text-center">
        <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-1">Code QR Secours</h3>
        <p className="text-[10px] text-slate-300 font-bold uppercase tracking-tight">Accès immédiat aux données vitales</p>
      </div>

      <div className="relative group p-4 bg-slate-50 rounded-2xl border border-slate-100">
        {qrDataUrl ? (
          <img src={qrDataUrl} alt="Patient QR Code" className="w-48 h-48 rounded-lg shadow-inner" />
        ) : (
          <div className="w-48 h-48 bg-slate-100 animate-pulse rounded-lg flex items-center justify-center text-slate-300">
            Génération...
          </div>
        )}
        <div className="absolute inset-0 bg-indigo-600/0 group-hover:bg-indigo-600/5 transition-all rounded-lg pointer-events-none" />
      </div>

      <button
        onClick={downloadQR}
        disabled={!qrDataUrl}
        className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-indigo-50 text-indigo-700 rounded-2xl font-black hover:bg-indigo-600 hover:text-white transition-all shadow-sm disabled:opacity-50"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
        <span className="text-sm uppercase tracking-widest">Télécharger PNG</span>
      </button>

      <p className="max-w-[200px] text-center text-[10px] text-slate-400 font-medium leading-relaxed italic">
        À imprimer sur la carte du patient ou à coller au dos du téléphone.
      </p>
    </div>
  );
}
