import { motion } from 'framer-motion';
import { PortfolioData } from '@/contexts/PortfolioContext';
import { AlertTriangle, BookOpen, CheckCircle, RefreshCw, FileText, Image as ImageIcon, GraduationCap, ChevronDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } } };
const staggerContainer = { hidden: {}, visible: { transition: { staggerChildren: 0.12 } } };

interface Props {
  data: PortfolioData;
}

const PortfolioShowcase = ({ data }: Props) => {
  const p = data.profile;
  const a = data.artefak;
  const m = data.model_guru;
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-background w-full max-w-full overflow-hidden">
      {/* HERO */}
      <section className="showcase-hero text-primary-foreground py-12 sm:py-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.6 }}>
            {p.foto_url && (
              <img src={p.foto_url} alt={p.full_name} className="w-20 h-20 sm:w-28 sm:h-28 rounded-full mx-auto mb-4 sm:mb-6 border-4 border-primary-foreground/30 object-cover" />
            )}
            <p className="text-xs sm:text-sm uppercase tracking-widest opacity-80 mb-2">Mahasiswa PPG Prajabatan</p>
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-3 break-words">{p.full_name || 'Nama Mahasiswa'}</h1>
            <p className="opacity-80 mb-4 sm:mb-6 text-sm sm:text-base break-words">{p.asal_daerah && `${p.asal_daerah} • `}{p.asal_kampus} • {p.bidang_studi}</p>
            {p.kutipan_motivasi && (
              <blockquote className="text-base sm:text-xl md:text-2xl italic font-light max-w-2xl mx-auto leading-relaxed opacity-90 break-words">
                "{p.kutipan_motivasi}"
              </blockquote>
            )}
            <a href="#profil" className="inline-flex items-center gap-2 mt-6 sm:mt-8 px-6 py-3 rounded-full bg-primary-foreground/20 hover:bg-primary-foreground/30 transition-colors text-sm font-medium">
              Lihat Portofolio <ChevronDown className="w-4 h-4" />
            </a>
          </motion.div>
        </div>
      </section>

      {/* PROFIL / STORY */}
      <section id="profil" className="py-10 sm:py-16 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.6 }}>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-6 sm:mb-10 text-center">Profil & Cerita Saya</h2>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-10">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.6, delay: 0.1 }} className="space-y-6">
              {p.keunikan_daerah && (
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">🏡 Keunikan Daerah Asal</h3>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{p.keunikan_daerah}</p>
                </div>
              )}
              {p.inspirasi_guru && (
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">💡 Inspirasi Menjadi Guru</h3>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{p.inspirasi_guru}</p>
                </div>
              )}
            </motion.div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.6, delay: 0.2 }} className="space-y-6">
              {p.tujuan_profesional && (
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">🎯 Tujuan Profesional</h3>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{p.tujuan_profesional}</p>
                </div>
              )}
              <div className="p-6 rounded-xl bg-muted/50">
                <GraduationCap className="w-8 h-8 text-primary mb-3" />
                <p className="text-sm text-muted-foreground"><strong className="text-foreground">{p.asal_kampus}</strong><br />{p.bidang_studi}</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ARTEFAK */}
      <section className="py-10 sm:py-16 px-4 sm:px-6 bg-muted/30">
        <div className="max-w-5xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-6 sm:mb-10 text-center">Analisis Artefak Pembelajaran</h2>
          </motion.div>
          <motion.div className="grid md:grid-cols-2 gap-6" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
            {[
              { key: 'kendala', label: 'Kendala', icon: AlertTriangle, text: a.kendala },
              { key: 'teori_pedagogi', label: 'Teori Pedagogi', icon: BookOpen, text: a.teori_pedagogi },
              { key: 'faktor_keberhasilan', label: 'Faktor Keberhasilan', icon: CheckCircle, text: a.faktor_keberhasilan },
              { key: 'adaptasi_pembelajaran', label: 'Adaptasi Pembelajaran', icon: RefreshCw, text: a.adaptasi_pembelajaran },
            ].map((item) => (
              <motion.div key={item.key} variants={fadeUp}>
                <div
                  className="p-6 rounded-xl bg-card card-shadow hover:card-shadow-hover transition-all cursor-pointer"
                  onClick={() => setExpandedCard(expandedCard === item.key ? null : item.key)}
                >
                  <item.icon className="w-8 h-8 text-primary mb-3" />
                  <h3 className="font-semibold text-foreground mb-2">{item.label}</h3>
                  <p className={`text-sm text-muted-foreground leading-relaxed whitespace-pre-line ${expandedCard === item.key ? '' : 'line-clamp-3'}`}>
                    {item.text || 'Belum diisi'}
                  </p>
                  {item.text && item.text.length > 150 && (
                    <p className="text-xs text-primary mt-2 font-medium">{expandedCard === item.key ? 'Tutup' : 'Baca selengkapnya'}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* LAMPIRAN */}
      {data.lampiran.length > 0 && (
        <section className="py-10 sm:py-16 px-4 sm:px-6">
          <div className="max-w-5xl mx-auto">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-6 sm:mb-10 text-center">Lampiran Penilaian</h2>
            </motion.div>
            <div className="grid md:grid-cols-2 gap-6">
              {data.lampiran.map(item => (
                <motion.div key={item.id} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
                  <div className="rounded-lg bg-card card-shadow overflow-hidden">
                    {/* YouTube embed */}
                    {item.file_type === 'youtube' && item.youtube_url && (
                      <div className="aspect-video">
                        <iframe
                          src={`https://www.youtube.com/embed/${item.youtube_url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([a-zA-Z0-9_-]{11})/)?.[1] || ''}`}
                          className="w-full h-full"
                          allowFullScreen
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        />
                      </div>
                    )}
                    {/* Image preview */}
                    {item.file_type === 'image' && (
                      <a href={item.file_url} target="_blank" rel="noopener noreferrer">
                        <img src={item.file_url} alt={item.judul || item.nama} className="w-full h-48 object-cover" />
                      </a>
                    )}
                    {/* PDF embed preview */}
                    {item.file_type === 'pdf' && item.file_url && (
                      <div className="h-48 bg-muted/30">
                        <iframe src={`${item.file_url}#toolbar=0&navpanes=0`} className="w-full h-full" title={item.judul || item.nama} />
                      </div>
                    )}
                    {/* Info bar */}
                    <a href={item.file_type === 'youtube' ? (item.youtube_url || '#') : item.file_url} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-3 p-4 hover:bg-muted/50 transition-colors">
                      {item.file_type === 'image' ? <ImageIcon className="w-5 h-5 text-primary shrink-0" /> :
                       item.file_type === 'youtube' ? <span className="text-lg shrink-0">▶️</span> :
                       <FileText className="w-5 h-5 text-primary shrink-0" />}
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{item.judul || item.nama}</p>
                        {item.judul && item.judul !== item.nama && (
                          <p className="text-xs text-muted-foreground truncate">{item.nama}</p>
                        )}
                      </div>
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* MODEL GURU */}
      <section className="py-10 sm:py-16 px-4 sm:px-6 bg-muted/30">
        <div className="max-w-5xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-6 sm:mb-10 text-center">Model Guru yang Dituju</h2>
          </motion.div>

          {m.visi && (
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-10">
              <p className="text-2xl font-bold text-primary max-w-2xl mx-auto">"{m.visi}"</p>
            </motion.div>
          )}

          <div className="grid md:grid-cols-2 gap-8">
            {m.misi && (
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
                <h3 className="font-semibold text-foreground mb-4">Misi</h3>
                <ul className="space-y-2">
                  {m.misi.split('\n').filter(Boolean).map((line, i) => (
                    <li key={i} className="flex items-start gap-2 text-muted-foreground">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                      {line}
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}

            {m.kompetensi.length > 0 && (
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
                <h3 className="font-semibold text-foreground mb-4">Kompetensi</h3>
                <div className="space-y-3">
                  {m.kompetensi.map((k, i) => (
                    <div key={i}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-foreground">{k.nama}</span>
                        <span className="text-muted-foreground">{k.level}%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <motion.div className="h-full hero-gradient rounded-full" initial={{ width: 0 }} whileInView={{ width: `${k.level}%` }} viewport={{ once: true }} transition={{ duration: 1, delay: i * 0.1 }} />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {m.karakter.length > 0 && (
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="mt-8 text-center">
              <h3 className="font-semibold text-foreground mb-4">Karakter</h3>
              <div className="flex flex-wrap justify-center gap-2">
                {m.karakter.map((k, i) => (
                  <Badge key={i} variant="secondary" className="px-4 py-1.5 text-sm">{k}</Badge>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-10 px-6 text-center bg-foreground text-background">
        <p className="font-semibold text-lg">{p.full_name || 'Nama Mahasiswa'}</p>
        <p className="text-sm opacity-70 mt-1">Program PPG Prajabatan • {new Date().getFullYear()}</p>
        <p className="text-xs opacity-50 mt-1">{p.asal_kampus} — {p.bidang_studi}</p>
      </footer>
    </div>
  );
};

export default PortfolioShowcase;
