import { useEffect, useRef, useState, forwardRef } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Download, Edit, RefreshCw, Plus, Trash2, Lock, Sparkles, FileText, Upload } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// ====== Types ======
interface Experiencia { cargo: string; empresa: string; pais: string; inicio: string; fim: string; descricao: string; }
interface Educacao { grau: string; instituicao: string; pais: string; ano: string; }
interface Idioma { idioma: string; nivel: string; }
interface Certificacao { nome: string; instituicao: string; ano: string; }

interface FormState {
  foto: string; // dataURL
  nomeCompleto: string;
  profissao: string;
  email: string;
  telefone: string;
  localidade: string;
  pais: string;
  linkedin: string;
  website: string;
  objetivo: string;
  experiencias: Experiencia[];
  educacoes: Educacao[];
  competencias: string[];
  idiomas: Idioma[];
  certificacoes: Certificacao[];
  formato: 'cronologico' | 'funcional' | 'combinado' | 'europass';
  paisDestino: string;
  idiomaCV: string;
  estilo: 'classico' | 'moderno' | 'minimalista';
  cor: string;
}

interface GeneratedCV {
  nome: string;
  titulo: string;
  contactos: { email?: string; telefone?: string; localizacao?: string; linkedin?: string; website?: string };
  apresentacao: string;
  experiencia: { cargo: string; empresa: string; periodo: string; descricao: string[] }[];
  educacao: { grau: string; instituicao: string; ano: string }[];
  competencias: string[];
  idiomas: { idioma: string; nivel: string }[];
  certificacoes?: { nome: string; instituicao: string; ano: string }[];
  tem_foto: boolean;
  section_labels: Record<string, string>;
}

const STORAGE_KEY = 'nocrioulo_cv_form_v1';
const USAGE_KEY = 'nocrioulo_cv_usage_v1';

const PAISES = [
  'Guiné-Bissau', 'Portugal', 'Brasil', 'Cabo Verde', 'Angola', 'Moçambique', 'São Tomé e Príncipe', 'Timor-Leste',
  'França', 'Espanha', 'Alemanha', 'Itália', 'Reino Unido', 'Países Baixos', 'Bélgica', 'Suíça', 'Luxemburgo',
  'Estados Unidos', 'Canadá', 'México', 'Argentina', 'Chile',
  'Senegal', 'Gâmbia', 'Mali', 'Costa do Marfim', 'Nigéria', 'Marrocos', 'África do Sul',
  'China', 'Japão', 'Coreia do Sul', 'Índia', 'Emirados Árabes Unidos', 'Austrália'
];

const empty: FormState = {
  foto: '', nomeCompleto: '', profissao: '', email: '', telefone: '',
  localidade: '', pais: '', linkedin: '', website: '', objetivo: '',
  experiencias: [], educacoes: [], competencias: [], idiomas: [], certificacoes: [],
  formato: 'cronologico', paisDestino: 'Guiné-Bissau', idiomaCV: 'Português (PT Portugal)',
  estilo: 'classico', cor: '#1f6f43',
};

const LOADING_MSGS = [
  'A analisar as tuas informações...',
  'A adaptar ao mercado escolhido...',
  'A melhorar a tua frase de apresentação...',
  'A formatar as experiências profissionais...',
  'Quase pronto! A preparar o teu currículo...',
];

export default function CurriculoPage() {
  const { profile } = useAuth();
  const isPremium = profile?.plan === 'premium';

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [form, setForm] = useState<FormState>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return { ...empty, ...JSON.parse(raw) };
    } catch {}
    return empty;
  });
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState(LOADING_MSGS[0]);
  const [cv, setCv] = useState<GeneratedCV | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const [skillInput, setSkillInput] = useState('');

  // autosave
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(form)); } catch {}
  }, [form]);

  // loading messages rotation
  useEffect(() => {
    if (!loading) return;
    let i = 0;
    const id = setInterval(() => { i = (i + 1) % LOADING_MSGS.length; setLoadingMsg(LOADING_MSGS[i]); }, 2000);
    return () => clearInterval(id);
  }, [loading]);

  const update = <K extends keyof FormState>(k: K, v: FormState[K]) => setForm(f => ({ ...f, [k]: v }));

  const canStep1 = form.nomeCompleto && form.profissao && form.email && form.telefone && form.localidade && form.pais;
  const canStep2 = form.experiencias.length > 0 || form.educacoes.length > 0 || form.competencias.length > 0;

  // ====== usage limit ======
  function checkUsage(): boolean {
    if (isPremium) return true;
    try {
      const raw = localStorage.getItem(USAGE_KEY);
      const now = new Date();
      const monthKey = `${now.getFullYear()}-${now.getMonth()}`;
      const data = raw ? JSON.parse(raw) : { month: monthKey, count: 0 };
      if (data.month !== monthKey) { data.month = monthKey; data.count = 0; }
      if (data.count >= 1) return false;
      return true;
    } catch { return true; }
  }
  function bumpUsage() {
    if (isPremium) return;
    const now = new Date();
    const monthKey = `${now.getFullYear()}-${now.getMonth()}`;
    const raw = localStorage.getItem(USAGE_KEY);
    const data = raw ? JSON.parse(raw) : { month: monthKey, count: 0 };
    if (data.month !== monthKey) { data.month = monthKey; data.count = 0; }
    data.count += 1;
    localStorage.setItem(USAGE_KEY, JSON.stringify(data));
  }

  // ====== generate ======
  async function generate() {
    if (!checkUsage()) {
      toast.error('Atingiste o limite gratuito de 1 currículo este mês. Faz upgrade para Premium para gerar mais.');
      return;
    }
    if (!isPremium && form.formato !== 'cronologico') {
      toast.error('O formato selecionado é Premium. Usa "Cronológico" no plano gratuito.');
      return;
    }
    if (!isPremium && form.estilo !== 'classico') {
      toast.error('Este estilo visual é Premium. Usa "Clássico" no plano gratuito.');
      return;
    }
    setLoading(true);
    setStep(4);
    try {
      const { data, error } = await supabase.functions.invoke('generate-cv', {
        body: {
          formData: form,
          format: form.formato,
          country: form.paisDestino,
          language: form.idiomaCV,
        },
      });
      if (error) throw error;
      if ((data as any)?.error) throw new Error((data as any).error);
      const generated: GeneratedCV = (data as any).cv;
      if (form.foto && generated.tem_foto !== false) {
        // keep tem_foto unless explicitly false (e.g. US)
      }
      setCv(generated);
      bumpUsage();
    } catch (e: any) {
      toast.error(e?.message || 'Erro ao gerar o currículo.');
      setStep(3);
    } finally {
      setLoading(false);
    }
  }

  async function downloadPdf() {
    if (!previewRef.current) return;
    const html2pdf = (await import('html2pdf.js')).default;
    await html2pdf().set({
      margin: 0,
      filename: `curriculo-${(cv?.nome || 'nocrioulo').replace(/\s+/g, '-').toLowerCase()}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    }).from(previewRef.current).save();
  }

  function handlePhoto(file: File) {
    if (file.size > 5 * 1024 * 1024) { toast.error('Foto deve ter no máximo 5MB.'); return; }
    const reader = new FileReader();
    reader.onload = () => update('foto', reader.result as string);
    reader.readAsDataURL(file);
  }

  // ====== JSX helpers ======
  const ProgressBar = (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-2">
        {[1, 2, 3, 4].map(n => (
          <div key={n} className="flex-1 flex items-center">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
              step >= n ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'
            }`}>{step > n ? '✓' : n}</div>
            {n < 4 && <div className={`flex-1 h-1 mx-2 rounded ${step > n ? 'bg-primary' : 'bg-secondary'}`} />}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-4 text-[11px] md:text-xs text-muted-foreground gap-2">
        <span className={step === 1 ? 'text-primary font-semibold' : ''}>Os teus dados</span>
        <span className={step === 2 ? 'text-primary font-semibold' : ''}>Experiência</span>
        <span className={step === 3 ? 'text-primary font-semibold' : ''}>Formato</span>
        <span className={step === 4 ? 'text-primary font-semibold' : ''}>CV pronto</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background pattern-bg flex flex-col">
      <Helmet>
        <title>Criar Currículo com IA — No Crioulo</title>
        <meta name="description" content="Cria um currículo profissional adaptado ao país de destino com inteligência artificial. Descarrega em PDF." />
      </Helmet>
      <Header />
      <main className="flex-1 pt-24 md:pt-32 pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl gradient-hero flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <h1 className="font-display font-extrabold text-3xl md:text-4xl">Criar Currículo</h1>
            </div>
            <p className="text-muted-foreground mb-6 text-sm">
              Preenche os teus dados e a IA gera um currículo profissional adaptado ao país onde te candidatas. 🔒 Os teus dados são processados de forma segura e não são armazenados.
            </p>

            {ProgressBar}

            <div className="gradient-card rounded-2xl border border-border/50 p-6 md:p-8 shadow-soft">
              {/* STEP 1 */}
              {step === 1 && (
                <div className="space-y-5">
                  <h2 className="font-display font-bold text-xl">Informações pessoais</h2>

                  <div className="flex items-center gap-4">
                    <div className="w-24 h-24 rounded-full overflow-hidden bg-secondary flex items-center justify-center border-2 border-border">
                      {form.foto ? <img src={form.foto} alt="Foto" className="w-full h-full object-cover" /> : <Upload className="w-6 h-6 text-muted-foreground" />}
                    </div>
                    <div>
                      <Label className="block mb-2">Foto de perfil (opcional)</Label>
                      <Input type="file" accept="image/jpeg,image/png" onChange={(e) => e.target.files?.[0] && handlePhoto(e.target.files[0])} />
                      <p className="text-xs text-muted-foreground mt-1">JPG/PNG, máx. 5MB</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <Field label="Nome completo *" v={form.nomeCompleto} onChange={v => update('nomeCompleto', v)} />
                    <Field label="Profissão / Título *" v={form.profissao} onChange={v => update('profissao', v)} placeholder="ex: Engenheiro de Software" />
                    <Field label="Email *" v={form.email} onChange={v => update('email', v)} type="email" />
                    <Field label="Telefone *" v={form.telefone} onChange={v => update('telefone', v)} placeholder="+245 ..." />
                    <Field label="Localidade *" v={form.localidade} onChange={v => update('localidade', v)} />
                    <SelectField label="País de residência *" v={form.pais} onChange={v => update('pais', v)} options={PAISES} />
                    <Field label="LinkedIn" v={form.linkedin} onChange={v => update('linkedin', v)} placeholder="linkedin.com/in/..." />
                    <Field label="Website / Portfólio" v={form.website} onChange={v => update('website', v)} />
                  </div>

                  <div>
                    <Label>Frase de apresentação / Objetivo profissional</Label>
                    <Textarea value={form.objetivo} maxLength={500} onChange={e => update('objetivo', e.target.value)} placeholder="Descreve em 2-3 frases quem és e o que procuras. A IA vai melhorar este texto." rows={4} />
                    <p className="text-xs text-muted-foreground mt-1">{form.objetivo.length}/500</p>
                  </div>

                  <div className="flex justify-end">
                    <Button variant="hero" disabled={!canStep1} onClick={() => setStep(2)}>Seguinte →</Button>
                  </div>
                </div>
              )}

              {/* STEP 2 */}
              {step === 2 && (
                <div className="space-y-6">
                  <h2 className="font-display font-bold text-xl">Experiência, educação & competências</h2>

                  {/* Experiência */}
                  <section>
                    <h3 className="font-semibold mb-2">Experiência profissional</h3>
                    {form.experiencias.map((exp, i) => (
                      <div key={i} className="border border-border rounded-lg p-3 mb-2 space-y-2 bg-background/50">
                        <div className="grid md:grid-cols-2 gap-2">
                          <Input placeholder="Cargo" value={exp.cargo} onChange={e => updateArr('experiencias', i, { ...exp, cargo: e.target.value })} />
                          <Input placeholder="Empresa" value={exp.empresa} onChange={e => updateArr('experiencias', i, { ...exp, empresa: e.target.value })} />
                          <Input placeholder="País" value={exp.pais} onChange={e => updateArr('experiencias', i, { ...exp, pais: e.target.value })} />
                          <div className="grid grid-cols-2 gap-2">
                            <Input placeholder="Início (MM/AAAA)" value={exp.inicio} onChange={e => updateArr('experiencias', i, { ...exp, inicio: e.target.value })} />
                            <Input placeholder="Fim ou 'até hoje'" value={exp.fim} onChange={e => updateArr('experiencias', i, { ...exp, fim: e.target.value })} />
                          </div>
                        </div>
                        <Textarea placeholder="Descrição das funções (a IA vai melhorar)" value={exp.descricao} onChange={e => updateArr('experiencias', i, { ...exp, descricao: e.target.value })} rows={3} />
                        <Button size="sm" variant="outline" onClick={() => removeArr('experiencias', i)}><Trash2 className="w-4 h-4" /> Remover</Button>
                      </div>
                    ))}
                    {form.experiencias.length < 6 && (
                      <Button variant="outline" onClick={() => update('experiencias', [...form.experiencias, { cargo: '', empresa: '', pais: '', inicio: '', fim: '', descricao: '' }])}>
                        <Plus className="w-4 h-4" /> Adicionar experiência
                      </Button>
                    )}
                  </section>

                  {/* Educação */}
                  <section>
                    <h3 className="font-semibold mb-2">Formação académica</h3>
                    {form.educacoes.map((ed, i) => (
                      <div key={i} className="border border-border rounded-lg p-3 mb-2 grid md:grid-cols-4 gap-2 bg-background/50">
                        <Input placeholder="Grau/Diploma" value={ed.grau} onChange={e => updateArr('educacoes', i, { ...ed, grau: e.target.value })} />
                        <Input placeholder="Instituição" value={ed.instituicao} onChange={e => updateArr('educacoes', i, { ...ed, instituicao: e.target.value })} />
                        <Input placeholder="País" value={ed.pais} onChange={e => updateArr('educacoes', i, { ...ed, pais: e.target.value })} />
                        <div className="flex gap-2">
                          <Input placeholder="Ano" value={ed.ano} onChange={e => updateArr('educacoes', i, { ...ed, ano: e.target.value })} />
                          <Button size="icon" variant="outline" onClick={() => removeArr('educacoes', i)}><Trash2 className="w-4 h-4" /></Button>
                        </div>
                      </div>
                    ))}
                    {form.educacoes.length < 4 && (
                      <Button variant="outline" onClick={() => update('educacoes', [...form.educacoes, { grau: '', instituicao: '', pais: '', ano: '' }])}>
                        <Plus className="w-4 h-4" /> Adicionar formação
                      </Button>
                    )}
                  </section>

                  {/* Competências */}
                  <section>
                    <h3 className="font-semibold mb-2">Competências (máx. 15)</h3>
                    <div className="flex gap-2 mb-2">
                      <Input
                        value={skillInput}
                        onChange={e => setSkillInput(e.target.value)}
                        onKeyDown={e => {
                          if (e.key === 'Enter' && skillInput.trim() && form.competencias.length < 15) {
                            e.preventDefault();
                            update('competencias', [...form.competencias, skillInput.trim()]);
                            setSkillInput('');
                          }
                        }}
                        placeholder="Escreve uma competência e prime Enter"
                      />
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {form.competencias.map((s, i) => (
                        <span key={i} className="bg-primary/10 text-primary text-sm px-3 py-1 rounded-full flex items-center gap-2">
                          {s}
                          <button onClick={() => update('competencias', form.competencias.filter((_, j) => j !== i))}>×</button>
                        </span>
                      ))}
                    </div>
                  </section>

                  {/* Idiomas */}
                  <section>
                    <h3 className="font-semibold mb-2">Idiomas (até 6)</h3>
                    {form.idiomas.map((idm, i) => (
                      <div key={i} className="grid grid-cols-[1fr_1fr_auto] gap-2 mb-2">
                        <Input placeholder="Idioma" value={idm.idioma} onChange={e => updateArr('idiomas', i, { ...idm, idioma: e.target.value })} />
                        <select className="border border-input rounded-md bg-background px-3" value={idm.nivel} onChange={e => updateArr('idiomas', i, { ...idm, nivel: e.target.value })}>
                          <option value="">Nível</option>
                          <option>Nativo</option><option>Fluente</option><option>Avançado</option><option>Intermédio</option><option>Básico</option>
                        </select>
                        <Button size="icon" variant="outline" onClick={() => removeArr('idiomas', i)}><Trash2 className="w-4 h-4" /></Button>
                      </div>
                    ))}
                    {form.idiomas.length < 6 && (
                      <Button variant="outline" onClick={() => update('idiomas', [...form.idiomas, { idioma: '', nivel: '' }])}><Plus className="w-4 h-4" /> Adicionar idioma</Button>
                    )}
                  </section>

                  {/* Certificações */}
                  <section>
                    <h3 className="font-semibold mb-2">Certificações & cursos (opcional, até 4)</h3>
                    {form.certificacoes.map((c, i) => (
                      <div key={i} className="grid md:grid-cols-[1fr_1fr_120px_auto] gap-2 mb-2">
                        <Input placeholder="Nome" value={c.nome} onChange={e => updateArr('certificacoes', i, { ...c, nome: e.target.value })} />
                        <Input placeholder="Instituição" value={c.instituicao} onChange={e => updateArr('certificacoes', i, { ...c, instituicao: e.target.value })} />
                        <Input placeholder="Ano" value={c.ano} onChange={e => updateArr('certificacoes', i, { ...c, ano: e.target.value })} />
                        <Button size="icon" variant="outline" onClick={() => removeArr('certificacoes', i)}><Trash2 className="w-4 h-4" /></Button>
                      </div>
                    ))}
                    {form.certificacoes.length < 4 && (
                      <Button variant="outline" onClick={() => update('certificacoes', [...form.certificacoes, { nome: '', instituicao: '', ano: '' }])}><Plus className="w-4 h-4" /> Adicionar certificação</Button>
                    )}
                  </section>

                  <div className="flex justify-between">
                    <Button variant="ghost" onClick={() => setStep(1)}>← Voltar</Button>
                    <Button variant="hero" disabled={!canStep2} onClick={() => setStep(3)}>Seguinte →</Button>
                  </div>
                </div>
              )}

              {/* STEP 3 */}
              {step === 3 && (
                <div className="space-y-6">
                  <h2 className="font-display font-bold text-xl">Escolher formato e país</h2>

                  <section>
                    <h3 className="font-semibold mb-3">Formato do currículo</h3>
                    <div className="grid md:grid-cols-2 gap-3">
                      <FormatCard active={form.formato === 'cronologico'} onClick={() => update('formato', 'cronologico')}
                        title="Cronológico" desc="Experiência do mais recente para o mais antigo. Ideal para carreira consolidada." badge="Europa, EUA, Brasil" />
                      <FormatCard active={form.formato === 'funcional'} onClick={() => isPremium ? update('formato', 'funcional') : toast.error('Premium — disponível com subscrição.')}
                        title="Funcional" desc="Destaca competências em vez de datas." badge="Guiné-Bissau, primeiros empregos" premium={!isPremium} />
                      <FormatCard active={form.formato === 'combinado'} onClick={() => isPremium ? update('formato', 'combinado') : toast.error('Premium — disponível com subscrição.')}
                        title="Combinado / Moderno" desc="Mistura competências e experiência." badge="Tecnologia, startups, design" premium={!isPremium} />
                      <FormatCard active={form.formato === 'europass'} onClick={() => isPremium ? update('formato', 'europass') : toast.error('Premium — disponível com subscrição.')}
                        title="Europass" desc="Formato oficial europeu." badge="Portugal, França, Alemanha" premium={!isPremium} />
                    </div>
                  </section>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <Label>País de destino</Label>
                      <select className="w-full border border-input rounded-md bg-background h-10 px-3" value={form.paisDestino} onChange={e => update('paisDestino', e.target.value)}>
                        {PAISES.map(p => <option key={p}>{p}</option>)}
                      </select>
                    </div>
                    <div>
                      <Label>Idioma do CV</Label>
                      <select className="w-full border border-input rounded-md bg-background h-10 px-3" value={form.idiomaCV} onChange={e => update('idiomaCV', e.target.value)}>
                        <option>Português (PT Portugal)</option>
                        <option>Português (BR Brasil)</option>
                        <option>Inglês</option>
                        <option>Francês</option>
                        <option>Espanhol</option>
                        <option>Alemão</option>
                      </select>
                    </div>
                    <div>
                      <Label>Estilo visual</Label>
                      <select className="w-full border border-input rounded-md bg-background h-10 px-3" value={form.estilo}
                        onChange={e => {
                          const v = e.target.value as FormState['estilo'];
                          if (!isPremium && v !== 'classico') { toast.error('Estilo Premium.'); return; }
                          update('estilo', v);
                        }}>
                        <option value="classico">Clássico</option>
                        <option value="moderno">Moderno {!isPremium && '🔒'}</option>
                        <option value="minimalista">Minimalista {!isPremium && '🔒'}</option>
                      </select>
                    </div>
                  </div>

                  {form.estilo === 'moderno' && (
                    <div>
                      <Label>Cor de destaque</Label>
                      <div className="flex gap-2 mt-2">
                        {['#1f6f43', '#1e40af', '#b91c1c', '#475569'].map(c => (
                          <button key={c} className={`w-9 h-9 rounded-full border-2 ${form.cor === c ? 'border-foreground' : 'border-transparent'}`} style={{ background: c }} onClick={() => update('cor', c)} />
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <Button variant="ghost" onClick={() => setStep(2)}>← Voltar</Button>
                    <Button variant="hero" onClick={generate}><Sparkles className="w-4 h-4" /> Gerar o meu currículo</Button>
                  </div>
                </div>
              )}

              {/* STEP 4 */}
              {step === 4 && (
                <div>
                  {loading && (
                    <div className="text-center py-16">
                      <div className="inline-block w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
                      <p className="text-lg font-semibold">{loadingMsg}</p>
                    </div>
                  )}
                  {!loading && cv && (
                    <div>
                      <div className="flex flex-wrap gap-2 mb-4 justify-end">
                        <Button variant="hero" onClick={downloadPdf}><Download className="w-4 h-4" /> Descarregar PDF</Button>
                        <Button variant="outline" onClick={() => setStep(1)}><Edit className="w-4 h-4" /> Editar</Button>
                        <Button variant="outline" onClick={generate}><RefreshCw className="w-4 h-4" /> Nova versão</Button>
                      </div>
                      <div className="overflow-auto bg-secondary/30 p-4 rounded-lg">
                        <CVPreview ref={previewRef} cv={cv} foto={form.foto} estilo={form.estilo} cor={form.cor} isPremium={isPremium} />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );

  function updateArr<K extends 'experiencias' | 'educacoes' | 'idiomas' | 'certificacoes'>(key: K, i: number, val: FormState[K][number]) {
    const arr = [...(form[key] as any[])];
    arr[i] = val;
    update(key, arr as any);
  }
  function removeArr<K extends 'experiencias' | 'educacoes' | 'idiomas' | 'certificacoes'>(key: K, i: number) {
    update(key, (form[key] as any[]).filter((_, j) => j !== i) as any);
  }
}

function Field({ label, v, onChange, type = 'text', placeholder }: { label: string; v: string; onChange: (v: string) => void; type?: string; placeholder?: string }) {
  return (
    <div>
      <Label>{label}</Label>
      <Input type={type} value={v} onChange={e => onChange(e.target.value)} placeholder={placeholder} />
    </div>
  );
}
function SelectField({ label, v, onChange, options }: { label: string; v: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <div>
      <Label>{label}</Label>
      <select className="w-full border border-input rounded-md bg-background h-10 px-3" value={v} onChange={e => onChange(e.target.value)}>
        <option value="">Selecionar...</option>
        {options.map(o => <option key={o}>{o}</option>)}
      </select>
    </div>
  );
}

function FormatCard({ active, onClick, title, desc, badge, premium }: { active: boolean; onClick: () => void; title: string; desc: string; badge: string; premium?: boolean }) {
  return (
    <button type="button" onClick={onClick}
      className={`text-left p-4 rounded-lg border-2 transition-all relative ${active ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/40'}`}>
      <div className="flex items-center justify-between mb-1">
        <span className="font-bold">{title}</span>
        {premium && <span className="text-xs bg-yellow-500/20 text-yellow-700 px-2 py-0.5 rounded-full flex items-center gap-1"><Lock className="w-3 h-3" />Premium</span>}
      </div>
      <p className="text-sm text-muted-foreground mb-1">{desc}</p>
      <p className="text-xs text-primary">Recomendado: {badge}</p>
    </button>
  );
}

// ====== CV Preview component ======
import { forwardRef } from 'react';

const CVPreview = forwardRef<HTMLDivElement, { cv: GeneratedCV; foto: string; estilo: FormState['estilo']; cor: string; isPremium: boolean }>(
  ({ cv, foto, estilo, cor, isPremium }, ref) => {
    const showPhoto = cv.tem_foto !== false && !!foto;
    const labels = cv.section_labels || {};

    const baseStyle: React.CSSProperties = {
      width: '210mm', minHeight: '297mm', padding: '15mm', background: 'white', color: '#111',
      fontFamily: estilo === 'classico' ? 'Georgia, serif' : 'Inter, system-ui, sans-serif',
      fontSize: '11pt', lineHeight: 1.45,
    };

    if (estilo === 'moderno') {
      return (
        <div ref={ref} style={{ ...baseStyle, padding: 0, display: 'grid', gridTemplateColumns: '70mm 1fr' }}>
          <aside style={{ background: cor, color: 'white', padding: '15mm 10mm' }}>
            {showPhoto && <img src={foto} alt="" style={{ width: '40mm', height: '40mm', borderRadius: '50%', objectFit: 'cover', marginBottom: '8mm', border: '3px solid white' }} />}
            <h1 style={{ fontSize: '18pt', margin: 0 }}>{cv.nome}</h1>
            <p style={{ opacity: 0.9, marginTop: 4 }}>{cv.titulo}</p>
            <Section title={labels.contactos || 'Contactos'} light>
              <ContactList c={cv.contactos} />
            </Section>
            {cv.competencias?.length > 0 && <Section title={labels.competencias || 'Competências'} light>
              <ul style={{ paddingLeft: 16 }}>{cv.competencias.map((s, i) => <li key={i}>{s}</li>)}</ul>
            </Section>}
            {cv.idiomas?.length > 0 && <Section title={labels.idiomas || 'Idiomas'} light>
              {cv.idiomas.map((i, k) => <div key={k}>{i.idioma} — <em>{i.nivel}</em></div>)}
            </Section>}
          </aside>
          <main style={{ padding: '15mm 12mm' }}>
            <RightContent cv={cv} labels={labels} accent={cor} />
            {!isPremium && <Watermark />}
          </main>
        </div>
      );
    }

    // classico & minimalista (single column)
    const accent = estilo === 'minimalista' ? '#000' : '#1f6f43';
    return (
      <div ref={ref} style={baseStyle}>
        <header style={{ borderBottom: `2px solid ${accent}`, paddingBottom: 8, marginBottom: 12, display: 'flex', gap: 16, alignItems: 'center' }}>
          {showPhoto && <img src={foto} alt="" style={{ width: '30mm', height: '30mm', borderRadius: estilo === 'minimalista' ? '4px' : '50%', objectFit: 'cover' }} />}
          <div>
            <h1 style={{ fontSize: '20pt', margin: 0, color: accent }}>{cv.nome}</h1>
            <p style={{ margin: 0, fontSize: '12pt' }}>{cv.titulo}</p>
            <p style={{ margin: '4px 0 0', fontSize: '9.5pt', color: '#555' }}>
              {[cv.contactos.email, cv.contactos.telefone, cv.contactos.localizacao].filter(Boolean).join(' • ')}
            </p>
            {(cv.contactos.linkedin || cv.contactos.website) && (
              <p style={{ margin: '2px 0 0', fontSize: '9.5pt', color: '#555' }}>
                {[cv.contactos.linkedin, cv.contactos.website].filter(Boolean).join(' • ')}
              </p>
            )}
          </div>
        </header>
        <RightContent cv={cv} labels={labels} accent={accent} />
        {!isPremium && <Watermark />}
      </div>
    );
  }
);
CVPreview.displayName = 'CVPreview';

function Section({ title, children, light }: { title: string; children: React.ReactNode; light?: boolean }) {
  return (
    <section style={{ marginTop: 14 }}>
      <h2 style={{ fontSize: '11pt', textTransform: 'uppercase', letterSpacing: 1, borderBottom: light ? '1px solid rgba(255,255,255,0.3)' : '1px solid #ddd', paddingBottom: 3, marginBottom: 6 }}>
        {title}
      </h2>
      <div>{children}</div>
    </section>
  );
}

function ContactList({ c }: { c: GeneratedCV['contactos'] }) {
  return (
    <div style={{ fontSize: '9.5pt' }}>
      {c.email && <div>{c.email}</div>}
      {c.telefone && <div>{c.telefone}</div>}
      {c.localizacao && <div>{c.localizacao}</div>}
      {c.linkedin && <div>{c.linkedin}</div>}
      {c.website && <div>{c.website}</div>}
    </div>
  );
}

function RightContent({ cv, labels, accent }: { cv: GeneratedCV; labels: Record<string, string>; accent: string }) {
  return (
    <>
      {cv.apresentacao && (
        <Section title={labels.apresentacao || 'Apresentação'}>
          <p style={{ margin: 0 }}>{cv.apresentacao}</p>
        </Section>
      )}
      {cv.experiencia?.length > 0 && (
        <Section title={labels.experiencia || 'Experiência profissional'}>
          {cv.experiencia.map((e, i) => (
            <div key={i} style={{ marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600 }}>
                <span>{e.cargo} — {e.empresa}</span>
                <span style={{ color: accent, fontSize: '9.5pt' }}>{e.periodo}</span>
              </div>
              <ul style={{ margin: '4px 0 0', paddingLeft: 18 }}>
                {e.descricao.map((d, k) => <li key={k}>{d}</li>)}
              </ul>
            </div>
          ))}
        </Section>
      )}
      {cv.educacao?.length > 0 && (
        <Section title={labels.educacao || 'Educação'}>
          {cv.educacao.map((e, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span><strong>{e.grau}</strong> — {e.instituicao}</span>
              <span style={{ color: accent }}>{e.ano}</span>
            </div>
          ))}
        </Section>
      )}
      {cv.certificacoes && cv.certificacoes.length > 0 && (
        <Section title={labels.certificacoes || 'Certificações'}>
          {cv.certificacoes.map((c, i) => (
            <div key={i}>{c.nome} — {c.instituicao} ({c.ano})</div>
          ))}
        </Section>
      )}
    </>
  );
}

function Watermark() {
  return (
    <div style={{ position: 'absolute', bottom: '5mm', right: '10mm', fontSize: '8pt', color: '#999' }}>
      Criado com NoCrioulo.com
    </div>
  );
}
