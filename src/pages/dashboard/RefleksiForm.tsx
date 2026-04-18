import PageTransition from '@/components/PageTransition';
import { usePortfolio, ReflectionData } from '@/contexts/PortfolioContext';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Heart, TrendingUp, AlertCircle, Target, Sparkles } from 'lucide-react';

const FIELDS: { key: keyof ReflectionData; label: string; desc: string; icon: any; iconColor: string; placeholder: string }[] = [
  {
    key: 'pengalaman_mengajar',
    label: 'Refleksi Pengalaman Mengajar',
    desc: 'Refleksi atas pengalaman PPL: apa yang terjadi, apa yang Anda rasakan, apa yang Anda pelajari.',
    icon: Heart, iconColor: 'text-rose-500',
    placeholder: 'Ceritakan pengalaman mengajar yang paling berkesan, tantangan yang dihadapi, dan pembelajaran yang didapat...',
  },
  {
    key: 'kekuatan_diri',
    label: 'Kekuatan Diri',
    desc: 'Kompetensi, sikap, dan kebiasaan yang menjadi modal Anda sebagai calon guru.',
    icon: TrendingUp, iconColor: 'text-emerald-500',
    placeholder: 'Identifikasi kekuatan diri yang mendukung profesi guru (mis. kemampuan komunikasi, kreativitas, ketekunan)...',
  },
  {
    key: 'kelemahan_diri',
    label: 'Kelemahan Diri',
    desc: 'Area yang masih perlu dikembangkan secara jujur dan reflektif.',
    icon: AlertCircle, iconColor: 'text-amber-500',
    placeholder: 'Identifikasi kelemahan yang perlu diperbaiki (mis. manajemen kelas, penguasaan teknologi tertentu)...',
  },
  {
    key: 'rencana_tindak_lanjut',
    label: 'Rencana Tindak Lanjut',
    desc: 'Langkah konkret untuk mengembangkan diri ke depan.',
    icon: Target, iconColor: 'text-primary',
    placeholder: 'Tuliskan rencana pengembangan diri (mis. mengikuti pelatihan, membaca literatur, latihan rutin)...',
  },
  {
    key: 'filosofi_mengajar',
    label: 'Filosofi Mengajar',
    desc: 'Nilai dan keyakinan yang mendasari cara Anda mengajar.',
    icon: Sparkles, iconColor: 'text-violet-500',
    placeholder: 'Tuliskan filosofi mengajar Anda — apa yang Anda yakini tentang pendidikan, pembelajaran, dan peran guru...',
  },
];

const RefleksiForm = () => {
  const { data, updateReflection } = usePortfolio();
  const r = data.reflection;

  return (
    <PageTransition>
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Refleksi Diri</h1>
          <p className="text-muted-foreground">Refleksi mendalam atas perjalanan menjadi calon guru profesional.</p>
        </div>

        {FIELDS.map(f => (
          <Card key={f.key} className="card-shadow">
            <CardHeader>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                  <f.icon className={`w-5 h-5 ${f.iconColor}`} />
                </div>
                <div>
                  <CardTitle className="text-base">{f.label}</CardTitle>
                  <CardDescription>{f.desc}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Textarea
                value={r[f.key]}
                onChange={e => updateReflection({ [f.key]: e.target.value } as any)}
                placeholder={f.placeholder}
                rows={6}
              />
            </CardContent>
          </Card>
        ))}
      </div>
    </PageTransition>
  );
};

export default RefleksiForm;
