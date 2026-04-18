import { useAuth } from '@/contexts/AuthContext';
import { usePortfolio } from '@/contexts/PortfolioContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { Home, User, BookOpen, FileSearch, Heart, Star, Paperclip, Eye, ExternalLink, CheckCircle2, Circle, Trophy, TrendingUp } from 'lucide-react';
import PageTransition from '@/components/PageTransition';
import ShareDialog from '@/components/ShareDialog';
import { motion } from 'framer-motion';

const sections = [
  { title: 'Beranda', icon: Home, path: '/dashboard/beranda', desc: 'Identitas, pengantar, kutipan motivasi' },
  { title: 'Profil Mahasiswa', icon: User, path: '/dashboard/profil', desc: 'Cerita & narasi storytelling' },
  { title: 'Artefak Mengajar', icon: BookOpen, path: '/dashboard/artefak', desc: 'Kategori artefak + analisis' },
  { title: 'Analisis Artefak', icon: FileSearch, path: '/dashboard/analisis', desc: '7 dimensi analisis per artefak' },
  { title: 'Refleksi Diri', icon: Heart, path: '/dashboard/refleksi', desc: 'Pengalaman, kekuatan, RTL, filosofi' },
  { title: 'Model Guru', icon: Star, path: '/dashboard/model-guru', desc: 'Visi, misi, kompetensi, karakter' },
  { title: 'Lampiran Penilaian', icon: Paperclip, path: '/dashboard/lampiran', desc: 'Lampiran 7, 8, dan pendukung' },
];

const RUBRIK_CHECKLIST = [
  { key: 'beranda', label: 'Beranda lengkap (identitas + pengantar + motivasi)' },
  { key: 'profil', label: 'Profil lengkap (cerita & narasi)' },
  { key: 'artefak', label: 'Artefak lengkap (judul, deskripsi, kategori)' },
  { key: 'analisis', label: 'Analisis lengkap (7 dimensi per artefak)' },
  { key: 'refleksi', label: 'Refleksi lengkap (5 dimensi)' },
  { key: 'model_guru', label: 'Model Guru lengkap (visi, misi, kompetensi, karakter)' },
  { key: 'lampiran', label: 'Lampiran terupload' },
] as const;

const LEVEL_CONFIG = {
  sangat_baik: { label: 'Sangat Baik', color: 'bg-emerald-500', textColor: 'text-emerald-700 dark:text-emerald-300', bgColor: 'bg-emerald-50 dark:bg-emerald-950/30', borderColor: 'border-emerald-300 dark:border-emerald-800' },
  baik: { label: 'Baik', color: 'bg-primary', textColor: 'text-primary', bgColor: 'bg-primary/5', borderColor: 'border-primary/30' },
  cukup: { label: 'Cukup', color: 'bg-amber-500', textColor: 'text-amber-700 dark:text-amber-300', bgColor: 'bg-amber-50 dark:bg-amber-950/30', borderColor: 'border-amber-300 dark:border-amber-800' },
  kurang: { label: 'Kurang', color: 'bg-destructive', textColor: 'text-destructive', bgColor: 'bg-destructive/5', borderColor: 'border-destructive/30' },
} as const;

const DashboardHome = () => {
  const { user } = useAuth();
  const { completionPercent, data, sectionStatus, rubrikLevel, slug } = usePortfolio();
  const name = data.profile.full_name || user?.user_metadata?.full_name || 'Mahasiswa';
  const level = LEVEL_CONFIG[rubrikLevel];

  return (
    <PageTransition>
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground break-words">Selamat datang, {name}!</h1>
          <p className="text-muted-foreground">Kelola e-portfolio PPG Prajabatan Anda berdasarkan rubrik penilaian.</p>
        </div>

        {/* Status Rubrik */}
        <Card className={`card-shadow border-2 ${level.borderColor} ${level.bgColor}`}>
          <CardContent className="pt-6">
            <div className="flex items-start gap-4 flex-wrap">
              <div className={`w-14 h-14 rounded-full ${level.color} flex items-center justify-center shrink-0`}>
                <Trophy className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-muted-foreground">Status Penilaian Saat Ini</p>
                <h2 className={`text-2xl font-bold ${level.textColor}`}>{level.label}</h2>
                <Progress value={completionPercent} className="h-2 mt-3" />
                <p className="text-sm text-muted-foreground mt-1">{completionPercent}% kelengkapan rubrik</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Validasi Checklist */}
        <Card className="card-shadow">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2"><TrendingUp className="w-4 h-4 text-primary" /> Validasi Rubrik</CardTitle>
            <CardDescription>Checklist kelengkapan setiap bagian portfolio</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {RUBRIK_CHECKLIST.map(item => {
                const done = sectionStatus[item.key as keyof typeof sectionStatus];
                return (
                  <li key={item.key} className="flex items-center gap-3 text-sm">
                    {done
                      ? <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                      : <Circle className="w-5 h-5 text-muted-foreground/40 shrink-0" />}
                    <span className={done ? 'text-foreground' : 'text-muted-foreground'}>{item.label}</span>
                    {done && <Badge variant="secondary" className="ml-auto text-xs">✓</Badge>}
                  </li>
                );
              })}
            </ul>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sections.map((s, i) => (
            <motion.div key={s.path} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 + i * 0.05, duration: 0.4 }}>
              <Link to={s.path}>
                <Card className="card-shadow hover:card-shadow-hover transition-all duration-300 cursor-pointer group hover:-translate-y-0.5 h-full">
                  <CardContent className="pt-6 flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg hero-gradient flex items-center justify-center shrink-0">
                      <s.icon className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-medium text-foreground group-hover:text-primary transition-colors">{s.title}</h3>
                      <p className="text-sm text-muted-foreground">{s.desc}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link to="/dashboard/preview">
            <Button className="w-full sm:w-auto"><Eye className="w-4 h-4 mr-2" /> Preview Portfolio</Button>
          </Link>
          {slug && (
            <Link to={`/portfolio/${slug}`} target="_blank">
              <Button variant="outline" className="w-full sm:w-auto"><ExternalLink className="w-4 h-4 mr-2" /> Lihat Halaman Publik</Button>
            </Link>
          )}
          {user && slug && <ShareDialog userId={user.id} slug={slug} />}
        </div>
      </div>
    </PageTransition>
  );
};

export default DashboardHome;
