// Pre-loaded vocabulary from the dictionaries
// This provides immediate functionality without requiring database setup

export interface VocabularyEntry {
  word: string;
  translation: string;
  variations: string[];
  targetLang: string;
  examples: { original: string; translated: string }[];
  category: string;
  frequency: number;
}

// Portuguese → Crioulo vocabulary (extracted from the dictionaries)
export const ptToKriol: VocabularyEntry[] = [
  { word: "aba", translation: "kapa", variations: ["capa"], targetLang: "kriol", examples: [{ original: "A aba do meu chapéu é branca", translated: "Kapa di ña tchapeu i branku" }], category: "substantivo", frequency: 10 },
  { word: "abacate", translation: "abakati", variations: [], targetLang: "kriol", examples: [{ original: "Comi abacate hoje", translated: "N' kume abakati aos" }], category: "substantivo", frequency: 5 },
  { word: "abacaxi", translation: "ananas", variations: [], targetLang: "kriol", examples: [{ original: "Suco de abacaxi é saboroso", translated: "Sumu di ananas sabi" }], category: "substantivo", frequency: 8 },
  { word: "abaixar", translation: "djungutu", variations: [], targetLang: "kriol", examples: [{ original: "O menino se abaixou para pegar a fruta", translated: "Mininu djungutu pa paña fruta" }], category: "verbo", frequency: 12 },
  { word: "abaixo", translation: "bas di", variations: [], targetLang: "kriol", examples: [{ original: "O sapato está debaixo da cama", translated: "Sapatu sta bas di kama" }], category: "advérbio", frequency: 20 },
  { word: "abandonado", translation: "bandonadu", variations: [], targetLang: "kriol", examples: [{ original: "O filho da minha tia foi abandonado", translated: "Fidju di ña tia bandonadu" }], category: "adjetivo", frequency: 7 },
  { word: "abandonar", translation: "bandona", variations: [], targetLang: "kriol", examples: [{ original: "Não os abandones", translated: "Ka bu bandona elis" }], category: "verbo", frequency: 15 },
  { word: "abater", translation: "bati", variations: ["mata"], targetLang: "kriol", examples: [{ original: "Matar os animais para comer ou vender", translated: "Bati limarias pa bai kume o bindi" }], category: "verbo", frequency: 9 },
  { word: "abdômen", translation: "bariga", variations: [], targetLang: "kriol", examples: [{ original: "O abdômen de alguém", translated: "Bariga di algin" }], category: "substantivo", frequency: 18 },
  { word: "abelha", translation: "bagera", variations: [], targetLang: "kriol", examples: [{ original: "Abelha que tem colmeia", translated: "Bagera ki ta tene kumbu di mel" }], category: "substantivo", frequency: 6 },
  { word: "abençoar", translation: "bensua", variations: ["abensua"], targetLang: "kriol", examples: [{ original: "Os velhos abençoam o meu filho", translated: "Garandis bensua ña fidju" }], category: "verbo", frequency: 11 },
  { word: "abertura", translation: "abertura", variations: ["braku"], targetLang: "kriol", examples: [{ original: "A abertura da porta é larga", translated: "Abertura di porta largu" }], category: "substantivo", frequency: 8 },
  { word: "abóbora", translation: "bobra", variations: ["abobra"], targetLang: "kriol", examples: [{ original: "Cozinhar a abóbora para comer", translated: "Kusiña bobra pa kume" }], category: "substantivo", frequency: 7 },
  { word: "aborrecer", translation: "burisi", variations: ["nerva", "satia"], targetLang: "kriol", examples: [{ original: "A minha mãe aborrece o meu pai", translated: "Ña mame ta burisi ña pape" }], category: "verbo", frequency: 13 },
  { word: "aborrecido", translation: "nervozu", variations: ["burisidu"], targetLang: "kriol", examples: [{ original: "Estou aborrecido com o resultado", translated: "N'sta nervozu ku ruzultadu" }], category: "adjetivo", frequency: 10 },
  { word: "abortar", translation: "tira bariga", variations: ["dismantcha bariga"], targetLang: "kriol", examples: [{ original: "A moça abortou", translated: "Badjuda tira bariga" }], category: "verbo", frequency: 4 },
  { word: "abraçar", translation: "barsa", variations: ["ngoti"], targetLang: "kriol", examples: [{ original: "Abracei o meu amigo", translated: "N' barsa ña amigu" }], category: "verbo", frequency: 16 },
  { word: "abrigar", translation: "moranta", variations: ["abriga", "gasidja"], targetLang: "kriol", examples: [{ original: "Abriguei a minha namorada", translated: "N' moranta ña badjuda" }], category: "verbo", frequency: 5 },
  { word: "abrigo", translation: "abrigu", variations: ["kau di sukundi"], targetLang: "kriol", examples: [{ original: "Precisamos de um abrigo na selva", translated: "No misti kau di sukundi na matu" }], category: "substantivo", frequency: 6 },
  { word: "abril", translation: "abril", variations: [], targetLang: "kriol", examples: [{ original: "O mês de abril está quente este ano", translated: "Mis di abril kinti es anu" }], category: "substantivo", frequency: 12 },
  { word: "abrir", translation: "yabri", variations: ["abri"], targetLang: "kriol", examples: [{ original: "Abra a porta para eu entrar", translated: "Abri porta pa n' yentra" }], category: "verbo", frequency: 45 },
  { word: "casa", translation: "kasa", variations: ["kaza"], targetLang: "kriol", examples: [{ original: "A minha casa é bonita", translated: "Ña kasa bonitu" }], category: "substantivo", frequency: 100 },
  { word: "homem", translation: "omi", variations: ["homi", "omis"], targetLang: "kriol", examples: [{ original: "O homem trabalha", translated: "Omi ta tarbadja" }], category: "substantivo", frequency: 85 },
  { word: "mulher", translation: "mindjer", variations: ["minjer", "mudjer"], targetLang: "kriol", examples: [{ original: "A mulher cozinha", translated: "Mindjer ta kusiña" }], category: "substantivo", frequency: 80 },
  { word: "criança", translation: "mininu", variations: ["mininu-mininu"], targetLang: "kriol", examples: [{ original: "A criança brinca", translated: "Mininu ta brinka" }], category: "substantivo", frequency: 70 },
  { word: "água", translation: "agu", variations: ["afo"], targetLang: "kriol", examples: [{ original: "Beber água", translated: "Bibi agu" }], category: "substantivo", frequency: 90 },
  { word: "comida", translation: "bianda", variations: ["kumida"], targetLang: "kriol", examples: [{ original: "A comida está pronta", translated: "Bianda pronto" }], category: "substantivo", frequency: 75 },
  { word: "trabalho", translation: "tarbadju", variations: ["trabalho"], targetLang: "kriol", examples: [{ original: "Vou ao trabalho", translated: "N' bai na tarbadju" }], category: "substantivo", frequency: 65 },
  { word: "amigo", translation: "amigu", variations: [], targetLang: "kriol", examples: [{ original: "Meu amigo chegou", translated: "Ña amigu tchiga" }], category: "substantivo", frequency: 60 },
  { word: "família", translation: "familia", variations: [], targetLang: "kriol", examples: [{ original: "A minha família é grande", translated: "Ña familia grandi" }], category: "substantivo", frequency: 55 },
  { word: "mãe", translation: "mame", variations: ["mama"], targetLang: "kriol", examples: [{ original: "A minha mãe", translated: "Ña mame" }], category: "substantivo", frequency: 88 },
  { word: "pai", translation: "pape", variations: ["papa"], targetLang: "kriol", examples: [{ original: "O meu pai", translated: "Ña pape" }], category: "substantivo", frequency: 85 },
  { word: "filho", translation: "fidju", variations: [], targetLang: "kriol", examples: [{ original: "O meu filho", translated: "Ña fidju" }], category: "substantivo", frequency: 70 },
  { word: "olá", translation: "ola", variations: ["oi"], targetLang: "kriol", examples: [{ original: "Olá, como estás?", translated: "Ola, kuma ku bu sta?" }], category: "interjeição", frequency: 95 },
  { word: "bom dia", translation: "bon dia", variations: [], targetLang: "kriol", examples: [{ original: "Bom dia para todos", translated: "Bon dia pa tudu" }], category: "interjeição", frequency: 90 },
  { word: "obrigado", translation: "obrigadu", variations: [], targetLang: "kriol", examples: [{ original: "Muito obrigado", translated: "Obrigadu tchiu" }], category: "interjeição", frequency: 88 },
  { word: "sim", translation: "sin", variations: [], targetLang: "kriol", examples: [{ original: "Sim, eu vou", translated: "Sin, n' na bai" }], category: "advérbio", frequency: 95 },
  { word: "não", translation: "ka", variations: [], targetLang: "kriol", examples: [{ original: "Não quero", translated: "N' ka kre" }], category: "advérbio", frequency: 98 },
  { word: "comer", translation: "kume", variations: [], targetLang: "kriol", examples: [{ original: "Vou comer", translated: "N' na kume" }], category: "verbo", frequency: 85 },
  { word: "beber", translation: "bibi", variations: [], targetLang: "kriol", examples: [{ original: "Beber água", translated: "Bibi agu" }], category: "verbo", frequency: 80 },
  { word: "dormir", translation: "durmi", variations: [], targetLang: "kriol", examples: [{ original: "Vou dormir", translated: "N' na durmi" }], category: "verbo", frequency: 75 },
  { word: "ir", translation: "bai", variations: [], targetLang: "kriol", examples: [{ original: "Eu vou", translated: "N' na bai" }], category: "verbo", frequency: 92 },
  { word: "vir", translation: "bin", variations: [], targetLang: "kriol", examples: [{ original: "Ele veio", translated: "I bin" }], category: "verbo", frequency: 88 },
  { word: "falar", translation: "papia", variations: [], targetLang: "kriol", examples: [{ original: "Falar Crioulo", translated: "Papia Kriol" }], category: "verbo", frequency: 82 },
  { word: "ver", translation: "odja", variations: [], targetLang: "kriol", examples: [{ original: "Eu vi", translated: "N' odja" }], category: "verbo", frequency: 78 },
  { word: "bonito", translation: "bonitu", variations: ["bunitu"], targetLang: "kriol", examples: [{ original: "É bonito", translated: "I bonitu" }], category: "adjetivo", frequency: 65 },
  { word: "grande", translation: "grandi", variations: [], targetLang: "kriol", examples: [{ original: "A casa é grande", translated: "Kasa grandi" }], category: "adjetivo", frequency: 70 },
  { word: "pequeno", translation: "pekenu", variations: ["pikinu"], targetLang: "kriol", examples: [{ original: "O menino é pequeno", translated: "Mininu pekenu" }], category: "adjetivo", frequency: 68 },
  { word: "bom", translation: "bon", variations: [], targetLang: "kriol", examples: [{ original: "É bom", translated: "I bon" }], category: "adjetivo", frequency: 90 },
  { word: "mau", translation: "mau", variations: [], targetLang: "kriol", examples: [{ original: "É mau", translated: "I mau" }], category: "adjetivo", frequency: 60 },
  { word: "dia", translation: "dia", variations: [], targetLang: "kriol", examples: [{ original: "Bom dia", translated: "Bon dia" }], category: "substantivo", frequency: 85 },
  { word: "noite", translation: "noti", variations: [], targetLang: "kriol", examples: [{ original: "Boa noite", translated: "Bon noti" }], category: "substantivo", frequency: 80 },
  { word: "sol", translation: "sol", variations: [], targetLang: "kriol", examples: [{ original: "O sol está forte", translated: "Sol forti" }], category: "substantivo", frequency: 55 },
  { word: "chuva", translation: "tchuba", variations: [], targetLang: "kriol", examples: [{ original: "A chuva caiu", translated: "Tchuba kai" }], category: "substantivo", frequency: 50 },
  { word: "terra", translation: "tera", variations: ["tchon"], targetLang: "kriol", examples: [{ original: "A minha terra", translated: "Ña tera" }], category: "substantivo", frequency: 60 },
  { word: "mar", translation: "mar", variations: [], targetLang: "kriol", examples: [{ original: "O mar é azul", translated: "Mar azul" }], category: "substantivo", frequency: 45 },
  { word: "peixe", translation: "pis", variations: ["pixi"], targetLang: "kriol", examples: [{ original: "Comer peixe", translated: "Kume pis" }], category: "substantivo", frequency: 65 },
  { word: "arroz", translation: "aros", variations: [], targetLang: "kriol", examples: [{ original: "Arroz com peixe", translated: "Aros ku pis" }], category: "substantivo", frequency: 75 },
  { word: "pão", translation: "pan", variations: [], targetLang: "kriol", examples: [{ original: "Comer pão", translated: "Kume pan" }], category: "substantivo", frequency: 60 },
  { word: "dinheiro", translation: "pataka", variations: ["dinheru"], targetLang: "kriol", examples: [{ original: "Preciso de dinheiro", translated: "N' misti pataka" }], category: "substantivo", frequency: 70 },
  { word: "escola", translation: "skola", variations: [], targetLang: "kriol", examples: [{ original: "Ir à escola", translated: "Bai skola" }], category: "substantivo", frequency: 65 },
  { word: "livro", translation: "libru", variations: [], targetLang: "kriol", examples: [{ original: "Ler o livro", translated: "Lidji libru" }], category: "substantivo", frequency: 55 },
  { word: "rua", translation: "rua", variations: ["strada"], targetLang: "kriol", examples: [{ original: "Na rua", translated: "Na rua" }], category: "substantivo", frequency: 50 },
  { word: "carro", translation: "karu", variations: [], targetLang: "kriol", examples: [{ original: "O meu carro", translated: "Ña karu" }], category: "substantivo", frequency: 55 },
  { word: "barco", translation: "barku", variations: [], targetLang: "kriol", examples: [{ original: "O barco é grande", translated: "Barku grandi" }], category: "substantivo", frequency: 45 },
  { word: "querer", translation: "kre", variations: [], targetLang: "kriol", examples: [{ original: "Eu quero", translated: "N' kre" }], category: "verbo", frequency: 90 },
  { word: "poder", translation: "pudi", variations: [], targetLang: "kriol", examples: [{ original: "Eu posso", translated: "N' pudi" }], category: "verbo", frequency: 85 },
  { word: "saber", translation: "sibi", variations: [], targetLang: "kriol", examples: [{ original: "Eu sei", translated: "N' sibi" }], category: "verbo", frequency: 80 },
  { word: "ter", translation: "tene", variations: [], targetLang: "kriol", examples: [{ original: "Eu tenho", translated: "N' tene" }], category: "verbo", frequency: 92 },
  { word: "ser", translation: "i", variations: [], targetLang: "kriol", examples: [{ original: "É bom", translated: "I bon" }], category: "verbo", frequency: 98 },
  { word: "estar", translation: "sta", variations: [], targetLang: "kriol", examples: [{ original: "Estou bem", translated: "N' sta bon" }], category: "verbo", frequency: 95 },
  { word: "fazer", translation: "fasi", variations: [], targetLang: "kriol", examples: [{ original: "Fazer comida", translated: "Fasi bianda" }], category: "verbo", frequency: 88 },
  { word: "dar", translation: "da", variations: [], targetLang: "kriol", examples: [{ original: "Dar comida", translated: "Da bianda" }], category: "verbo", frequency: 85 },
  { word: "amor", translation: "amor", variations: [], targetLang: "kriol", examples: [{ original: "Eu te amo", translated: "N' ta ama-u" }], category: "substantivo", frequency: 70 },
  { word: "coração", translation: "kurason", variations: [], targetLang: "kriol", examples: [{ original: "Meu coração", translated: "Ña kurason" }], category: "substantivo", frequency: 55 },
  { word: "vida", translation: "bida", variations: [], targetLang: "kriol", examples: [{ original: "A vida é boa", translated: "Bida bon" }], category: "substantivo", frequency: 65 },
  { word: "saúde", translation: "saúdi", variations: [], targetLang: "kriol", examples: [{ original: "Boa saúde", translated: "Bon saúdi" }], category: "substantivo", frequency: 60 },
  { word: "como", translation: "kuma", variations: [], targetLang: "kriol", examples: [{ original: "Como estás?", translated: "Kuma ku bu sta?" }], category: "advérbio", frequency: 85 },
  { word: "onde", translation: "undi", variations: [], targetLang: "kriol", examples: [{ original: "Onde estás?", translated: "Undi ku bu sta?" }], category: "advérbio", frequency: 80 },
  { word: "quando", translation: "kantu", variations: [], targetLang: "kriol", examples: [{ original: "Quando vens?", translated: "Kantu ku bu na bin?" }], category: "advérbio", frequency: 75 },
  { word: "porque", translation: "pabia", variations: ["pamodi"], targetLang: "kriol", examples: [{ original: "Porque é assim", translated: "Pabia i sin" }], category: "conjunção", frequency: 82 },
  { word: "mas", translation: "mas", variations: [], targetLang: "kriol", examples: [{ original: "Mas eu quero", translated: "Mas n' kre" }], category: "conjunção", frequency: 88 },
  { word: "e", translation: "i", variations: ["ku"], targetLang: "kriol", examples: [{ original: "Eu e tu", translated: "Mi ku bo" }], category: "conjunção", frequency: 95 },
  { word: "eu", translation: "n'", variations: ["ami"], targetLang: "kriol", examples: [{ original: "Eu sou", translated: "N' i" }], category: "pronome", frequency: 98 },
  { word: "tu", translation: "bu", variations: ["bo"], targetLang: "kriol", examples: [{ original: "Tu és", translated: "Bu i" }], category: "pronome", frequency: 95 },
  { word: "ele", translation: "i", variations: ["el"], targetLang: "kriol", examples: [{ original: "Ele é", translated: "I i" }], category: "pronome", frequency: 92 },
  { word: "nós", translation: "no", variations: ["anos"], targetLang: "kriol", examples: [{ original: "Nós somos", translated: "No i" }], category: "pronome", frequency: 88 },
  { word: "vocês", translation: "bos", variations: [], targetLang: "kriol", examples: [{ original: "Vocês são", translated: "Bos i" }], category: "pronome", frequency: 85 },
  { word: "eles", translation: "elis", variations: [], targetLang: "kriol", examples: [{ original: "Eles são", translated: "Elis i" }], category: "pronome", frequency: 82 },
  { word: "acalmar", translation: "kalma", variations: ["toma ton"], targetLang: "kriol", examples: [{ original: "Acalme-se, vai dar certo", translated: "Kalma, i na da sertu" }], category: "verbo", frequency: 25 },
  { word: "acariciar", translation: "da kariñu", variations: ["karisia", "ngodu"], targetLang: "kriol", examples: [{ original: "Acaricia a sua namorada", translated: "Da bu badjuda kariñu" }], category: "verbo", frequency: 15 },
  { word: "acaso", translation: "akazu", variations: [], targetLang: "kriol", examples: [{ original: "Minha mãe chegou por acaso", translated: "Ña mame tchiga pur akazu" }], category: "substantivo", frequency: 18 },
  { word: "aceitação", translation: "setason", variations: [], targetLang: "kriol", examples: [{ original: "A aceitação dele na aldeia é boa", translated: "Si setason i bon na tabanka" }], category: "substantivo", frequency: 12 },
  { word: "aceitar", translation: "seta", variations: [], targetLang: "kriol", examples: [{ original: "Tu deves aceitar a verdade", translated: "Bu dibi di seta bardadi" }], category: "verbo", frequency: 35 },
  { word: "acenar", translation: "sana", variations: [], targetLang: "kriol", examples: [{ original: "Acena a mão para as pessoas", translated: "Sana djintis mon" }], category: "verbo", frequency: 10 },
  { word: "acender", translation: "sindi", variations: ["peganda"], targetLang: "kriol", examples: [{ original: "Acenda o fogo para cozinhar", translated: "Sindi fugu pa kusiña bianda" }], category: "verbo", frequency: 28 },
  { word: "acertar", translation: "serta", variations: [], targetLang: "kriol", examples: [{ original: "Acerta quem está ganhando", translated: "Serta kin ki na gaña" }], category: "verbo", frequency: 20 },
  { word: "aceso", translation: "sindidu", variations: ["sezu"], targetLang: "kriol", examples: [{ original: "A luz está acesa no quarto", translated: "Lus sindidu na kuartu" }], category: "adjetivo", frequency: 15 },
  { word: "achar", translation: "odja", variations: ["otcha"], targetLang: "kriol", examples: [{ original: "Achei o meu sapato", translated: "N' odja ña sapatu" }], category: "verbo", frequency: 55 },
];

// Crioulo → Portuguese vocabulary (reverse mapping with additional entries)
export const kriolToPt: VocabularyEntry[] = [
  { word: "kasa", translation: "casa", variations: ["kaza"], targetLang: "pt", examples: [{ original: "Ña kasa bonitu", translated: "A minha casa é bonita" }], category: "substantivo", frequency: 100 },
  { word: "omi", translation: "homem", variations: ["homi", "omis"], targetLang: "pt", examples: [{ original: "Omi ta tarbadja", translated: "O homem trabalha" }], category: "substantivo", frequency: 85 },
  { word: "mindjer", translation: "mulher", variations: ["minjer", "mudjer"], targetLang: "pt", examples: [{ original: "Mindjer ta kusiña", translated: "A mulher cozinha" }], category: "substantivo", frequency: 80 },
  { word: "mininu", translation: "criança", variations: ["mininu-mininu"], targetLang: "pt", examples: [{ original: "Mininu ta brinka", translated: "A criança brinca" }], category: "substantivo", frequency: 70 },
  { word: "agu", translation: "água", variations: ["afo"], targetLang: "pt", examples: [{ original: "Bibi agu", translated: "Beber água" }], category: "substantivo", frequency: 90 },
  { word: "bianda", translation: "comida", variations: ["kumida"], targetLang: "pt", examples: [{ original: "Bianda pronto", translated: "A comida está pronta" }], category: "substantivo", frequency: 75 },
  { word: "tarbadju", translation: "trabalho", variations: [], targetLang: "pt", examples: [{ original: "N' bai na tarbadju", translated: "Vou ao trabalho" }], category: "substantivo", frequency: 65 },
  { word: "amigu", translation: "amigo", variations: [], targetLang: "pt", examples: [{ original: "Ña amigu tchiga", translated: "Meu amigo chegou" }], category: "substantivo", frequency: 60 },
  { word: "familia", translation: "família", variations: [], targetLang: "pt", examples: [{ original: "Ña familia grandi", translated: "A minha família é grande" }], category: "substantivo", frequency: 55 },
  { word: "mame", translation: "mãe", variations: ["mama"], targetLang: "pt", examples: [{ original: "Ña mame", translated: "A minha mãe" }], category: "substantivo", frequency: 88 },
  { word: "pape", translation: "pai", variations: ["papa"], targetLang: "pt", examples: [{ original: "Ña pape", translated: "O meu pai" }], category: "substantivo", frequency: 85 },
  { word: "fidju", translation: "filho", variations: [], targetLang: "pt", examples: [{ original: "Ña fidju", translated: "O meu filho" }], category: "substantivo", frequency: 70 },
  { word: "papia", translation: "falar", variations: [], targetLang: "pt", examples: [{ original: "Papia Kriol", translated: "Falar Crioulo" }], category: "verbo", frequency: 82 },
  { word: "kume", translation: "comer", variations: [], targetLang: "pt", examples: [{ original: "N' na kume", translated: "Vou comer" }], category: "verbo", frequency: 85 },
  { word: "bibi", translation: "beber", variations: [], targetLang: "pt", examples: [{ original: "Bibi agu", translated: "Beber água" }], category: "verbo", frequency: 80 },
  { word: "durmi", translation: "dormir", variations: [], targetLang: "pt", examples: [{ original: "N' na durmi", translated: "Vou dormir" }], category: "verbo", frequency: 75 },
  { word: "bai", translation: "ir", variations: [], targetLang: "pt", examples: [{ original: "N' na bai", translated: "Eu vou" }], category: "verbo", frequency: 92 },
  { word: "bin", translation: "vir", variations: [], targetLang: "pt", examples: [{ original: "I bin", translated: "Ele veio" }], category: "verbo", frequency: 88 },
  { word: "odja", translation: "ver", variations: [], targetLang: "pt", examples: [{ original: "N' odja", translated: "Eu vi" }], category: "verbo", frequency: 78 },
  { word: "kre", translation: "querer", variations: [], targetLang: "pt", examples: [{ original: "N' kre", translated: "Eu quero" }], category: "verbo", frequency: 90 },
  { word: "pudi", translation: "poder", variations: [], targetLang: "pt", examples: [{ original: "N' pudi", translated: "Eu posso" }], category: "verbo", frequency: 85 },
  { word: "sibi", translation: "saber", variations: [], targetLang: "pt", examples: [{ original: "N' sibi", translated: "Eu sei" }], category: "verbo", frequency: 80 },
  { word: "tene", translation: "ter", variations: [], targetLang: "pt", examples: [{ original: "N' tene", translated: "Eu tenho" }], category: "verbo", frequency: 92 },
  { word: "sta", translation: "estar", variations: [], targetLang: "pt", examples: [{ original: "N' sta bon", translated: "Estou bem" }], category: "verbo", frequency: 95 },
  { word: "fasi", translation: "fazer", variations: [], targetLang: "pt", examples: [{ original: "Fasi bianda", translated: "Fazer comida" }], category: "verbo", frequency: 88 },
  { word: "da", translation: "dar", variations: [], targetLang: "pt", examples: [{ original: "Da bianda", translated: "Dar comida" }], category: "verbo", frequency: 85 },
  { word: "bon", translation: "bom", variations: [], targetLang: "pt", examples: [{ original: "I bon", translated: "É bom" }], category: "adjetivo", frequency: 90 },
  { word: "grandi", translation: "grande", variations: [], targetLang: "pt", examples: [{ original: "Kasa grandi", translated: "A casa é grande" }], category: "adjetivo", frequency: 70 },
  { word: "pekenu", translation: "pequeno", variations: ["pikinu"], targetLang: "pt", examples: [{ original: "Mininu pekenu", translated: "O menino é pequeno" }], category: "adjetivo", frequency: 68 },
  { word: "bonitu", translation: "bonito", variations: ["bunitu"], targetLang: "pt", examples: [{ original: "I bonitu", translated: "É bonito" }], category: "adjetivo", frequency: 65 },
  { word: "sin", translation: "sim", variations: [], targetLang: "pt", examples: [{ original: "Sin, n' na bai", translated: "Sim, eu vou" }], category: "advérbio", frequency: 95 },
  { word: "ka", translation: "não", variations: [], targetLang: "pt", examples: [{ original: "N' ka kre", translated: "Não quero" }], category: "advérbio", frequency: 98 },
  { word: "tcheu", translation: "muito", variations: ["tchiu"], targetLang: "pt", examples: [{ original: "Obrigadu tcheu", translated: "Muito obrigado" }], category: "advérbio", frequency: 85 },
  { word: "kuma", translation: "como", variations: [], targetLang: "pt", examples: [{ original: "Kuma ku bu sta?", translated: "Como estás?" }], category: "advérbio", frequency: 85 },
  { word: "undi", translation: "onde", variations: [], targetLang: "pt", examples: [{ original: "Undi ku bu sta?", translated: "Onde estás?" }], category: "advérbio", frequency: 80 },
  { word: "kantu", translation: "quando", variations: [], targetLang: "pt", examples: [{ original: "Kantu ku bu na bin?", translated: "Quando vens?" }], category: "advérbio", frequency: 75 },
  { word: "pabia", translation: "porque", variations: ["pamodi"], targetLang: "pt", examples: [{ original: "Pabia i sin", translated: "Porque é assim" }], category: "conjunção", frequency: 82 },
  { word: "tabanka", translation: "aldeia", variations: [], targetLang: "pt", examples: [{ original: "Na ña tabanka", translated: "Na minha aldeia" }], category: "substantivo", frequency: 55 },
  { word: "tchon", translation: "chão/terra", variations: [], targetLang: "pt", examples: [{ original: "Na tchon", translated: "No chão" }], category: "substantivo", frequency: 60 },
  { word: "sol", translation: "sol", variations: [], targetLang: "pt", examples: [{ original: "Sol forti", translated: "O sol está forte" }], category: "substantivo", frequency: 55 },
  { word: "tchuba", translation: "chuva", variations: [], targetLang: "pt", examples: [{ original: "Tchuba kai", translated: "A chuva caiu" }], category: "substantivo", frequency: 50 },
  { word: "pis", translation: "peixe", variations: ["pixi"], targetLang: "pt", examples: [{ original: "Kume pis", translated: "Comer peixe" }], category: "substantivo", frequency: 65 },
  { word: "aros", translation: "arroz", variations: [], targetLang: "pt", examples: [{ original: "Aros ku pis", translated: "Arroz com peixe" }], category: "substantivo", frequency: 75 },
  { word: "pataka", translation: "dinheiro", variations: [], targetLang: "pt", examples: [{ original: "N' misti pataka", translated: "Preciso de dinheiro" }], category: "substantivo", frequency: 70 },
  { word: "skola", translation: "escola", variations: [], targetLang: "pt", examples: [{ original: "Bai skola", translated: "Ir à escola" }], category: "substantivo", frequency: 65 },
  { word: "libru", translation: "livro", variations: [], targetLang: "pt", examples: [{ original: "Lidji libru", translated: "Ler o livro" }], category: "substantivo", frequency: 55 },
  { word: "karu", translation: "carro", variations: [], targetLang: "pt", examples: [{ original: "Ña karu", translated: "O meu carro" }], category: "substantivo", frequency: 55 },
  { word: "barku", translation: "barco", variations: [], targetLang: "pt", examples: [{ original: "Barku grandi", translated: "O barco é grande" }], category: "substantivo", frequency: 45 },
  { word: "kurason", translation: "coração", variations: [], targetLang: "pt", examples: [{ original: "Ña kurason", translated: "Meu coração" }], category: "substantivo", frequency: 55 },
  { word: "bida", translation: "vida", variations: [], targetLang: "pt", examples: [{ original: "Bida bon", translated: "A vida é boa" }], category: "substantivo", frequency: 65 },
  { word: "djungutu", translation: "abaixar", variations: [], targetLang: "pt", examples: [{ original: "Mininu djungutu pa paña fruta", translated: "O menino se abaixou para pegar a fruta" }], category: "verbo", frequency: 12 },
  { word: "bandona", translation: "abandonar", variations: [], targetLang: "pt", examples: [{ original: "Ka bu bandona elis", translated: "Não os abandones" }], category: "verbo", frequency: 15 },
  { word: "bagera", translation: "abelha", variations: [], targetLang: "pt", examples: [{ original: "Bagera ki ta tene kumbu di mel", translated: "Abelha que tem colmeia" }], category: "substantivo", frequency: 6 },
  { word: "bensua", translation: "abençoar", variations: ["abensua"], targetLang: "pt", examples: [{ original: "Garandis bensua ña fidju", translated: "Os velhos abençoam o meu filho" }], category: "verbo", frequency: 11 },
  { word: "bobra", translation: "abóbora", variations: ["abobra"], targetLang: "pt", examples: [{ original: "Kusiña bobra pa kume", translated: "Cozinhar a abóbora para comer" }], category: "substantivo", frequency: 7 },
  { word: "burisi", translation: "aborrecer", variations: [], targetLang: "pt", examples: [{ original: "Ña mame ta burisi ña pape", translated: "A minha mãe aborrece o meu pai" }], category: "verbo", frequency: 13 },
  { word: "nervozu", translation: "aborrecido", variations: [], targetLang: "pt", examples: [{ original: "N'sta nervozu ku ruzultadu", translated: "Estou aborrecido com o resultado" }], category: "adjetivo", frequency: 10 },
  { word: "barsa", translation: "abraçar", variations: [], targetLang: "pt", examples: [{ original: "N' barsa ña amigu", translated: "Abracei o meu amigo" }], category: "verbo", frequency: 16 },
  { word: "yabri", translation: "abrir", variations: ["abri"], targetLang: "pt", examples: [{ original: "Abri porta pa n' yentra", translated: "Abra a porta para eu entrar" }], category: "verbo", frequency: 45 },
];

// Common Crioulo phrases
export const commonPhrases = [
  { kriol: "Kuma ku bu sta?", pt: "Como estás?", en: "How are you?" },
  { kriol: "N' sta bon, obrigadu", pt: "Estou bem, obrigado", en: "I'm fine, thank you" },
  { kriol: "Bon dia", pt: "Bom dia", en: "Good morning" },
  { kriol: "Bon tardi", pt: "Boa tarde", en: "Good afternoon" },
  { kriol: "Bon noti", pt: "Boa noite", en: "Good night" },
  { kriol: "N' kre kume", pt: "Eu quero comer", en: "I want to eat" },
  { kriol: "Undi ku bu mora?", pt: "Onde moras?", en: "Where do you live?" },
  { kriol: "N' ta papia Kriol", pt: "Eu falo Crioulo", en: "I speak Creole" },
  { kriol: "Kinti nomi?", pt: "Qual é o teu nome?", en: "What's your name?" },
  { kriol: "Ña nomi i...", pt: "O meu nome é...", en: "My name is..." },
  { kriol: "Obrigadu tcheu", pt: "Muito obrigado", en: "Thank you very much" },
  { kriol: "Di nada", pt: "De nada", en: "You're welcome" },
  { kriol: "Diskulpa", pt: "Desculpa", en: "Sorry" },
  { kriol: "N' ka entendi", pt: "Não entendo", en: "I don't understand" },
  { kriol: "Papia mas dibagar", pt: "Fala mais devagar", en: "Speak more slowly" },
];

// Get top words by frequency
export function getTopWords(lang: 'kriol' | 'pt', limit: number = 5): VocabularyEntry[] {
  const source = lang === 'kriol' ? kriolToPt : ptToKriol;
  return [...source].sort((a, b) => b.frequency - a.frequency).slice(0, limit);
}

// Search vocabulary
export function searchVocabulary(query: string, fromLang: string, toLang: string): VocabularyEntry | null {
  const normalizedQuery = query.toLowerCase().trim();
  
  let source: VocabularyEntry[];
  if (fromLang === 'pt' && toLang === 'kriol') {
    source = ptToKriol;
  } else if (fromLang === 'kriol' && toLang === 'pt') {
    source = kriolToPt;
  } else {
    return null;
  }
  
  // Exact match
  const exact = source.find(entry => entry.word.toLowerCase() === normalizedQuery);
  if (exact) return exact;
  
  // Check variations
  const variation = source.find(entry => 
    entry.variations.some(v => v.toLowerCase() === normalizedQuery)
  );
  if (variation) return variation;
  
  return null;
}

// Find similar words (for spell checking)
export function findSimilarWords(word: string, lang: 'kriol' | 'pt'): { word: string; similarity: number }[] {
  const source = lang === 'kriol' ? kriolToPt : ptToKriol;
  const normalizedWord = word.toLowerCase().trim();
  
  const similarities: { word: string; similarity: number }[] = [];
  
  for (const entry of source) {
    const sim = calculateSimilarity(normalizedWord, entry.word.toLowerCase());
    if (sim > 0.6 && sim < 1) {
      similarities.push({ word: entry.word, similarity: sim });
    }
    
    // Check variations too
    for (const variation of entry.variations) {
      const varSim = calculateSimilarity(normalizedWord, variation.toLowerCase());
      if (varSim > 0.6 && varSim < 1) {
        similarities.push({ word: variation, similarity: varSim });
      }
    }
  }
  
  return similarities.sort((a, b) => b.similarity - a.similarity).slice(0, 3);
}

// Levenshtein distance-based similarity
function calculateSimilarity(str1: string, str2: string): number {
  const len1 = str1.length;
  const len2 = str2.length;
  
  if (len1 === 0) return len2 === 0 ? 1 : 0;
  if (len2 === 0) return 0;
  
  const matrix: number[][] = [];
  
  for (let i = 0; i <= len1; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= len2; j++) {
    matrix[0][j] = j;
  }
  
  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }
  
  const distance = matrix[len1][len2];
  const maxLen = Math.max(len1, len2);
  return 1 - distance / maxLen;
}

// Check if word exists in vocabulary
export function wordExists(word: string, lang: 'kriol' | 'pt'): boolean {
  const source = lang === 'kriol' ? kriolToPt : ptToKriol;
  const normalizedWord = word.toLowerCase().trim();
  
  return source.some(entry => 
    entry.word.toLowerCase() === normalizedWord ||
    entry.variations.some(v => v.toLowerCase() === normalizedWord)
  );
}
