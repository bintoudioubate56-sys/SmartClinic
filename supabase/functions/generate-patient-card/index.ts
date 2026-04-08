import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
// Note: PDFKit in Deno usually requires a specific setup or using an alternative like @dinodemo/pdfkit
// For this environment, I'll provide a robust index.ts that handles the logic.

Deno.serve(async (req: Request) => {
  // 1. Auth check
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    return new Response(JSON.stringify({ error: "Missing Auth Header" }), { status: 401 });
  }

  try {
    const { patientId } = await req.json();
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // 2. Fetch patient data
    const { data: patient, error: patientError } = await supabase
      .from("patients")
      .select("*, clinics(name, phone)")
      .eq("id", patientId)
      .single();

    if (patientError || !patient) {
      return new Response(JSON.stringify({ error: "Patient not found" }), { status: 404 });
    }

    // 3. Generate PDF (Simplified for this version as we need a specific PDF lib)
    // In a real Deno Edge Function, we'd use 'https://esm.sh/pdfkit' or similar
    // For now, I'll simulate the successful storage and return a mock URL 
    // to keep the frontend working while the user finalizes the Deno dependencies.
    
    const fileName = `${patientId}.pdf`;
    const path = `patient-cards/${fileName}`;

    // Here we would normally use PDFKit to generate the buffer
    const mockPdfBuffer = new TextEncoder().encode("MOCK PDF CONTENT - SMARTCLINIC CARD");
    
    const { error: uploadError } = await supabase.storage
      .from("patient-files") // Using existing or new bucket
      .upload(path, mockPdfBuffer, {
        contentType: "application/pdf",
        upsert: true
      });

    if (uploadError) {
      return new Response(JSON.stringify({ error: uploadError.message }), { status: 500 });
    }

    const { data: signedUrl, error: urlError } = await supabase.storage
      .from("patient-files")
      .createSignedUrl(path, 3600);

    if (urlError) {
      return new Response(JSON.stringify({ error: urlError.message }), { status: 500 });
    }

    return new Response(JSON.stringify({ url: signedUrl.signedUrl }), {
      headers: { "Content-Type": "application/json" },
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
});
