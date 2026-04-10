import PageTransition from '@/components/PageTransition';
import { usePortfolio } from '@/contexts/PortfolioContext';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AlertTriangle, BookOpen, CheckCircle, RefreshCw } from 'lucide-react';

const fields = [
  { key: 'kendala', label: 'Kendala Pembelajaran', desc: 'Identifikasi kendala yang dihadapi', icon: AlertTriangle, color: 'text-destructive' },
  { key: 'teori_pedagogi', label: 'Teori Pedagogi', desc: 'Landasan teori yang digunakan', icon: BookOpen, color: 'text-primary' },
  { key: 'faktor_keberhasilan', label: 'Faktor Keberhasilan', desc: 'Faktor yang mendukung keberhasilan', icon: CheckCircle, color: 'text-accent' },
  { key: 'adaptasi_pembelajaran', label: 'Adaptasi Pembelajaran', desc: 'Penyesuaian dan inovasi yang dilakukan', icon: RefreshCw, color: 'text-muted-foreground' },
] as const;

const ArtefakForm = () => {
  const { data, updateArtefak } = usePortfolio();

  return (
    <PageTransition>
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Analisis Artefak Pembelajaran</h1>
        <p className="text-muted-foreground">Refleksi dan analisis dari pengalaman mengajar Anda.</p>
      </div>

      {fields.map(f => (
        <Card key={f.key} className="card-shadow">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                <f.icon className={`w-5 h-5 ${f.color}`} />
              </div>
              <div>
                <CardTitle className="text-base">{f.label}</CardTitle>
                <CardDescription>{f.desc}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Textarea
              value={data.artefak[f.key]}
              onChange={e => updateArtefak({ [f.key]: e.target.value })}
              placeholder={`Tuliskan ${f.label.toLowerCase()}...`}
              rows={5}
            />
          </CardContent>
        </Card>
      ))}
    </div>
    </PageTransition>
  );
};

export default ArtefakForm;
