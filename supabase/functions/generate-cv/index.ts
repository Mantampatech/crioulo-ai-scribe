import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { formData, format, country, language } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: 'AI service not configured' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const systemPrompt = `Você é um especialista em recursos humanos e redação de currículos profissionais com mais de 20 anos de experiência. Transforme as informações brutas do utilizador num currículo profissional impecável.

Regras obrigatórias:
1. Reescreva a frase de apresentação/objetivo de forma profissional, impactante e no idioma solicitado
2. Melhore as descrições de funções usando verbos de ação fortes (liderou, desenvolveu, implementou, geriu, aumentou...)
3. Adapte o tom, estrutura e vocabulário ao país de destino e cultura profissional local
4. Para candidaturas nos EUA/Canadá: NUNCA inclua foto, data de nascimento ou estado civil (tem_foto=false)
5. Para formato Europass: siga o template oficial europeu
6. Ordene as secções na ordem mais valorizada no país de destino
7. Mantenha conciso mas completo — máximo 2 páginas
8. Adicione palavras-chave relevantes para ATS
9. Se uma secção estiver vazia, devolve array vazio
10. Use o idioma solicitado para TODOS os textos gerados`;

    const userPrompt = `Cria um currículo profissional com estes dados:
- País de destino: ${country}
- Idioma do currículo: ${language}
- Formato: ${format}
- Dados do utilizador: ${JSON.stringify(formData)}`;

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
        tools: [{
          type: 'function',
          function: {
            name: 'build_cv',
            description: 'Devolve o currículo estruturado',
            parameters: {
              type: 'object',
              properties: {
                nome: { type: 'string' },
                titulo: { type: 'string' },
                contactos: {
                  type: 'object',
                  properties: {
                    email: { type: 'string' },
                    telefone: { type: 'string' },
                    localizacao: { type: 'string' },
                    linkedin: { type: 'string' },
                    website: { type: 'string' }
                  }
                },
                apresentacao: { type: 'string' },
                experiencia: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      cargo: { type: 'string' },
                      empresa: { type: 'string' },
                      periodo: { type: 'string' },
                      descricao: { type: 'array', items: { type: 'string' } }
                    },
                    required: ['cargo', 'empresa', 'periodo', 'descricao']
                  }
                },
                educacao: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      grau: { type: 'string' },
                      instituicao: { type: 'string' },
                      ano: { type: 'string' }
                    },
                    required: ['grau', 'instituicao', 'ano']
                  }
                },
                competencias: { type: 'array', items: { type: 'string' } },
                idiomas: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      idioma: { type: 'string' },
                      nivel: { type: 'string' }
                    },
                    required: ['idioma', 'nivel']
                  }
                },
                certificacoes: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      nome: { type: 'string' },
                      instituicao: { type: 'string' },
                      ano: { type: 'string' }
                    },
                    required: ['nome', 'instituicao', 'ano']
                  }
                },
                tem_foto: { type: 'boolean' },
                section_labels: {
                  type: 'object',
                  description: 'Etiquetas das secções no idioma solicitado',
                  properties: {
                    apresentacao: { type: 'string' },
                    experiencia: { type: 'string' },
                    educacao: { type: 'string' },
                    competencias: { type: 'string' },
                    idiomas: { type: 'string' },
                    certificacoes: { type: 'string' },
                    contactos: { type: 'string' }
                  }
                }
              },
              required: ['nome', 'titulo', 'contactos', 'apresentacao', 'experiencia', 'educacao', 'competencias', 'idiomas', 'tem_foto', 'section_labels']
            }
          }
        }],
        tool_choice: { type: 'function', function: { name: 'build_cv' } },
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: 'Demasiados pedidos. Tenta novamente em alguns segundos.' }), {
          status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: 'Serviço de IA temporariamente indisponível (créditos esgotados).' }), {
          status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
      const t = await response.text();
      console.error('AI error', response.status, t);
      return new Response(JSON.stringify({ error: 'Erro na geração do CV' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) {
      return new Response(JSON.stringify({ error: 'Resposta inválida da IA' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    const cv = JSON.parse(toolCall.function.arguments);

    return new Response(JSON.stringify({ cv }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (e) {
    console.error('generate-cv error', e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : 'Erro desconhecido' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
