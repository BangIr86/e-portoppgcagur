import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { PortfolioData, KATEGORI_LABEL, ArtefakItem } from '@/contexts/PortfolioContext';
import {
  AlertTriangle, BookOpen, CheckCircle, RefreshCw, FileText, Image as ImageIcon, GraduationCap,
  ChevronDown, Heart, TrendingUp, AlertCircle as AlertCircleIcon, Target, Sparkles, Quote, MapPin,
  FileSearch, FlaskConical, Award, Star,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { getTheme, themeToStyle, injectThemeFont, resolveUppercase, type ThemeOverrides } from '@/lib/themes';

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } } };
const staggerContainer = { hidden: {}, visible: { transition: { staggerChildren: 0.12 } } };

interface Props {
  data: PortfolioData;
  themeId?: string;
  themeOverrides?: ThemeOverrides;
}

const ANALISIS_FIELDS: { key: keyof ArtefakItem; label: string; icon: any }[] = [
  { key: 'konteks', label: 'Konteks', icon: MapPin },
  { key: 'tujuan', label: 'Tujuan', icon: Target },
  { key: 'kelebihan', label: 'Kelebihan', icon: CheckCircle },
  { key: 'kekurangan', label: 'Kekurangan', icon: AlertTriangle },
  { key: 'teori_pedagogi', label: 'Teori Pedagogi', icon: BookOpen },
  { key: 'faktor_keberhasilan', label: 'Faktor Keberhasilan', icon: Award },
  { key: 'adaptasi_pembelajaran', label: 'Adaptasi Pembelajaran', icon: RefreshCw },
];

const PortfolioShowcase = ({ data, themeId, themeOverrides }: Props) => {
  const p = data.profile;
  const a = data.artefak;
  const r = data.reflection;
  const m = data.model_guru;

  const theme = getTheme(themeId);
  useEffect(() => { injectThemeFont(theme); }, [theme]);
  const uppercase = resolveUppercase(theme, themeOverrides);


  // Lampiran 7 & 8 highlight
  const lampiran7 = data.lampiran.filter(l => l.tipe === 'lampiran7');
  const lampiran8 = data.lampiran.filter(l => l.tipe === 'lampiran8');
  const lampiranOther = data.lampiran.filter(l => !['lampiran7', 'lampiran8'].includes(l.tipe));

  return (
    <div style={themeToStyle(theme, themeOverrides)} data-uppercase-headings={uppercase ? 'true' : 'false'} className="portfolio-themed min-h-screen bg-background text-foreground w-full max-w-full overflow-hidden">
      {/* HERO BERANDA */}
      <section id="beranda" className="showcase-hero text-primary-foreground py-12 sm:py-24 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial="hidden" animate="visible" variants={fadeUp}>
            {p.foto_url && (
              <img src={p.foto_url} alt={p.full_name} className="w-24 h-24 sm:w-32 sm:h-32 rounded-full mx-auto mb-5 sm:mb-6 border-4 border-primary-foreground/30 object-cover" />
            )}
            <p className="text-xs sm:text-sm uppercase tracking-widest opacity-80 mb-2">Mahasiswa PPG Prajabatan Informatika</p>
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold mb-4 break-words">{p.full_name || 'Nama Mahasiswa'}</h1>
            {(p.asal_daerah || p.asal_kampus) && (
              <p className="opacity-80 mb-6 text-sm sm:text-base break-words flex items-center justify-center gap-2 flex-wrap">
                {p.asal_daerah && <span className="inline-flex items-center gap-1"><MapPin className="w-4 h-4" />{p.asal_daerah}</span>}
                {p.asal_daerah && p.asal_kampus && <span className="opacity-50">•</span>}
                {p.asal_kampus && <span>{p.asal_kampus}</span>}
              </p>
            )}
            {p.kutipan_motivasi && (
              <blockquote className="relative text-base sm:text-xl md:text-2xl italic font-light max-w-2xl mx-auto leading-relaxed opacity-95 break-words mb-8">
                <Quote className="w-8 h-8 absolute -top-3 -left-2 opacity-30" />
                <span className="relative">"{p.kutipan_motivasi}"</span>
              </blockquote>
            )}
            <div className="flex flex-wrap items-center justify-center gap-3">
              <a href="#profil" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary-foreground text-primary hover:bg-primary-foreground/90 transition-colors text-sm font-semibold">
                Lihat Portfolio <ChevronDown className="w-4 h-4" />
              </a>
              <button onClick={() => window.print()} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border-2 border-primary-foreground/40 hover:bg-primary-foreground/10 transition-colors text-sm font-medium">
                Download PDF
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* PENGANTAR */}
      {p.pengantar && (
        <section className="py-10 sm:py-14 px-4 sm:px-6">
          <div className="max-w-3xl mx-auto">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed whitespace-pre-line text-center">{p.pengantar}</p>
            </motion.div>
          </div>
        </section>
      )}

      {/* PROFIL — STORYTELLING */}
      <section id="profil" className="py-10 sm:py-16 px-4 sm:px-6 bg-muted/30">
        <div className="max-w-3xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2 text-center">Profil Mahasiswa</h2>
            <p className="text-sm text-muted-foreground text-center mb-8 sm:mb-12">Cerita perjalanan menjadi calon guru profesional</p>
          </motion.div>

          {p.narasi_storytelling ? (
            <motion.article initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
              className="prose prose-lg max-w-none text-foreground leading-relaxed">
              {p.narasi_storytelling.split(/\n\n+/).map((para, i) => (
                <p key={i} className="text-base sm:text-lg leading-relaxed mb-5 text-foreground/90 whitespace-pre-line">{para}</p>
              ))}
            </motion.article>
          ) : (
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="space-y-8">
              {p.keunikan_daerah && (
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2 flex items-center gap-2"><MapPin className="w-5 h-5 text-primary" /> Keunikan Daerah Asal</h3>
                  <p className="text-base text-foreground/85 leading-relaxed whitespace-pre-line">{p.keunikan_daerah}</p>
                </div>
              )}
              {p.inspirasi_guru && (
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2 flex items-center gap-2"><Sparkles className="w-5 h-5 text-primary" /> Inspirasi Menjadi Guru</h3>
                  <p className="text-base text-foreground/85 leading-relaxed whitespace-pre-line">{p.inspirasi_guru}</p>
                </div>
              )}
              {p.tujuan_profesional && (
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2 flex items-center gap-2"><Target className="w-5 h-5 text-primary" /> Tujuan Profesional</h3>
                  <p className="text-base text-foreground/85 leading-relaxed whitespace-pre-line">{p.tujuan_profesional}</p>
                </div>
              )}
            </motion.div>
          )}

          {(p.asal_kampus || p.bidang_studi) && (
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
              className="mt-10 p-6 rounded-xl bg-card border card-shadow flex items-start gap-4">
              <GraduationCap className="w-8 h-8 text-primary shrink-0" />
              <div>
                <p className="font-semibold text-foreground">{p.asal_kampus}</p>
                <p className="text-sm text-muted-foreground">{p.bidang_studi}</p>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* ARTEFAK MENGAJAR */}
      {a.length > 0 && (
        <section id="artefak" className="py-10 sm:py-16 px-4 sm:px-6">
          <div className="max-w-5xl mx-auto">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2 text-center">Artefak Mengajar</h2>
              <p className="text-sm text-muted-foreground text-center mb-8 sm:mb-12">Dokumentasi karya pembelajaran</p>
            </motion.div>

            <motion.div className="grid grid-cols-1 sm:grid-cols-2 gap-5 auto-rows-fr" variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              {a.map(item => {
                const files = item.files && item.files.length
                  ? item.files
                  : (item.file_url ? [{ id: 'legacy', file_url: item.file_url, file_type: item.file_type, youtube_url: item.youtube_url }] : []);
                const primary = files[0];
                const extra = files.slice(1);
                const kats = item.kategoris && item.kategoris.length ? item.kategoris : [item.kategori];
                return (
                  <motion.div key={item.id} variants={fadeUp} className="h-full">
                    <div className="rounded-xl bg-card border card-shadow overflow-hidden h-full flex flex-col">
                      <div className="aspect-video w-full bg-muted/30 shrink-0">
                        {primary?.file_type === 'youtube' && primary?.youtube_url && (
                          <iframe
                            src={`https://www.youtube.com/embed/${primary.youtube_url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([a-zA-Z0-9_-]{11})/)?.[1] || ''}`}
                            className="w-full h-full" allowFullScreen
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" />
                        )}
                        {primary?.file_type === 'image' && primary?.file_url && (
                          <a href={primary.file_url} target="_blank" rel="noopener noreferrer" className="block w-full h-full">
                            <img src={primary.file_url} alt={item.judul} className="w-full h-full object-cover" />
                          </a>
                        )}
                        {primary?.file_type === 'pdf' && primary?.file_url && (
                          <iframe src={`${primary.file_url}#toolbar=0&navpanes=0`} className="w-full h-full" title={item.judul} />
                        )}
                        {!primary && (
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground/50">
                            <FileText className="w-10 h-10" />
                          </div>
                        )}
                      </div>
                      <div className="p-4 flex-1 flex flex-col gap-2">
                        <p className="font-semibold text-foreground">{item.judul || 'Tanpa judul'}</p>
                        <div className="flex flex-wrap gap-1">
                          {kats.map(k => (
                            <Badge key={k} variant="secondary" className="text-[10px] font-normal">{KATEGORI_LABEL[k as keyof typeof KATEGORI_LABEL]}</Badge>
                          ))}
                        </div>
                        {item.deskripsi && <p className="text-sm text-muted-foreground leading-relaxed">{item.deskripsi}</p>}
                        {extra.length > 0 && (
                          <div className="mt-auto pt-2 border-t flex flex-wrap gap-2">
                            {extra.map((f, i) => (
                              <a key={f.id} href={f.file_url} target="_blank" rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 text-xs px-2 py-1 rounded bg-muted hover:bg-muted/70 text-foreground transition-colors">
                                {f.file_type === 'image' && <ImageIcon className="w-3 h-3" />}
                                {f.file_type === 'youtube' && <span className="text-red-500">▶</span>}
                                {!['image', 'youtube'].includes(f.file_type) && <FileText className="w-3 h-3" />}
                                {f.label || `File ${i + 2}`}
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </section>
      )}

      {/* ANALISIS ARTEFAK */}
      {a.some(item => ANALISIS_FIELDS.some(f => (item as any)[f.key])) && (
        <section id="analisis" className="py-10 sm:py-16 px-4 sm:px-6 bg-muted/30">
          <div className="max-w-4xl mx-auto">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2 text-center flex items-center justify-center gap-3">
                <FileSearch className="w-7 h-7 text-primary" /> Analisis Artefak
              </h2>
              <p className="text-sm text-muted-foreground text-center mb-8 sm:mb-12">Analisis mendalam 7 dimensi untuk setiap artefak</p>
            </motion.div>

            <Accordion type="multiple" className="space-y-3">
              {a.map(item => (
                <AccordionItem key={item.id} value={item.id} className="border rounded-xl bg-card card-shadow data-[state=open]:shadow-md">
                  <AccordionTrigger className="px-5 py-4 hover:no-underline">
                    <div className="text-left flex-1 min-w-0">
                      <p className="font-semibold text-foreground truncate">{item.judul || 'Artefak tanpa judul'}</p>
                      <p className="text-xs text-muted-foreground truncate">{(item.kategoris && item.kategoris.length ? item.kategoris : [item.kategori]).map(k => KATEGORI_LABEL[k as keyof typeof KATEGORI_LABEL]).join(' • ')}</p>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-5 pb-5 space-y-5">
                    {ANALISIS_FIELDS.map(f => {
                      const val = (item as any)[f.key];
                      if (!val) return null;
                      return (
                        <div key={f.key} className="border-l-2 border-primary/40 pl-4">
                          <h4 className="font-semibold text-foreground mb-1.5 flex items-center gap-2">
                            <f.icon className="w-4 h-4 text-primary" /> {f.label}
                          </h4>
                          <p className="text-sm sm:text-base text-foreground/85 leading-relaxed whitespace-pre-line">{val}</p>
                        </div>
                      );
                    })}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>
      )}

      {/* REFLEKSI DIRI */}
      {(r.pengalaman_mengajar || r.kekuatan_diri || r.kelemahan_diri || r.rencana_tindak_lanjut || r.filosofi_mengajar) && (
        <section id="refleksi" className="py-10 sm:py-16 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2 text-center flex items-center justify-center gap-3">
                <Heart className="w-7 h-7 text-primary" /> Refleksi Diri
              </h2>
              <p className="text-sm text-muted-foreground text-center mb-8 sm:mb-12">Refleksi mendalam atas perjalanan menjadi guru profesional</p>
            </motion.div>

            <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-5" variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              {r.pengalaman_mengajar && (
                <motion.div variants={fadeUp} className="md:col-span-2 p-6 rounded-xl bg-primary/5 border-2 border-primary/20">
                  <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2"><Heart className="w-5 h-5 text-primary" /> Refleksi Pengalaman Mengajar</h3>
                  <p className="text-foreground/85 leading-relaxed whitespace-pre-line">{r.pengalaman_mengajar}</p>
                </motion.div>
              )}
              {r.kekuatan_diri && (
                <motion.div variants={fadeUp} className="p-6 rounded-xl bg-card border card-shadow">
                  <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2"><TrendingUp className="w-5 h-5 text-emerald-500" /> Kekuatan Diri</h3>
                  <p className="text-foreground/85 leading-relaxed whitespace-pre-line">{r.kekuatan_diri}</p>
                </motion.div>
              )}
              {r.kelemahan_diri && (
                <motion.div variants={fadeUp} className="p-6 rounded-xl bg-card border card-shadow">
                  <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2"><AlertCircleIcon className="w-5 h-5 text-amber-500" /> Kelemahan Diri</h3>
                  <p className="text-foreground/85 leading-relaxed whitespace-pre-line">{r.kelemahan_diri}</p>
                </motion.div>
              )}
              {r.rencana_tindak_lanjut && (
                <motion.div variants={fadeUp} className="md:col-span-2 p-6 rounded-xl bg-card border card-shadow">
                  <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2"><Target className="w-5 h-5 text-primary" /> Rencana Tindak Lanjut</h3>
                  <p className="text-foreground/85 leading-relaxed whitespace-pre-line">{r.rencana_tindak_lanjut}</p>
                </motion.div>
              )}
              {r.filosofi_mengajar && (
                <motion.div variants={fadeUp} className="md:col-span-2 p-7 rounded-xl border-l-4 border-primary bg-gradient-to-br from-primary/5 to-transparent">
                  <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2"><Sparkles className="w-5 h-5 text-violet-500" /> Filosofi Mengajar</h3>
                  <p className="text-lg italic text-foreground/90 leading-relaxed whitespace-pre-line">"{r.filosofi_mengajar}"</p>
                </motion.div>
              )}
            </motion.div>
          </div>
        </section>
      )}

      {/* MODEL GURU */}
      {(m.visi || m.misi || m.kompetensi.length > 0 || m.karakter.length > 0) && (
        <section id="model-guru" className="py-10 sm:py-16 px-4 sm:px-6 bg-muted/30">
          <div className="max-w-5xl mx-auto">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2 text-center flex items-center justify-center gap-3">
                <Star className="w-7 h-7 text-primary" /> Model Guru yang Dituju
              </h2>
              <p className="text-sm text-muted-foreground text-center mb-8 sm:mb-12">Visi, misi, kompetensi, dan karakter sebagai calon guru profesional</p>
            </motion.div>

            {m.visi && (
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-12">
                <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Visi</p>
                <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary max-w-3xl mx-auto leading-tight">"{m.visi}"</p>
              </motion.div>
            )}

            <div className="grid md:grid-cols-2 gap-8">
              {m.misi && (
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="p-6 rounded-xl bg-card border card-shadow">
                  <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2"><Target className="w-5 h-5 text-primary" /> Misi</h3>
                  <ul className="space-y-2.5">
                    {m.misi.split('\n').filter(Boolean).map((line, i) => (
                      <li key={i} className="flex items-start gap-3 text-foreground/85">
                        <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-semibold flex items-center justify-center mt-0.5 shrink-0">{i + 1}</span>
                        <span className="leading-relaxed">{line}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}

              {m.kompetensi.length > 0 && (
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="p-6 rounded-xl bg-card border card-shadow">
                  <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2"><FlaskConical className="w-5 h-5 text-primary" /> Kompetensi</h3>
                  <div className="space-y-4">
                    {m.kompetensi.map((k, i) => (
                      <div key={i}>
                        <div className="flex justify-between text-sm mb-1.5">
                          <span className="text-foreground font-medium">{k.nama}</span>
                          <span className="text-muted-foreground">{k.level}%</span>
                        </div>
                        <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                          <motion.div className="h-full hero-gradient rounded-full" initial={{ width: 0 }} whileInView={{ width: `${k.level}%` }} viewport={{ once: true }} transition={{ duration: 1, delay: i * 0.1 }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {m.karakter.length > 0 && (
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="mt-10 text-center">
                <h3 className="font-semibold text-foreground mb-4 flex items-center justify-center gap-2"><Award className="w-5 h-5 text-primary" /> Karakter</h3>
                <div className="flex flex-wrap justify-center gap-2.5">
                  {m.karakter.map((k, i) => (
                    <Badge key={i} variant="secondary" className="px-4 py-2 text-sm font-medium">{k}</Badge>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </section>
      )}

      {/* LAMPIRAN PENILAIAN — disembunyikan dari preview publik */}

      {/* FOOTER */}
      <footer className="py-10 px-6 text-center bg-foreground text-background">
        <p className="font-semibold text-lg">{p.full_name || 'Nama Mahasiswa'}</p>
        <p className="text-sm opacity-70 mt-1">Program PPG Prajabatan Informatika • {new Date().getFullYear()}</p>
        {(p.asal_kampus || p.bidang_studi) && (
          <p className="text-xs opacity-50 mt-1">{p.asal_kampus}{p.asal_kampus && p.bidang_studi && ' — '}{p.bidang_studi}</p>
        )}
      </footer>
    </div>
  );
};

export default PortfolioShowcase;
