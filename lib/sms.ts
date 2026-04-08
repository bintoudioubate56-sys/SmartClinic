import { Patient, Database } from '@/types/database.types';

type Appointment = Database['public']['Tables']['appointments']['Row'];
type Clinic = Database['public']['Tables']['clinics']['Row'];

async function sendSms(to: string, message: string) {
  const apiKey = process.env.AFRICAS_TALKING_API_KEY;
  const username = process.env.AFRICAS_TALKING_USERNAME || 'sandbox';

  if (!apiKey) {
    console.warn('AFRICAS_TALKING_API_KEY non configurée. SMS non envoyé.');
    return { success: false };
  }

  try {
    // Note: This is a placeholder for Africa's Talking official API call
    // Requires 'africastalking' package or raw fetch to their endpoint
    const response = await fetch('https://api.africastalking.com/version1/messaging', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
        'apikey': apiKey
      },
      body: new URLSearchParams({
        'username': username,
        'to': to,
        'message': message
      })
    });

    return { success: response.ok };
  } catch (error) {
    console.error('Erreur SMS Africa\'s Talking:', error);
    return { success: false };
  }
}

export async function sendSmsConfirmation(patient: Patient, appointment: Appointment, clinic: Clinic) {
  const date = new Date(appointment.scheduled_at).toLocaleDateString();
  const time = new Date(appointment.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const message = `Bonjour ${patient.first_name}, votre RDV à ${clinic.name} est prévu le ${date} à ${time}. Pour annuler: ${clinic.phone}. SmartClinic`;
  
  const res = await sendSms(patient.phone || '', message);
  return { smsFailed: !res.success };
}

export async function sendSmsCancellation(patient: Patient, appointment: Appointment, clinic: Clinic) {
  const date = new Date(appointment.scheduled_at).toLocaleDateString();
  const time = new Date(appointment.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const message = `Votre RDV du ${date} à ${time} a été annulé. Contactez-nous au ${clinic.phone}.`;
  
  const res = await sendSms(patient.phone || '', message);
  return { smsFailed: !res.success };
}
