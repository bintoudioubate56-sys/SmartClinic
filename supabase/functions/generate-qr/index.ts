import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3"
import * as QRCode from "https://esm.sh/qrcode@1.5.3"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { patient_id, patient_number } = await req.json()
    
    if (!patient_id || !patient_number) {
        return new Response(JSON.stringify({ error: 'Missing patient_id or patient_number' }), { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
            status: 400 
        })
    }

    // SC-YYYY-XXXXX -> We add an emergency token uniquely identifying this specific card version
    const emergency_token = crypto.randomUUID()
    
    // Encode object according to user request
    const qrData = JSON.stringify({ patient_number, emergency_token })
    
    // Generate QR (Data URI base64)
    const qrDataUri = await QRCode.toDataURL(qrData)
    const base64Data = qrDataUri.replace(/^data:image\/png;base64,/, "")
    const binaryData = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0))

    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    const supabase = createClient(supabaseUrl, supabaseKey)

    const fileName = `${patient_number}-${emergency_token}.png`

    // Upload image to 'qr-codes' bucket
    const { error: uploadError } = await supabase
        .storage
        .from('qr-codes')
        .upload(fileName, binaryData, {
            contentType: 'image/png',
            upsert: true
        })

    if (uploadError) {
        throw uploadError
    }

    // Get public URL using the bucket
    const { data: publicUrlData } = supabase.storage.from('qr-codes').getPublicUrl(fileName)
    const qr_code_url = publicUrlData.publicUrl

    // Update the patient row with this URL
    const { error: updateError } = await supabase
        .from('patients')
        .update({ qr_code_url })
        .eq('id', patient_id)

    if (updateError) {
        throw updateError
    }

    return new Response(JSON.stringify({ success: true, qr_code_url }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
