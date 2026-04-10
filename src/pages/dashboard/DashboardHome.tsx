import { useAuth } from '@/contexts/AuthContext';
import { usePortfolio } from '@/contexts/PortfolioContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { User, BookOpen, Paperclip, Star, Eye, AlertCircle, ExternalLink } from 'lucide-react';

const sections = [
  { title: 'Profil Mahasiswa', icon: User, path: '/dashboard/profil', desc: 'Data diri dan cerita inspirasi' },
  { title: 'Analisis Artefak', icon: BookOpen, path: '/dashboard/artefak', desc: 'Kendala, teori, dan adaptasi' },
  { title: 'Lampiran', icon: Paperclip, path: '/dashboard/lampiran', desc: 'Perangkat dan praktik mengajar' },
  { title: 'Model Guru', icon: Star, path: '/dashboard/model-guru', desc: 'Visi, misi, dan kompetensi' },
];

const DashboardHome = () => {
  const { user } = useAuth();
  const { completionPercent, data } = usePortfolio();
  const name = data.profile.full_name || user?.user_metadata?.full_name || 'Mahasiswa';

  const incomplete: string[] = [];
  if (!data.profile.full_name) incomplete.push('Nama lengkap');
  if (!data.profile.kutipan_motivasi) incomplete.push('Kutipan motivasi');
  if (!data.artefak.kendala) incomplete.push('Analisis kendala');
  if (!data.model_guru.visi) incomplete.push('Visi guru');
  if (data.lampiran.length === 0) incomplete.push('Lampiran');

  return (
    <div className="max-w-4xl mx-auto space-y-6 fade-in">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-foreground break-words">Selamat datang, {name}!</h1>
        <p className="text-muted-foreground">Kelola e-portfolio PPG Prajabatan Anda.</p>
      </div>

      <Card className="card-shadow">
        <CardHeader>
          <CardTitle className="text-base">Kelengkapan Portfolio</CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={completionPercent} className="h-3 mb-2" />
          <p className="text-sm text-muted-foreground">{completionPercent}% terisi</p>
        </CardContent>
      </Card>

      {incomplete.length > 0 && (
        <Card className="border-destructive/30 bg-destructive/5 card-shadow">
          <CardContent className="pt-4">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-destructive mt-0.5" />
              <div>
                <p className="text-sm font-medium text-foreground">Bagian yang belum diisi:</p>
                <ul className="text-sm text-muted-foreground mt-1 space-y-0.5">
                  {incomplete.map(i => <li key={i}>• {i}</li>)}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sections.map(s => (
          <Link to={s.path} key={s.path}>
            <Card className="card-shadow hover:card-shadow-hover transition-shadow cursor-pointer group">
              <CardContent className="pt-6 flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg hero-gradient flex items-center justify-center shrink-0">
                  <s.icon className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground group-hover:text-primary transition-colors">{s.title}</h3>
                  <p className="text-sm text-muted-foreground">{s.desc}</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="flex gap-3">
        <Link to="/dashboard/preview">
          <Button>
            <Eye className="w-4 h-4 mr-2" />
            Preview Portfolio
          </Button>
        </Link>
        <Link to={`/portfolio/${user?.id}`} target="_blank">
          <Button variant="outline">
            <ExternalLink className="w-4 h-4 mr-2" />
            Lihat Halaman Publik
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default DashboardHome;
