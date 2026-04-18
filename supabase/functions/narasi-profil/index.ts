// AI assist: rangkai narasi storytelling profil dari field terpisah
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const { full_name, asal_daerah, keunikan_daerah, inspirasi_guru, tujuan_profesional } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) throw new Error('LOVABLE_API_KEY tidak tersedia');

    const userPrompt = `Susun narasi storytelling profil mahasiswa PPG Prajabatan dalam 3-4 paragraf akademik yang mengalir dan reflektif. Gunakan sudut pandang orang pertama ("saya"). Hindari bullet point dan heading.

DATA:
- Nama: ${full_name || '-'}
- Asal daerah: ${asal_daerah || '-'}
- Keunikan daerah: ${keunikan_daerah || '-'}
- Inspirasi menjadi guru: ${inspirasi_guru || '-'}
- Tujuan profesional: ${tujuan_profesional || '-'}

Gabungkan informasi tersebut menjadi narasi yang utuh, hangat, dan menunjukkan kedalaman refleksi. Jangan menambahkan informasi yang tidak diberikan.`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-3-flash-preview',
        messages: [
          { role: 'system', content: 'Anda adalah penulis akademik yang membantu mahasiswa PPG menyusun narasi profil portofolio yang reflektif dan profesional dalam Bahasa Indonesia.' },
          { role: 'user', content: userPrompt },
        ],
      }),
    });

    if (response.status === 429) {
      return new Response(JSON.stringify({ error: 'Terlalu banyak permintaan, coba lagi sebentar.' }), { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
    if (response.status === 402) {
      return new Response(JSON.stringify({ error: 'Kredit AI habis. Silakan top up di Lovable Cloud.' }), { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
    if (!response.ok) {
      const t = await response.text();
      console.error('AI gateway error:', response.status, t);
      return new Response(JSON.stringify({ error: 'AI gateway error' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const json = await response.json();
    const narasi = json.choices?.[0]?.message?.content || '';

    return new Response(JSON.stringify({ narasi }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (e) {
    console.error('narasi-profil error:', e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : 'Unknown error' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
