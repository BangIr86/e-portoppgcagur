import PageTransition from '@/components/PageTransition';
import { usePortfolio, ArtefakItem, KATEGORI_LABEL } from '@/contexts/PortfolioContext';
import { Card, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CheckCircle2, AlertCircle, FileSearch, ArrowRight } from 'lucide-react';

const ANALISIS_FIELDS: { key: keyof ArtefakItem; label: string; hint: string }[] = [
  { key: 'konteks', label: 'Konteks', hint: 'Latar belakang situasi pembelajaran' },
  { key: 'tujuan', label: 'Tujuan', hint: 'Tujuan pembelajaran yang ingin dicapai' },
  { key: 'kelebihan', label: 'Kelebihan', hint: 'Kekuatan dari artefak ini' },
  { key: 'kekurangan', label: 'Kekurangan', hint: 'Hal yang perlu diperbaiki' },
  { key: 'teori_pedagogi', label: 'Teori Pedagogi', hint: 'Landasan teori yang mendasari' },
  { key: 'faktor_keberhasilan', label: 'Faktor Keberhasilan', hint: 'Faktor pendukung keberhasilan' },
  { key: 'adaptasi_pembelajaran', label: 'Adaptasi Pembelajaran', hint: 'Penyesuaian ke depan berdasarkan refleksi' },
];

const filledCount = (a: ArtefakItem) => ANALISIS_FIELDS.filter(f => (a as any)[f.key]).length;

const AnalisisForm = () => {
  const { data, updateArtefak } = usePortfolio();

  return (
    <PageTransition>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Analisis Artefak</h1>
          <p className="text-muted-foreground">Analisis mendalam untuk setiap artefak (7 dimensi). Edit langsung di sini atau di halaman Artefak Mengajar.</p>
        </div>

        {data.artefak.length === 0 ? (
          <Card className="card-shadow">
            <CardContent className="py-10 text-center text-muted-foreground">
              <FileSearch className="w-10 h-10 mx-auto mb-3 opacity-50" />
              <p className="mb-4">Belum ada artefak untuk dianalisis.</p>
              <Link to="/dashboard/artefak"><Button>Tambah Artefak <ArrowRight className="w-4 h-4 ml-2" /></Button></Link>
            </CardContent>
          </Card>
        ) : (
          <Accordion type="multiple" className="space-y-3">
            {data.artefak.map(item => {
              const filled = filledCount(item);
              const total = ANALISIS_FIELDS.length;
              const complete = filled === total;
              return (
                <AccordionItem key={item.id} value={item.id} className="border rounded-lg bg-card card-shadow">
                  <AccordionTrigger className="px-4 py-3 hover:no-underline">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {complete
                        ? <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                        : <AlertCircle className="w-5 h-5 text-muted-foreground shrink-0" />}
                      <div className="flex-1 min-w-0 text-left">
                        <p className="font-medium text-foreground truncate">{item.judul || 'Artefak tanpa judul'}</p>
                        <p className="text-xs text-muted-foreground">{KATEGORI_LABEL[item.kategori]}</p>
                      </div>
                      <Badge variant={complete ? 'default' : 'outline'} className="text-xs">{filled}/{total}</Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4 space-y-4">
                    {ANALISIS_FIELDS.map(f => (
                      <div key={f.key} className="space-y-1.5">
                        <Label className="flex items-center gap-2">
                          {f.label}
                          {(item as any)[f.key] && <CheckCircle2 className="w-3 h-3 text-primary" />}
                          <span className="text-xs text-muted-foreground font-normal">— {f.hint}</span>
                        </Label>
                        <Textarea
                          value={(item as any)[f.key] || ''}
                          onChange={e => updateArtefak(item.id, { [f.key]: e.target.value } as any)}
                          rows={3}
                          placeholder={`Tuliskan ${f.label.toLowerCase()}...`}
                        />
                      </div>
                    ))}
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        )}
      </div>
    </PageTransition>
  );
};

export default AnalisisForm;
