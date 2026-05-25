import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { PortfolioData, KATEGORI_LABEL, ArtefakItem } from '@/contexts/PortfolioContext';
import {
  AlertTriangle, BookOpen, CheckCircle, RefreshCw, FileText, Image as ImageIcon, GraduationCap,
  ChevronDown, Heart, TrendingUp, AlertCircle as AlertCircleIcon, Target, Sparkles, Quote, MapPin,
  FileSearch, FlaskConical, Award, Star, ChevronRight, ArrowLeft, ExternalLink, Folder, Menu, X
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Profil', href: '#profil' },
    { name: 'Artefak', href: '#artefak' },
    { name: 'Refleksi', href: '#refleksi' },
    { name: 'Model Guru', href: '#model-guru' },
  ];

  return (
    <div style={themeToStyle(theme, themeOverrides)} data-uppercase-headings={uppercase ? 'true' : 'false'} className="portfolio-themed min-h-screen bg-background text-foreground w-full max-w-full overflow-x-hidden">
      
      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 z-40 w-full backdrop-blur-xl bg-background/70 border-b border-primary/10 shadow-sm transition-all duration-300">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <div className="flex-shrink-0">
              <a href="#beranda" className="font-bold text-xl sm:text-2xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-violet-500 hover:opacity-80 transition-opacity">
                E-Portofolio
              </a>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-center space-x-2">
                {navLinks.map((link) => (
                  <a key={link.name} href={link.href} className="relative group px-4 py-2 rounded-full text-sm font-medium text-foreground/80 hover:text-primary hover:bg-primary/5 transition-all duration-300">
                    {link.name}
                    <span className="absolute inset-x-4 bottom-1 h-0.5 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 rounded-full"></span>
                  </a>
                ))}
              </div>
            </div>
            <div className="md:hidden flex items-center">
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-foreground/80 hover:text-primary p-2 focus:outline-none transition-colors">
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section id="beranda" className="showcase-hero text-primary-foreground pt-24 pb-12 sm:pt-28 sm:pb-24 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial="hidden" animate="visible" variants={fadeUp}>
            {p.foto_url && <img src={p.foto_url} alt={p.full_name} className="w-24 h-24 sm:w-32 sm:h-32 rounded-full mx-auto mb-5 sm:mb-6 border-4 border-primary-foreground/30 object-cover" />}
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold mb-4 break-words">{p.full_name || 'Nama Mahasiswa'}</h1>
          </motion.div>
        </div>
      </section>

      {/* ARTEFAK SECTION */}
      {a.length > 0 && (
        <section id="artefak" className="scroll-mt-20 py-10 sm:py-16 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-12 text-center">Artefak Mengajar & Analisis</h2>
            </motion.div>

            <motion.div className="space-y-10" variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              {a.map(item => {
                const kats = item.kategoris && item.kategoris.length ? item.kategoris : [item.kategori];
                const hasAnalisis = ANALISIS_FIELDS.some(f => (item as any)[f.key]);

                return (
                  <motion.div key={item.id} variants={fadeUp} className="bg-card border card-shadow rounded-2xl overflow-hidden flex flex-col">
                    <div className="p-6 md:px-8 border-b border-border/50 text-center bg-muted/5">
                      <h3 className="text-xl sm:text-2xl font-bold text-foreground">{item.judul || 'Tanpa judul'}</h3>
                    </div>
                    <div className="flex flex-col md:flex-row flex-1">
                      {/* Kolom Kiri: Kategori Saja */}
                      <div className="p-6 md:p-8 flex-1 md:w-1/2 border-b md:border-b-0 md:border-r border-border">
                        <h4 className="font-semibold text-lg text-foreground mb-4 flex items-center gap-2">
                          <Folder className="w-5 h-5 text-primary" /> Artefak Pembelajaran
                        </h4>
                        <div className="space-y-3">
                          {kats.map(k => (
                            <button 
                              key={k}
                              onClick={() => { setOpenArtefak(item); setOpenKategori(k); }}
                              className="w-full flex items-center justify-between p-4 rounded-xl border border-border/60 bg-background hover:bg-primary/5 transition-all shadow-sm group"
                            >
                              <span className="text-sm sm:text-base font-medium">{KATEGORI_LABEL[k as keyof typeof KATEGORI_LABEL]}</span>
                              <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Kolom Kanan: Analisis */}
                      <div className="p-6 md:p-8 flex-1 md:w-1/2 bg-muted/10">
                        <h4 className="font-semibold text-lg text-foreground mb-5 flex items-center gap-2">
                          <FileSearch className="w-5 h-5 text-primary" /> Analisis Pembelajaran
                        </h4>
                        {hasAnalisis ? (
                          <Accordion type="single" collapsible className="w-full">
                            {ANALISIS_FIELDS.map(f => {
                              const val = (item as any)[f.key];
                              if (!val) return null;
                              return (
                                <AccordionItem key={f.key} value={f.key} className="border-b-primary/10 border-b last:border-b-0">
                                  <AccordionTrigger className="py-3 hover:no-underline text-left">
                                    <div className="flex items-center gap-2 font-medium text-sm sm:text-base"><f.icon className="w-4 h-4 text-primary" /> {f.label}</div>
                                  </AccordionTrigger>
                                  <AccordionContent className="text-sm sm:text-base text-foreground/85 leading-relaxed pb-4 pt-1">{val}</AccordionContent>
                                </AccordionItem>
                              );
                            })}
                          </Accordion>
                        ) : (
                          <div className="text-center text-muted-foreground py-8">Belum ada analisis.</div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
            
            <ArtefakDialog item={openArtefak} kategori={openKategori} onClose={() => { setOpenArtefak(null); setOpenKategori(null); }} onSelectKategori={setOpenKategori} onBack={() => setOpenKategori(null)} />
          </div>
        </section>
      )}
    </div>
  );
};

// ... (Komponen ArtefakDialog tetap sama seperti sebelumnya)

export default PortfolioShowcase;
