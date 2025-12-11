import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const LANGUAGE_NAMES: Record<string, string> = {
  'pt': 'Portuguese',
  'en': 'English',
  'fr': 'French',
  'de': 'German',
  'kriol': 'Guinea-Bissau Creole (Kriol)',
  'wo': 'Wolof'
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text, fromLang, toLang } = await req.json();
    
    if (!text || !fromLang || !toLang) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters: text, fromLang, toLang' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      console.error('LOVABLE_API_KEY is not configured');
      return new Response(
        JSON.stringify({ error: 'AI service not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const fromLangName = LANGUAGE_NAMES[fromLang] || fromLang;
    const toLangName = LANGUAGE_NAMES[toLang] || toLang;

    const systemPrompt = `You are an expert translator specializing in African languages, particularly Guinea-Bissau Creole (Kriol). 

IMPORTANT RULES:
1. Translate naturally and fluently, connecting words properly like a native speaker would
2. Preserve the meaning, tone, and intent of the original text
3. For Kriol, use the standard orthography (e.g., "kasa" not "casa", "tarbadju" not "trabalho")
4. Handle phrases, sentences, and long texts - not just word-by-word
5. If translating TO Kriol, use authentic Kriol expressions and idioms when appropriate
6. Return ONLY the translation, nothing else - no explanations, no quotes, no prefixes

Common Kriol vocabulary reference:
- Hello = Kuma di kurpu? / Kuma bu sta?
- Thank you = Obrigadu (m) / Obrigada (f)
- Yes = Sin / Ã©
- No = Nan
- House = Kasa
- Work = Tarbadju
- Food = Bianda / Kumida
- Water = Agu
- Good = Bon
- Bad = Ma
- Big = Grandi
- Small = Pekenu
- I = N / Ami
- You = Bu / Abo
- We = No / Anos
- They = Elis`;

    const userPrompt = `Translate the following text from ${fromLangName} to ${toLangName}:

"${text}"`;

    console.log(`Translating from ${fromLang} to ${toLang}: "${text.substring(0, 50)}..."`);

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again in a moment.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI service temporarily unavailable.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: 'Translation service error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    const translation = data.choices?.[0]?.message?.content?.trim() || '';

    console.log(`Translation result: "${translation.substring(0, 50)}..."`);

    return new Response(
      JSON.stringify({ 
        translation,
        source: 'ai',
        confidence: 0.95
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Translation error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
