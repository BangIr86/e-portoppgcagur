import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { PortfolioData, KATEGORI_LABEL, ArtefakItem } from '@/contexts/PortfolioContext';
import {
  AlertTriangle, BookOpen, CheckCircle, RefreshCw, FileText, Image as ImageIcon, GraduationCap,
  ChevronDown, Heart, TrendingUp, AlertCircle as AlertCircleIcon, Target, Sparkles, Quote, MapPin,
  FileSearch, FlaskConical, Award, Star, ChevronRight, ArrowLeft, ExternalLink, Folder, Menu, X
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import PdfViewer from '@/components/PdfViewer';
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

  const [openArtefak, setOpenArtefak] = useState<ArtefakItem | null>(null);
  const [openKategori, setOpenKategori] = useState<string | null>(null);
  
  // State untuk Menu HP (Mobile)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Lampiran 7 & 8 highlight
  const lampiran7 = data.lampiran.filter(l => l.tipe === 'lampiran7');
  const lampiran8 = data.lampiran.filter(l => l.tipe === 'lampiran8');
  const lampiranOther = data.lampiran.filter(l => !['lampiran7', 'lampiran8'].includes(l.tipe));

  const navLinks = [
    { name: 'Profil', href: '#profil' },
    { name: 'Artefak', href: '#artefak' },
    { name: 'Refleksi', href: '#refleksi' },
    { name: 'Model Guru', href: '#model-guru' },
  ];

  return (
    <div style={themeToStyle(theme, themeOverrides)} data-uppercase-headings={uppercase ? 'true' : 'false'} className="portfolio-themed min-h-screen bg-background text-foreground w-full max-w-full overflow-x-hidden">
      
      {/* KODE NAVBAR DI SINI - Ketinggian diturunkan ke h-14 */}
      <nav className="fixed top-0 left-0 z-40 w-full backdrop-blur-xl bg-background/70 border-b border-primary/10 shadow-sm transition-all duration-300">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            {/* Logo diganti menjadi teks E-Portofolio statik */}
            <div className="flex-shrink-0">
              <a href="#beranda" className="font-bold text-xl sm:text-2xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-violet-500 hover:opacity-80 transition-opacity">
                E-Portofolio
              </a>
            </div>
            
            {/* Navigasi Desktop */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-center space-x-2">
                {navLinks.map((link) => (
                  <a 
                    key={link.name}
                    href={link.href} 
                    className="relative group px-4 py-2 rounded-full text-sm font-medium text-foreground/80 hover:text-primary hover:bg-primary/5 transition-all duration-300"
                  >
                    {link.name}
                    {/* Animasi garis bawah elegan */}
                    <span className="absolute inset-x-4 bottom-1 h-0.5 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 rounded-full"></span>
                  </a>
                ))}
              </div>
            </div>

            {/* Tombol Menu Mobile */}
            <div className="md:hidden flex items-center">
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-foreground/80 hover:text-primary p-2 focus:outline-none transition-colors"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Menu Dropdown Mobile */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-background border-b border-primary/10 shadow-lg py-2 px-4 flex flex-col space-y-1 slide-in-top">
            {navLinks.map((link) => (
              <a 
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-4 py-3 rounded-lg text-base font-medium text-foreground/80 hover:text-primary hover:bg-primary/5 transition-colors"
              >
                {link.name}
              </a>
            ))}
          </div>
        )}
      </nav>
      {/* KODE NAVBAR SELESAI */}

      {/* HERO BERANDA - Jarak padding dilaraskan semula */}
      <section id="beranda" className="showcase-hero text-primary-foreground pt-24 pb-12 sm:pt-28 sm:pb-24 px-4 sm:px-6">
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
      <section id="profil" className="scroll-mt-20 py-10 sm:py-16 px-4 sm:px-6 bg-muted/30">
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

      {/* ARTEFAK MENGAJAR & ANALISIS - Desain Sejajar Baru */}
      {a.length > 0 && (
        <section id="artefak" className="scroll-mt-20 py-10 sm:py-16 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2 text-center">Artefak Mengajar & Analisis</h2>
              <p className="text-sm text-muted-foreground text-center mb-8 sm:mb-12">Dokumentasi karya dan analisis pembelajaran</p>
            </motion.div>

            <motion.div className="space-y-8" variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              {a.map(item => {
                const files = item.files && item.files.length
                  ? item.files
                  : (item.file_url ? [{ id: 'legacy', file_url: item.file_url, file_type: item.file_type, youtube_url: item.youtube_url }] : []);
                const kats = item.kategoris && item.kategoris.length ? item.kategoris : [item.kategori];
                const hasAnalisis = ANALISIS_FIELDS.some(f => (item as any)[f.key]);

                return (
                  <motion.div key={item.id} variants={fadeUp} className="bg-card border card-shadow rounded-2xl overflow-hidden flex flex-col md:flex-row">
                    
                    {/* Kolom Kiri: Informasi Artefak */}
                    <div className="p-6 md:p-8 flex-1 md:w-1/2 border-b md:border-b-0 md:border-r border-border flex flex-col">
                      <div className="flex-1">
                        <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-3">{item.judul || 'Tanpa judul'}</h3>
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {kats.map(k => (
                            <Badge key={k} variant="secondary" className="font-medium px-2 py-0.5">
                              {KATEGORI_LABEL[k as keyof typeof KATEGORI_LABEL]}
                            </Badge>
                          ))}
                        </div>
                        {item.deskripsi && <p className="text-base text-muted-foreground leading-relaxed mb-6">{item.deskripsi}</p>}
                      </div>
                      <div className="mt-4 pt-4 border-t border-border/50">
                        <Button 
                          onClick={() => { setOpenArtefak(item); setOpenKategori(null); }}
                          className="w-full sm:w-auto flex items-center justify-center gap-2"
                          size="lg"
                        >
                          <Folder className="w-5 h-5" /> Buka File Artefak ({files.length})
                        </Button>
                      </div>
                    </div>

                    {/* Kolom Kanan: Analisis Pembelajaran */}
                    <div className="p-6 md:p-8 flex-1 md:w-1/2 bg-muted/10">
                      <h4 className="font-semibold text-lg text-foreground mb-5 flex items-center gap-2">
                        <FileSearch className="w-5 h-5 text-primary" /> Analisis Pembelajaran
                      </h4>
                      
                      {hasAnalisis ? (
                        <div className="space-y-5">
                          {ANALISIS_FIELDS.map(f => {
                            const val = (item as any)[f.key];
                            if (!val) return null;
                            return (
                              <div key={f.key} className="border-l-2 border-primary/40 pl-4">
                                <h5 className="font-semibold text-sm text-foreground mb-1.5 flex items-center gap-2">
                                  <f.icon className="w-4 h-4 text-primary" /> {f.label}
                                </h5>
                                <p className="text-sm sm:text-base text-foreground/85 leading-relaxed whitespace-pre-line">{val}</p>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground opacity-60 py-8">
                          <FileText className="w-12 h-12 mb-3 opacity-20" />
                          <p className="text-sm">Belum ada catatan analisis untuk artefak ini.</p>
                        </div>
                      )}
                    </div>
                    
                  </motion.div>
                );
              })}
            </motion.div>

            <ArtefakDialog
              item={openArtefak}
              kategori={openKategori}
              onClose={() => { setOpenArtefak(null); setOpenKategori(null); }}
              onSelectKategori={setOpenKategori}
              onBack={() => setOpenKategori(null)}
            />
          </div>
        </section>
      )}

      {/* REFLEKSI DIRI */}
      {(r.pengalaman_mengajar || r.kekuatan_diri || r.kelemahan_diri || r.rencana_tindak_lanjut || r.filosofi_mengajar) && (
        <section id="refleksi" className="scroll-mt-20 py-10 sm:py-16 px-4 sm:px-6">
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
        <section id="model-guru" className="scroll-mt-20 py-10 sm:py-16 px-4 sm:px-6 bg-muted/30">
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

interface ArtefakDialogProps {
  item: ArtefakItem | null;
  kategori: string | null;
  onClose: () => void;
  onSelectKategori: (k: string) => void;
  onBack: () => void;
}

const ArtefakDialog = ({ item, kategori, onClose, onSelectKategori, onBack }: ArtefakDialogProps) => {
  if (!item) return null;
  const files = item.files && item.files.length
    ? item.files
    : (item.file_url ? [{ id: 'legacy', file_url: item.file_url, file_type: item.file_type, youtube_url: item.youtube_url, kategori: item.kategori, label: '' } as any] : []);

  const groups: Record<string, typeof files> = {};
  files.forEach(f => {
    const k = (f as any).kategori || item.kategori;
    if (!groups[k]) groups[k] = [];
    groups[k].push(f);
  });
  const kategoriList = Object.keys(groups);
  const activeFiles = kategori ? groups[kategori] || [] : [];

  return (
    <Dialog open={!!item} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            {kategori && (
              <Button variant="ghost" size="sm" onClick={onBack} className="h-8 px-2">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            )}
            <div className="flex-1 min-w-0">
              <DialogTitle className="truncate">{item.judul || 'Tanpa judul'}</DialogTitle>
              <DialogDescription>
                {kategori
                  ? KATEGORI_LABEL[kategori as keyof typeof KATEGORI_LABEL]
                  : `${kategoriList.length} kategori • ${files.length} file/link`}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {!kategori && (
          <div className="space-y-2">
            {item.deskripsi && <p className="text-sm text-muted-foreground leading-relaxed mb-2">{item.deskripsi}</p>}
            {kategoriList.map(k => (
              <button
                key={k}
                onClick={() => onSelectKategori(k)}
                className="w-full text-left p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors flex items-center gap-3 group"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Folder className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground">{KATEGORI_LABEL[k as keyof typeof KATEGORI_LABEL]}</p>
                  <p className="text-xs text-muted-foreground">{groups[k].length} file/link</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </button>
            ))}
            {kategoriList.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-6">Belum ada file/link.</p>
            )}
          </div>
        )}

        {kategori && (
          <div className="space-y-4">
            {activeFiles.map((f: any, i) => (
              <div key={f.id || i} className="rounded-lg border overflow-hidden bg-card">
                {f.file_type === 'youtube' && f.youtube_url && (
                  <div className="aspect-video w-full bg-black">
                    <iframe
                      src={`https://www.youtube.com/embed/${f.youtube_url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([a-zA-Z0-9_-]{11})/)?.[1] || ''}`}
                      className="w-full h-full" allowFullScreen
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" />
                  </div>
                )}
                {f.file_type === 'image' && f.file_url && (
                  <a href={f.file_url} target="_blank" rel="noopener noreferrer" className="block">
                    <img src={f.file_url} alt={f.label || item.judul} className="w-full max-h-[60vh] object-contain bg-muted/30" />
                  </a>
                )}
                {f.file_type === 'pdf' && f.file_url && (
                  <PdfViewer url={f.file_url} title={f.label || item.judul} />
                )}
                <div className="p-3 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    {f.file_type === 'image' && <ImageIcon className="w-4 h-4 text-muted-foreground shrink-0" />}
                    {f.file_type === 'youtube' && <span className="text-red-500 shrink-0">▶</span>}
                    {!['image', 'youtube'].includes(f.file_type || '') && <FileText className="w-4 h-4 text-muted-foreground shrink-0" />}
                    <span className="text-sm font-medium truncate">{f.label || `File ${i + 1}`}</span>
                  </div>
                  {(f.file_url || f.youtube_url) && (
                    <a href={f.file_url || f.youtube_url} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-primary hover:underline shrink-0">
                      Buka <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PortfolioShowcase;
