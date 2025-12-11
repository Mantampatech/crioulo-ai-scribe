import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Comprehensive Crioulo linguistic context from dictionaries
const CRIOULO_CONTEXT = `
## GUINEENSE/KRIOL - Crioulo da Guiné-Bissau

### Grafia e Fonologia:
- "k" sempre para som /k/ (kasa, kume, karu)
- "dj" para som /ʤ/ (djuda, djungutu, djuntis)
- "tch" para som /ʧ/ (tchora, tchuba, tchon)
- "ñ" para nasal palatal (ñambi = inhame)
- "n'" para pronome "eu" e nasal velar (n' bai = eu vou)
- "y" para semivogal (yabri = abrir, yagu = água)
- "x" para /ʃ/ (xa = chá, bixiga = bexiga)

### Pronomes Pessoais:
- N' / Ami = eu
- Bu / Bo = tu
- I / El = ele/ela
- No / Anos = nós
- Bos = vocês
- Elis = eles/elas

### Estrutura Gramatical:
- "ta" indica ação habitual: N' ta kume = Eu como (habitualmente)
- "na" indica ação progressiva: N' na kume = Estou comendo
- "ka" é negação: N' ka kre = Eu não quero
- Morfema "-ba" indica passado: N' kumeba = Eu comi
- Preposição "di" = de
- Preposição "pa" = para
- Preposição "ku" = com
- Preposição "na" = em

### Vocabulário Essencial (Português → Kriol):
Substantivos:
- casa = kasa, água = yagu, comida = bianda, trabalho = tarbadju
- homem = omi, mulher = mindjer, criança = mininu
- pai = pape, mãe = mame, filho = fidju, amigo = amigu
- aldeia = tabanka, terra = tera/tchon, mar = mar
- peixe = pis, arroz = arus, chuva = tchuba, sol = sol
- escola = skola, dinheiro = pataka/diñeru
- roupa = ropa, porta = porta, janela = djanela
- cabeça = kabesa, mão = mon, pé = pe, olho = odju
- coração = kurason, boca = boka, orelha = oredja
- faca = faka, fogo = fugu, noite = noti, dia = dia
- carro = karu, barco = barku, avião = avion
- irmão = ermon, irmã = ermon-femia, avô = dona

Verbos:
- ser/estar = i/sta, ter = tene, fazer = fasi
- ir = bai, vir = bin, ver = odja, falar = papia
- comer = kume, beber = bibi, dormir = durmi
- querer = kre/misti, poder = pudi, saber = sibi
- trabalhar = tarbadja, ajudar = djuda, amar = ama
- abrir = yabri/abri, fechar = fitcha, entrar = yentra
- chegar = tchiga, acordar = korda/filanta
- comprar = kumpra, vender = bindi, dar = da
- chorar = tchora, rir = ri, correr = kori
- ouvir = obi, andar = anda, sentar = sinta
- levantar = lanta, cozinhar = kusiña, lavar = laba
- aceitar = seta, receber = risibi, encontrar = nkontra

Adjetivos:
- bom = bon, mau = mau, grande = grandi, pequeno = pekenu
- bonito = bonitu, feio = fiu, novo = nobu, velho = bedju
- quente = kinti, frio = friu, difícil = difisil
- fácil = fasil, alto = altu, baixo = baxu
- doente = duenti, saudável = saudi, feliz = kontenti
- triste = tristi, cansado = kansadu, rico = riku

Advérbios/Expressões:
- sim = sin, não = ka, hoje = aos, ontem = aonti
- amanhã = amaña, agora = gosi, aqui = li, ali = la
- muito = tchiu/muitu, pouco = poku, bem = bon
- como = kuma, onde = undi/nunde, quando = kantu
- porque = pabia, depois = dipus, antes = antis
- sempre = sempri, nunca = nunka, já = dja

### Frases Comuns:
- Como estás? = Kuma ku bu sta?
- Estou bem = N' sta bon
- Obrigado = Obrigadu
- De nada = Ka i nada
- Bom dia = Bon dia
- Boa tarde = Bon tardi
- Boa noite = Bon noti
- Até logo = Te logu
- Vou à casa = N' na bai kasa
- Eu te amo = N' ta ama-u
- Quanto custa? = Kantu ki ta kusta?
- Eu não entendo = N' ka ta intindi
- Fala mais devagar = Papia mas dibagar
- Qual é o teu nome? = Kuma ki bu tchoma?
- O meu nome é... = Ña nomi i...
- Onde moras? = Undi ku bu mora?
- Eu moro em... = N' mora na...
`;

const LANGUAGE_NAMES: Record<string, string> = {
  'pt': 'Português',
  'en': 'Inglês',
  'fr': 'Francês',
  'de': 'Alemão',
  'kriol': 'Crioulo da Guiné-Bissau (Guineense/Kriol)',
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

    const systemPrompt = `Você é um tradutor especialista em Crioulo da Guiné-Bissau (Guineense/Kriol), treinado com dicionários bilíngues acadêmicos incluindo o "Dicionário do Guineense" de Luigi Scantamburlo e o "Dicionário Bilíngue Português-Crioulo" de Cirineu Cecote Stein.

${CRIOULO_CONTEXT}

REGRAS DE TRADUÇÃO OBRIGATÓRIAS:
1. Traduza de forma NATURAL e INTELIGENTE, conectando palavras em frases coerentes como um falante nativo
2. Use a grafia padrão do Kriol (k em vez de c/q, dj, tch, y, etc.)
3. Para frases longas, traduza o SENTIDO COMPLETO, não palavra por palavra
4. Mantenha expressões idiomáticas quando possível, adaptando para equivalentes naturais
5. Se não souber uma palavra específica, use uma aproximação natural baseada no contexto
6. RETORNE APENAS A TRADUÇÃO, sem explicações, aspas ou prefixos
7. Preserve o tom e a intenção do texto original
8. Para textos em Kriol, aceite variações ortográficas comuns (ex: kaza/kasa, mindjer/minjer)`;

    const userPrompt = `Traduza o seguinte texto de ${fromLangName} para ${toLangName}:

"${text}"

Retorne APENAS a tradução, nada mais.`;

    console.log(`Translating from ${fromLang} to ${toLang}: "${text.substring(0, 100)}..."`);

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
        temperature: 0.3,
        max_tokens: 4000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Limite de requisições excedido. Tente novamente em alguns segundos.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Serviço de IA temporariamente indisponível.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: 'Erro no serviço de tradução' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    const translation = data.choices?.[0]?.message?.content?.trim() || '';

    if (!translation) {
      throw new Error('Tradução vazia recebida');
    }

    console.log(`Translation result: "${translation.substring(0, 100)}..."`);

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
      JSON.stringify({ error: error instanceof Error ? error.message : 'Erro desconhecido' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
